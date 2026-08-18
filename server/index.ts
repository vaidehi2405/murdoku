import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { GroqPuzzleGenerationProvider } from './providers/groqProvider.js';
import type { GenerationRequest } from './providers/types.js';

dotenv.config();
dotenv.config({ path: path.resolve(import.meta.dirname, '.env') });

const PORT = parseInt(process.env.PORT || '4000', 10);
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'groq/compound-mini';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Validate that we have an API key
const hasApiKey = GROQ_API_KEY.trim().length > 0 && GROQ_API_KEY !== 'gsk_your_key_here';
console.log(`[Murdoku Server] Loaded key: "${GROQ_API_KEY ? GROQ_API_KEY.slice(0, 8) + '...' : 'EMPTY'}", hasApiKey: ${hasApiKey}`);

let provider: GroqPuzzleGenerationProvider | null = null;
if (hasApiKey) {
  provider = new GroqPuzzleGenerationProvider(GROQ_API_KEY, GROQ_MODEL);
  console.log(`[Murdoku Server] Groq provider initialized with model: ${GROQ_MODEL}`);
} else {
  console.warn('[Murdoku Server] ⚠ No valid GROQ_API_KEY found. Puzzle generation will be unavailable.');
  console.warn('[Murdoku Server]   Copy server/.env.example to server/.env and add your key.');
}

/**
 * POST /api/generate-puzzle
 * 
 * Accepts a GenerationRequest body and returns a raw puzzle JSON from Groq.
 * The client is responsible for validation via the existing solver.
 */
app.post('/api/generate-puzzle', async (req, res) => {
  if (!provider) {
    res.status(503).json({
      success: false,
      error: 'Puzzle generation unavailable: GROQ_API_KEY not configured on server',
    });
    return;
  }

  try {
    const body = req.body as Partial<GenerationRequest>;

    // Validate request
    const request: GenerationRequest = {
      difficulty: body.difficulty || 'medium',
      gridSize: Math.min(9, Math.max(5, body.gridSize || 6)),
      suspectCount: Math.min(9, Math.max(4, body.suspectCount || 6)),
      roomCount: Math.min(6, Math.max(2, body.roomCount || 4)),
      clueCount: Math.min(20, Math.max(6, body.clueCount || 10)),
      theme: body.theme || 'luxury hotel',
    };

    console.log(`[Murdoku Server] Generating puzzle: ${request.difficulty}, ${request.gridSize}x${request.gridSize}, theme="${request.theme}"`);

    const result = await provider.generatePuzzle(request);

    console.log(
      `[Murdoku Server] Generation ${result.success ? 'succeeded' : 'failed'} in ${result.durationMs}ms` +
      (result.error ? ` — ${result.error}` : '')
    );

    res.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown server error';
    console.error(`[Murdoku Server] Unexpected error: ${msg}`);
    res.status(500).json({ success: false, error: msg });
  }
});

/**
 * GET /api/health
 * Quick health check endpoint.
 */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    groqConfigured: hasApiKey,
    model: GROQ_MODEL,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[Murdoku Server] Running on http://localhost:${PORT}`);
  console.log(`[Murdoku Server] Health check: http://localhost:${PORT}/api/health`);
});

// Keep process active in background execution
setInterval(() => {}, 3600000);
