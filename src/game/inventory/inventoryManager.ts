/**
 * Inventory Manager — decides when new puzzles need to be generated
 * and manages the lifecycle of AI-generated puzzles.
 *
 * Player-facing states: NEW, IN_PROGRESS, COMPLETED
 * Internal states: GENERATED, VALIDATING, APPROVED, AVAILABLE, REJECTED
 */

import type { PuzzleDefinition } from '../../types/puzzleTypes';
import { getAllProgress } from '../storage';
import { getAllRegisteredPuzzles, publishCustomPuzzle } from '../puzzleRegistry';
import {
  loadGenerationState,
  saveGenerationState,
  setInventoryEntry,
  getAllInventoryEntries,
  type InventoryEntry,
} from './inventoryStorage';

// ─── Constants ───
export const TARGET_AVAILABLE_CASES = 10;
export const MAX_GENERATION_BATCH = 5;
export const COMPLETION_TRIGGER_RATE = 0.6;

// ─── Core Inventory Functions ───

/**
 * Count how many playable (NEW or IN_PROGRESS) cases exist right now.
 */
export function countPlayableCases(): number {
  const allProgress = getAllProgress();
  const allPuzzles = getAllRegisteredPuzzles();

  let playable = 0;
  for (const puzzle of allPuzzles) {
    const progress = allProgress[puzzle.caseId];
    if (!progress || progress.status === 'new' || progress.status === 'in_progress') {
      playable++;
    }
  }

  return playable;
}

/**
 * Count completed cases.
 */
export function countCompletedCases(): number {
  const allProgress = getAllProgress();
  let completed = 0;
  for (const p of Object.values(allProgress)) {
    if (p.status === 'completed') completed++;
  }
  return completed;
}

/**
 * Calculate how many new puzzles are needed.
 */
export function calculateRequiredCount(): number {
  const playable = countPlayableCases();
  const deficit = TARGET_AVAILABLE_CASES - playable;
  if (deficit <= 0) return 0;
  return Math.min(deficit, MAX_GENERATION_BATCH);
}

/**
 * Check if the 60% completion trigger should fire.
 */
export function checkCompletionTrigger(): boolean {
  const state = loadGenerationState();
  const completed = countCompletedCases();
  const totalEver = Math.max(state.totalCasesEverAvailable, getAllRegisteredPuzzles().length);

  if (totalEver === 0) return false;

  const rate = completed / totalEver;
  return rate >= COMPLETION_TRIGGER_RATE;
}

/**
 * Determine if generation should happen and how many puzzles.
 */
export function shouldGenerate(): { needed: boolean; count: number } {
  const state = loadGenerationState();

  // Don't generate if already in progress
  if (state.generationInProgress) {
    return { needed: false, count: 0 };
  }

  // Debounce: don't generate again within 30 seconds
  if (Date.now() - state.lastGenerationTimestamp < 30000) {
    return { needed: false, count: 0 };
  }

  const required = calculateRequiredCount();

  if (required > 0) {
    return { needed: true, count: required };
  }

  // Check 60% completion trigger
  if (checkCompletionTrigger()) {
    const needed = calculateRequiredCount();
    if (needed > 0) {
      return { needed: true, count: needed };
    }
  }

  return { needed: false, count: 0 };
}

/**
 * Acquire the generation lock. Returns false if already locked.
 */
export function acquireGenerationLock(): boolean {
  const state = loadGenerationState();
  if (state.generationInProgress) return false;

  saveGenerationState({
    ...state,
    generationInProgress: true,
    lastGenerationTimestamp: Date.now(),
  });
  return true;
}

/**
 * Release the generation lock.
 */
export function releaseGenerationLock(): void {
  const state = loadGenerationState();
  saveGenerationState({
    ...state,
    generationInProgress: false,
    lastGenerationTimestamp: Date.now(),
  });
}

/**
 * Get and increment the generation sequence counter for unique IDs.
 */
export function getNextSequence(): number {
  const state = loadGenerationState();
  const next = state.generationSequence + 1;
  saveGenerationState({ ...state, generationSequence: next });
  return next;
}

/**
 * Update the totalCasesEverAvailable counter.
 */
export function updateTotalEverAvailable(): void {
  const state = loadGenerationState();
  const total = getAllRegisteredPuzzles().length;
  if (total > state.totalCasesEverAvailable) {
    saveGenerationState({ ...state, totalCasesEverAvailable: total });
  }
}

/**
 * Add a puzzle to the generated pool.
 */
export function addToGeneratedPool(puzzle: PuzzleDefinition, durationMs?: number): void {
  const entry: InventoryEntry = {
    puzzle,
    status: 'generated',
    createdAt: Date.now(),
    generationDurationMs: durationMs,
  };
  setInventoryEntry(puzzle.caseId, entry);
}

import type { QualityMetrics } from '../validation/qualityMetrics';

/**
 * Promote a puzzle to approved status.
 */
export function promoteToApproved(
  caseId: string,
  solutionCount: number,
  repairAttempts?: number,
  qualityMetrics?: QualityMetrics
): void {
  const entries = getAllInventoryEntries();
  const entry = entries.find((e) => e.puzzle.caseId === caseId);
  if (!entry) return;

  setInventoryEntry(caseId, {
    ...entry,
    status: 'approved',
    validatedAt: Date.now(),
    solutionCount,
    repairAttempts,
    qualityMetrics,
  });
}

/**
 * Promote a puzzle to available and publish it to the puzzle registry.
 */
export function promoteToAvailable(caseId: string): void {
  const entries = getAllInventoryEntries();
  const entry = entries.find((e) => e.puzzle.caseId === caseId);
  if (!entry) return;

  // Publish to puzzle registry so CaseLibrary sees it
  publishCustomPuzzle(entry.puzzle);

  setInventoryEntry(caseId, {
    ...entry,
    status: 'available',
    approvedAt: Date.now(),
  });

  // Update total ever available
  updateTotalEverAvailable();
}

/**
 * Mark a puzzle as rejected.
 */
export function markRejected(caseId: string, reason: string): void {
  const entries = getAllInventoryEntries();
  const entry = entries.find((e) => e.puzzle.caseId === caseId);
  if (!entry) return;

  setInventoryEntry(caseId, {
    ...entry,
    status: 'rejected',
    rejectedAt: Date.now(),
    rejectionReason: reason,
  });
}

/**
 * Get generation stats for the admin dashboard.
 */
export function getGenerationStats() {
  const entries = getAllInventoryEntries();
  return {
    generated: entries.filter((e) => e.status === 'generated').length,
    validating: entries.filter((e) => e.status === 'validating').length,
    approved: entries.filter((e) => e.status === 'approved').length,
    available: entries.filter((e) => e.status === 'available').length,
    rejected: entries.filter((e) => e.status === 'rejected').length,
    total: entries.length,
    entries,
  };
}
