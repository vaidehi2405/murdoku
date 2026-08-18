/**
 * Difficulty distribution for AI-generated puzzles.
 * Adjusts based on player progression and current pool balance.
 */

import type { Difficulty } from '../../types/case';

interface DifficultyWeights {
  very_easy: number;
  easy: number;
  medium: number;
  hard: number;
  expert: number;
}

/**
 * Select a difficulty for the next generated puzzle.
 *
 * @param completedCount - Total number of cases the player has completed
 * @param currentDistribution - Count of currently available (playable) puzzles per difficulty
 */
export function selectDifficulty(
  completedCount: number,
  currentDistribution: Record<Difficulty, number>
): Difficulty {
  // Base weights by progression stage
  let weights: DifficultyWeights;

  if (completedCount <= 5) {
    // Early game: mostly easy
    weights = { very_easy: 40, easy: 35, medium: 20, hard: 5, expert: 0 };
  } else if (completedCount <= 15) {
    // Mid game: balanced
    weights = { very_easy: 15, easy: 25, medium: 35, hard: 20, expert: 5 };
  } else {
    // Late game: more challenging
    weights = { very_easy: 10, easy: 20, medium: 30, hard: 30, expert: 10 };
  }

  // Adjust weights to counter over-representation in current pool
  const totalInPool = Object.values(currentDistribution).reduce((a, b) => a + b, 0);
  if (totalInPool > 0) {
    const difficulties: Difficulty[] = ['very_easy', 'easy', 'medium', 'hard', 'expert'];
    for (const d of difficulties) {
      const currentPct = (currentDistribution[d] / totalInPool) * 100;
      const targetPct = weights[d];
      if (currentPct > targetPct * 1.5) {
        // Over-represented: halve the weight
        weights[d] = Math.max(1, weights[d] / 2);
      } else if (currentPct < targetPct * 0.5 && targetPct > 0) {
        // Under-represented: boost the weight
        weights[d] = weights[d] * 1.5;
      }
    }
  }

  // Weighted random selection
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let rand = Math.random() * totalWeight;

  const entries = Object.entries(weights) as [Difficulty, number][];
  for (const [difficulty, weight] of entries) {
    rand -= weight;
    if (rand <= 0) return difficulty;
  }

  return 'medium'; // Fallback
}

/**
 * Get generation constraints (grid size, suspect count, etc.) for a given difficulty.
 */
export function getConstraintsForDifficulty(difficulty: Difficulty): {
  gridSize: number;
  suspectCount: number;
  roomCount: number;
  clueCount: number;
  estimatedTime: string;
} {
  switch (difficulty) {
    case 'very_easy':
      return { gridSize: 6, suspectCount: 6, roomCount: 4, clueCount: 12, estimatedTime: '~5-8 min' };
    case 'easy':
      return { gridSize: 6, suspectCount: 6, roomCount: 4, clueCount: 11, estimatedTime: '~6-10 min' };
    case 'medium':
      return { gridSize: 6, suspectCount: 6, roomCount: 4, clueCount: 10, estimatedTime: '~8-12 min' };
    case 'hard':
      return { gridSize: 6, suspectCount: 6, roomCount: 4, clueCount: 9, estimatedTime: '~10-15 min' };
    case 'expert':
      return { gridSize: 7, suspectCount: 7, roomCount: 5, clueCount: 10, estimatedTime: '~15-20 min' };
    default:
      return { gridSize: 6, suspectCount: 6, roomCount: 4, clueCount: 10, estimatedTime: '~8-12 min' };
  }
}
