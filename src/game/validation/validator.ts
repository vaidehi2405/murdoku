import type { PuzzleDefinition, ValidationResult, Clue } from '../../types/puzzleTypes';
import {
  parseCoord,
  isBeside,
  isNorthOf,
  isSouthOf,
  isEastOf,
  isWestOf,
  isSameRoom,
  isDiagonal,
  isCorner,
} from '../rules/spatialRules';
import {
  validateRowUniqueness,
  validateColumnUniqueness,
  isAloneInRoom,
  isAloneWithInRoom,
  isEmptyArea,
  isBesideObject,
} from '../rules/groupRules';

export function evaluateClue(
  clue: Clue,
  placements: Record<string, string>,
  puzzle: PuzzleDefinition
): boolean {
  const { condition } = clue;

  // Special case: empty_area condition (subject is roomId)
  if (condition.type === 'empty_area') {
    const targetRoomId = condition.reference || condition.subject;
    return isEmptyArea(targetRoomId, placements, puzzle);
  }

  const subjectCoordStr = placements[condition.subject];
  if (!subjectCoordStr) return false; // Not placed yet

  const { row: sR, col: sC } = parseCoord(subjectCoordStr);
  const subjectCell = puzzle.cells[sR][sC];

  // 1. Check cell occupancy validity
  if (!subjectCell.occupiable) return false;

  // 2. Reference suspect coord if applicable
  let refCell = null;
  if (condition.reference && placements[condition.reference]) {
    const { row: rR, col: rC } = parseCoord(placements[condition.reference]);
    refCell = puzzle.cells[rR][rC];
  }

  switch (condition.type) {
    case 'in_room':
      return subjectCell.roomId === condition.reference;

    case 'not_in_room':
      return subjectCell.roomId !== condition.reference;

    case 'south_of':
      return refCell ? isSouthOf(subjectCell, refCell) : false;

    case 'north_of':
      return refCell ? isNorthOf(subjectCell, refCell) : false;

    case 'east_of':
      return refCell ? isEastOf(subjectCell, refCell) : false;

    case 'west_of':
      return refCell ? isWestOf(subjectCell, refCell) : false;

    case 'same_room':
      return refCell ? isSameRoom(subjectCell, refCell) : false;

    case 'not_same_room':
      return refCell ? !isSameRoom(subjectCell, refCell) : false;

    case 'alone':
      return isAloneInRoom(condition.subject, placements, puzzle);

    case 'alone_with':
      return condition.secondaryReference
        ? isAloneWithInRoom(
            condition.subject,
            condition.secondaryReference,
            placements,
            puzzle
          )
        : false;

    case 'corner':
      return isCorner(subjectCell, puzzle.gridRows, puzzle.gridCols);

    case 'on_object':
      return subjectCell.object === condition.reference;

    case 'beside_object':
      return condition.reference
        ? isBesideObject(subjectCell, condition.reference, puzzle)
        : false;

    case 'not_beside_object':
      return condition.reference
        ? !isBesideObject(subjectCell, condition.reference, puzzle)
        : false;

    case 'beside_suspect':
      return refCell ? isBeside(subjectCell, refCell) : false;

    case 'not_beside_suspect':
      return refCell ? !isBeside(subjectCell, refCell) : false;

    case 'west_of_all':
      for (const [suspectId, coordStr] of Object.entries(placements)) {
        if (suspectId === condition.subject || !coordStr) continue;
        const { col: otherCol } = parseCoord(coordStr);
        if (subjectCell.col >= otherCol) return false;
      }
      return true;

    case 'diagonal':
      return refCell ? isDiagonal(subjectCell, refCell) : false;

    default:
      return true;
  }
}

export function validateSolution(
  placements: Record<string, string>,
  puzzle: PuzzleDefinition
): ValidationResult {
  const unsatisfiedClueIds: string[] = [];

  // Check if all suspects are placed
  const placedSuspectIds = Object.keys(placements).filter((id) => placements[id]);
  if (placedSuspectIds.length < puzzle.suspects.length) {
    return {
      isValid: false,
      message: `Please place all ${puzzle.suspects.length} suspects on the board before submitting.`,
      unsatisfiedClueIds: [],
    };
  }

  // Check row uniqueness constraint
  if (!validateRowUniqueness(placements)) {
    return {
      isValid: false,
      message: 'Constraint violation: Multiple suspects occupy the same row.',
      unsatisfiedClueIds: [],
    };
  }

  // Check column uniqueness constraint
  if (!validateColumnUniqueness(placements)) {
    return {
      isValid: false,
      message: 'Constraint violation: Multiple suspects occupy the same column.',
      unsatisfiedClueIds: [],
    };
  }

  // Check occupiable cells constraint
  for (const [suspectId, coordStr] of Object.entries(placements)) {
    const { row, col } = parseCoord(coordStr);
    if (!puzzle.cells[row][col].occupiable) {
      const suspect = puzzle.suspects.find((s) => s.id === suspectId);
      return {
        isValid: false,
        message: `${suspect?.name || 'A suspect'} cannot be placed on furniture or obstacles.`,
        unsatisfiedClueIds: [],
      };
    }
  }

  // Evaluate all clues
  for (const clue of puzzle.clues) {
    const satisfied = evaluateClue(clue, placements, puzzle);
    if (!satisfied) {
      unsatisfiedClueIds.push(clue.id);
    }
  }

  if (unsatisfiedClueIds.length > 0) {
    return {
      isValid: false,
      message: "Not quite. Some placements don't satisfy the clues.",
      unsatisfiedClueIds,
    };
  }

  return {
    isValid: true,
    message: 'CASE SOLVED! All clue constraints satisfied.',
    unsatisfiedClueIds: [],
  };
}
