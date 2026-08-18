import type { Cell, PuzzleDefinition } from '../../types/puzzleTypes';
import { parseCoord, isBeside } from './spatialRules';

export function validateRowUniqueness(placements: Record<string, string>): boolean {
  const rows = new Set<number>();
  for (const coordStr of Object.values(placements)) {
    if (!coordStr) continue;
    const { row } = parseCoord(coordStr);
    if (rows.has(row)) return false;
    rows.add(row);
  }
  return true;
}

export function validateColumnUniqueness(placements: Record<string, string>): boolean {
  const cols = new Set<number>();
  for (const coordStr of Object.values(placements)) {
    if (!coordStr) continue;
    const { col } = parseCoord(coordStr);
    if (cols.has(col)) return false;
    cols.add(col);
  }
  return true;
}

export function isAloneInRoom(
  subjectId: string,
  placements: Record<string, string>,
  puzzle: PuzzleDefinition
): boolean {
  const subjectCoord = placements[subjectId];
  if (!subjectCoord) return false;
  const { row, col } = parseCoord(subjectCoord);
  const subjectCell = puzzle.cells[row][col];

  for (const [suspectId, coord] of Object.entries(placements)) {
    if (suspectId === subjectId || !coord) continue;
    const { row: r, col: c } = parseCoord(coord);
    const otherCell = puzzle.cells[r][c];
    if (otherCell.roomId === subjectCell.roomId) {
      return false; // Found another suspect in same room
    }
  }
  return true;
}

export function isAloneWithInRoom(
  subjectId: string,
  companionId: string,
  placements: Record<string, string>,
  puzzle: PuzzleDefinition
): boolean {
  const subjectCoord = placements[subjectId];
  const companionCoord = placements[companionId];
  if (!subjectCoord || !companionCoord) return false;

  const { row: sR, col: sC } = parseCoord(subjectCoord);
  const { row: cR, col: cC } = parseCoord(companionCoord);
  const subjectCell = puzzle.cells[sR][sC];
  const companionCell = puzzle.cells[cR][cC];

  if (subjectCell.roomId !== companionCell.roomId) return false;

  for (const [suspectId, coord] of Object.entries(placements)) {
    if (suspectId === subjectId || suspectId === companionId || !coord) continue;
    const { row: r, col: c } = parseCoord(coord);
    const otherCell = puzzle.cells[r][c];
    if (otherCell.roomId === subjectCell.roomId) {
      return false; // Third person in room
    }
  }
  return true;
}

export function isEmptyArea(
  roomId: string,
  placements: Record<string, string>,
  puzzle: PuzzleDefinition
): boolean {
  for (const coord of Object.values(placements)) {
    if (!coord) continue;
    const { row, col } = parseCoord(coord);
    if (puzzle.cells[row][col].roomId === roomId) {
      return false;
    }
  }
  return true;
}

export function isBesideObject(
  cell: Cell,
  targetObject: string,
  puzzle: PuzzleDefinition
): boolean {
  for (let r = 0; r < puzzle.gridRows; r++) {
    for (let c = 0; c < puzzle.gridCols; c++) {
      const otherCell = puzzle.cells[r][c];
      if (otherCell.object === targetObject) {
        if (isBeside(cell, otherCell)) return true;
      }
    }
  }
  return false;
}
