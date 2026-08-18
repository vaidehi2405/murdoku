import type { PuzzleDefinition } from '../../types/puzzleTypes';
import { countValidSolutions } from './puzzleSolver';

export interface ValidationCheckItem {
  id: string;
  title: string;
  passed: boolean;
  message?: string;
}

export interface AuthorValidationReport {
  isPublishable: boolean;
  solutionCount: number;
  checks: ValidationCheckItem[];
  errors: string[];
}

export function validateAuthorPuzzle(puzzle: Partial<PuzzleDefinition>): AuthorValidationReport {
  const checks: ValidationCheckItem[] = [];
  const errors: string[] = [];

  // 1. Case Info
  const hasCaseInfo = Boolean(
    puzzle.caseId?.trim() &&
    puzzle.title?.trim() &&
    puzzle.description?.trim() &&
    puzzle.difficulty &&
    puzzle.estimatedTime?.trim()
  );
  checks.push({
    id: 'case_info',
    title: 'Case Information Complete',
    passed: hasCaseInfo,
    message: hasCaseInfo ? 'Case ID, Title, Description, and Difficulty set' : 'Missing title, ID, or description',
  });
  if (!hasCaseInfo) errors.push('Please fill in all case information fields (ID, title, description, difficulty).');

  // 2. Board Grid
  const gridRows = puzzle.gridRows || 6;
  const gridCols = puzzle.gridCols || 6;
  const cells = puzzle.cells;
  const hasValidGrid = Boolean(
    cells &&
    cells.length === gridRows &&
    cells.every((r) => r.length === gridCols && r.every((c) => c.roomId))
  );
  checks.push({
    id: 'board_valid',
    title: 'Board & Cells Configured',
    passed: hasValidGrid,
    message: hasValidGrid ? `${gridRows}×${gridCols} grid fully configured with room assignments` : 'Some cells are missing room assignments',
  });
  if (!hasValidGrid) errors.push('Every cell on the board must belong to a defined room.');

  // 3. Rooms
  const roomsCount = Object.keys(puzzle.rooms || {}).length;
  const hasValidRooms = roomsCount >= 2;
  checks.push({
    id: 'rooms_valid',
    title: 'Rooms Defined (≥ 2)',
    passed: hasValidRooms,
    message: hasValidRooms ? `${roomsCount} rooms defined with theme colors` : 'At least 2 rooms must be created',
  });
  if (!hasValidRooms) errors.push('Define at least 2 distinct rooms on the board.');

  // 4. Suspects
  const suspectsCount = puzzle.suspects?.length || 0;
  const hasValidSuspects = suspectsCount >= 4;
  checks.push({
    id: 'suspects_valid',
    title: 'Suspects Configured (≥ 4)',
    passed: hasValidSuspects,
    message: hasValidSuspects ? `${suspectsCount} suspects added` : 'At least 4 suspects are required',
  });
  if (!hasValidSuspects) errors.push('Add at least 4 suspects to the puzzle.');

  // 5. Solution Placements
  const solution = puzzle.solution || {};
  const suspectIds = puzzle.suspects?.map((s) => s.id) || [];
  const allPlaced = suspectIds.length > 0 && suspectIds.every((id) => solution[id] !== undefined);
  checks.push({
    id: 'solution_placed',
    title: 'All Suspects Have Solution Placements',
    passed: allPlaced,
    message: allPlaced ? `All ${suspectIds.length} suspects assigned to target cells` : 'One or more suspects have no solution placement',
  });
  if (!allPlaced) errors.push('Every suspect must have an assigned solution coordinate.');

  // 6. Solution Row/Col Uniqueness & Occupiability
  let rowColUnique = true;
  let occupiableValid = true;
  if (allPlaced && cells) {
    const rows = new Set<number>();
    const cols = new Set<number>();
    for (const [sId, coord] of Object.entries(solution)) {
      if (rows.has(coord.row) || cols.has(coord.col)) {
        rowColUnique = false;
      }
      rows.add(coord.row);
      cols.add(coord.col);

      const cell = cells[coord.row]?.[coord.col];
      if (!cell || !cell.occupiable) {
        occupiableValid = false;
        errors.push(`Suspect "${sId}" is placed on a blocked obstacle cell at (${coord.row},${coord.col}).`);
      }
    }
  } else {
    rowColUnique = false;
  }
  checks.push({
    id: 'solution_uniqueness',
    title: 'Solution Row & Column Uniqueness',
    passed: rowColUnique && occupiableValid,
    message: rowColUnique && occupiableValid ? '1 suspect per row/col, all on occupiable cells' : 'Row/column collision or blocked cell detected',
  });
  if (!rowColUnique) errors.push('Solution violates 1-person-per-row or 1-person-per-column constraint.');

  // 7. Clues
  const clues = puzzle.clues || [];
  const hasClues = clues.length >= 4;
  let cluesValid = true;
  for (const c of clues) {
    if (!c.condition?.subject || !c.condition?.type) {
      cluesValid = false;
    }
  }
  checks.push({
    id: 'clues_valid',
    title: 'Clues Configured (≥ 4)',
    passed: hasClues && cluesValid,
    message: hasClues && cluesValid ? `${clues.length} structured clues defined` : 'Clues incomplete or insufficient',
  });
  if (!hasClues || !cluesValid) errors.push('Add at least 4 valid structured clues.');

  // 8. Mathematical Solver Uniqueness Check
  let solutionCount = 0;
  let matchesIntended = false;
  if (hasCaseInfo && hasValidGrid && allPlaced && rowColUnique && occupiableValid && hasClues) {
    try {
      const solverRes = countValidSolutions(puzzle as PuzzleDefinition);
      solutionCount = solverRes.totalValid;

      if (solutionCount === 1) {
        const found = solverRes.solutions[0];
        matchesIntended = suspectIds.every((id) => {
          const intended = `${solution[id].row},${solution[id].col}`;
          return found[id] === intended;
        });
      }
    } catch {
      solutionCount = 0;
    }
  }

  const solverPassed = solutionCount === 1 && matchesIntended;
  checks.push({
    id: 'solver_uniqueness',
    title: 'Mathematical Unique Solution (1 Valid)',
    passed: solverPassed,
    message:
      solutionCount === 1
        ? '✓ Exactly 1 unique solution verified by mathematical solver'
        : solutionCount === 0
        ? '✕ 0 solutions found (clues contradict or are impossible)'
        : `⚠ ${solutionCount} valid solutions found (puzzle is ambiguous, add more clues)`,
  });
  if (solutionCount === 0) errors.push('Mathematical solver found 0 solutions. One or more clues contradict each other.');
  if (solutionCount > 1) errors.push(`Mathematical solver found ${solutionCount} solutions. Add more clues to narrow down to exactly 1.`);

  // 9. Hints
  const hints = puzzle.hints || [];
  const hasHints = hints.length === 3 && hints.every((h) => h.text?.trim());
  checks.push({
    id: 'hints_configured',
    title: 'Progressive Hints (3 Levels)',
    passed: hasHints,
    message: hasHints ? 'All 3 hint levels configured' : 'Configure all 3 hint levels',
  });
  if (!hasHints) errors.push('Provide all 3 progressive hint levels (Gentle, Specific, Direct).');

  // 10. Solution Explanation
  const exp = puzzle.solutionExplanation;
  const hasExp = Boolean(exp?.culpritName?.trim() && exp?.summary?.trim() && exp?.steps?.length >= 3);
  checks.push({
    id: 'explanation_configured',
    title: 'Solution Reasoning & Steps (≥ 3)',
    passed: hasExp,
    message: hasExp ? `${exp?.steps.length} reasoning steps configured` : 'Add culprit, summary, and at least 3 steps',
  });
  if (!hasExp) errors.push('Add a solution explanation summary, culprit, and at least 3 reasoning steps.');

  const isPublishable = checks.every((c) => c.passed);

  return {
    isPublishable,
    solutionCount,
    checks,
    errors,
  };
}
