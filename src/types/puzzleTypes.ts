import type { Difficulty } from './case';
export type { Difficulty };

export type CellObject =
  | 'bookshelf'
  | 'table'
  | 'plant'
  | 'chair'
  | 'carpet'
  | 'safe'
  | 'pedestal'
  | 'desk'
  | 'couch'
  | 'cabinet'
  | 'bar'
  | 'microscope'
  | 'fireplace'
  | 'none';

export interface Cell {
  row: number; // 0 to 5
  col: number; // 0 to 5
  occupiable: boolean;
  roomId: string;
  roomName: string;
  object: CellObject;
  objectName?: string;
}

export interface Room {
  id: string;
  name: string;
  color: string;
  borderColor: string;
  textColor: string;
}

export interface Suspect {
  id: string;
  name: string;
  initial: string; // 'A', 'B', 'C', 'D', 'E', 'V'
  color: string;
  badgeBg: string;
  textColor: string;
  avatarBg: string;
}

export type ClueType =
  | 'in_room'
  | 'not_in_room'
  | 'south_of'
  | 'north_of'
  | 'east_of'
  | 'west_of'
  | 'same_room'
  | 'not_same_room'
  | 'alone'
  | 'alone_with'
  | 'empty_area'
  | 'corner'
  | 'on_object'
  | 'beside_object'
  | 'not_beside_object'
  | 'beside_suspect'
  | 'not_beside_suspect'
  | 'west_of_all'
  | 'diagonal';

export interface ClueCondition {
  type: ClueType;
  subject: string; // suspectId or roomId (for empty_area)
  reference?: string; // suspectId or roomId or objectName
  secondaryReference?: string; // suspectId if alone_with
}

export interface Clue {
  id: string;
  suspectId: string;
  text: string;
  condition: ClueCondition;
}

export interface Hint {
  level: 1 | 2 | 3;
  title: string;
  text: string;
  targetClueId?: string;
  targetCellCoords?: string[]; // e.g. ["1,1", "2,2"]
}

export interface SolutionExplanation {
  culpritId: string;
  culpritName: string;
  summary: string;
  steps: string[];
}

export interface PuzzleDefinition {
  id: string;
  caseId: string;
  caseNumber: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: string;
  gridRows: number;
  gridCols: number;
  cells: Cell[][];
  rooms: Record<string, Room>;
  suspects: Suspect[];
  clues: Clue[];
  solution: Record<string, { row: number; col: number }>; // suspectId -> {row, col}
  hints: Hint[];
  solutionExplanation: SolutionExplanation;
}

export type Puzzle = PuzzleDefinition;

export type ActiveTool = 'place' | 'note' | 'eliminate' | 'erase';

export interface GameStateSnapshot {
  placements: Record<string, string>; // suspectId -> "row,col"
  notes: Record<string, string[]>; // suspectId -> ["row,col"]
  eliminatedCells: Record<string, string[]>; // suspectId -> ["row,col"]
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  unsatisfiedClueIds: string[];
}

export interface CaseProgress {
  caseId: string;
  status: 'new' | 'in_progress' | 'completed';
  placements: Record<string, string>; // suspectId -> "row,col"
  notes: Record<string, string[]>; // suspectId -> ["row,col"]
  eliminatedCells: Record<string, string[]>; // suspectId -> ["row,col"]
  elapsedTime: number; // in seconds
  attempts: number;
  bestTime?: string; // "07:42"
  bestTimeSeconds?: number;
  hintsUsed: number;
  activeHintIndex: number;
  solutionRevealed: boolean;
  isReadOnly: boolean;
  lastPlayed: number;
}
