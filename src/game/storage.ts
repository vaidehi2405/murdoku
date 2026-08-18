import type { CaseProgress } from '../types/puzzleTypes';

const STORAGE_KEY = 'murdoku_case_progress_v1';

export function getAllProgress(): Record<string, CaseProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load progress from localStorage', err);
    return {};
  }
}

export function loadCaseProgress(caseId: string): CaseProgress | null {
  const all = getAllProgress();
  return all[caseId] || null;
}

export function saveCaseProgress(progress: CaseProgress): void {
  try {
    const all = getAllProgress();
    all[progress.caseId] = {
      ...progress,
      lastPlayed: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.error('Failed to save progress to localStorage', err);
  }
}

export function createFreshAttempt(
  caseId: string,
  existingProgress?: CaseProgress | null
): CaseProgress {
  const attempts = (existingProgress?.attempts || 0) + 1;
  const bestTime = existingProgress?.bestTime;
  const bestTimeSeconds = existingProgress?.bestTimeSeconds;

  const fresh: CaseProgress = {
    caseId,
    status: 'in_progress',
    placements: {},
    notes: {},
    eliminatedCells: {},
    elapsedTime: 0,
    attempts,
    bestTime,
    bestTimeSeconds,
    hintsUsed: 0,
    activeHintIndex: 0,
    solutionRevealed: false,
    isReadOnly: false,
    lastPlayed: Date.now(),
  };

  saveCaseProgress(fresh);
  return fresh;
}
