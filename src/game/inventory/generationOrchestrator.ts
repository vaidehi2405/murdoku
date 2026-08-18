/**
 * Background Generation Orchestrator
 *
 * Coordinates the full pipeline:
 *   Inventory check → API call → Schema validation → Solver → Repair → Approve → Publish
 *
 * NEVER blocks the player. All errors are logged, never crash the app.
 */

import type { PuzzleDefinition } from '../../types/puzzleTypes';
import type { Difficulty } from '../../types/case';
import { validateGeneratedPuzzle } from '../validation/generationPipeline';
import { attemptRepair } from '../validation/puzzleRepair';
import {
  shouldGenerate,
  acquireGenerationLock,
  releaseGenerationLock,
  getNextSequence,
  addToGeneratedPool,
  promoteToApproved,
  promoteToAvailable,
  markRejected,
  countCompletedCases,
} from './inventoryManager';
import { selectDifficulty, getConstraintsForDifficulty } from './difficultyDistribution';
import { selectTheme } from './themePool';
import { generateUniqueCaseId, generateCaseNumber, isDuplicate } from './deduplication';
import { getAllRegisteredPuzzles } from '../puzzleRegistry';
import { getAllInventoryEntries } from './inventoryStorage';

// ─── Types ───

interface GenerationLog {
  caseId: string;
  status: 'approved' | 'rejected';
  difficulty: Difficulty;
  theme: string;
  durationMs: number;
  solutionCount: number;
  repairAttempts: number;
  error?: string;
}

// ─── Module State ───

let generationLogs: GenerationLog[] = [];

export function getGenerationLogs(): GenerationLog[] {
  return [...generationLogs];
}

// ─── Main Entry Point ───

/**
 * Trigger background puzzle generation if needed.
 * This is the ONLY function that should be called from the UI layer.
 * It is fully async, non-blocking, and idempotent.
 */
export function triggerBackgroundGeneration(forceCount?: number): void {
  // Run asynchronously to never block the UI
  setTimeout(async () => {
    try {
      await runGenerationJob(forceCount);
    } catch (err) {
      console.error('[GenerationOrchestrator] Fatal error in generation job:', err);
      releaseGenerationLock();
    }
  }, 100);
}

/**
 * The internal generation job.
 */
async function runGenerationJob(forceCount?: number): Promise<void> {
  // 1. Check if generation is needed
  const check = shouldGenerate();
  const count = forceCount ?? check.count;

  if (!forceCount && !check.needed) {
    console.log('[GenerationOrchestrator] No generation needed');
    return;
  }

  if (count <= 0) return;

  // 2. Acquire lock
  if (!acquireGenerationLock()) {
    console.log('[GenerationOrchestrator] Generation already in progress, skipping');
    return;
  }

  console.log(`[GenerationOrchestrator] Starting generation of ${count} puzzles`);

  // 3. Check server health first
  const serverAvailable = await checkServerHealth();
  if (!serverAvailable) {
    console.warn('[GenerationOrchestrator] Server not available, aborting generation');
    releaseGenerationLock();
    return;
  }

  // 4. Gather context for difficulty selection
  const completedCount = countCompletedCases();
  const currentDistribution = getCurrentDifficultyDistribution();
  const usedThemes = getUsedThemes();

  // 5. Generate puzzles sequentially
  for (let i = 0; i < count; i++) {
    try {
      await generateSinglePuzzle(completedCount, currentDistribution, usedThemes);

      // Small delay between generations to be respectful of rate limits
      if (i < count - 1) {
        await sleep(1000);
      }
    } catch (err) {
      console.error(`[GenerationOrchestrator] Puzzle ${i + 1}/${count} failed:`, err);
    }
  }

  // 6. Release lock
  releaseGenerationLock();
  console.log('[GenerationOrchestrator] Generation job complete');
}

/**
 * Generate, validate, optionally repair, and publish a single puzzle.
 */
async function generateSinglePuzzle(
  completedCount: number,
  currentDistribution: Record<Difficulty, number>,
  usedThemes: string[]
): Promise<void> {
  const startTime = Date.now();

  // Select parameters
  const difficulty = selectDifficulty(completedCount, currentDistribution);
  const constraints = getConstraintsForDifficulty(difficulty);
  const theme = selectTheme(usedThemes);
  const sequence = getNextSequence();
  const caseId = generateUniqueCaseId(sequence);
  const caseNumber = generateCaseNumber(sequence);

  console.log(`[GenerationOrchestrator] Generating: ${caseId} (${difficulty}, "${theme}")`);

  // Call the server API
  let rawPuzzle: Record<string, unknown>;
  try {
    const response = await fetch('/api/generate-puzzle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        difficulty,
        gridSize: constraints.gridSize,
        suspectCount: constraints.suspectCount,
        roomCount: constraints.roomCount,
        clueCount: constraints.clueCount,
        theme,
      }),
    });

    const result = await response.json();

    if (!result.success || !result.puzzle) {
      const error = result.error || 'Unknown API error';
      console.error(`[GenerationOrchestrator] API error for ${caseId}: ${error}`);

      generationLogs.push({
        caseId, status: 'rejected', difficulty, theme,
        durationMs: Date.now() - startTime, solutionCount: 0, repairAttempts: 0,
        error,
      });
      return;
    }

    rawPuzzle = result.puzzle;
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Network error';
    console.error(`[GenerationOrchestrator] Network error for ${caseId}: ${error}`);
    generationLogs.push({
      caseId, status: 'rejected', difficulty, theme,
      durationMs: Date.now() - startTime, solutionCount: 0, repairAttempts: 0,
      error,
    });
    return;
  }

  // Override IDs to ensure uniqueness
  rawPuzzle.caseId = caseId;
  rawPuzzle.id = `puzzle-${caseId}`;
  rawPuzzle.caseNumber = caseNumber;

  // Add to generated pool
  addToGeneratedPool(rawPuzzle as unknown as PuzzleDefinition, Date.now() - startTime);

  // Validate
  const validation = validateGeneratedPuzzle(rawPuzzle);

  if (validation.valid && validation.puzzle) {
    // Check for duplicates
    if (isDuplicate(validation.puzzle)) {
      markRejected(caseId, 'Duplicate content detected');
      generationLogs.push({
        caseId, status: 'rejected', difficulty, theme,
        durationMs: Date.now() - startTime, solutionCount: validation.solutionCount,
        repairAttempts: 0, error: 'Duplicate',
      });
      return;
    }

    // Perfect — approve and publish
    promoteToApproved(caseId, 1, 0, validation.qualityMetrics);
    promoteToAvailable(caseId);
    usedThemes.push(theme);

    generationLogs.push({
      caseId, status: 'approved', difficulty, theme,
      durationMs: Date.now() - startTime, solutionCount: 1, repairAttempts: 0,
    });

    console.log(`[GenerationOrchestrator] ✓ ${caseId} approved (${Date.now() - startTime}ms)`);
    return;
  }

  // Attempt repair
  console.log(`[GenerationOrchestrator] ${caseId} needs repair (${validation.solutionCount} solutions, ${validation.errors.length} errors)`);

  if (validation.puzzle) {
    const repairResult = attemptRepair(validation.puzzle);

    if (repairResult.repaired && repairResult.puzzle) {
      // Re-assign the repaired puzzle data
      const repairedPuzzle = repairResult.puzzle;
      repairedPuzzle.caseId = caseId;
      repairedPuzzle.id = `puzzle-${caseId}`;
      repairedPuzzle.caseNumber = caseNumber;

      const repairedValidation = validateGeneratedPuzzle(repairedPuzzle);

      if (!repairedValidation.valid || !repairedValidation.puzzle) {
        const error = `Repair failed validation: ${repairedValidation.errors.join('; ')}`;
        markRejected(caseId, error);
        generationLogs.push({
          caseId, status: 'rejected', difficulty, theme,
          durationMs: Date.now() - startTime, solutionCount: repairedValidation.solutionCount,
          repairAttempts: repairResult.attempts, error,
        });
        return;
      }

      if (isDuplicate(repairedValidation.puzzle)) {
        markRejected(caseId, 'Duplicate after repair');
        generationLogs.push({
          caseId, status: 'rejected', difficulty, theme,
          durationMs: Date.now() - startTime, solutionCount: repairedValidation.solutionCount,
          repairAttempts: repairResult.attempts, error: 'Duplicate after repair',
        });
        return;
      }

      // Update the inventory entry with the repaired and fully revalidated puzzle
      addToGeneratedPool(repairedValidation.puzzle, Date.now() - startTime);
      promoteToApproved(caseId, repairedValidation.solutionCount, repairResult.attempts, repairedValidation.qualityMetrics);
      promoteToAvailable(caseId);
      usedThemes.push(theme);

      generationLogs.push({
        caseId, status: 'approved', difficulty, theme,
        durationMs: Date.now() - startTime, solutionCount: repairedValidation.solutionCount,
        repairAttempts: repairResult.attempts,
      });

      console.log(`[GenerationOrchestrator] ✓ ${caseId} approved after ${repairResult.attempts} repair(s) (${Date.now() - startTime}ms)`);
      return;
    }
  }

  // Failed all repairs
  markRejected(caseId, `Validation failed: ${validation.errors.join('; ')}`);
  generationLogs.push({
    caseId, status: 'rejected', difficulty, theme,
    durationMs: Date.now() - startTime, solutionCount: validation.solutionCount,
    repairAttempts: 5, error: validation.errors.join('; '),
  });

  console.log(`[GenerationOrchestrator] ✕ ${caseId} rejected after all repair attempts`);
}

// ─── Helpers ───

async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health', { method: 'GET' });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'ok' && data.groqConfigured === true;
  } catch {
    return false;
  }
}

function getCurrentDifficultyDistribution(): Record<Difficulty, number> {
  const dist: Record<Difficulty, number> = {
    very_easy: 0, easy: 0, medium: 0, hard: 0, expert: 0,
  };

  const puzzles = getAllRegisteredPuzzles();
  for (const p of puzzles) {
    if (dist[p.difficulty] !== undefined) {
      dist[p.difficulty]++;
    }
  }

  return dist;
}

function getUsedThemes(): string[] {
  const entries = getAllInventoryEntries();
  const themes: string[] = [];
  for (const entry of entries) {
    if (entry.puzzle.description) {
      // Rough check — themes are embedded in descriptions
      themes.push(entry.puzzle.description.toLowerCase());
    }
  }
  return themes;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
