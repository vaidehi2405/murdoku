import type { PuzzleDefinition, Cell, Room, Suspect } from '../../types/puzzleTypes';

export const CASE_10_ROOMS: Record<string, Room> = {
  boardroom: {
    id: 'boardroom',
    name: 'Grand Boardroom',
    color: '#FFFBEB',
    borderColor: '#FDE68A',
    textColor: '#B45309',
  },
  exec_suite: {
    id: 'exec_suite',
    name: 'Executive Suite',
    color: '#ECFDF5',
    borderColor: '#A7F3D0',
    textColor: '#047857',
  },
  conf_room: {
    id: 'conf_room',
    name: 'Conference Room B',
    color: '#EFF6FF',
    borderColor: '#BFDBFE',
    textColor: '#1D4ED8',
  },
  secret_annex: {
    id: 'secret_annex',
    name: 'Secret Annex',
    color: '#F5F3FF',
    borderColor: '#DDD6FE',
    textColor: '#6D28D9',
  },
};

export const CASE_10_SUSPECTS: Suspect[] = [
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
      let roomId = 'boardroom';
      let roomName = 'Grand Boardroom';

      if (r < 3 && c >= 3) {
        roomId = 'exec_suite';
        roomName = 'Executive Suite';
      } else if (r >= 3 && c < 3) {
        roomId = 'conf_room';
        roomName = 'Conference Room B';
      } else if (r >= 3 && c >= 3) {
        roomId = 'secret_annex';
        roomName = 'Secret Annex';
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

  grid[0][3] = { ...grid[0][3], occupiable: true, object: 'carpet', objectName: 'Mahogany Mat' };
  grid[1][1] = { ...grid[1][1], occupiable: true, object: 'couch', objectName: 'Executive Sofa' };
  grid[2][5] = { ...grid[2][5], occupiable: true, object: 'table', objectName: 'Suite Table' };
  grid[3][0] = { ...grid[3][0], occupiable: true, object: 'chair', objectName: 'Conf Stool' };
  grid[4][4] = { ...grid[4][4], occupiable: true, object: 'desk', objectName: 'Annex Desk' };
  grid[5][2] = { ...grid[5][2], occupiable: true, object: 'safe', objectName: 'Annex Safe' };

  return grid;
}

export const CASE_10_PUZZLE: PuzzleDefinition = {
  id: 'puzzle-case-10',
  caseId: 'case-10',
  caseNumber: 'CASE 10',
  title: 'The Last Meeting',
  description: 'A tense board meeting ended in tragedy. Untangle complex spatial clues to pinpoint the truth.',
  difficulty: 'expert',
  estimatedTime: '~15–20 min',
  gridRows: 6,
  gridCols: 6,
  rooms: CASE_10_ROOMS,
  cells: generateGrid(),
  suspects: CASE_10_SUSPECTS,
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
      title: 'Mahogany Mat & Sofa',
      text: 'Ada is on Mahogany Mat at (0,3). Brigitte is on Executive Sofa at (1,1).',
      targetClueId: 'c10-1',
      targetCellCoords: ['0,3', '1,1'],
    },
    {
      level: 2,
      title: 'Suite Table & Conf Stool',
      text: 'Cameron is at Suite Table (2,5). Edison is at Conf Stool (3,0).',
      targetClueId: 'c10-3',
      targetCellCoords: ['2,5', '3,0'],
    },
    {
      level: 3,
      title: 'Annex Desk & Safe',
      text: 'Darlene is at Annex Desk (4,4). Vinita is at Annex Safe (5,2).',
      targetClueId: 'c10-5',
      targetCellCoords: ['4,4', '5,2'],
    },
  ],
  solutionExplanation: {
    culpritId: 'vinita',
    culpritName: 'Vinita',
    summary: 'The Last Meeting case was unraveled by mapping every member\'s seat in the board suite:',
    steps: [
      'Ada is standing on Mahogany Mat in Executive Suite at (0,3).',
      'Brigitte is on Executive Sofa in Grand Boardroom at (1,1).',
      'Cameron is at Suite Table in Executive Suite at (2,5).',
      'Edison is sitting at Conf Stool in Conference Room B at (3,0).',
      'Darlene is at Annex Desk in Secret Annex at (4,4).',
      'Vinita is at Annex Safe in Conference Room B at (5,2).',
    ],
  },
  clues: [
    { id: 'c10-1', suspectId: 'ada', text: 'Ada was standing on the carpet in Executive Suite.', condition: { type: 'on_object', subject: 'ada', reference: 'carpet' } },
    { id: 'c10-2', suspectId: 'brigitte', text: 'Brigitte was on the couch in Grand Boardroom.', condition: { type: 'on_object', subject: 'brigitte', reference: 'couch' } },
    { id: 'c10-3', suspectId: 'cameron', text: 'Cameron was at the table in Executive Suite.', condition: { type: 'on_object', subject: 'cameron', reference: 'table' } },
    { id: 'c10-4', suspectId: 'edison', text: 'Edison was sitting in the chair in Conference Room B.', condition: { type: 'on_object', subject: 'edison', reference: 'chair' } },
    { id: 'c10-5', suspectId: 'darlene', text: 'Darlene was at the desk in Secret Annex.', condition: { type: 'on_object', subject: 'darlene', reference: 'desk' } },
    { id: 'c10-6', suspectId: 'vinita', text: 'Vinita was at the safe in Conference Room B.', condition: { type: 'on_object', subject: 'vinita', reference: 'safe' } },
  ],
};
