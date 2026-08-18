import type { PuzzleDefinition, Clue } from '../../types/puzzleTypes';
import { validateSolution, evaluateClue } from './validator';

export function countValidSolutions(puzzle: PuzzleDefinition): {
  totalValid: number;
  solutions: Record<string, string>[];
} {
  // Collect all occupiable cells
  const occupiableCoords: { row: number; col: number; coordStr: string; roomId: string }[] = [];
  for (let r = 0; r < puzzle.gridRows; r++) {
    for (let c = 0; c < puzzle.gridCols; c++) {
      if (puzzle.cells[r][c].occupiable) {
        occupiableCoords.push({
          row: r,
          col: c,
          coordStr: `${r},${c}`,
          roomId: puzzle.cells[r][c].roomId,
        });
      }
    }
  }

  const suspects = puzzle.suspects.map((s) => s.id);
  const solutions: Record<string, string>[] = [];

  // Group clues by involved suspects for early pruning
  const singleSuspectClues: Record<string, Clue[]> = {};
  for (const sId of suspects) {
    singleSuspectClues[sId] = puzzle.clues.filter((c) => {
      const cond = c.condition;
      return (
        cond.subject === sId &&
        (cond.type === 'in_room' ||
          cond.type === 'not_in_room' ||
          cond.type === 'on_object' ||
          cond.type === 'corner')
      );
    });
  }

  // Permutation generator for N suspects into N distinct cells with row & col uniqueness + early pruning
  function search(
    suspectIdx: number,
    currentPlacements: Record<string, string>,
    usedRows: Set<number>,
    usedCols: Set<number>
  ) {
    if (suspectIdx === suspects.length) {
      // Validate full placement against all clue rules
      const result = validateSolution(currentPlacements, puzzle);
      if (result.isValid) {
        solutions.push({ ...currentPlacements });
      }
      return;
    }

    const suspectId = suspects[suspectIdx];
    const fastClues = singleSuspectClues[suspectId] || [];

    for (const cell of occupiableCoords) {
      if (usedRows.has(cell.row) || usedCols.has(cell.col)) continue;

      currentPlacements[suspectId] = cell.coordStr;

      // Early prune: check single-suspect clues immediately
      let failedEarly = false;
      for (const clue of fastClues) {
        if (!evaluateClue(clue, currentPlacements, puzzle)) {
          failedEarly = true;
          break;
        }
      }

      if (!failedEarly) {
        usedRows.add(cell.row);
        usedCols.add(cell.col);

        search(suspectIdx + 1, currentPlacements, usedRows, usedCols);

        usedRows.delete(cell.row);
        usedCols.delete(cell.col);
      }

      delete currentPlacements[suspectId];
    }
  }

  search(0, {}, new Set(), new Set());

  return {
    totalValid: solutions.length,
    solutions,
  };
}
