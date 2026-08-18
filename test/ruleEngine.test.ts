import {
  isBeside,
  isNorthOf,
  isSouthOf,
  isEastOf,
  isWestOf,
  isSameRoom,
  isDiagonal,
  isCorner,
} from '../src/game/rules/spatialRules';
import {
  validateRowUniqueness,
  validateColumnUniqueness,
  isAloneInRoom,
  isAloneWithInRoom,
  isEmptyArea,
} from '../src/game/rules/groupRules';
import { validateSolution } from '../src/game/validation/validator';
import { countValidSolutions } from '../src/game/validation/puzzleSolver';
import {
  CASE_02_PUZZLE,
  CASE_03_PUZZLE,
  CASE_04_PUZZLE,
  CASE_05_PUZZLE,
  CASE_06_PUZZLE,
} from '../src/game/puzzleData';
import type { Cell } from '../src/types/puzzleTypes';

function makeMockCell(row: number, col: number, roomId = 'room_1', occupiable = true): Cell {
  return {
    row,
    col,
    occupiable,
    roomId,
    roomName: roomId,
    object: 'none',
  };
}

console.log('==================================================');
console.log('STARTING AUTOMATED RULE ENGINE & PUZZLE TEST SUITE');
console.log('==================================================\n');

let passCount = 0;
let failCount = 0;

function assert(description: string, condition: boolean) {
  if (condition) {
    console.log(`✓ PASS: ${description}`);
    passCount++;
  } else {
    console.error(`✗ FAIL: ${description}`);
    failCount++;
  }
}

// 1. Spatial Rules Tests
console.log('[1. Testing Spatial Predicates]');
const c00 = makeMockCell(0, 0, 'r1');
const c01 = makeMockCell(0, 1, 'r1');
const c10 = makeMockCell(1, 0, 'r1');
const c11 = makeMockCell(1, 1, 'r2');
const c55 = makeMockCell(5, 5, 'r3');

assert('isBeside adjacent horizontally (0,0) and (0,1)', isBeside(c00, c01));
assert('isBeside adjacent vertically (0,0) and (1,0)', isBeside(c00, c10));
assert('isBeside rejects diagonal (0,0) and (1,1)', !isBeside(c00, c11));
assert('isNorthOf (0,0) is north of (1,0)', isNorthOf(c00, c10));
assert('isSouthOf (1,0) is south of (0,0)', isSouthOf(c10, c00));
assert('isEastOf (0,1) is east of (0,0)', isEastOf(c01, c00));
assert('isWestOf (0,0) is west of (0,1)', isWestOf(c00, c01));
assert('isSameRoom (0,0) and (0,1) in r1', isSameRoom(c00, c01));
assert('isSameRoom rejects (0,0) and (1,1) in different rooms', !isSameRoom(c00, c11));
assert('isDiagonal (0,0) and (1,1) are on diagonal', isDiagonal(c00, c11));
assert('isCorner (0,0) is a corner of 6x6', isCorner(c00, 6, 6));
assert('isCorner (5,5) is a corner of 6x6', isCorner(c55, 6, 6));
assert('isCorner rejects (1,1)', !isCorner(c11, 6, 6));

// 2. Group & Uniqueness Tests
console.log('\n[2. Testing Row & Column Uniqueness & Group Constraints]');
const validPlacements = { ada: '0,0', brigitte: '1,1', cameron: '2,2' };
const rowDuplicatePlacements = { ada: '0,0', brigitte: '0,5' };
const colDuplicatePlacements = { ada: '0,0', brigitte: '4,0' };

assert('validateRowUniqueness accepts unique rows', validateRowUniqueness(validPlacements));
assert('validateRowUniqueness rejects duplicate rows', !validateRowUniqueness(rowDuplicatePlacements));
assert('validateColumnUniqueness accepts unique cols', validateColumnUniqueness(validPlacements));
assert('validateColumnUniqueness rejects duplicate cols', !validateColumnUniqueness(colDuplicatePlacements));

// 3. Occupiability & Solution Validation Tests
console.log('\n[3. Testing Validation with Deliberately Invalid Placements]');
const obstaclePlacement = {
  ada: '0,0', // (0,0) in Case 02 is a bookshelf (non-occupiable)
  cameron: '0,3',
  edison: '2,2',
  brigitte: '3,4',
  vinita: '4,5',
  darlene: '5,0',
};
const obstacleResult = validateSolution(obstaclePlacement, CASE_02_PUZZLE);
assert('validateSolution rejects placement on non-occupiable obstacle', !obstacleResult.isValid);

const validCase02SolutionPlacements = {
  ada: '1,1',
  cameron: '0,3',
  edison: '2,2',
  brigitte: '3,4',
  vinita: '4,5',
  darlene: '5,0',
};
const validCase02Result = validateSolution(validCase02SolutionPlacements, CASE_02_PUZZLE);
assert('validateSolution accepts intended Case 02 solution', validCase02Result.isValid);

// 4. Mathematical Uniqueness Verification for All 5 Puzzles
console.log('\n[4. Testing Mathematical Uniqueness (1 Solution per Case)]');

const puzzles = [
  { name: 'CASE 02 — The Library Secret', puzzle: CASE_02_PUZZLE },
  { name: 'CASE 03 — The Locked Office', puzzle: CASE_03_PUZZLE },
  { name: 'CASE 04 — Murder at Midnight', puzzle: CASE_04_PUZZLE },
  { name: 'CASE 05 — Death in the Lab', puzzle: CASE_05_PUZZLE },
  { name: 'CASE 06 — The Red Envelope', puzzle: CASE_06_PUZZLE },
];

for (const p of puzzles) {
  console.log(`Solving ${p.name}...`);
  const solverRes = countValidSolutions(p.puzzle);
  assert(`${p.name} has EXACTLY ONE valid solution (Found: ${solverRes.totalValid})`, solverRes.totalValid === 1);
}

console.log('\n==================================================');
console.log(`TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('==================================================');

if (failCount > 0) {
  process.exit(1);
}
