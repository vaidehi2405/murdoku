/**
 * Automatic puzzle repair for AI-generated puzzles that don't have exactly 1 solution.
 *
 * Strategies:
 * - 0 solutions: remove the most restrictive clue and re-solve
 * - Multiple solutions: add disambiguating clues from the intended solution
 *
 * MAX_REPAIR_ATTEMPTS = 5
 */

import type { PuzzleDefinition, Clue, ClueCondition, ClueType } from '../../types/puzzleTypes';
import { countValidSolutions } from './puzzleSolver';
import { evaluateClue } from './validator';

export interface RepairResult {
  repaired: boolean;
  puzzle?: PuzzleDefinition;
  attempts: number;
  finalSolutionCount: number;
}

const MAX_REPAIR_ATTEMPTS = 5;

export function attemptRepair(puzzle: PuzzleDefinition): RepairResult {
  let current = JSON.parse(JSON.stringify(puzzle)) as PuzzleDefinition;
  let attempts = 0;

  while (attempts < MAX_REPAIR_ATTEMPTS) {
    attempts++;

    const result = countValidSolutions(current);
    const solutionCount = result.totalValid;

    if (solutionCount === 1) {
      // Verify it matches intended
      const found = result.solutions[0];
      const suspectIds = current.suspects.map((s) => s.id);
      const matches = suspectIds.every((id) => {
        const intended = `${current.solution[id].row},${current.solution[id].col}`;
        return found[id] === intended;
      });

      if (matches) {
        return { repaired: true, puzzle: current, attempts, finalSolutionCount: 1 };
      }
    }

    if (solutionCount === 0) {
      // Strategy: Remove the most restrictive clue (try removing each and pick the one that yields closest to 1 solution)
      current = repairZeroSolutions(current);
    } else if (solutionCount > 1) {
      // Strategy: Add a disambiguating clue from the intended solution
      current = repairMultipleSolutions(current, result.solutions);
    }
  }

  // Final check after all attempts
  const finalResult = countValidSolutions(current);
  if (finalResult.totalValid === 1) {
    const found = finalResult.solutions[0];
    const suspectIds = current.suspects.map((s) => s.id);
    const matches = suspectIds.every((id) => {
      const intended = `${current.solution[id].row},${current.solution[id].col}`;
      return found[id] === intended;
    });

    if (matches) {
      return { repaired: true, puzzle: current, attempts, finalSolutionCount: 1 };
    }
  }

  return { repaired: false, attempts, finalSolutionCount: finalResult.totalValid };
}

/**
 * When 0 solutions: remove clues one at a time, pick the removal that yields closest to 1 solution.
 */
function repairZeroSolutions(puzzle: PuzzleDefinition): PuzzleDefinition {
  let bestCandidate = puzzle;
  let bestDiff = Infinity;

  for (let i = 0; i < puzzle.clues.length; i++) {
    const candidate = {
      ...puzzle,
      clues: [...puzzle.clues.slice(0, i), ...puzzle.clues.slice(i + 1)],
    };

    try {
      const result = countValidSolutions(candidate);
      const diff = Math.abs(result.totalValid - 1);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestCandidate = candidate;
      }
      // Perfect — removing this clue gives exactly 1 solution
      if (result.totalValid === 1) break;
    } catch {
      // Skip this candidate
    }
  }

  return bestCandidate;
}

/**
 * When multiple solutions: add a new clue that disambiguates by using the intended solution.
 */
function repairMultipleSolutions(
  puzzle: PuzzleDefinition,
  solutions: Record<string, string>[]
): PuzzleDefinition {
  const suspectIds = puzzle.suspects.map((s) => s.id);
  const intended: Record<string, string> = {};
  for (const sid of suspectIds) {
    intended[sid] = `${puzzle.solution[sid].row},${puzzle.solution[sid].col}`;
  }

  // Find first suspect that differs between intended and another solution
  for (const altSolution of solutions) {
    for (const sid of suspectIds) {
      if (altSolution[sid] !== intended[sid]) {
        // Generate a disambiguating clue for this suspect
        const newClue = generateDisambiguatingClue(puzzle, sid, intended);
        if (newClue) {
          return {
            ...puzzle,
            clues: [...puzzle.clues, newClue],
          };
        }
      }
    }
  }

  return puzzle;
}

/**
 * Generate a clue that pins down a suspect's position using the intended solution.
 */
function generateDisambiguatingClue(
  puzzle: PuzzleDefinition,
  suspectId: string,
  intended: Record<string, string>
): Clue | null {
  const coordStr = intended[suspectId];
  if (!coordStr) return null;

  const clueId = `clue-repair-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // Prefer suspect-to-suspect relational repair clues. Direct room placement is
  // reserved as an emergency fallback and still must pass full post-repair gates.
  const relationalClue = generateDirectionalClue(puzzle, suspectId, intended, clueId)
    || generateSameRoomClue(puzzle, suspectId, intended, clueId)
    || generateCornerClue(puzzle, suspectId, intended, clueId);
  if (relationalClue) return relationalClue;

  const existingDirectCount = puzzle.clues.filter((clue) => {
    const type = clue.condition.type;
    return type === 'in_room' || type === 'not_in_room' || type === 'on_object' || type === 'beside_object';
  }).length;

  if (existingDirectCount >= 1) return null;

  return generateInRoomFallbackClue(puzzle, suspectId, intended, clueId);
}

function generateInRoomFallbackClue(
  puzzle: PuzzleDefinition,
  suspectId: string,
  intended: Record<string, string>,
  clueId: string
): Clue | null {
  const coordStr = intended[suspectId];
  if (!coordStr) return null;

  const [row, col] = coordStr.split(',').map(Number);
  const cell = puzzle.cells[row][col];

  const condition: ClueCondition = {
    type: 'in_room' as ClueType,
    subject: suspectId,
    reference: cell.roomId,
  };

  const suspect = puzzle.suspects.find((s) => s.id === suspectId);
  const room = puzzle.rooms[cell.roomId];
  const text = `${suspect?.name || suspectId} was in the ${room?.name || cell.roomId}.`;
  const testClue: Clue = { id: clueId, suspectId, text, condition };

  const placements: Record<string, string> = {};
  for (const sid of puzzle.suspects.map((s) => s.id)) {
    placements[sid] = intended[sid];
  }

  const valid = evaluateClue(testClue, placements, puzzle);
  if (!valid) return null;

  const duplicate = puzzle.clues.some(
    (c) =>
      c.condition.type === condition.type &&
      c.condition.subject === condition.subject &&
      c.condition.reference === condition.reference
  );

  return duplicate ? null : testClue;
}

/**
 * Generate a directional clue (north_of, east_of, etc.) as a fallback disambiguator.
 */
function generateDirectionalClue(
  puzzle: PuzzleDefinition,
  suspectId: string,
  intended: Record<string, string>,
  clueId: string
): Clue | null {
  const [sRow, sCol] = intended[suspectId].split(',').map(Number);
  const suspect = puzzle.suspects.find((s) => s.id === suspectId);

  for (const other of puzzle.suspects) {
    if (other.id === suspectId) continue;
    const otherCoord = intended[other.id];
    if (!otherCoord) continue;
    const [oRow, oCol] = otherCoord.split(',').map(Number);

    let type: ClueType | null = null;
    let text = '';

    if (sRow < oRow) {
      type = 'north_of';
      text = `${suspect?.name} was north of ${other.name}.`;
    } else if (sRow > oRow) {
      type = 'south_of';
      text = `${suspect?.name} was south of ${other.name}.`;
    } else if (sCol > oCol) {
      type = 'east_of';
      text = `${suspect?.name} was east of ${other.name}.`;
    } else if (sCol < oCol) {
      type = 'west_of';
      text = `${suspect?.name} was west of ${other.name}.`;
    }

    if (!type) continue;

    // Check doesn't already exist
    const exists = puzzle.clues.some(
      (c) =>
        c.condition.type === type &&
        c.condition.subject === suspectId &&
        c.condition.reference === other.id
    );
    if (exists) continue;

    return {
      id: clueId,
      suspectId,
      text,
      condition: { type, subject: suspectId, reference: other.id },
    };
  }

  return null;
}


function generateSameRoomClue(
  puzzle: PuzzleDefinition,
  suspectId: string,
  intended: Record<string, string>,
  clueId: string
): Clue | null {
  const suspectCoord = intended[suspectId];
  if (!suspectCoord) return null;
  const [sRow, sCol] = suspectCoord.split(',').map(Number);
  const suspectRoom = puzzle.cells[sRow][sCol].roomId;
  const suspect = puzzle.suspects.find((s) => s.id === suspectId);

  for (const other of puzzle.suspects) {
    if (other.id === suspectId) continue;
    const otherCoord = intended[other.id];
    if (!otherCoord) continue;
    const [oRow, oCol] = otherCoord.split(',').map(Number);
    const otherRoom = puzzle.cells[oRow][oCol].roomId;
    const type: ClueType = suspectRoom === otherRoom ? 'same_room' : 'not_same_room';

    const exists = puzzle.clues.some(
      (c) => c.condition.type === type && c.condition.subject === suspectId && c.condition.reference === other.id
    );
    if (exists) continue;

    return {
      id: clueId,
      suspectId,
      text: `${suspect?.name || suspectId} was ${type === 'same_room' ? 'in the same room as' : 'not in the same room as'} ${other.name}.`,
      condition: { type, subject: suspectId, reference: other.id },
    };
  }

  return null;
}

function generateCornerClue(
  puzzle: PuzzleDefinition,
  suspectId: string,
  intended: Record<string, string>,
  clueId: string
): Clue | null {
  const coordStr = intended[suspectId];
  if (!coordStr) return null;
  const [row, col] = coordStr.split(',').map(Number);
  const isCorner = (row === 0 || row === puzzle.gridRows - 1) && (col === 0 || col === puzzle.gridCols - 1);
  if (!isCorner) return null;

  const exists = puzzle.clues.some((c) => c.condition.type === 'corner' && c.condition.subject === suspectId);
  if (exists) return null;

  const suspect = puzzle.suspects.find((s) => s.id === suspectId);
  return {
    id: clueId,
    suspectId,
    text: `${suspect?.name || suspectId} was in a corner.`,
    condition: { type: 'corner', subject: suspectId },
  };
}
