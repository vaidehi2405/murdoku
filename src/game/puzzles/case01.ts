import type { PuzzleDefinition, Cell, Room, Suspect } from '../../types/puzzleTypes';

export const CASE_01_ROOMS: Record<string, Room> = {
  lab_a: {
    id: 'lab_a',
    name: 'Lab Alpha',
    color: '#ECFDF5',
    borderColor: '#A7F3D0',
    textColor: '#047857',
  },
  lab_b: {
    id: 'lab_b',
    name: 'Lab Beta',
    color: '#EFF6FF',
    borderColor: '#BFDBFE',
    textColor: '#1D4ED8',
  },
  testing_room: {
    id: 'testing_room',
    name: 'Testing Bay',
    color: '#FFFBEB',
    borderColor: '#FDE68A',
    textColor: '#B45309',
  },
  server_room: {
    id: 'server_room',
    name: 'Server Core',
    color: '#F5F3FF',
    borderColor: '#DDD6FE',
    textColor: '#6D28D9',
  },
};

export const CASE_01_SUSPECTS: Suspect[] = [
  { id: 'ada', name: 'Ada', initial: 'A', color: '#10B981', badgeBg: '#10B981', textColor: '#FFFFFF', avatarBg: '#D1FAE5' },
  { id: 'brigitte', name: 'Brigitte', initial: 'B', color: '#3B82F6', badgeBg: '#3B82F6', textColor: '#FFFFFF', avatarBg: '#DBEAFE' },
  { id: 'cameron', name: 'Cameron', initial: 'C', color: '#F59E0B', badgeBg: '#F59E0B', textColor: '#FFFFFF', avatarBg: '#FEF3C7' },
  { id: 'darlene', name: 'Darlene', initial: 'D', color: '#EF4444', badgeBg: '#EF4444', textColor: '#FFFFFF', avatarBg: '#FEE2E2' },
];

function generateGrid(): Cell[][] {
  const grid: Cell[][] = [];
  for (let r = 0; r < 6; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < 6; c++) {
      let roomId = 'lab_a';
      let roomName = 'Lab Alpha';

      if (r < 3 && c >= 3) {
        roomId = 'lab_b';
        roomName = 'Lab Beta';
      } else if (r >= 3 && c < 3) {
        roomId = 'testing_room';
        roomName = 'Testing Bay';
      } else if (r >= 3 && c >= 3) {
        roomId = 'server_room';
        roomName = 'Server Core';
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

  // Furniture / Obstacles
  grid[0][0] = { ...grid[0][0], occupiable: false, object: 'microscope', objectName: 'Microscope Station' };
  grid[0][5] = { ...grid[0][5], occupiable: false, object: 'cabinet', objectName: 'Storage Cabinet' };
  grid[5][0] = { ...grid[5][0], occupiable: false, object: 'table', objectName: 'Test Workbench' };
  grid[5][5] = { ...grid[5][5], occupiable: false, object: 'safe', objectName: 'Data Safe' };
  grid[1][1] = { ...grid[1][1], occupiable: true, object: 'carpet', objectName: 'Cleanroom Mat' };
  grid[0][4] = { ...grid[0][4], occupiable: true, object: 'chair', objectName: 'Lab Stool' };
  grid[4][0] = { ...grid[4][0], occupiable: true, object: 'desk', objectName: 'Bay Terminal' };
  grid[3][3] = { ...grid[3][3], occupiable: true, object: 'safe', objectName: 'Server Vault' };

  return grid;
}

export const CASE_01_PUZZLE: PuzzleDefinition = {
  id: 'puzzle-case-01',
  caseId: 'case-01',
  caseNumber: 'CASE 01',
  title: 'The Missing Prototype',
  description: 'A revolutionary prototype vanished from the research labs. Trace the movements of the team to find who took it.',
  difficulty: 'very_easy',
  estimatedTime: '~5 min',
  gridRows: 6,
  gridCols: 6,
  rooms: CASE_01_ROOMS,
  cells: generateGrid(),
  suspects: CASE_01_SUSPECTS,
  solution: {
    ada: { row: 1, col: 1 },
    brigitte: { row: 0, col: 4 },
    cameron: { row: 4, col: 0 },
    darlene: { row: 3, col: 3 },
  },
  hints: [
    {
      level: 1,
      title: 'Lab Alpha Mat',
      text: 'Ada is standing on the Cleanroom Mat in Lab Alpha at cell (1,1).',
      targetClueId: 'c1-1',
      targetCellCoords: ['1,1'],
    },
    {
      level: 2,
      title: 'Lab Beta Stool',
      text: 'Brigitte is sitting on the Lab Stool in Lab Beta at cell (0,4).',
      targetClueId: 'c1-2',
      targetCellCoords: ['0,4'],
    },
    {
      level: 3,
      title: 'Terminal & Server Vault',
      text: 'Cameron is at the Bay Terminal in Testing Bay at (4,0). Darlene is at Server Vault in Server Core at (3,3).',
      targetClueId: 'c1-3',
      targetCellCoords: ['4,0', '3,3'],
    },
  ],
  solutionExplanation: {
    culpritId: 'darlene',
    culpritName: 'Darlene',
    summary: 'The Missing Prototype was located in the Server Core after identifying each suspect\'s specific furniture station:',
    steps: [
      'Ada is standing on the Cleanroom Mat in Lab Alpha at cell (1,1).',
      'Brigitte is sitting on the Lab Stool in Lab Beta at cell (0,4).',
      'Cameron is stationed at the Bay Terminal in Testing Bay at cell (4,0), west of all suspects.',
      'Darlene is at the Server Vault in Server Core at cell (3,3).',
    ],
  },
  clues: [
    { id: 'c1-1', suspectId: 'ada', text: 'Ada was standing on the mat in Lab Alpha.', condition: { type: 'on_object', subject: 'ada', reference: 'carpet' } },
    { id: 'c1-2', suspectId: 'brigitte', text: 'Brigitte was on the chair in Lab Beta.', condition: { type: 'on_object', subject: 'brigitte', reference: 'chair' } },
    { id: 'c1-3', suspectId: 'cameron', text: 'Cameron was at the desk in Testing Bay.', condition: { type: 'on_object', subject: 'cameron', reference: 'desk' } },
    { id: 'c1-4', suspectId: 'cameron', text: 'Cameron was west of all other suspects.', condition: { type: 'west_of_all', subject: 'cameron' } },
    { id: 'c1-5', suspectId: 'darlene', text: 'Darlene was at the safe in Server Core.', condition: { type: 'on_object', subject: 'darlene', reference: 'safe' } },
  ],
};
