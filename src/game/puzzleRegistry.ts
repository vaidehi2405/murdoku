import type { PuzzleDefinition } from '../types/puzzleTypes';
import { CASE_01_PUZZLE } from './puzzles/case01';
import { CASE_02_PUZZLE } from './puzzles/case02';
import { CASE_03_PUZZLE } from './puzzles/case03';
import { CASE_04_PUZZLE } from './puzzles/case04';
import { CASE_05_PUZZLE } from './puzzles/case05';
import { CASE_06_PUZZLE } from './puzzles/case06';
import { CASE_07_PUZZLE } from './puzzles/case07';
import { CASE_08_PUZZLE } from './puzzles/case08';
import { CASE_09_PUZZLE } from './puzzles/case09';
import { CASE_10_PUZZLE } from './puzzles/case10';
import { CASE_11_PUZZLE } from './puzzles/case11';
import { CASE_12_PUZZLE } from './puzzles/case12';

export const STATIC_PUZZLE_REGISTRY: Record<string, PuzzleDefinition> = {
  'case-01': CASE_01_PUZZLE,
  'case-02': CASE_02_PUZZLE,
  'case-03': CASE_03_PUZZLE,
  'case-04': CASE_04_PUZZLE,
  'case-05': CASE_05_PUZZLE,
  'case-06': CASE_06_PUZZLE,
  'case-07': CASE_07_PUZZLE,
  'case-08': CASE_08_PUZZLE,
  'case-09': CASE_09_PUZZLE,
  'case-10': CASE_10_PUZZLE,
  'case-11': CASE_11_PUZZLE,
  'case-12': CASE_12_PUZZLE,
};

export const PUZZLE_REGISTRY = STATIC_PUZZLE_REGISTRY;

const PUBLISHED_STORAGE_KEY = 'murdoku_custom_puzzles_v1';
const DRAFTS_STORAGE_KEY = 'murdoku_puzzle_drafts_v1';

export function getPublishedPuzzles(): Record<string, PuzzleDefinition> {
  try {
    const raw = localStorage.getItem(PUBLISHED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function publishCustomPuzzle(puzzle: PuzzleDefinition): void {
  try {
    const current = getPublishedPuzzles();
    current[puzzle.caseId] = puzzle;
    localStorage.setItem(PUBLISHED_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to publish custom puzzle:', e);
  }
}

export function getPuzzleDrafts(): Record<string, PuzzleDefinition> {
  try {
    const raw = localStorage.getItem(DRAFTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function savePuzzleDraft(draft: PuzzleDefinition): void {
  try {
    const current = getPuzzleDrafts();
    current[draft.id] = draft;
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save puzzle draft:', e);
  }
}

export function deletePuzzleDraft(draftId: string): void {
  try {
    const current = getPuzzleDrafts();
    delete current[draftId];
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to delete puzzle draft:', e);
  }
}

export function getPuzzleDefinition(caseId: string): PuzzleDefinition | null {
  // Check static puzzles first
  if (STATIC_PUZZLE_REGISTRY[caseId]) {
    return STATIC_PUZZLE_REGISTRY[caseId];
  }
  // Check published custom puzzles
  const published = getPublishedPuzzles();
  if (published[caseId]) {
    return published[caseId];
  }
  return null;
}

export function getAllRegisteredPuzzles(): PuzzleDefinition[] {
  const published = getPublishedPuzzles();
  const map: Record<string, PuzzleDefinition> = {
    ...STATIC_PUZZLE_REGISTRY,
    ...published,
  };
  return Object.values(map);
}

export function isCasePlayable(caseId: string): boolean {
  return Boolean(getPuzzleDefinition(caseId));
}
