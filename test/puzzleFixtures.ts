import type { Clue, ClueType, PuzzleDefinition } from '../src/types/puzzleTypes';

const colors = { color: '#000000', badgeBg: '#000000', textColor: '#ffffff', avatarBg: '#ffffff' };

export function makePuzzle(
  id: string,
  clues: Array<[string, ClueType, string?]>,
  options: { gridSize?: number; oneCellRooms?: boolean } = {}
): PuzzleDefinition {
  const gridSize = options.gridSize ?? 3;
  const suspects = ['ada', 'brigitte', 'cameron'].map((suspectId) => ({
    id: suspectId,
    name: suspectId[0].toUpperCase() + suspectId.slice(1),
    initial: suspectId[0].toUpperCase(),
    ...colors,
  }));

  const rooms: PuzzleDefinition['rooms'] = {};
  const cells: PuzzleDefinition['cells'] = [];
  for (let row = 0; row < gridSize; row++) {
    cells[row] = [];
    for (let col = 0; col < gridSize; col++) {
      const roomId = options.oneCellRooms ? `room_${row}_${col}` : 'room_main';
      rooms[roomId] ||= {
        id: roomId,
        name: options.oneCellRooms ? `Room ${row},${col}` : 'Main Hall',
        color: '#ffffff',
        borderColor: '#000000',
        textColor: '#000000',
      };
      cells[row][col] = { row, col, occupiable: true, roomId, roomName: rooms[roomId].name, object: 'none' };
    }
  }

  return {
    id,
    caseId: id,
    caseNumber: id.toUpperCase(),
    title: id,
    description: 'Deterministic quality-gate fixture.',
    difficulty: 'medium',
    estimatedTime: '~1 min',
    gridRows: gridSize,
    gridCols: gridSize,
    rooms,
    cells,
    suspects,
    solution: {
      ada: { row: 0, col: 0 },
      brigitte: { row: 1, col: 1 },
      cameron: { row: 2, col: 2 },
    },
    clues: clues.map(([subject, type, reference], index): Clue => ({
      id: `clue-${index + 1}`,
      suspectId: subject,
      text: `${subject} ${type}${reference ? ` ${reference}` : ''}`,
      condition: { type, subject, reference },
    })),
    hints: [],
    solutionExplanation: { summary: '', steps: [] },
  };
}

export const GOOD_RELATIONAL_PUZZLE = makePuzzle('good-relational', [
  ['ada', 'corner'],
  ['ada', 'north_of', 'brigitte'],
  ['ada', 'west_of', 'brigitte'],
  ['cameron', 'corner'],
]);

export const BAD_EVERY_SUSPECT_DIRECT = makePuzzle('bad-every-suspect-direct', [
  ['ada', 'in_room', 'room_0_0'],
  ['brigitte', 'in_room', 'room_1_1'],
  ['cameron', 'in_room', 'room_2_2'],
], { oneCellRooms: true });

export const BAD_MULTIPLE_DIRECT = makePuzzle('bad-multiple-direct', [
  ['ada', 'in_room', 'room_0_0'],
  ['brigitte', 'in_room', 'room_1_1'],
  ['ada', 'north_of', 'cameron'],
  ['cameron', 'corner'],
], { oneCellRooms: true });

export const BAD_TRIVIAL_DIRECT_UNIQUE = makePuzzle('bad-trivial-direct-unique', [
  ['ada', 'in_room', 'room_0_0'],
  ['brigitte', 'in_room', 'room_1_1'],
  ['cameron', 'in_room', 'room_2_2'],
  ['ada', 'north_of', 'brigitte'],
  ['brigitte', 'north_of', 'cameron'],
], { oneCellRooms: true });

export const BAD_POOR_CONNECTIVITY = makePuzzle('bad-poor-connectivity', [
  ['ada', 'in_room', 'room_0_0'],
  ['brigitte', 'in_room', 'room_1_1'],
  ['cameron', 'in_room', 'room_2_2'],
], { oneCellRooms: true });

export const BAD_TOO_MANY_REDUNDANT = makePuzzle('bad-too-many-redundant', [
  ['ada', 'corner'],
  ['ada', 'north_of', 'brigitte'],
  ['ada', 'west_of', 'brigitte'],
  ['cameron', 'corner'],
  ['brigitte', 'north_of', 'cameron'],
  ['brigitte', 'west_of', 'cameron'],
  ['ada', 'north_of', 'cameron'],
  ['ada', 'west_of', 'cameron'],
]);
