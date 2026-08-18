import type { PuzzleDefinition, Cell, Room, Suspect } from '../../types/puzzleTypes';

export const CASE_07_ROOMS: Record<string, Room> = {
  main_vault: {
    id: 'main_vault',
    name: 'Main Vault',
    color: '#FFFBEB',
    borderColor: '#FDE68A',
    textColor: '#B45309',
  },
  security_room: {
    id: 'security_room',
    name: 'Security Room',
    color: '#ECFDF5',
    borderColor: '#A7F3D0',
    textColor: '#047857',
  },
  deposit_room: {
    id: 'deposit_room',
    name: 'Safe Deposit Room',
    color: '#EFF6FF',
    borderColor: '#BFDBFE',
    textColor: '#1D4ED8',
  },
  counting_room: {
    id: 'counting_room',
    name: 'Counting Room',
    color: '#F5F3FF',
    borderColor: '#DDD6FE',
    textColor: '#6D28D9',
  },
};

export const CASE_07_SUSPECTS: Suspect[] = [
  { id: 'ada', name: 'Ada', initial: 'A', color: '#10B981', badgeBg: '#10B981', textColor: '#FFFFFF', avatarBg: '#D1FAE5' },
  { id: 'brigitte', name: 'Brigitte', initial: 'B', color: '#3B82F6', badgeBg: '#3B82F6', textColor: '#FFFFFF', avatarBg: '#DBEAFE' },
  { id: 'cameron', name: 'Cameron', initial: 'C', color: '#F59E0B', badgeBg: '#F59E0B', textColor: '#FFFFFF', avatarBg: '#FEF3C7' },
  { id: 'darlene', name: 'Darlene', initial: 'D', color: '#EF4444', badgeBg: '#EF4444', textColor: '#FFFFFF', avatarBg: '#FEE2E2' },
  { id: 'edison', name: 'Edison', initial: 'E', color: '#8B5CF6', badgeBg: '#8B5CF6', textColor: '#FFFFFF', avatarBg: '#EDE9FE' },
];

function generateGrid(): Cell[][] {
  const grid: Cell[][] = [];
  for (let r = 0; r < 6; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < 6; c++) {
      let roomId = 'main_vault';
      let roomName = 'Main Vault';

      if (r < 3 && c >= 3) {
        roomId = 'security_room';
        roomName = 'Security Room';
      } else if (r >= 3 && c < 3) {
        roomId = 'deposit_room';
        roomName = 'Safe Deposit Room';
      } else if (r >= 3 && c >= 3) {
        roomId = 'counting_room';
        roomName = 'Counting Room';
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

  grid[0][1] = { ...grid[0][1], occupiable: true, object: 'carpet', objectName: 'Vault Mat' };
  grid[1][4] = { ...grid[1][4], occupiable: true, object: 'couch', objectName: 'Security Sofa' };
  grid[2][0] = { ...grid[2][0], occupiable: true, object: 'table', objectName: 'Inspection Table' };
  grid[3][2] = { ...grid[3][2], occupiable: true, object: 'chair', objectName: 'Teller Stool' };
  grid[4][3] = { ...grid[4][3], occupiable: true, object: 'desk', objectName: 'Audit Terminal' };

  return grid;
}

export const CASE_07_PUZZLE: PuzzleDefinition = {
  id: 'puzzle-case-07',
  caseId: 'case-07',
  caseNumber: 'CASE 07',
  title: 'The Empty Room',
  description: 'An inner vault room was completely cleared out overnight. Find out who was stationed where.',
  difficulty: 'medium',
  estimatedTime: '~8–12 min',
  gridRows: 6,
  gridCols: 6,
  rooms: CASE_07_ROOMS,
  cells: generateGrid(),
  suspects: CASE_07_SUSPECTS,
  solution: {
    ada: { row: 0, col: 1 },
    brigitte: { row: 1, col: 4 },
    cameron: { row: 2, col: 0 },
    edison: { row: 3, col: 2 },
    darlene: { row: 4, col: 3 },
  },
  hints: [
    {
      level: 1,
      title: 'Main Vault & Security',
      text: 'Ada is on Vault Mat at (0,1). Brigitte is on Security Sofa at (1,4).',
      targetClueId: 'c7-1',
      targetCellCoords: ['0,1', '1,4'],
    },
    {
      level: 2,
      title: 'Inspection & Teller Stool',
      text: 'Cameron is at Inspection Table (2,0). Edison is at Teller Stool (3,2).',
      targetClueId: 'c7-3',
      targetCellCoords: ['2,0', '3,2'],
    },
    {
      level: 3,
      title: 'Audit Terminal',
      text: 'Darlene is at Audit Terminal (4,3) in the Counting Room.',
      targetClueId: 'c7-5',
      targetCellCoords: ['4,3'],
    },
  ],
  solutionExplanation: {
    culpritId: 'edison',
    culpritName: 'Edison',
    summary: 'The Empty Room mystery was solved by placing each suspect at their unique furniture object:',
    steps: [
      'Ada is standing on Vault Mat in Main Vault at (0,1).',
      'Brigitte is on Security Sofa in Security Room at (1,4).',
      'Cameron is at Inspection Table in Main Vault at (2,0).',
      'Edison is sitting at Teller Stool in Safe Deposit Room at (3,2).',
      'Darlene is at Audit Terminal in Counting Room at (4,3).',
    ],
  },
  clues: [
    { id: 'c7-1', suspectId: 'ada', text: 'Ada was standing on the mat in Main Vault.', condition: { type: 'on_object', subject: 'ada', reference: 'carpet' } },
    { id: 'c7-2', suspectId: 'brigitte', text: 'Brigitte was on the couch in Security Room.', condition: { type: 'on_object', subject: 'brigitte', reference: 'couch' } },
    { id: 'c7-3', suspectId: 'cameron', text: 'Cameron was at the table in Main Vault.', condition: { type: 'on_object', subject: 'cameron', reference: 'table' } },
    { id: 'c7-4', suspectId: 'edison', text: 'Edison was sitting in the chair in Safe Deposit.', condition: { type: 'on_object', subject: 'edison', reference: 'chair' } },
    { id: 'c7-5', suspectId: 'darlene', text: 'Darlene was at the desk in Counting Room.', condition: { type: 'on_object', subject: 'darlene', reference: 'desk' } },
  ],
};
