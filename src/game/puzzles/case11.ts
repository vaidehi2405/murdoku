import type { PuzzleDefinition, Cell, Room, Suspect } from '../../types/puzzleTypes';

export const CASE_11_ROOMS: Record<string, Room> = {
  sculpture_hall: {
    id: 'sculpture_hall',
    name: 'Sculpture Hall',
    color: '#EFF6FF',
    borderColor: '#BFDBFE',
    textColor: '#1D4ED8',
  },
  painting_wing: {
    id: 'painting_wing',
    name: 'Painting Wing',
    color: '#ECFDF5',
    borderColor: '#A7F3D0',
    textColor: '#047857',
  },
  restoration_lab: {
    id: 'restoration_lab',
    name: 'Restoration Lab',
    color: '#FFFBEB',
    borderColor: '#FDE68A',
    textColor: '#B45309',
  },
  antiquities_vault: {
    id: 'antiquities_vault',
    name: 'Antiquities Vault',
    color: '#F5F3FF',
    borderColor: '#DDD6FE',
    textColor: '#6D28D9',
  },
};

export const CASE_11_SUSPECTS: Suspect[] = [
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
      let roomId = 'sculpture_hall';
      let roomName = 'Sculpture Hall';

      if (r < 3 && c >= 3) {
        roomId = 'painting_wing';
        roomName = 'Painting Wing';
      } else if (r >= 3 && c < 3) {
        roomId = 'restoration_lab';
        roomName = 'Restoration Lab';
      } else if (r >= 3 && c >= 3) {
        roomId = 'antiquities_vault';
        roomName = 'Antiquities Vault';
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

  grid[0][4] = { ...grid[0][4], occupiable: true, object: 'carpet', objectName: 'Wing Runner' };
  grid[1][0] = { ...grid[1][0], occupiable: true, object: 'couch', objectName: 'Gallery Bench' };
  grid[2][2] = { ...grid[2][2], occupiable: true, object: 'table', objectName: 'Sculpture Table' };
  grid[3][5] = { ...grid[3][5], occupiable: true, object: 'chair', objectName: 'Vault Chair' };
  grid[4][1] = { ...grid[4][1], occupiable: true, object: 'desk', objectName: 'Lab Desk' };
  grid[5][3] = { ...grid[5][3], occupiable: true, object: 'safe', objectName: 'Relic Safe' };

  return grid;
}

export const CASE_11_PUZZLE: PuzzleDefinition = {
  id: 'puzzle-case-11',
  caseId: 'case-11',
  caseNumber: 'CASE 11',
  title: 'The Silent Witness',
  description: 'An ancient sculpture was replaced with a forged replica during night guard rotation.',
  difficulty: 'expert',
  estimatedTime: '~15–20 min',
  gridRows: 6,
  gridCols: 6,
  rooms: CASE_11_ROOMS,
  cells: generateGrid(),
  suspects: CASE_11_SUSPECTS,
  solution: {
    ada: { row: 0, col: 4 },
    brigitte: { row: 1, col: 0 },
    cameron: { row: 2, col: 2 },
    edison: { row: 3, col: 5 },
    darlene: { row: 4, col: 1 },
    vinita: { row: 5, col: 3 },
  },
  hints: [
    {
      level: 1,
      title: 'Wing Runner & Gallery Bench',
      text: 'Ada is on Wing Runner at (0,4). Brigitte is on Gallery Bench at (1,0).',
      targetClueId: 'c11-1',
      targetCellCoords: ['0,4', '1,0'],
    },
    {
      level: 2,
      title: 'Sculpture Table & Vault Chair',
      text: 'Cameron is at Sculpture Table (2,2). Edison is at Vault Chair (3,5).',
      targetClueId: 'c11-3',
      targetCellCoords: ['2,2', '3,5'],
    },
    {
      level: 3,
      title: 'Lab Desk & Relic Safe',
      text: 'Darlene is at Lab Desk (4,1). Vinita is at Relic Safe (5,3).',
      targetClueId: 'c11-5',
      targetCellCoords: ['4,1', '5,3'],
    },
  ],
  solutionExplanation: {
    culpritId: 'brigitte',
    culpritName: 'Brigitte',
    summary: 'The Silent Witness heist was exposed by reconstructing gallery guard locations:',
    steps: [
      'Ada is standing on Wing Runner in Painting Wing at (0,4).',
      'Brigitte is on Gallery Bench in Sculpture Hall at (1,0).',
      'Cameron is at Sculpture Table in Sculpture Hall at (2,2).',
      'Edison is sitting in Vault Chair in Antiquities Vault at (3,5).',
      'Darlene is at Lab Desk in Restoration Lab at (4,1).',
      'Vinita is at Relic Safe in Antiquities Vault at (5,3).',
    ],
  },
  clues: [
    { id: 'c11-1', suspectId: 'ada', text: 'Ada was standing on the carpet in Painting Wing.', condition: { type: 'on_object', subject: 'ada', reference: 'carpet' } },
    { id: 'c11-2', suspectId: 'brigitte', text: 'Brigitte was on the couch in Sculpture Hall.', condition: { type: 'on_object', subject: 'brigitte', reference: 'couch' } },
    { id: 'c11-3', suspectId: 'cameron', text: 'Cameron was at the table in Sculpture Hall.', condition: { type: 'on_object', subject: 'cameron', reference: 'table' } },
    { id: 'c11-4', suspectId: 'edison', text: 'Edison was sitting in the chair in Antiquities Vault.', condition: { type: 'on_object', subject: 'edison', reference: 'chair' } },
    { id: 'c11-5', suspectId: 'darlene', text: 'Darlene was at the desk in Restoration Lab.', condition: { type: 'on_object', subject: 'darlene', reference: 'desk' } },
    { id: 'c11-6', suspectId: 'vinita', text: 'Vinita was at the safe in Antiquities Vault.', condition: { type: 'on_object', subject: 'vinita', reference: 'safe' } },
  ],
};
