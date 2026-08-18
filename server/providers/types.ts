/**
 * Provider abstraction for puzzle generation.
 * Current implementation: GroqPuzzleGenerationProvider
 * The interface allows swapping to any other LLM provider in the future.
 */

export interface GenerationRequest {
  difficulty: 'very_easy' | 'easy' | 'medium' | 'hard' | 'expert';
  gridSize: number;       // 5–9
  suspectCount: number;   // 4–9
  roomCount: number;      // 2–6
  clueCount: number;      // 6–20
  theme: string;          // e.g. "luxury hotel", "art museum"
}

export interface GenerationResponse {
  success: boolean;
  puzzle?: Record<string, unknown>;  // Raw parsed JSON, validated separately
  error?: string;
  rawResponse?: string;
  durationMs?: number;
}

export interface PuzzleGenerationProvider {
  generatePuzzle(request: GenerationRequest): Promise<GenerationResponse>;
}
