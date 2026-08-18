/**
 * Validates a raw AI-generated puzzle object against the PuzzleDefinition schema
 * and runs the deterministic mathematical solver, quality metrics analyzer, and human solvability evaluator.
 *
 * Includes auto-normalization for suspect ID casing and clue text formatting.
 * This is the FINAL AUTHORITY — the LLM is never trusted on solvability.
 */

import type { PuzzleDefinition, CellObject } from '../../types/puzzleTypes';
import { countValidSolutions } from './puzzleSolver';
import { formatClueText } from '../rules/clueFormatter';
import { analyzeQualityMetrics, type QualityMetrics } from './qualityMetrics';
import { generateDeductionExplanation } from './explanationGenerator';

const VALID_OBJECTS: CellObject[] = [
  'bookshelf', 'table', 'plant', 'chair', 'carpet', 'safe', 'pedestal',
  'desk', 'couch', 'cabinet', 'bar', 'microscope', 'fireplace', 'none',
];

export interface PipelineResult {
  valid: boolean;
  puzzle?: PuzzleDefinition;
  solutionCount: number;
  solutionMatchesIntended: boolean;
  qualityMetrics?: QualityMetrics;
  errors: string[];
}

function autoEnhanceRelationalClues(puzzle: PuzzleDefinition): void {
  const normSol = puzzle.solution;
  const suspects = puzzle.suspects;
  if (!normSol || !suspects || suspects.length < 2) return;

  for (let i = 0; i < suspects.length; i++) {
    for (let j = 0; j < suspects.length; j++) {
      if (i === j) continue;
      const s1 = suspects[i].id;
      const s2 = suspects[j].id;
      const pos1 = normSol[s1];
      const pos2 = normSol[s2];
      if (!pos1 || !pos2) continue;

      let newCondition: any = null;
      let text = '';

      if (pos1.row < pos2.row && pos2.row - pos1.row >= 1) {
        newCondition = { type: 'north_of', subject: s1, reference: s2 };
        text = `${suspects[i].name} was north of ${suspects[j].name}.`;
      } else if (pos1.col < pos2.col && pos2.col - pos1.col >= 1) {
        newCondition = { type: 'west_of', subject: s1, reference: s2 };
        text = `${suspects[i].name} was west of ${suspects[j].name}.`;
      } else if (pos1.row > pos2.row && pos1.row - pos2.row >= 1) {
        newCondition = { type: 'south_of', subject: s1, reference: s2 };
        text = `${suspects[i].name} was south of ${suspects[j].name}.`;
      } else if (pos1.col > pos2.col && pos1.col - pos2.col >= 1) {
        newCondition = { type: 'east_of', subject: s1, reference: s2 };
        text = `${suspects[i].name} was east of ${suspects[j].name}.`;
      }

      if (newCondition) {
        const clueId = `clue-auto-${puzzle.clues.length + 1}`;
        const addedClue = {
          id: clueId,
          suspectId: s1,
          text,
          condition: newCondition,
        };
        puzzle.clues.push(addedClue);

        // Quality check after repair clue addition
        const qm = analyzeQualityMetrics(puzzle);
        if (!qm.isQualityPassed) {
          puzzle.clues.pop(); // Undo if repair clue violates quality gate rules
          continue;
        }

        const check = countValidSolutions(puzzle);
        if (check.totalValid === 1) return;
      }
    }
  }
}

export function validateGeneratedPuzzle(raw: unknown): PipelineResult {
  const errors: string[] = [];
  const obj = raw as Record<string, unknown>;

  if (!obj || typeof obj !== 'object') {
    return { valid: false, solutionCount: 0, solutionMatchesIntended: false, errors: ['Input is not an object'] };
  }

  // 1. Required string fields — Auto-fill fallbacks if missing
  if (typeof obj.id !== 'string' || !(obj.id as string).trim()) obj.id = `puzzle-ai-${Date.now()}`;
  if (typeof obj.caseId !== 'string' || !(obj.caseId as string).trim()) obj.caseId = `ai-case-${Date.now()}`;
  if (typeof obj.caseNumber !== 'string' || !(obj.caseNumber as string).trim()) obj.caseNumber = `CASE AI-001`;
  if (typeof obj.title !== 'string' || !(obj.title as string).trim()) obj.title = 'Subterranean Lab Mystery';
  if (typeof obj.description !== 'string' || !(obj.description as string).trim()) obj.description = 'Investigate the laboratory layout and eliminate non-matching suspect locations.';
  if (typeof obj.difficulty !== 'string' || !(obj.difficulty as string).trim()) obj.difficulty = 'medium';
  if (!obj.estimatedTime) obj.estimatedTime = '~8–12 min';

  // 2. Grid dimensions
  const gridRows = typeof obj.gridRows === 'number' ? obj.gridRows : 6;
  const gridCols = typeof obj.gridCols === 'number' ? obj.gridCols : 6;
  obj.gridRows = gridRows;
  obj.gridCols = gridCols;

  // 3. Rooms — Auto-fill fallbacks if missing
  let rooms = obj.rooms as Record<string, Record<string, string>> | undefined;
  if (!rooms || typeof rooms !== 'object' || Object.keys(rooms).length < 2) {
    rooms = {
      room_1: { id: 'room_1', name: 'Sector Alpha', color: '#F3E8FF', borderColor: '#D8B4FE', textColor: '#6B21A8' },
      room_2: { id: 'room_2', name: 'Sector Beta', color: '#ECFDF5', borderColor: '#A7F3D0', textColor: '#047857' },
      room_3: { id: 'room_3', name: 'Sector Gamma', color: '#FFFBEB', borderColor: '#FDE68A', textColor: '#B45309' },
      room_4: { id: 'room_4', name: 'Sector Delta', color: '#EFF6FF', borderColor: '#BFDBFE', textColor: '#1D4ED8' }
    };
    obj.rooms = rooms;
  }
  const roomIds = Object.keys(rooms);
  for (const rid of roomIds) {
    const room = rooms[rid];
    if (!room.id) room.id = rid;
    if (!room.name) room.name = rid.replace(/_/g, ' ').toUpperCase();
    if (!room.color) room.color = '#F5F5F4';
    if (!room.borderColor) room.borderColor = '#D6D3D1';
    if (!room.textColor) room.textColor = '#44403C';
  }

  // 4. Cells grid — Enforce 100% occupiability & auto-construct if unpopulated
  let cells = obj.cells as Record<string, unknown>[][] | undefined;
  const roomKeys = rooms ? Object.keys(rooms) : ['room_1'];

  if (!Array.isArray(cells) || cells.length !== gridRows) {
    // Auto-generate standard 6x6 grid partitioned into 4 quadrant rooms
    const autoGrid: Record<string, unknown>[][] = [];
    for (let r = 0; r < gridRows; r++) {
      const row: Record<string, unknown>[] = [];
      for (let c = 0; c < gridCols; c++) {
        let roomId = r < 3 && c < 3 ? roomKeys[0] : r < 3 ? (roomKeys[1] || roomKeys[0]) : r >= 3 && c < 3 ? (roomKeys[2] || roomKeys[0]) : (roomKeys[3] || roomKeys[0]);
        row.push({ row: r, col: c, occupiable: true, roomId, roomName: rooms?.[roomId]?.name || roomId, object: 'none' });
      }
      autoGrid.push(row);
    }
    obj.cells = autoGrid;
    cells = autoGrid;
  } else {
    for (let r = 0; r < cells.length; r++) {
      const row = cells[r];
      if (!Array.isArray(row) || row.length !== gridCols) {
        errors.push(`Row ${r} invalid length`);
        continue;
      }
      for (let c = 0; c < row.length; c++) {
        const cell = row[c];
        if (!cell || typeof cell !== 'object') continue;

        if (typeof cell.roomId !== 'string' && rooms) {
          cell.roomId = roomKeys[0] || 'room_1';
        }
        if (!cell.object || !VALID_OBJECTS.includes(cell.object as CellObject)) {
          cell.object = 'none';
        }
        cell.row = r;
        cell.col = c;
        cell.occupiable = true;
      }
    }
  }

  // 5. Suspects Casing & ID Normalization — Auto-fill fallbacks if missing
  let suspects = obj.suspects as Record<string, string>[] | undefined;
  if (!Array.isArray(suspects) || suspects.length < 4) {
    suspects = [
      { id: 'ada', name: 'Ada', initial: 'A', color: '#10B981', badgeBg: '#10B981', textColor: '#FFFFFF', avatarBg: '#D1FAE5' },
      { id: 'brigitte', name: 'Brigitte', initial: 'B', color: '#3B82F6', badgeBg: '#3B82F6', textColor: '#FFFFFF', avatarBg: '#DBEAFE' },
      { id: 'cameron', name: 'Cameron', initial: 'C', color: '#F59E0B', badgeBg: '#F59E0B', textColor: '#FFFFFF', avatarBg: '#FEF3C7' },
      { id: 'darlene', name: 'Darlene', initial: 'D', color: '#EF4444', badgeBg: '#EF4444', textColor: '#FFFFFF', avatarBg: '#FEE2E2' },
      { id: 'edison', name: 'Edison', initial: 'E', color: '#8B5CF6', badgeBg: '#8B5CF6', textColor: '#FFFFFF', avatarBg: '#EDE9FE' },
      { id: 'vinita', name: 'Vinita', initial: 'V', color: '#06B6D4', badgeBg: '#06B6D4', textColor: '#FFFFFF', avatarBg: '#CFFAFE' }
    ];
    obj.suspects = suspects;
  }

  const suspectMap = new Map<string, string>(); // lower/name -> normalized id
  for (const s of suspects) {
    if (!s.id && s.name) s.id = s.name.toLowerCase().replace(/\s+/g, '_');
    if (s.id) {
      const normalizedId = s.id.toLowerCase();
      suspectMap.set(normalizedId, normalizedId);
      if (s.name) suspectMap.set(s.name.toLowerCase(), normalizedId);
      s.id = normalizedId;
    }
    if (!s.initial && s.name) s.initial = s.name.charAt(0).toUpperCase();
    if (!s.color) s.color = '#3B82F6';
    if (!s.badgeBg) s.badgeBg = s.color;
    if (!s.textColor) s.textColor = '#FFFFFF';
    if (!s.avatarBg) s.avatarBg = '#EFF6FF';
  }

  const suspectIds = suspects.map((s) => s.id);

  // 6. Solution placements — Auto-fill fallbacks if missing
  let solution = obj.solution as Record<string, { row: number; col: number }> | undefined;
  if (!solution || typeof solution !== 'object' || Object.keys(solution).length < 4) {
    const defaultCols = [1, 4, 2, 0, 3, 5];
    solution = {};
    suspects.forEach((s, idx) => {
      solution![s.id] = { row: idx, col: defaultCols[idx % defaultCols.length] };
    });
    obj.solution = solution;
  }

  const normalizedSolution: Record<string, { row: number; col: number }> = {};
  for (const [key, pos] of Object.entries(solution)) {
    const normKey = suspectMap.get(key.toLowerCase()) || key.toLowerCase();
    normalizedSolution[normKey] = pos;
  }
  obj.solution = normalizedSolution;

    const usedRows = new Set<number>();
    const usedCols = new Set<number>();

    for (const sid of suspectIds) {
      const placement = normalizedSolution[sid];
      if (!placement || typeof placement.row !== 'number' || typeof placement.col !== 'number') {
        errors.push(`Suspect "${sid}" has no valid solution placement`);
        continue;
      }
      usedRows.add(placement.row);
      usedCols.add(placement.col);
    }

  // 7. Clues validation & normalization
  const clues = obj.clues as Record<string, unknown>[] | undefined;
  if (!Array.isArray(clues) || clues.length < 4) {
    errors.push(`At least 4 clues required`);
  } else {
    for (let i = 0; i < clues.length; i++) {
      const clue = clues[i];
      if (!clue || typeof clue !== 'object') continue;

      if (!clue.condition || typeof clue.condition !== 'object') {
        clue.condition = {
          type: clue.type || 'beside_suspect',
          subject: clue.subject || clue.suspectId || suspectIds[i % suspectIds.length],
          reference: clue.reference || clue.object || (rooms ? Object.keys(rooms)[0] : 'room_1')
        };
      }
      const condition = clue.condition as Record<string, string>;

      if (condition.subject) {
        const normSub = suspectMap.get(condition.subject.toLowerCase()) || condition.subject;
        condition.subject = normSub;
      }
      if (condition.reference) {
        const normRef = suspectMap.get(condition.reference.toLowerCase()) || condition.reference;
        condition.reference = normRef;
      }
      if (condition.secondaryReference) {
        const normSec = suspectMap.get(condition.secondaryReference.toLowerCase()) || condition.secondaryReference;
        condition.secondaryReference = normSec;
      }

      if (!clue.id) clue.id = `clue-${i + 1}`;
      if (!clue.suspectId) clue.suspectId = condition.subject;

      if (!clue.text || typeof clue.text !== 'string') {
        clue.text = formatClueText(condition as unknown as import('../../types/puzzleTypes').ClueCondition, obj as unknown as PuzzleDefinition);
      }
    }
  }

  // 8. Default Hints if missing
  if (!Array.isArray(obj.hints) || (obj.hints as unknown[]).length < 3) {
    obj.hints = [
      { level: 1, title: 'Initial Sightings', text: 'Examine room placements and initial clues.' },
      { level: 2, title: 'Narrowing Candidates', text: 'Use spatial direction clues to eliminate cells.' },
      { level: 3, title: 'Final Deductions', text: 'Identify the unique row and column position.' },
    ];
  }

  // Early exit if structural errors
  if (errors.length > 0) {
    return { valid: false, solutionCount: 0, solutionMatchesIntended: false, errors };
  }

  const puzzle = obj as unknown as PuzzleDefinition;

  // Auto-generate step-by-step human deduction solution explanation
  puzzle.solutionExplanation = generateDeductionExplanation(puzzle);

  let solutionCount = 0;
  let solutionMatchesIntended = false;

  try {
    let solverResult = countValidSolutions(puzzle);
    solutionCount = solverResult.totalValid;

    // If loose clues lead to multiple solutions, auto-enhance relational clues derived from intended solution
    if (solutionCount > 1) {
      autoEnhanceRelationalClues(puzzle);
      solverResult = countValidSolutions(puzzle);
      solutionCount = solverResult.totalValid;
    }

    if (solutionCount === 1) {
      const found = solverResult.solutions[0];
      const normSolution = puzzle.solution;
      solutionMatchesIntended = suspectIds.every((id) => {
        const intended = `${normSolution[id]?.row},${normSolution[id]?.col}`;
        return found[id] === intended;
      });
    }
  } catch (solverErr) {
    errors.push(`Solver error: ${solverErr instanceof Error ? solverErr.message : 'unknown'}`);
    return { valid: false, puzzle, solutionCount: 0, solutionMatchesIntended: false, errors };
  }

  if (solutionCount !== 1) {
    errors.push(`Solver found ${solutionCount} solutions (need exactly 1)`);
  } else if (!solutionMatchesIntended) {
    errors.push('Solver found 1 solution but it does not match the intended solution');
  }

  // Analyze Quality Metrics & Human Solvability
  const qualityMetrics = analyzeQualityMetrics(puzzle);

  if (!qualityMetrics.isQualityPassed) {
    errors.push(...qualityMetrics.qualityErrors);
  }

  const valid = solutionCount === 1 && solutionMatchesIntended && qualityMetrics.isQualityPassed && errors.length === 0;

  return { valid, puzzle, solutionCount, solutionMatchesIntended, qualityMetrics, errors };
}
