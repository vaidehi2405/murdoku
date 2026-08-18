import type { PuzzleDefinition, Cell, Room, Suspect } from '../../types/puzzleTypes';

export const CASE_02_ROOMS: Record<string, Room> = {
  grand_archive: {
    id: 'grand_archive',
    name: 'Grand Archive',
    color: '#F3E8FF',
    borderColor: '#D8B4FE',
    textColor: '#6B21A8',
  },
  curator_study: {
    id: 'curator_study',
    name: "Curator's Study",
    color: '#ECFDF5',
    borderColor: '#A7F3D0',
    textColor: '#047857',
  },
  reading_room: {
    id: 'reading_room',
    name: 'Quiet Reading Room',
    color: '#FFFBEB',
    borderColor: '#FDE68A',
    textColor: '#B45309',
  },
  manuscripts_vault: {
    id: 'manuscripts_vault',
    name: 'Rare Manuscripts Vault',
    color: '#EFF6FF',
    borderColor: '#BFDBFE',
    textColor: '#1D4ED8',
  },
};

export const CASE_02_SUSPECTS: Suspect[] = [
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
      let roomId = 'grand_archive';
      let roomName = 'Grand Archive';

      if (r < 3 && c >= 3) {
        roomId = 'curator_study';
        roomName = "Curator's Study";
      } else if (r >= 3 && c < 3) {
        roomId = 'reading_room';
        roomName = 'Quiet Reading Room';
      } else if (r >= 3 && c >= 3) {
        roomId = 'manuscripts_vault';
        roomName = 'Rare Manuscripts Vault';
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

  grid[0][3] = { ...grid[0][3], occupiable: true, object: 'bookshelf', objectName: 'Curator Shelf' };
  grid[1][1] = { ...grid[1][1], occupiable: true, object: 'carpet', objectName: 'Ornate Carpet' };
  grid[2][2] = { ...grid[2][2], occupiable: true, object: 'desk', objectName: 'Archive Desk' };
  grid[3][4] = { ...grid[3][4], occupiable: true, object: 'couch', objectName: 'Vault Couch' };
  grid[4][5] = { ...grid[4][5], occupiable: true, object: 'safe', objectName: 'Vault Safe' };
  grid[5][0] = { ...grid[5][0], occupiable: true, object: 'chair', objectName: 'Oak Chair' };

  return grid;
}

export const CASE_02_PUZZLE: PuzzleDefinition = {
  id: 'puzzle-case-02',
  caseId: 'case-02',
  caseNumber: 'CASE 02',
  title: 'The Library Secret',
  description: 'Uncover who accessed the private archives and displaced the secret manuscripts.',
  difficulty: 'very_easy',
  estimatedTime: '~5–8 min',
  gridRows: 6,
  gridCols: 6,
  rooms: CASE_02_ROOMS,
  cells: generateGrid(),
  suspects: CASE_02_SUSPECTS,
  solution: {
    cameron: { row: 0, col: 3 },
    ada: { row: 1, col: 1 },
    edison: { row: 2, col: 2 },
    brigitte: { row: 3, col: 4 },
    vinita: { row: 4, col: 5 },
    darlene: { row: 5, col: 0 },
  },
  hints: [
    {
      level: 1,
      title: 'Grand Archive Positions',
      text: 'Ada is standing on Ornate Carpet at (1,1). Edison is at Archive Desk at (2,2).',
      targetClueId: 'clue-3',
      targetCellCoords: ['1,1', '2,2'],
    },
    {
      level: 2,
      title: 'Curator Study & Vault',
      text: 'Cameron is at Curator Shelf (0,3). Brigitte is at Vault Couch (3,4).',
      targetClueId: 'clue-1',
      targetCellCoords: ['0,3', '3,4'],
    },
    {
      level: 3,
      title: 'Vault Safe & Reading Room',
      text: 'Vinita is at Vault Safe (4,5). Darlene is at Oak Chair (5,0).',
      targetClueId: 'clue-7',
      targetCellCoords: ['4,5', '5,0'],
    },
  ],
  solutionExplanation: {
    culpritId: 'vinita',
    culpritName: 'Vinita',
    summary: 'The Library Secret was solved by connecting room constraints and furniture stations:',
    steps: [
      'Cameron was in Curator\'s Study at Curator Shelf at cell (0,3).',
      'Ada is standing on Ornate Carpet in Grand Archive at cell (1,1).',
      'Edison is at Archive Desk in Grand Archive at cell (2,2).',
      'Brigitte is on Vault Couch in Rare Manuscripts Vault at cell (3,4).',
      'Vinita is at Vault Safe in Rare Manuscripts Vault at cell (4,5).',
      'Darlene is sitting in Oak Chair in Quiet Reading Room at cell (5,0).',
    ],
  },
  clues: [
    { id: 'clue-1', suspectId: 'cameron', text: 'Cameron was at the bookshelf in Curator\'s Study.', condition: { type: 'on_object', subject: 'cameron', reference: 'bookshelf' } },
    { id: 'clue-2', suspectId: 'ada', text: 'Ada was standing on the carpet in Grand Archive.', condition: { type: 'on_object', subject: 'ada', reference: 'carpet' } },
    { id: 'clue-3', suspectId: 'edison', text: 'Edison was at the desk in Grand Archive.', condition: { type: 'on_object', subject: 'edison', reference: 'desk' } },
    { id: 'clue-4', suspectId: 'brigitte', text: 'Brigitte was on the couch in Rare Manuscripts Vault.', condition: { type: 'on_object', subject: 'brigitte', reference: 'couch' } },
    { id: 'clue-5', suspectId: 'vinita', text: 'Vinita was at the safe in Rare Manuscripts Vault.', condition: { type: 'on_object', subject: 'vinita', reference: 'safe' } },
    { id: 'clue-6', suspectId: 'darlene', text: 'Darlene was sitting in the chair in Quiet Reading Room.', condition: { type: 'on_object', subject: 'darlene', reference: 'chair' } },
  ],
};
