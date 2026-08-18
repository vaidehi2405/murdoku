import type { PuzzleDefinition, Cell, Room, Suspect } from '../../types/puzzleTypes';

export const CASE_03_ROOMS: Record<string, Room> = {
  executive_suite: {
    id: 'executive_suite',
    name: 'Executive Suite',
    color: '#FEF3C7',
    borderColor: '#FCD34D',
    textColor: '#92400E',
  },
  private_lounge: {
    id: 'private_lounge',
    name: 'Private Lounge',
    color: '#E0F2FE',
    borderColor: '#BAE6FD',
    textColor: '#0369A1',
  },
  secretary_lobby: {
    id: 'secretary_lobby',
    name: 'Secretary Lobby',
    color: '#DCFCE7',
    borderColor: '#86EFAC',
    textColor: '#15803D',
  },
  file_archive: {
    id: 'file_archive',
    name: 'Secure File Archive',
    color: '#EDE9FE',
    borderColor: '#DDD6FE',
    textColor: '#6D28D9',
  },
};

export const CASE_03_SUSPECTS: Suspect[] = [
  { id: 'ada', name: 'Ada', initial: 'A', color: '#10B981', badgeBg: '#10B981', textColor: '#FFFFFF', avatarBg: '#D1FAE5' },
  { id: 'brigitte', name: 'Brigitte', initial: 'B', color: '#3B82F6', badgeBg: '#3B82F6', textColor: '#FFFFFF', avatarBg: '#DBEAFE' },
  { id: 'cameron', name: 'Cameron', initial: 'C', color: '#F59E0B', badgeBg: '#F59E0B', textColor: '#FFFFFF', avatarBg: '#FEF3C7' },
  { id: 'darlene', name: 'Darlene', initial: 'D', color: '#EF4444', badgeBg: '#EF4444', textColor: '#FFFFFF', avatarBg: '#FEE2E2' },
  { id: 'edison', name: 'Edison', initial: 'E', color: '#8B5CF6', badgeBg: '#8B5CF6', textColor: '#FFFFFF', avatarBg: '#EDE9FE' },
  { id: 'vinita', name: 'Vinita', initial: 'V', color: '#06B6D4', badgeBg: '#06B6D4', textColor: '#FFFFFF', avatarBg: '#CFFAFE' },
];

function generateGrid(): Cell[][] {
  const grid: Cell[][] = [];
  for (let r = 0; r < 6; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < 6; c++) {
      let roomId = 'executive_suite';
      let roomName = 'Executive Suite';

      if (r < 3 && c >= 3) {
        roomId = 'private_lounge';
        roomName = 'Private Lounge';
      } else if (r >= 3 && c < 3) {
        roomId = 'secretary_lobby';
        roomName = 'Secretary Lobby';
      } else if (r >= 3 && c >= 3) {
        roomId = 'file_archive';
        roomName = 'Secure File Archive';
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

  grid[0][1] = { ...grid[0][1], occupiable: true, object: 'carpet', objectName: 'Silk Rug' };
  grid[1][4] = { ...grid[1][4], occupiable: true, object: 'couch', objectName: 'Leather Couch' };
  grid[2][0] = { ...grid[2][0], occupiable: true, object: 'table', objectName: 'Suite Table' };
  grid[3][2] = { ...grid[3][2], occupiable: true, object: 'chair', objectName: 'Lobby Stool' };
  grid[4][3] = { ...grid[4][3], occupiable: true, object: 'desk', objectName: 'Archive Desk' };
  grid[5][5] = { ...grid[5][5], occupiable: true, object: 'safe', objectName: 'Archive Safe' };

  return grid;
}

export const CASE_03_PUZZLE: PuzzleDefinition = {
  id: 'puzzle-case-03',
  caseId: 'case-03',
  caseNumber: 'CASE 03',
  title: 'The Locked Office',
  description: 'Determine which executive slipped into the secure records room after office hours.',
  difficulty: 'easy',
  estimatedTime: '~6–10 min',
  gridRows: 6,
  gridCols: 6,
  rooms: CASE_03_ROOMS,
  cells: generateGrid(),
  suspects: CASE_03_SUSPECTS,
  solution: {
    ada: { row: 0, col: 1 },
    brigitte: { row: 1, col: 4 },
    cameron: { row: 2, col: 0 },
    edison: { row: 3, col: 2 },
    darlene: { row: 4, col: 3 },
    vinita: { row: 5, col: 5 },
  },
  hints: [
    {
      level: 1,
      title: 'Silk Rug & Leather Couch',
      text: 'Ada is on Silk Rug at (0,1). Brigitte is on Leather Couch at (1,4).',
      targetClueId: 'c3-1',
      targetCellCoords: ['0,1', '1,4'],
    },
    {
      level: 2,
      title: 'Suite Table & Lobby Stool',
      text: 'Cameron is at Suite Table (2,0). Edison is at Lobby Stool (3,2).',
      targetClueId: 'c3-3',
      targetCellCoords: ['2,0', '3,2'],
    },
    {
      level: 3,
      title: 'Archive Desk & Safe',
      text: 'Darlene is at Archive Desk (4,3). Vinita is at Archive Safe (5,5).',
      targetClueId: 'c3-5',
      targetCellCoords: ['4,3', '5,5'],
    },
  ],
  solutionExplanation: {
    culpritId: 'vinita',
    culpritName: 'Vinita',
    summary: 'The Locked Office puzzle was solved by tracking room furniture stations:',
    steps: [
      'Ada is on Silk Rug in Executive Suite at cell (0,1).',
      'Brigitte is on Leather Couch in Private Lounge at cell (1,4).',
      'Cameron is at Suite Table in Executive Suite at cell (2,0).',
      'Edison is sitting in Lobby Stool in Secretary Lobby at cell (3,2).',
      'Darlene is at Archive Desk in Secure File Archive at cell (4,3).',
      'Vinita is at Archive Safe in Secure File Archive at cell (5,5).',
    ],
  },
  clues: [
    { id: 'c3-1', suspectId: 'ada', text: 'Ada was standing on the carpet in Executive Suite.', condition: { type: 'on_object', subject: 'ada', reference: 'carpet' } },
    { id: 'c3-2', suspectId: 'brigitte', text: 'Brigitte was on the couch in Private Lounge.', condition: { type: 'on_object', subject: 'brigitte', reference: 'couch' } },
    { id: 'c3-3', suspectId: 'cameron', text: 'Cameron was at the table in Executive Suite.', condition: { type: 'on_object', subject: 'cameron', reference: 'table' } },
    { id: 'c3-4', suspectId: 'edison', text: 'Edison was sitting in the chair in Secretary Lobby.', condition: { type: 'on_object', subject: 'edison', reference: 'chair' } },
    { id: 'c3-5', suspectId: 'darlene', text: 'Darlene was at the desk in Secure File Archive.', condition: { type: 'on_object', subject: 'darlene', reference: 'desk' } },
    { id: 'c3-6', suspectId: 'vinita', text: 'Vinita was at the safe in Secure File Archive.', condition: { type: 'on_object', subject: 'vinita', reference: 'safe' } },
  ],
};
