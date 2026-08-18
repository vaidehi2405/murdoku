import { analyzeQualityMetrics } from '../src/game/validation/qualityMetrics';
import {
  BAD_EVERY_SUSPECT_DIRECT,
  BAD_MULTIPLE_DIRECT,
  BAD_POOR_CONNECTIVITY,
  BAD_TOO_MANY_REDUNDANT,
  BAD_TRIVIAL_DIRECT_UNIQUE,
  GOOD_RELATIONAL_PUZZLE,
} from './puzzleFixtures';

const cases = [
  ['BAD #1 every suspect has a direct location clue', BAD_EVERY_SUSPECT_DIRECT, false],
  ['BAD #2 multiple direct location clues', BAD_MULTIPLE_DIRECT, false],
  ['BAD #3 exactly one mathematical solution but trivial direct clues', BAD_TRIVIAL_DIRECT_UNIQUE, false],
  ['BAD #4 poor suspect connectivity', BAD_POOR_CONNECTIVITY, false],
  ['BAD #5 too many redundant clues', BAD_TOO_MANY_REDUNDANT, false],
  ['GOOD relational puzzle', GOOD_RELATIONAL_PUZZLE, true],
] as const;

let failures = 0;

for (const [name, puzzle, expectedPass] of cases) {
  const metrics = analyzeQualityMetrics(puzzle);
  const actualPass = metrics.isQualityPassed;
  const solutionOnlyWouldPass = metrics.solutionCount === 1;

  console.log(`\n${name}`);
  console.log(JSON.stringify({
    solutionCount: metrics.solutionCount,
    directClueCount: metrics.directClueCount,
    relationalClueCount: metrics.relationalClueCount,
    redundantClueCount: metrics.redundantClueCount,
    suspectConnectivityScore: metrics.suspectConnectivityScore,
    deductionDepth: metrics.deductionDepth,
    humanSolvabilityScore: metrics.humanSolvabilityScore,
    pass: actualPass,
    solutionOnlyWouldPass,
    errors: metrics.qualityErrors,
  }, null, 2));

  if (actualPass !== expectedPass) {
    console.error(`Expected ${expectedPass ? 'PASS' : 'REJECT'} but got ${actualPass ? 'PASS' : 'REJECT'}`);
    failures++;
  }
}

if (failures > 0) process.exit(1);
