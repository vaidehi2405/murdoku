import type { PuzzleDefinition, Difficulty } from '../../types/puzzleTypes';
import { countValidSolutions } from './puzzleSolver';
import { evaluateClue } from './validator';

export const MIN_DEDUCTION_DEPTH = 2;
export const MIN_HUMAN_SOLVABILITY_SCORE = 80;

export interface QualityMetrics {
  solutionCount: number;
  directClueCount: number;
  relationalClueCount: number;
  redundantClueCount: number;
  suspectConnectivityScore: number; // 0.0 to 1.0
  deductionDepth: number; // 1 to 10+
  estimatedDifficulty: Difficulty;
  humanSolvabilityScore: number; // 0 to 100
  isQualityPassed: boolean;
  qualityErrors: string[];
  deductionSteps: string[];
}

/**
 * Analyzes the structural quality, human solvability, clue graph connectivity,
 * and clue redundancy of an AI-generated or static puzzle.
 */
export function analyzeQualityMetrics(puzzle: PuzzleDefinition): QualityMetrics {
  const qualityErrors: string[] = [];

  // 1. Solution Count check
  const solverResult = countValidSolutions(puzzle);
  const solutionCount = solverResult.totalValid;

  if (solutionCount !== 1) {
    qualityErrors.push(`Solver found ${solutionCount} solutions (need exactly 1)`);
  }

  // 2. Classify Clues (Direct vs Relational)
  let directClueCount = 0;
  let relationalClueCount = 0;
  const suspectsWithDirectClues = new Set<string>();

  for (const clue of puzzle.clues) {
    const type = clue.condition.type as string;
    // Direct clues: in_room, not_in_room, on_object, beside_object, cell
    if (type === 'in_room' || type === 'not_in_room' || type === 'on_object' || type === 'beside_object' || type === 'cell') {
      directClueCount++;
      if (clue.condition.subject) suspectsWithDirectClues.add(clue.condition.subject);
    } else {
      relationalClueCount++;
    }
  }

  if (directClueCount > 1) {
    qualityErrors.push(`Too many direct location clues (${directClueCount}). Max allowed: 1`);
  }

  const directSuspectRatio = suspectsWithDirectClues.size / (puzzle.suspects.length || 1);
  if (directSuspectRatio >= 0.5) {
    qualityErrors.push(`Too many suspects with direct clues (${suspectsWithDirectClues.size}/${puzzle.suspects.length} = ${Math.round(directSuspectRatio * 100)}%). Max allowed: < 50%`);
  }

  // 3. Clue Redundancy Analysis
  let redundantClueCount = 0;
  const maxAllowedRedundant = 2;
  const suspectIds = puzzle.suspects.map((s) => s.id);

  for (let i = 0; i < puzzle.clues.length; i++) {
    const tempClues = puzzle.clues.filter((_, idx) => idx !== i);
    const tempPuzzle: PuzzleDefinition = { ...puzzle, clues: tempClues };
    const tempResult = countValidSolutions(tempPuzzle);

    if (tempResult.totalValid === 1) {
      redundantClueCount++;
    }
  }

  if (redundantClueCount > 2) {
    qualityErrors.push(`Too many redundant clues (${redundantClueCount}). Max allowed: 2`);
  }

  // 4. Suspect Connectivity Graph Analysis
  const suspectDegree: Record<string, number> = {};
  for (const sId of suspectIds) suspectDegree[sId] = 0;

  for (const clue of puzzle.clues) {
    const { subject, reference, secondaryReference } = clue.condition;
    if (suspectDegree[subject] !== undefined) suspectDegree[subject]++;
    if (reference && suspectDegree[reference] !== undefined) suspectDegree[reference]++;
    if (secondaryReference && suspectDegree[secondaryReference] !== undefined) suspectDegree[secondaryReference]++;
  }

  const multiConnectedCount = suspectIds.filter((sId) => suspectDegree[sId] >= 2).length;
  const suspectConnectivityScore = Number((multiConnectedCount / (suspectIds.length || 1)).toFixed(2));

  if (suspectConnectivityScore < 0.6) {
    qualityErrors.push(`Low suspect connectivity (${(suspectConnectivityScore * 100).toFixed(0)}%). Suspects must participate in multiple clues.`);
  }

  // 5. Human Solvability & Deduction Evaluator
  const candidates: Record<string, Set<string>> = {};
  const allCoords: string[] = [];

  for (let r = 0; r < puzzle.gridRows; r++) {
    for (let c = 0; c < puzzle.gridCols; c++) {
      if (puzzle.cells[r][c].occupiable) {
        allCoords.push(`${r},${c}`);
      }
    }
  }

  for (const sId of suspectIds) {
    candidates[sId] = new Set(allCoords);
  }

  const deductionSteps: string[] = [];
  let deductionDepth = 0;
  let changed = true;

  while (changed && deductionDepth < 12) {
    changed = false;
    deductionDepth++;

    // Step A: Check single-candidate placements (Naked Singles)
    for (const sId of suspectIds) {
      if (candidates[sId].size === 1) {
        const fixedCoord = Array.from(candidates[sId])[0];
        const [fR, fC] = fixedCoord.split(',').map(Number);
        // Eliminate row and column from other suspects
        for (const otherId of suspectIds) {
          if (otherId === sId) continue;
          for (const coordStr of Array.from(candidates[otherId])) {
            const [oR, oC] = coordStr.split(',').map(Number);
            if (oR === fR || oC === fC) {
              candidates[otherId].delete(coordStr);
              changed = true;
            }
          }
        }
      }
    }

    // Step B: Evaluate clues on current candidates
    for (const clue of puzzle.clues) {
      const sId = clue.condition.subject;
      if (!candidates[sId]) continue;

      for (const coordStr of Array.from(candidates[sId])) {
        // Create hypothetical placement
        const testPlacements: Record<string, string> = { [sId]: coordStr };

        // For reference suspects with 1 single candidate left, include their fixed position
        if (clue.condition.reference && candidates[clue.condition.reference]?.size === 1) {
          testPlacements[clue.condition.reference] = Array.from(candidates[clue.condition.reference])[0];
        }

        const valid = evaluateClue(clue, testPlacements, puzzle);
        if (!valid && candidates[sId].size > 1) {
          // If reference is fixed or clue is self-contained and fails, eliminate coord
          if (!clue.condition.reference || candidates[clue.condition.reference]?.size === 1) {
            candidates[sId].delete(coordStr);
            changed = true;
          }
        }
      }
    }
  }

  // Count fully resolved suspects
  const solvedCount = suspectIds.filter((sId) => candidates[sId].size === 1).length;

  let humanSolvabilityScore = 0;
  if (solutionCount === 1) {
    humanSolvabilityScore = 100;
    if (directClueCount > 1) humanSolvabilityScore -= (directClueCount - 1) * 25;
    if (redundantClueCount > maxAllowedRedundant) humanSolvabilityScore -= 15;
    humanSolvabilityScore = Math.max(40, Math.min(100, humanSolvabilityScore));
  } else {
    humanSolvabilityScore = Math.round((solvedCount / (suspectIds.length || 1)) * 40);
  }

  // Determine estimated difficulty
  let estimatedDifficulty: Difficulty = 'medium';
  if (deductionDepth <= 2 && directClueCount >= 1) estimatedDifficulty = 'very_easy';
  else if (deductionDepth <= 3) estimatedDifficulty = 'easy';
  else if (deductionDepth <= 5) estimatedDifficulty = 'medium';
  else if (deductionDepth <= 7) estimatedDifficulty = 'hard';
  else estimatedDifficulty = 'expert';

  if (deductionDepth < MIN_DEDUCTION_DEPTH) {
    qualityErrors.push(`Insufficient deduction depth (${deductionDepth}). Min required: ${MIN_DEDUCTION_DEPTH}`);
  }

  if (humanSolvabilityScore < MIN_HUMAN_SOLVABILITY_SCORE) {
    qualityErrors.push(`Low human solvability score (${humanSolvabilityScore}). Min required: ${MIN_HUMAN_SOLVABILITY_SCORE}`);
  }

  const isQualityPassed = solutionCount === 1 && qualityErrors.length === 0;

  return {
    solutionCount,
    directClueCount,
    relationalClueCount,
    redundantClueCount,
    suspectConnectivityScore,
    deductionDepth,
    estimatedDifficulty,
    humanSolvabilityScore,
    isQualityPassed,
    qualityErrors,
    deductionSteps,
  };
}
