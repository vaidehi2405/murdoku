export type Difficulty = 'very_easy' | 'easy' | 'medium' | 'hard' | 'expert';

export type CaseStatus = 'new' | 'in_progress' | 'completed' | 'locked';

export type TabFilter = 'all' | 'in_progress' | 'completed';

export type SortOption = 'difficulty' | 'newest' | 'shortest' | 'longest';

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  difficulty: Difficulty;
  status: CaseStatus;
  estimatedTime?: string;
  elapsedTime?: string;
  bestTime?: string;
  attempts?: number;
  orderIndex: number;
  roomType: string;
}

export interface DifficultyConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
  btnBg: string;
  btnHover: string;
  btnText: string;
}
