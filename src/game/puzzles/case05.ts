import type { PuzzleDefinition, Cell, Room, Suspect } from '../../types/puzzleTypes';

export const CASE_05_ROOMS: Record<string, Room> = {
  clean_room: {
    id: 'clean_room',
    name: 'Clean Synthesis Room',
    color: '#CCFBF1',
    borderColor: '#99F6E4',
    textColor: '#115E59',
  },
  chem_storage: {
    id: 'chem_storage',
    name: 'Chemical Storage',
    color: '#FFEDD5',
    borderColor: '#FED7AA',
    textColor: '#9A3412',
  },
  microscopy_lab: {
    id: 'microscopy_lab',
    name: 'Microscopy Lab',
    color: '#E0F2FE',
    borderColor: '#BAE6FD',
    textColor: '#075985',
  },
  analysis_station: {
    id: 'analysis_station',
    name: 'Genetic Analysis Station',
    color: '#F3E8FF',
    borderColor: '#E9D5FF',
    textColor: '#6B21A8',
  },
};

export const CASE_05_SUSPECTS: Suspect[] = [
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
      let roomId = 'clean_room';
      let roomName = 'Clean Synthesis Room';

      if (r < 3 && c >= 3) {
        roomId = 'chem_storage';
        roomName = 'Chemical Storage';
      } else if (r >= 3 && c < 3) {
        roomId = 'microscopy_lab';
        roomName = 'Microscopy Lab';
      } else if (r >= 3 && c >= 3) {
        roomId = 'analysis_station';
        roomName = 'Genetic Analysis Station';
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

  grid[0][4] = { ...grid[0][4], occupiable: true, object: 'carpet', objectName: 'Decon Mat' };
  grid[1][0] = { ...grid[1][0], occupiable: true, object: 'couch', objectName: 'Synthesis Sofa' };
  grid[2][2] = { ...grid[2][2], occupiable: true, object: 'table', objectName: 'Microscope Bench' };
  grid[3][5] = { ...grid[3][5], occupiable: true, object: 'chair', objectName: 'Analysis Chair' };
  grid[4][1] = { ...grid[4][1], occupiable: true, object: 'desk', objectName: 'Slide Desk' };
  grid[5][3] = { ...grid[5][3], occupiable: true, object: 'safe', objectName: 'Toxin Vault' };

  return grid;
}

export const CASE_05_PUZZLE: PuzzleDefinition = {
  id: 'puzzle-case-05',
  caseId: 'case-05',
  caseNumber: 'CASE 05',
  title: 'Death in the Lab',
  description: 'A lethal contamination incident occurred in the subterranean facility. Trace the researchers.',
  difficulty: 'medium',
  estimatedTime: '~8–12 min',
  gridRows: 6,
  gridCols: 6,
  rooms: CASE_05_ROOMS,
  cells: generateGrid(),
  suspects: CASE_05_SUSPECTS,
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
      title: 'Decon Mat & Synthesis Sofa',
      text: 'Ada is on Decon Mat at (0,4). Brigitte is on Synthesis Sofa at (1,0).',
      targetClueId: 'c5-1',
      targetCellCoords: ['0,4', '1,0'],
    },
    {
      level: 2,
      title: 'Microscope Bench & Analysis Chair',
      text: 'Cameron is at Microscope Bench (2,2). Edison is at Analysis Chair (3,5).',
      targetClueId: 'c5-3',
      targetCellCoords: ['2,2', '3,5'],
    },
    {
      level: 3,
      title: 'Slide Desk & Toxin Vault',
      text: 'Darlene is at Slide Desk (4,1). Vinita is at Toxin Vault (5,3).',
      targetClueId: 'c5-5',
      targetCellCoords: ['4,1', '5,3'],
    },
  ],
  solutionExplanation: {
    culpritId: 'darlene',
    culpritName: 'Darlene',
    summary: 'The laboratory breach timeline was solved by isolating each sector and researcher station:',
    steps: [
      'Ada is standing on Decon Mat in Chemical Storage at cell (0,4).',
      'Brigitte is on Synthesis Sofa in Clean Synthesis Room at cell (1,0).',
      'Cameron is at Microscope Bench in Clean Synthesis Room at cell (2,2).',
      'Edison is sitting in Analysis Chair in Genetic Analysis Station at cell (3,5).',
      'Darlene is at Slide Desk in Microscopy Lab at cell (4,1).',
      'Vinita is at Toxin Vault in Genetic Analysis Station at cell (5,3).',
    ],
  },
  clues: [
    { id: 'c5-1', suspectId: 'ada', text: 'Ada was standing on the carpet in Chemical Storage.', condition: { type: 'on_object', subject: 'ada', reference: 'carpet' } },
    { id: 'c5-2', suspectId: 'brigitte', text: 'Brigitte was on the couch in Clean Synthesis Room.', condition: { type: 'on_object', subject: 'brigitte', reference: 'couch' } },
    { id: 'c5-3', suspectId: 'cameron', text: 'Cameron was at the table in Clean Synthesis Room.', condition: { type: 'on_object', subject: 'cameron', reference: 'table' } },
    { id: 'c5-4', suspectId: 'edison', text: 'Edison was sitting in the chair in Genetic Analysis Station.', condition: { type: 'on_object', subject: 'edison', reference: 'chair' } },
    { id: 'c5-5', suspectId: 'darlene', text: 'Darlene was at the desk in Microscopy Lab.', condition: { type: 'on_object', subject: 'darlene', reference: 'desk' } },
    { id: 'c5-6', suspectId: 'vinita', text: 'Vinita was at the safe in Genetic Analysis Station.', condition: { type: 'on_object', subject: 'vinita', reference: 'safe' } },
  ],
};
