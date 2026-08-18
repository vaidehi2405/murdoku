import Groq from 'groq-sdk';
import type { PuzzleGenerationProvider, GenerationRequest, GenerationResponse } from './types.js';
import { buildSystemPrompt, buildUserPrompt } from '../prompts/puzzleSystemPrompt.js';

/**
 * Groq-backed implementation of PuzzleGenerationProvider.
 * Uses the official groq-sdk to call chat completions with JSON mode.
 */
export class GroqPuzzleGenerationProvider implements PuzzleGenerationProvider {
  private client: Groq;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.client = new Groq({ apiKey });
    this.model = model;
  }

  async generatePuzzle(request: GenerationRequest): Promise<GenerationResponse> {
    const startTime = Date.now();
    const systemPrompt = buildSystemPrompt(request);
    const userPrompt = buildUserPrompt(request);

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const chatCompletion = await this.client.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          model: this.model,
          response_format: { type: 'json_object' },
          temperature: 0.3,
          max_tokens: 1500,
        });

        let rawContent = chatCompletion.choices?.[0]?.message?.content;

        if (!rawContent) {
          return {
            success: false,
            error: 'Groq returned empty response content',
            durationMs: Date.now() - startTime,
          };
        }

        // Clean reasoning or markdown backticks if present
        if (rawContent.includes('</think>')) {
          rawContent = rawContent.split('</think>')[1];
        }
        rawContent = rawContent.replace(/```json/gi, '').replace(/```/g, '');

        let parsed: Record<string, unknown>;
        try {
          const jsonMatch = rawContent.match(/\{[\s\S]*/);
          let jsonString = jsonMatch ? jsonMatch[0] : rawContent;
          jsonString = jsonString
            .replace(/\/\/.*/g, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/,\s*"[^"]*"?\s*:?\s*$/, '')
            .replace(/,\s*$/, '')
            .replace(/,(\s*[\}\]])/g, '$1')
            .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
            .replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '"$1"');

          let openBraces = (jsonString.match(/\{/g) || []).length;
          let closeBraces = (jsonString.match(/\}/g) || []).length;
          let openBrackets = (jsonString.match(/\[/g) || []).length;
          let closeBrackets = (jsonString.match(/\]/g) || []).length;

          while (closeBrackets < openBrackets) {
            jsonString += ']';
            closeBrackets++;
          }
          while (closeBraces < openBraces) {
            jsonString += '}';
            closeBraces++;
          }
          parsed = JSON.parse(jsonString);
        } catch (parseErr) {
          return {
            success: false,
            error: `Failed to parse JSON from Groq response: ${parseErr instanceof Error ? parseErr.message : 'unknown'}`,
            rawResponse: rawContent.slice(0, 2000),
            durationMs: Date.now() - startTime,
          };
        }

        return {
          success: true,
          puzzle: parsed,
          rawResponse: rawContent.slice(0, 500),
          durationMs: Date.now() - startTime,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown Groq API error';
        if (errorMessage.includes('429') && attempts < maxAttempts) {
          await new Promise((res) => setTimeout(res, 2500 * attempts));
          continue;
        }

        return {
          success: false,
          error: errorMessage,
          durationMs: Date.now() - startTime,
        };
      }
    }

    return {
      success: false,
      error: 'Max retry attempts reached for Groq generation',
      durationMs: Date.now() - startTime,
    };
  }
}
