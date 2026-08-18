import type { ClueCondition, PuzzleDefinition } from '../../types/puzzleTypes';

export function formatClueText(condition: ClueCondition, puzzle: Partial<PuzzleDefinition>): string {
  const getSuspectName = (id?: string) => {
    if (!id) return 'Someone';
    const found = puzzle.suspects?.find((s) => s.id === id);
    return found ? found.name : id;
  };

  const getRoomName = (id?: string) => {
    if (!id) return 'a room';
    const found = puzzle.rooms?.[id];
    return found ? found.name : id;
  };

  const subject = getSuspectName(condition.subject);
  const ref = condition.reference;

  switch (condition.type) {
    case 'in_room':
      return `${subject} was in the ${getRoomName(ref)}.`;

    case 'not_in_room':
      return `${subject} was not in the ${getRoomName(ref)}.`;

    case 'south_of':
      return `${subject} was south of ${getSuspectName(ref)}.`;

    case 'north_of':
      return `${subject} was north of ${getSuspectName(ref)}.`;

    case 'east_of':
      return `${subject} was east of ${getSuspectName(ref)}.`;

    case 'west_of':
      return `${subject} was west of ${getSuspectName(ref)}.`;

    case 'same_room':
      return `${subject} was in the same room as ${getSuspectName(ref)}.`;

    case 'not_same_room':
      return `${subject} was not in the same room as ${getSuspectName(ref)}.`;

    case 'alone':
      return `${subject} was alone in their room.`;

    case 'alone_with':
      return `${subject} was alone in a room with ${getSuspectName(condition.secondaryReference || ref)}.`;

    case 'empty_area':
      return `Nobody was in the ${getRoomName(condition.subject || ref)}.`;

    case 'corner':
      return `${subject} was in a corner of the building.`;

    case 'on_object':
      return `${subject} was on the ${ref || 'object'} in their room.`;

    case 'beside_object':
      return `${subject} was directly beside the ${ref || 'object'}.`;

    case 'not_beside_object':
      return `${subject} was not directly beside the ${ref || 'object'}.`;

    case 'beside_suspect':
      return `${subject} was standing directly beside ${getSuspectName(ref)}.`;

    case 'not_beside_suspect':
      return `${subject} was not directly beside ${getSuspectName(ref)}.`;

    case 'west_of_all':
      return `${subject} was west of all other suspects.`;

    case 'diagonal':
      return `${subject} was positioned diagonally from ${getSuspectName(ref)}.`;

    default:
      return `${subject} satisfies an investigation condition.`;
  }
}
