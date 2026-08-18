import type { Cell } from '../../types/puzzleTypes';

export function parseCoord(coordStr: string): { row: number; col: number } {
  const [r, c] = coordStr.split(',').map(Number);
  return { row: r, col: c };
}

export function toCoordStr(row: number, col: number): string {
  return `${row},${col}`;
}

export function isBeside(cellA: Cell, cellB: Cell): boolean {
  // Horizontally or vertically adjacent (sharing an edge). No diagonal adjacency.
  const rowDiff = Math.abs(cellA.row - cellB.row);
  const colDiff = Math.abs(cellA.col - cellB.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

export function isNorthOf(cellA: Cell, cellB: Cell): boolean {
  // North means smaller row index
  return cellA.row < cellB.row;
}

export function isSouthOf(cellA: Cell, cellB: Cell): boolean {
  // South means larger row index
  return cellA.row > cellB.row;
}

export function isEastOf(cellA: Cell, cellB: Cell): boolean {
  // East means larger column index
  return cellA.col > cellB.col;
}

export function isWestOf(cellA: Cell, cellB: Cell): boolean {
  // West means smaller column index
  return cellA.col < cellB.col;
}

export function isSameRoom(cellA: Cell, cellB: Cell): boolean {
  return cellA.roomId === cellB.roomId;
}

export function isDiagonal(cellA: Cell, cellB: Cell): boolean {
  const rowDiff = Math.abs(cellA.row - cellB.row);
  const colDiff = Math.abs(cellA.col - cellB.col);
  return rowDiff > 0 && rowDiff === colDiff;
}

export function isCorner(cell: Cell, gridRows: number, gridCols: number): boolean {
  const isRowEnd = cell.row === 0 || cell.row === gridRows - 1;
  const isColEnd = cell.col === 0 || cell.col === gridCols - 1;
  return isRowEnd && isColEnd;
}
