import type { PuzzleDefinition, Cell, Room, Suspect } from '../../types/puzzleTypes';

export const CASE_06_ROOMS: Record<string, Room> = {
  private_dining: {
    id: 'private_dining',
    name: 'Private Dining Room',
    color: '#FFF1F2',
    borderColor: '#FECDD3',
    textColor: '#9F1239',
  },
  wine_cellar: {
    id: 'wine_cellar',
    name: 'Vintage Wine Cellar',
    color: '#FFFBEB',
    borderColor: '#FDE68A',
    textColor: '#92400E',
  },
  kitchen_pantry: {
    id: 'kitchen_pantry',
    name: 'Kitchen & Pantry',
    color: '#ECFDF5',
    borderColor: '#A7F3D0',
    textColor: '#065F46',
  },
  courtyard: {
    id: 'courtyard',
    name: 'Courtyard Garden',
    color: '#F3F4F6',
    borderColor: '#E5E7EB',
    textColor: '#1F2937',
  },
};

export const CASE_06_SUSPECTS: Suspect[] = [
  {
    id: 'ada',
    name: 'Ada',
    initial: 'A',
    color: '#10B981',
    badgeBg: '#10B981',
    textColor: '#FFFFFF',
    avatarBg: '#D1FAE5',
  },
  {
    id: 'brigitte',
    name: 'Brigitte',
    initial: 'B',
    color: '#3B82F6',
    badgeBg: '#3B82F6',
    textColor: '#FFFFFF',
    avatarBg: '#DBEAFE',
  },
  {
    id: 'cameron',
    name: 'Cameron',
    initial: 'C',
    color: '#F59E0B',
    badgeBg: '#F59E0B',
    textColor: '#FFFFFF',
    avatarBg: '#FEF3C7',
  },
  {
    id: 'darlene',
    name: 'Darlene',
    initial: 'D',
    color: '#8B5CF6',
    badgeBg: '#8B5CF6',
    textColor: '#FFFFFF',
    avatarBg: '#EDE9FE',
  },
  {
    id: 'edison',
    name: 'Edison',
    initial: 'E',
    color: '#EF4444',
    badgeBg: '#EF4444',
    textColor: '#FFFFFF',
    avatarBg: '#FEE2E2',
  },
  {
    id: 'vinita',
    name: 'Vinita',
    initial: 'V',
    color: '#EC4899',
    badgeBg: '#EC4899',
    textColor: '#FFFFFF',
    avatarBg: '#FCE7F3',
  },
];

function generateGrid(): Cell[][] {
  const grid: Cell[][] = [];
  for (let r = 0; r < 6; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < 6; c++) {
      let roomId = 'private_dining';
      let roomName = 'Private Dining Room';

      if (r < 3 && c >= 3) {
        roomId = 'wine_cellar';
        roomName = 'Vintage Wine Cellar';
      } else if (r >= 3 && c < 3) {
        roomId = 'kitchen_pantry';
        roomName = 'Kitchen & Pantry';
      } else if (r >= 3 && c >= 3) {
        roomId = 'courtyard';
        roomName = 'Courtyard Garden';
      }

      row.push({
        row: r,
        col: c,
        occupiable: true,
        roomId,
        roomName,
        object: 'none',
      });
    }
    grid.push(row);
  }

  // Feature Furniture & Objects
  grid[0][0] = { ...grid[0][0], occupiable: true, object: 'fireplace', objectName: 'Grand Fireplace' };
  grid[0][1] = { ...grid[0][1], occupiable: true, object: 'table', objectName: 'Buffet Sideboard' };
  grid[0][2] = { ...grid[0][2], occupiable: true, object: 'cabinet', objectName: 'China Cabinet' };
  grid[1][1] = { ...grid[1][1], occupiable: true, object: 'table', objectName: 'Dining Table' };
  grid[1][2] = { ...grid[1][2], occupiable: true, object: 'chair', objectName: 'Armchair' };
  grid[2][0] = { ...grid[2][0], occupiable: true, object: 'plant', objectName: 'Orchid Pot' };
  grid[2][1] = { ...grid[2][1], occupiable: true, object: 'cabinet', objectName: 'Side Table' };

  grid[0][4] = { ...grid[0][4], occupiable: true, object: 'bar', objectName: 'Vintage Casks' };
  grid[0][5] = { ...grid[0][5], occupiable: true, object: 'cabinet', objectName: 'Barrel Rack' };
  grid[1][3] = { ...grid[1][3], occupiable: true, object: 'table', objectName: 'Cork Station' };
  grid[1][4] = { ...grid[1][4], occupiable: true, object: 'cabinet', objectName: 'Reserve Vault' };
  grid[1][5] = { ...grid[1][5], occupiable: true, object: 'bar', objectName: 'Wine Shelves' };
  grid[2][3] = { ...grid[2][3], occupiable: true, object: 'table', objectName: 'Tasting Table' };
  grid[2][4] = { ...grid[2][4], occupiable: true, object: 'safe', objectName: 'Vintage Safe' };
  grid[2][5] = { ...grid[2][5], occupiable: true, object: 'cabinet', objectName: 'Cellar Cabinet' };

  grid[3][0] = { ...grid[3][0], occupiable: true, object: 'desk', objectName: 'Prep Counter' };
  grid[3][2] = { ...grid[3][2], occupiable: true, object: 'table', objectName: 'Chef Table' };
  grid[4][0] = { ...grid[4][0], occupiable: true, object: 'table', objectName: 'Oven Unit' };
  grid[4][1] = { ...grid[4][1], occupiable: true, object: 'cabinet', objectName: 'Spice Pantry' };
  grid[4][2] = { ...grid[4][2], occupiable: true, object: 'table', objectName: 'Sink' };
  grid[5][0] = { ...grid[5][0], occupiable: true, object: 'safe', objectName: 'Silver Safe' };
  grid[5][2] = { ...grid[5][2], occupiable: true, object: 'cabinet', objectName: 'Cooler Unit' };

  grid[3][3] = { ...grid[3][3], occupiable: true, object: 'pedestal', objectName: 'Marble Fountain' };
  grid[3][4] = { ...grid[3][4], occupiable: true, object: 'plant', objectName: 'Hedge' };
  grid[3][5] = { ...grid[3][5], occupiable: true, object: 'table', objectName: 'Stone Table' };
  grid[4][3] = { ...grid[4][3], occupiable: true, object: 'plant', objectName: 'Rose Bush' };
  grid[4][5] = { ...grid[4][5], occupiable: true, object: 'plant', objectName: 'Topiary' };
  grid[5][3] = { ...grid[5][3], occupiable: true, object: 'chair', objectName: 'Garden Bench' };
  grid[5][4] = { ...grid[5][4], occupiable: true, object: 'table', objectName: 'Sun Lounge' };

  return grid;
}

export const CASE_06_PUZZLE: PuzzleDefinition = {
  id: 'puzzle-case-06',
  caseId: 'case-06',
  caseNumber: 'CASE 06',
  title: 'The Red Envelope',
  description: 'An extortion note was exchanged during the family banquet. Unmask the conspirators.',
  difficulty: 'hard',
  estimatedTime: '~10–15 min',
  gridRows: 6,
  gridCols: 6,
  rooms: CASE_06_ROOMS,
  cells: generateGrid(),
  suspects: CASE_06_SUSPECTS,
  solution: {
    ada: { row: 1, col: 0 },
    brigitte: { row: 0, col: 3 },
    cameron: { row: 2, col: 2 },
    darlene: { row: 3, col: 1 },
    vinita: { row: 4, col: 4 },
    edison: { row: 5, col: 5 },
  },
  hints: [
    {
      level: 1,
      title: 'Dining Room & Wine Cellar Entries',
      text: 'Ada is in the Private Dining Room at (1,0), west of Cameron at (2,2). Brigitte is in the Vintage Wine Cellar at (0,3).',
      targetClueId: 'clue-1',
      targetCellCoords: ['1,0', '0,3'],
    },
    {
      level: 2,
      title: 'Kitchen & Pantry Setup',
      text: 'Darlene is alone in the Kitchen & Pantry at cell (3,1), south of Ada and west of Cameron.',
      targetClueId: 'clue-6',
      targetCellCoords: ['3,1'],
    },
    {
      level: 3,
      title: 'Courtyard Alignments',
      text: 'Vinita is in the Courtyard at cell (4,4), south and east of Cameron. Edison is in the Courtyard at cell (5,5), south of Vinita.',
      targetClueId: 'clue-11',
      targetCellCoords: ['4,4', '5,5'],
    },
  ],
  solutionExplanation: {
    culpritId: 'edison',
    culpritName: 'Edison',
    summary: 'The Red Envelope mystery was solved by connecting spatial relationships across open rooms:',
    steps: [
      'Ada is standing at cell (1,0) in the Private Dining Room, west of all other suspects.',
      'Cameron is in the Private Dining Room at cell (2,2), south and east of Ada.',
      'Brigitte is in the Vintage Wine Cellar at cell (0,3), alone in her room, north of Ada, Cameron, Darlene, Vinita, and Edison.',
      'Darlene is in the Kitchen & Pantry at cell (3,1), south of Ada and west of Cameron.',
      'Vinita is in the Courtyard Garden at cell (4,4), south and east of Darlene and Cameron.',
      'Edison is in the Courtyard Garden at cell (5,5), in a building corner, south and east of Vinita.',
    ],
  },
  clues: [
    {
      id: 'clue-1',
      suspectId: 'ada',
      text: 'Ada was in the Private Dining Room.',
      condition: { type: 'in_room', subject: 'ada', reference: 'private_dining' },
    },
    {
      id: 'clue-2',
      suspectId: 'ada',
      text: 'Ada was west of all other suspects.',
      condition: { type: 'west_of_all', subject: 'ada' },
    },
    {
      id: 'clue-3',
      suspectId: 'brigitte',
      text: 'Brigitte was in the Vintage Wine Cellar.',
      condition: { type: 'in_room', subject: 'brigitte', reference: 'wine_cellar' },
    },
    {
      id: 'clue-4',
      suspectId: 'brigitte',
      text: 'Brigitte was alone in her room.',
      condition: { type: 'alone', subject: 'brigitte' },
    },
    {
      id: 'clue-5',
      suspectId: 'brigitte',
      text: 'Brigitte was north of Ada.',
      condition: { type: 'north_of', subject: 'brigitte', reference: 'ada' },
    },
    {
      id: 'clue-6',
      suspectId: 'brigitte',
      text: 'Brigitte was north of Cameron.',
      condition: { type: 'north_of', subject: 'brigitte', reference: 'cameron' },
    },
    {
      id: 'clue-7',
      suspectId: 'cameron',
      text: 'Cameron was in the Private Dining Room with Ada.',
      condition: { type: 'same_room', subject: 'cameron', reference: 'ada' },
    },
    {
      id: 'clue-8',
      suspectId: 'cameron',
      text: 'Cameron was south of Ada.',
      condition: { type: 'south_of', subject: 'cameron', reference: 'ada' },
    },
    {
      id: 'clue-9',
      suspectId: 'cameron',
      text: 'Cameron was east of Ada.',
      condition: { type: 'east_of', subject: 'cameron', reference: 'ada' },
    },
    {
      id: 'clue-10',
      suspectId: 'darlene',
      text: 'Darlene was in the Kitchen & Pantry.',
      condition: { type: 'in_room', subject: 'darlene', reference: 'kitchen_pantry' },
    },
    {
      id: 'clue-11',
      suspectId: 'darlene',
      text: 'Darlene was alone in her room.',
      condition: { type: 'alone', subject: 'darlene' },
    },
    {
      id: 'clue-12',
      suspectId: 'darlene',
      text: 'Darlene was south of Ada.',
      condition: { type: 'south_of', subject: 'darlene', reference: 'ada' },
    },
    {
      id: 'clue-13',
      suspectId: 'darlene',
      text: 'Darlene was west of Cameron.',
      condition: { type: 'west_of', subject: 'darlene', reference: 'cameron' },
    },
    {
      id: 'clue-14',
      suspectId: 'vinita',
      text: 'Vinita was in the Courtyard Garden.',
      condition: { type: 'in_room', subject: 'vinita', reference: 'courtyard' },
    },
    {
      id: 'clue-15',
      suspectId: 'vinita',
      text: 'Vinita was south of Cameron.',
      condition: { type: 'south_of', subject: 'vinita', reference: 'cameron' },
    },
    {
      id: 'clue-16',
      suspectId: 'vinita',
      text: 'Vinita was east of Cameron.',
      condition: { type: 'east_of', subject: 'vinita', reference: 'cameron' },
    },
    {
      id: 'clue-17',
      suspectId: 'vinita',
      text: 'Vinita was south of Darlene.',
      condition: { type: 'south_of', subject: 'vinita', reference: 'darlene' },
    },
    {
      id: 'clue-18',
      suspectId: 'edison',
      text: 'Edison was in the Courtyard Garden with Vinita.',
      condition: { type: 'same_room', subject: 'edison', reference: 'vinita' },
    },
    {
      id: 'clue-19',
      suspectId: 'edison',
      text: 'Edison was south of Vinita.',
      condition: { type: 'south_of', subject: 'edison', reference: 'vinita' },
    },
    {
      id: 'clue-20',
      suspectId: 'edison',
      text: 'Edison was east of Vinita.',
      condition: { type: 'east_of', subject: 'edison', reference: 'vinita' },
    },
    {
      id: 'clue-21',
      suspectId: 'edison',
      text: 'Edison was standing in a corner of the building.',
      condition: { type: 'corner', subject: 'edison' },
    },
    {
      id: 'clue-22',
      suspectId: 'brigitte',
      text: 'Brigitte was west of Vinita.',
      condition: { type: 'west_of', subject: 'brigitte', reference: 'vinita' },
    },
  ],
};
