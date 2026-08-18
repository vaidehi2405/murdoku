/**
 * Deduplication helpers for AI-generated puzzles.
 * Prevents duplicate IDs, titles, and near-identical puzzle content.
 */

import type { PuzzleDefinition } from '../../types/puzzleTypes';
import { getAllRegisteredPuzzles } from '../puzzleRegistry';
import { getAllInventoryEntries } from './inventoryStorage';

/**
 * Check if a newly generated puzzle is a duplicate of an existing one.
 */
export function isDuplicate(newPuzzle: PuzzleDefinition): boolean {
  const existing = getAllRegisteredPuzzles();
  const inventoryEntries = getAllInventoryEntries();
  const allPuzzles = [
    ...existing,
    ...inventoryEntries.map((e) => e.puzzle),
  ];

  for (const p of allPuzzles) {
    // Same caseId
    if (p.caseId === newPuzzle.caseId) return true;

    // Same title (case-insensitive)
    if (p.title.toLowerCase().trim() === newPuzzle.title.toLowerCase().trim()) return true;

    // Identical solution + grid dimensions = likely same puzzle
    if (
      p.gridRows === newPuzzle.gridRows &&
      p.gridCols === newPuzzle.gridCols &&
      JSON.stringify(p.solution) === JSON.stringify(newPuzzle.solution)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Generate a unique case ID using the sequence number.
 */
export function generateUniqueCaseId(sequence: number): string {
  return `ai-case-${sequence.toString().padStart(4, '0')}`;
}

/**
 * Generate a display case number.
 */
export function generateCaseNumber(sequence: number): string {
  return `CASE AI-${sequence.toString().padStart(3, '0')}`;
}
