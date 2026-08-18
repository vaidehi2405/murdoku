import type { PuzzleDefinition, Cell, Room, Suspect } from '../../types/puzzleTypes';

export const CASE_08_ROOMS: Record<string, Room> = {
  diamond_gallery: {
    id: 'diamond_gallery',
    name: 'Diamond Gallery',
    color: '#EFF6FF',
    borderColor: '#BFDBFE',
    textColor: '#1D4ED8',
  },
  gem_suite: {
    id: 'gem_suite',
    name: 'Gem Suite',
    color: '#ECFDF5',
    borderColor: '#A7F3D0',
    textColor: '#047857',
  },
  vip_lounge: {
    id: 'vip_lounge',
    name: 'VIP Lounge',
    color: '#FFFBEB',
    borderColor: '#FDE68A',
    textColor: '#B45309',
  },
  vault_room: {
    id: 'vault_room',
    name: 'Vault Room',
    color: '#F5F3FF',
    borderColor: '#DDD6FE',
    textColor: '#6D28D9',
  },
};

export const CASE_08_SUSPECTS: Suspect[] = [
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
      let roomId = 'diamond_gallery';
      let roomName = 'Diamond Gallery';

      if (r < 3 && c >= 3) {
        roomId = 'gem_suite';
        roomName = 'Gem Suite';
      } else if (r >= 3 && c < 3) {
        roomId = 'vip_lounge';
        roomName = 'VIP Lounge';
      } else if (r >= 3 && c >= 3) {
        roomId = 'vault_room';
        roomName = 'Vault Room';
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

  grid[0][2] = { ...grid[0][2], occupiable: true, object: 'carpet', objectName: 'Gallery Runner' };
  grid[1][0] = { ...grid[1][0], occupiable: true, object: 'couch', objectName: 'Viewing Couch' };
  grid[2][4] = { ...grid[2][4], occupiable: true, object: 'table', objectName: 'Display Table' };
  grid[3][1] = { ...grid[3][1], occupiable: true, object: 'chair', objectName: 'Lounge Stool' };
  grid[4][3] = { ...grid[4][3], occupiable: true, object: 'desk', objectName: 'Appraiser Bench' };

  return grid;
}

export const CASE_08_PUZZLE: PuzzleDefinition = {
  id: 'puzzle-case-08',
  caseId: 'case-08',
  caseNumber: 'CASE 08',
  title: 'The Missing Necklace',
  description: 'A priceless sapphire necklace vanished during a high-society exhibition. Determine where everyone was located.',
  difficulty: 'medium',
  estimatedTime: '~8–12 min',
  gridRows: 6,
  gridCols: 6,
  rooms: CASE_08_ROOMS,
  cells: generateGrid(),
  suspects: CASE_08_SUSPECTS,
  solution: {
    ada: { row: 0, col: 2 },
    brigitte: { row: 1, col: 0 },
    cameron: { row: 2, col: 4 },
    edison: { row: 3, col: 1 },
    darlene: { row: 4, col: 3 },
  },
  hints: [
    {
      level: 1,
      title: 'Gallery Runner & Couch',
      text: 'Ada is on Gallery Runner at (0,2). Brigitte is on Viewing Couch at (1,0).',
      targetClueId: 'c8-1',
      targetCellCoords: ['0,2', '1,0'],
    },
    {
      level: 2,
      title: 'Display Table & Lounge Stool',
      text: 'Cameron is at Display Table (2,4). Edison is at Lounge Stool (3,1).',
      targetClueId: 'c8-3',
      targetCellCoords: ['2,4', '3,1'],
    },
    {
      level: 3,
      title: 'Appraiser Bench',
      text: 'Darlene is at Appraiser Bench (4,3) in the Vault Room.',
      targetClueId: 'c8-5',
      targetCellCoords: ['4,3'],
    },
  ],
  solutionExplanation: {
    culpritId: 'brigitte',
    culpritName: 'Brigitte',
    summary: 'The Missing Necklace investigation concluded by matching unique furniture stations:',
    steps: [
      'Ada is standing on Gallery Runner in Diamond Gallery at (0,2).',
      'Brigitte is on Viewing Couch in Diamond Gallery at (1,0).',
      'Cameron is at Display Table in Gem Suite at (2,4).',
      'Edison is sitting in Lounge Stool in VIP Lounge at (3,1).',
      'Darlene is at Appraiser Bench in Vault Room at (4,3).',
    ],
  },
  clues: [
    { id: 'c8-1', suspectId: 'ada', text: 'Ada was standing on the carpet in Diamond Gallery.', condition: { type: 'on_object', subject: 'ada', reference: 'carpet' } },
    { id: 'c8-2', suspectId: 'brigitte', text: 'Brigitte was on the couch in Diamond Gallery.', condition: { type: 'on_object', subject: 'brigitte', reference: 'couch' } },
    { id: 'c8-3', suspectId: 'cameron', text: 'Cameron was at the table in Gem Suite.', condition: { type: 'on_object', subject: 'cameron', reference: 'table' } },
    { id: 'c8-4', suspectId: 'edison', text: 'Edison was sitting in the chair in VIP Lounge.', condition: { type: 'on_object', subject: 'edison', reference: 'chair' } },
    { id: 'c8-5', suspectId: 'darlene', text: 'Darlene was at the desk in Vault Room.', condition: { type: 'on_object', subject: 'darlene', reference: 'desk' } },
  ],
};
