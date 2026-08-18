import type { PuzzleDefinition, Cell, Room, Suspect } from '../../types/puzzleTypes';

export const CASE_09_ROOMS: Record<string, Room> = {
  executive_office: {
    id: 'executive_office',
    name: 'Executive Office',
    color: '#EFF6FF',
    borderColor: '#BFDBFE',
    textColor: '#1D4ED8',
  },
  cubicle_bay: {
    id: 'cubicle_bay',
    name: 'Cubicle Bay',
    color: '#ECFDF5',
    borderColor: '#A7F3D0',
    textColor: '#047857',
  },
  break_room: {
    id: 'break_room',
    name: 'Break Room',
    color: '#FFFBEB',
    borderColor: '#FDE68A',
    textColor: '#B45309',
  },
  it_core: {
    id: 'it_core',
    name: 'IT Core',
    color: '#F5F3FF',
    borderColor: '#DDD6FE',
    textColor: '#6D28D9',
  },
};

export const CASE_09_SUSPECTS: Suspect[] = [
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
      let roomId = 'executive_office';
      let roomName = 'Executive Office';

      if (r < 3 && c >= 3) {
        roomId = 'cubicle_bay';
        roomName = 'Cubicle Bay';
      } else if (r >= 3 && c < 3) {
        roomId = 'break_room';
        roomName = 'Break Room';
      } else if (r >= 3 && c >= 3) {
        roomId = 'it_core';
        roomName = 'IT Core';
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

  grid[0][1] = { ...grid[0][1], occupiable: true, object: 'carpet', objectName: 'Executive Rug' };
  grid[1][4] = { ...grid[1][4], occupiable: true, object: 'couch', objectName: 'Cubicle Couch' };
  grid[2][0] = { ...grid[2][0], occupiable: true, object: 'table', objectName: 'Executive Table' };
  grid[3][2] = { ...grid[3][2], occupiable: true, object: 'chair', objectName: 'Break Chair' };
  grid[4][3] = { ...grid[4][3], occupiable: true, object: 'desk', objectName: 'Console Desk' };
  grid[5][5] = { ...grid[5][5], occupiable: true, object: 'safe', objectName: 'Server Vault' };

  return grid;
}

export const CASE_09_PUZZLE: PuzzleDefinition = {
  id: 'puzzle-case-09',
  caseId: 'case-09',
  caseNumber: 'CASE 09',
  title: 'Murder on Floor 7',
  description: 'Late after hours on the 7th floor, a senior director was murdered. Reconstruct everyone\'s exact station.',
  difficulty: 'hard',
  estimatedTime: '~10–15 min',
  gridRows: 6,
  gridCols: 6,
  rooms: CASE_09_ROOMS,
  cells: generateGrid(),
  suspects: CASE_09_SUSPECTS,
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
      title: 'Executive Rug & Couch',
      text: 'Ada is on Executive Rug at (0,1). Brigitte is on Cubicle Couch at (1,4).',
      targetClueId: 'c9-1',
      targetCellCoords: ['0,1', '1,4'],
    },
    {
      level: 2,
      title: 'Table & Break Chair',
      text: 'Cameron is at Executive Table (2,0). Edison is at Break Chair (3,2).',
      targetClueId: 'c9-3',
      targetCellCoords: ['2,0', '3,2'],
    },
    {
      level: 3,
      title: 'Console & Server Vault',
      text: 'Darlene is at Console Desk (4,3). Vinita is at Server Vault (5,5).',
      targetClueId: 'c9-5',
      targetCellCoords: ['4,3', '5,5'],
    },
  ],
  solutionExplanation: {
    culpritId: 'cameron',
    culpritName: 'Cameron',
    summary: 'The Floor 7 murder case was resolved by establishing exact station coordinates for all six employees:',
    steps: [
      'Ada is standing on Executive Rug in Executive Office at (0,1).',
      'Brigitte is on Cubicle Couch in Cubicle Bay at (1,4).',
      'Cameron is at Executive Table in Executive Office at (2,0).',
      'Edison is sitting in Break Chair in Break Room at (3,2).',
      'Darlene is at Console Desk in IT Core at (4,3).',
      'Vinita is at Server Vault in IT Core at (5,5).',
    ],
  },
  clues: [
    { id: 'c9-1', suspectId: 'ada', text: 'Ada was standing on the carpet in Executive Office.', condition: { type: 'on_object', subject: 'ada', reference: 'carpet' } },
    { id: 'c9-2', suspectId: 'brigitte', text: 'Brigitte was on the couch in Cubicle Bay.', condition: { type: 'on_object', subject: 'brigitte', reference: 'couch' } },
    { id: 'c9-3', suspectId: 'cameron', text: 'Cameron was at the table in Executive Office.', condition: { type: 'on_object', subject: 'cameron', reference: 'table' } },
    { id: 'c9-4', suspectId: 'edison', text: 'Edison was sitting in the chair in Break Room.', condition: { type: 'on_object', subject: 'edison', reference: 'chair' } },
    { id: 'c9-5', suspectId: 'darlene', text: 'Darlene was at the desk in IT Core.', condition: { type: 'on_object', subject: 'darlene', reference: 'desk' } },
    { id: 'c9-6', suspectId: 'vinita', text: 'Vinita was at the safe in IT Core.', condition: { type: 'on_object', subject: 'vinita', reference: 'safe' } },
  ],
};
