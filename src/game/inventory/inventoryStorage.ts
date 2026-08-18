/**
 * Separate localStorage helpers for puzzle inventory and generation state.
 * Isolated from player progress storage so they can be swapped to a DB later.
 */

import type { PuzzleDefinition } from '../../types/puzzleTypes';
import type { QualityMetrics } from '../validation/qualityMetrics';

// ─── Storage Keys ───
const INVENTORY_KEY = 'murdoku_puzzle_inventory_v1';
const GENERATION_STATE_KEY = 'murdoku_generation_state_v1';

// ─── Inventory State Types ───

export type InternalPuzzleStatus =
  | 'generated'
  | 'validating'
  | 'approved'
  | 'available'
  | 'rejected';

export interface InventoryEntry {
  puzzle: PuzzleDefinition;
  status: InternalPuzzleStatus;
  createdAt: number;       // timestamp
  validatedAt?: number;
  approvedAt?: number;
  rejectedAt?: number;
  rejectionReason?: string;
  solutionCount?: number;
  repairAttempts?: number;
  generationDurationMs?: number;
  qualityMetrics?: QualityMetrics;
}

export interface InventoryData {
  entries: Record<string, InventoryEntry>;  // keyed by puzzle caseId
}

export interface GenerationState {
  generationInProgress: boolean;
  lastGenerationTimestamp: number;
  totalCasesEverAvailable: number;
  generationSequence: number;   // monotonically increasing for unique IDs
}

// ─── Inventory CRUD ───

export function loadInventory(): InventoryData {
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    return raw ? JSON.parse(raw) : { entries: {} };
  } catch {
    return { entries: {} };
  }
}

export function saveInventory(data: InventoryData): void {
  try {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('[InventoryStorage] Failed to save inventory:', e);
  }
}

export function getInventoryEntry(caseId: string): InventoryEntry | null {
  const data = loadInventory();
  return data.entries[caseId] || null;
}

export function setInventoryEntry(caseId: string, entry: InventoryEntry): void {
  const data = loadInventory();
  data.entries[caseId] = entry;
  saveInventory(data);
}

export function removeInventoryEntry(caseId: string): void {
  const data = loadInventory();
  delete data.entries[caseId];
  saveInventory(data);
}

export function getAllInventoryEntries(): InventoryEntry[] {
  const data = loadInventory();
  return Object.values(data.entries);
}

export function getEntriesByStatus(status: InternalPuzzleStatus): InventoryEntry[] {
  return getAllInventoryEntries().filter((e) => e.status === status);
}

// ─── Generation State CRUD ───

export function loadGenerationState(): GenerationState {
  try {
    const raw = localStorage.getItem(GENERATION_STATE_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          generationInProgress: false,
          lastGenerationTimestamp: 0,
          totalCasesEverAvailable: 0,
          generationSequence: 0,
        };
  } catch {
    return {
      generationInProgress: false,
      lastGenerationTimestamp: 0,
      totalCasesEverAvailable: 0,
      generationSequence: 0,
    };
  }
}

export function saveGenerationState(state: GenerationState): void {
  try {
    localStorage.setItem(GENERATION_STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('[InventoryStorage] Failed to save generation state:', e);
  }
}
