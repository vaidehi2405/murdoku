import type { PuzzleDefinition, Cell, Room, Suspect } from '../../types/puzzleTypes';

export const CASE_12_ROOMS: Record<string, Room> = {
  master_suite: {
    id: 'master_suite',
    name: 'Master Suite',
    color: '#EFF6FF',
    borderColor: '#BFDBFE',
    textColor: '#1D4ED8',
  },
  ballroom: {
    id: 'ballroom',
    name: 'Grand Ballroom',
    color: '#ECFDF5',
    borderColor: '#A7F3D0',
    textColor: '#047857',
  },
  study_tower: {
    id: 'study_tower',
    name: 'Study Tower',
    color: '#FFFBEB',
    borderColor: '#FDE68A',
    textColor: '#B45309',
  },
  secret_chamber: {
    id: 'secret_chamber',
    name: 'Secret Chamber',
    color: '#F5F3FF',
    borderColor: '#DDD6FE',
    textColor: '#6D28D9',
  },
};

export const CASE_12_SUSPECTS: Suspect[] = [
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
      let roomId = 'master_suite';
      let roomName = 'Master Suite';

      if (r < 3 && c >= 3) {
        roomId = 'ballroom';
        roomName = 'Grand Ballroom';
      } else if (r >= 3 && c < 3) {
        roomId = 'study_tower';
        roomName = 'Study Tower';
      } else if (r >= 3 && c >= 3) {
        roomId = 'secret_chamber';
        roomName = 'Secret Chamber';
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

  grid[0][5] = { ...grid[0][5], occupiable: true, object: 'carpet', objectName: 'Silk Rug' };
  grid[1][2] = { ...grid[1][2], occupiable: true, object: 'couch', objectName: 'Suite Couch' };
  grid[2][0] = { ...grid[2][0], occupiable: true, object: 'table', objectName: 'Tower Table' };
  grid[3][4] = { ...grid[3][4], occupiable: true, object: 'chair', objectName: 'Chamber Chair' };
  grid[4][1] = { ...grid[4][1], occupiable: true, object: 'desk', objectName: 'Tower Desk' };
  grid[5][3] = { ...grid[5][3], occupiable: true, object: 'safe', objectName: 'Estate Safe' };

  return grid;
}

export const CASE_12_PUZZLE: PuzzleDefinition = {
  id: 'puzzle-case-12',
  caseId: 'case-12',
  caseNumber: 'CASE 12',
  title: 'The Final Case',
  description: 'The master mystery that ties all cases together. Solve the ultimate deduction puzzle.',
  difficulty: 'expert',
  estimatedTime: '~15–20 min',
  gridRows: 6,
  gridCols: 6,
  rooms: CASE_12_ROOMS,
  cells: generateGrid(),
  suspects: CASE_12_SUSPECTS,
  solution: {
    ada: { row: 0, col: 5 },
    brigitte: { row: 1, col: 2 },
    cameron: { row: 2, col: 0 },
    edison: { row: 3, col: 4 },
    darlene: { row: 4, col: 1 },
    vinita: { row: 5, col: 3 },
  },
  hints: [
    {
      level: 1,
      title: 'Silk Rug & Suite Couch',
      text: 'Ada is on Silk Rug at (0,5). Brigitte is on Suite Couch at (1,2).',
      targetClueId: 'c12-1',
      targetCellCoords: ['0,5', '1,2'],
    },
    {
      level: 2,
      title: 'Tower Table & Chamber Chair',
      text: 'Cameron is at Tower Table (2,0). Edison is at Chamber Chair (3,4).',
      targetClueId: 'c12-3',
      targetCellCoords: ['2,0', '3,4'],
    },
    {
      level: 3,
      title: 'Tower Desk & Estate Safe',
      text: 'Darlene is at Tower Desk (4,1). Vinita is at Estate Safe (5,3).',
      targetClueId: 'c12-5',
      targetCellCoords: ['4,1', '5,3'],
    },
  ],
  solutionExplanation: {
    culpritId: 'vinita',
    culpritName: 'Vinita',
    summary: 'The Final Case was cracked by piecing together every suspect\'s location in the estate:',
    steps: [
      'Ada is standing on Silk Rug in Grand Ballroom at (0,5).',
      'Brigitte is on Suite Couch in Master Suite at (1,2).',
      'Cameron is at Tower Table in Master Suite at (2,0).',
      'Edison is sitting in Chamber Chair in Secret Chamber at (3,4).',
      'Darlene is at Tower Desk in Study Tower at (4,1).',
      'Vinita is at Estate Safe in Secret Chamber at (5,3).',
    ],
  },
  clues: [
    { id: 'c12-1', suspectId: 'ada', text: 'Ada was standing on the carpet in Grand Ballroom.', condition: { type: 'on_object', subject: 'ada', reference: 'carpet' } },
    { id: 'c12-2', suspectId: 'brigitte', text: 'Brigitte was on the couch in Master Suite.', condition: { type: 'on_object', subject: 'brigitte', reference: 'couch' } },
    { id: 'c12-3', suspectId: 'cameron', text: 'Cameron was at the table in Master Suite.', condition: { type: 'on_object', subject: 'cameron', reference: 'table' } },
    { id: 'c12-4', suspectId: 'edison', text: 'Edison was sitting in the chair in Secret Chamber.', condition: { type: 'on_object', subject: 'edison', reference: 'chair' } },
    { id: 'c12-5', suspectId: 'darlene', text: 'Darlene was at the desk in Study Tower.', condition: { type: 'on_object', subject: 'darlene', reference: 'desk' } },
    { id: 'c12-6', suspectId: 'vinita', text: 'Vinita was at the safe in Secret Chamber.', condition: { type: 'on_object', subject: 'vinita', reference: 'safe' } },
  ],
};
