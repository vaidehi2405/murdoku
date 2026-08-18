import fs from 'node:fs';
import { STATIC_PUZZLE_REGISTRY, getAllRegisteredPuzzles } from '../src/game/puzzleRegistry';
import type { PuzzleDefinition } from '../src/types/puzzleTypes';
import { countValidSolutions } from '../src/game/validation/puzzleSolver';
import { analyzeQualityMetrics } from '../src/game/validation/qualityMetrics';

interface InventoryEntry { status?: string; puzzle?: PuzzleDefinition }
interface InventoryData { entries?: Record<string, InventoryEntry> }

function intendedSolutionMatches(puzzle: PuzzleDefinition): boolean {
  const solver = countValidSolutions(puzzle);
  if (solver.totalValid !== 1) return false;
  const found = solver.solutions[0];
  return puzzle.suspects.every((suspect) => found[suspect.id] === `${puzzle.solution[suspect.id]?.row},${puzzle.solution[suspect.id]?.col}`);
}

function readInventoryPuzzles(): PuzzleDefinition[] {
  const fromBrowser = typeof globalThis.localStorage !== 'undefined'
    ? globalThis.localStorage.getItem('murdoku_puzzle_inventory_v1')
    : null;
  const fromFile = process.env.MURDOKU_INVENTORY_JSON
    ? fs.readFileSync(process.env.MURDOKU_INVENTORY_JSON, 'utf8')
    : null;
  const raw = fromBrowser || fromFile;
  if (!raw) return [];
  const data = JSON.parse(raw) as InventoryData;
  return Object.values(data.entries || {})
    .filter((entry) => entry.status === 'approved' && entry.puzzle)
    .map((entry) => entry.puzzle!);
}

const staticPuzzles = Object.values(STATIC_PUZZLE_REGISTRY);
const allPuzzles = [...getAllRegisteredPuzzles(), ...readInventoryPuzzles()];
const unique = new Map(allPuzzles.map((puzzle) => [puzzle.caseId, puzzle]));

console.log(`Auditing ${staticPuzzles.length} static puzzles and ${unique.size - staticPuzzles.length} approved inventory/custom puzzles.\n`);

let failed = 0;
for (const puzzle of unique.values()) {
  const metrics = analyzeQualityMetrics(puzzle);
  const matches = intendedSolutionMatches(puzzle);
  const errors = [...metrics.qualityErrors];
  if (!matches) errors.push('Intended solution does not match the unique solver solution');
  const pass = metrics.isQualityPassed && matches;
  if (!pass) failed++;

  console.log(`${puzzle.caseNumber} (${puzzle.caseId}) — ${pass ? 'PASS' : 'FAIL'}`);
  console.log(`TITLE: ${puzzle.title}`);
  console.log(`DIFFICULTY: ${puzzle.difficulty}`);
  console.log(`GRID SIZE: ${puzzle.gridRows}x${puzzle.gridCols}`);
  console.log(`SUSPECT COUNT: ${puzzle.suspects.length}`);
  console.log(`CLUE COUNT: ${puzzle.clues.length}`);
  console.log(`DIRECT CLUES: ${metrics.directClueCount}`);
  console.log(`RELATIONAL CLUES: ${metrics.relationalClueCount}`);
  console.log(`REDUNDANT CLUES: ${metrics.redundantClueCount}`);
  console.log(`SUSPECT CONNECTIVITY: ${Math.round(metrics.suspectConnectivityScore * 100)}%`);
  console.log(`DEDUCTION DEPTH: ${metrics.deductionDepth}`);
  console.log(`HUMAN SOLVABILITY SCORE: ${metrics.humanSolvabilityScore}`);
  console.log(`SOLUTION COUNT: ${metrics.solutionCount}`);
  console.log(`INTENDED SOLUTION MATCH: ${matches}`);
  console.log(`FINAL: ${pass ? 'PASS' : 'FAIL'}`);
  if (!pass) console.log(`FAILED GATES: ${errors.join('; ')}`);
  console.log('');
}

if (failed > 0) {
  console.error(`${failed} puzzle(s) failed quality audit.`);
}
