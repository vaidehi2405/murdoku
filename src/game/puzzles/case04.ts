import type { PuzzleDefinition, Cell, Room, Suspect } from '../../types/puzzleTypes';

export const CASE_04_ROOMS: Record<string, Room> = {
  penthouse_suite: {
    id: 'penthouse_suite',
    name: 'Penthouse Suite',
    color: '#EFF6FF',
    borderColor: '#BFDBFE',
    textColor: '#1D4ED8',
  },
  sky_lounge: {
    id: 'sky_lounge',
    name: 'Sky Lounge',
    color: '#ECFDF5',
    borderColor: '#A7F3D0',
    textColor: '#047857',
  },
  terrace_garden: {
    id: 'terrace_garden',
    name: 'Terrace Garden',
    color: '#FFFBEB',
    borderColor: '#FDE68A',
    textColor: '#B45309',
  },
  private_bar: {
    id: 'private_bar',
    name: 'Private Bar',
    color: '#F5F3FF',
    borderColor: '#DDD6FE',
    textColor: '#6D28D9',
  },
};

export const CASE_04_SUSPECTS: Suspect[] = [
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
      let roomId = 'penthouse_suite';
      let roomName = 'Penthouse Suite';

      if (r < 3 && c >= 3) {
        roomId = 'sky_lounge';
        roomName = 'Sky Lounge';
      } else if (r >= 3 && c < 3) {
        roomId = 'terrace_garden';
        roomName = 'Terrace Garden';
      } else if (r >= 3 && c >= 3) {
        roomId = 'private_bar';
        roomName = 'Private Bar';
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

  grid[0][3] = { ...grid[0][3], occupiable: true, object: 'carpet', objectName: 'Sky Mat' };
  grid[1][1] = { ...grid[1][1], occupiable: true, object: 'couch', objectName: 'Penthouse Sofa' };
  grid[2][5] = { ...grid[2][5], occupiable: true, object: 'table', objectName: 'Lounge Table' };
  grid[3][0] = { ...grid[3][0], occupiable: true, object: 'chair', objectName: 'Terrace Chair' };
  grid[4][4] = { ...grid[4][4], occupiable: true, object: 'desk', objectName: 'Bar Desk' };
  grid[5][2] = { ...grid[5][2], occupiable: true, object: 'safe', objectName: 'Garden Vault' };

  return grid;
}

export const CASE_04_PUZZLE: PuzzleDefinition = {
  id: 'puzzle-case-04',
  caseId: 'case-04',
  caseNumber: 'CASE 04',
  title: 'Murder at Midnight',
  description: 'A high-profile party ended in tragedy at midnight. Determine everyone\'s location.',
  difficulty: 'easy',
  estimatedTime: '~6–10 min',
  gridRows: 6,
  gridCols: 6,
  rooms: CASE_04_ROOMS,
  cells: generateGrid(),
  suspects: CASE_04_SUSPECTS,
  solution: {
    ada: { row: 0, col: 3 },
    brigitte: { row: 1, col: 1 },
    cameron: { row: 2, col: 5 },
    edison: { row: 3, col: 0 },
    darlene: { row: 4, col: 4 },
    vinita: { row: 5, col: 2 },
  },
  hints: [
    {
      level: 1,
      title: 'Sky Mat & Penthouse Sofa',
      text: 'Ada is on Sky Mat at (0,3). Brigitte is on Penthouse Sofa at (1,1).',
      targetClueId: 'c4-1',
      targetCellCoords: ['0,3', '1,1'],
    },
    {
      level: 2,
      title: 'Lounge Table & Terrace Chair',
      text: 'Cameron is at Lounge Table (2,5). Edison is at Terrace Chair (3,0).',
      targetClueId: 'c4-3',
      targetCellCoords: ['2,5', '3,0'],
    },
    {
      level: 3,
      title: 'Bar Desk & Garden Vault',
      text: 'Darlene is at Bar Desk (4,4). Vinita is at Garden Vault (5,2).',
      targetClueId: 'c4-5',
      targetCellCoords: ['4,4', '5,2'],
    },
  ],
  solutionExplanation: {
    culpritId: 'cameron',
    culpritName: 'Cameron',
    summary: 'The Midnight Murder timeline was solved by establishing each guest\'s furniture location:',
    steps: [
      'Ada is standing on Sky Mat in Sky Lounge at cell (0,3).',
      'Brigitte is on Penthouse Sofa in Penthouse Suite at cell (1,1).',
      'Cameron is at Lounge Table in Sky Lounge at cell (2,5).',
      'Edison is sitting in Terrace Chair in Terrace Garden at cell (3,0).',
      'Darlene is at Bar Desk in Private Bar at cell (4,4).',
      'Vinita is at Garden Vault in Terrace Garden at cell (5,2).',
    ],
  },
  clues: [
    { id: 'c4-1', suspectId: 'ada', text: 'Ada was standing on the carpet in Sky Lounge.', condition: { type: 'on_object', subject: 'ada', reference: 'carpet' } },
    { id: 'c4-2', suspectId: 'brigitte', text: 'Brigitte was on the couch in Penthouse Suite.', condition: { type: 'on_object', subject: 'brigitte', reference: 'couch' } },
    { id: 'c4-3', suspectId: 'cameron', text: 'Cameron was at the table in Sky Lounge.', condition: { type: 'on_object', subject: 'cameron', reference: 'table' } },
    { id: 'c4-4', suspectId: 'edison', text: 'Edison was sitting in the chair in Terrace Garden.', condition: { type: 'on_object', subject: 'edison', reference: 'chair' } },
    { id: 'c4-5', suspectId: 'darlene', text: 'Darlene was at the desk in Private Bar.', condition: { type: 'on_object', subject: 'darlene', reference: 'desk' } },
    { id: 'c4-6', suspectId: 'vinita', text: 'Vinita was at the safe in Terrace Garden.', condition: { type: 'on_object', subject: 'vinita', reference: 'safe' } },
  ],
};
