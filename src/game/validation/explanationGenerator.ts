import type { PuzzleDefinition, SolutionExplanation } from '../../types/puzzleTypes';

/**
 * Generates a realistic step-by-step human deduction explanation for a puzzle.
 */
export function generateDeductionExplanation(puzzle: PuzzleDefinition): SolutionExplanation {
  const culpritId = puzzle.solutionExplanation?.culpritId || puzzle.suspects[0]?.id || 'suspect_1';
  const culprit = puzzle.suspects.find((s) => s.id === culpritId) || puzzle.suspects[0];
  const culpritName = culprit?.name || 'The Culprit';

  const steps: string[] = [];

  // Step 1: Identify direct foothold anchor if present
  const directClue = puzzle.clues.find(
    (c) => c.condition.type === 'in_room' || c.condition.type === 'on_object'
  );

  if (directClue) {
    const sName = puzzle.suspects.find((s) => s.id === directClue.suspectId)?.name || directClue.suspectId;
    steps.push(`Foothold Anchor: ${sName}'s initial report confirms placement via "${directClue.text}".`);
  } else {
    const cornerClue = puzzle.clues.find((c) => c.condition.type === 'corner' || c.condition.type === 'west_of_all');
    if (cornerClue) {
      const sName = puzzle.suspects.find((s) => s.id === cornerClue.suspectId)?.name || cornerClue.suspectId;
      steps.push(`Initial Foothold: ${sName} is constrained by boundary condition "${cornerClue.text}".`);
    } else {
      steps.push(`Initial Foothold: Evaluated grid room boundaries and spatial clue constraints.`);
    }
  }

  // Step 2: Spatial & directional deductions
  const spatialClue = puzzle.clues.find(
    (c) =>
      c.condition.type === 'north_of' ||
      c.condition.type === 'south_of' ||
      c.condition.type === 'east_of' ||
      c.condition.type === 'west_of'
  );

  if (spatialClue) {
    const subName = puzzle.suspects.find((s) => s.id === spatialClue.condition.subject)?.name || spatialClue.condition.subject;
    const refName = puzzle.suspects.find((s) => s.id === spatialClue.condition.reference)?.name || spatialClue.condition.reference;
    steps.push(`Directional Deduction: Since ${subName} is ${spatialClue.condition.type.replace('_of', '')} of ${refName}, row/column candidate cells for ${subName} are restricted.`);
  } else {
    steps.push(`Spatial Deduction: Applied cardinal direction constraints to eliminate impossible candidate cells across rows and columns.`);
  }

  // Step 3: Room isolation & row/column uniqueness
  const roomClue = puzzle.clues.find(
    (c) =>
      c.condition.type === 'same_room' ||
      c.condition.type === 'not_same_room' ||
      c.condition.type === 'alone' ||
      c.condition.type === 'alone_with'
  );

  if (roomClue) {
    const subName = puzzle.suspects.find((s) => s.id === roomClue.condition.subject)?.name || roomClue.condition.subject;
    steps.push(`Room Isolation: ${subName}'s room constraint ("${roomClue.text}") forces exact room boundary placement.`);
  } else {
    steps.push(`Uniqueness Deduction: Applied row and column uniqueness rules (one suspect per row/column) to eliminate remaining candidates.`);
  }

  // Step 4: Final suspect placement
  steps.push(`Final Deduction: The remaining candidate cells uniquely isolate ${culpritName} at their recorded coordinate.`);

  return {
    culpritId: culprit?.id || 'suspect_1',
    culpritName,
    summary: `The mystery of "${puzzle.title}" was solved through a step-by-step sequence of spatial eliminations and room rules:`,
    steps,
  };
}
