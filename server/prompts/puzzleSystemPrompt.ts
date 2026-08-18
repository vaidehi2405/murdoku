import type { GenerationRequest } from '../providers/types.js';

/**
 * High-performance system prompt enforcing strict 7-step quality rules with explicit cell suppression.
 */
export function buildSystemPrompt(request: GenerationRequest): string {
  return `You are an expert logic puzzle designer for Murdoku.
Output ONLY a single valid JSON object defining a deduction-based murder mystery puzzle.

### GAME RULES & GENERATION PATTERN:
1. BOARD & SOLUTION: ${request.gridSize}x${request.gridSize} grid, ${request.roomCount} rooms. Place ${request.suspectCount} suspects ("ada", "brigitte", "cameron", "darlene", "edison", "vinita") as solution (exactly 1 per row & col).
2. MAXIMUM 1 DIRECT LOCATION CLUE ("in_room", "on_object", "beside_object"). At least 50% of suspects MUST HAVE NO DIRECT LOCATION CLUES.
3. MAJORITY RELATIONAL CLUES: Use "north_of", "south_of", "east_of", "west_of", "beside_suspect", "not_beside_suspect", "same_room", "not_same_room", "alone", "corner", "west_of_all".
4. DEDUCTION GRAPH: Clues MUST form an interconnected chain producing EXACTLY 1 solution requiring combining multiple clues.
5. DO NOT include a "cells" key. "cells" will be generated automatically.

### JSON OUTPUT SCHEMA:
{
  "id": "puzzle-ai-1",
  "caseId": "ai-case-1",
  "caseNumber": "CASE AI-001",
  "title": "<title>",
  "description": "<briefing>",
  "difficulty": "${request.difficulty}",
  "estimatedTime": "~8-12 min",
  "gridRows": ${request.gridSize},
  "gridCols": ${request.gridSize},
  "rooms": {
    "room_1": { "id": "room_1", "name": "Sector Alpha", "color": "#F3E8FF", "borderColor": "#D8B4FE", "textColor": "#6B21A8" },
    "room_2": { "id": "room_2", "name": "Sector Beta", "color": "#ECFDF5", "borderColor": "#A7F3D0", "textColor": "#047857" },
    "room_3": { "id": "room_3", "name": "Sector Gamma", "color": "#FFFBEB", "borderColor": "#FDE68A", "textColor": "#B45309" },
    "room_4": { "id": "room_4", "name": "Sector Delta", "color": "#EFF6FF", "borderColor": "#BFDBFE", "textColor": "#1D4ED8" }
  },
  "suspects": [
    { "id": "ada", "name": "Ada", "initial": "A", "color": "#10B981", "badgeBg": "#10B981", "textColor": "#FFFFFF", "avatarBg": "#D1FAE5" },
    { "id": "brigitte", "name": "Brigitte", "initial": "B", "color": "#3B82F6", "badgeBg": "#3B82F6", "textColor": "#FFFFFF", "avatarBg": "#DBEAFE" },
    { "id": "cameron", "name": "Cameron", "initial": "C", "color": "#F59E0B", "badgeBg": "#F59E0B", "textColor": "#FFFFFF", "avatarBg": "#FEF3C7" },
    { "id": "darlene", "name": "Darlene", "initial": "D", "color": "#EF4444", "badgeBg": "#EF4444", "textColor": "#FFFFFF", "avatarBg": "#FEE2E2" },
    { "id": "edison", "name": "Edison", "initial": "E", "color": "#8B5CF6", "badgeBg": "#8B5CF6", "textColor": "#FFFFFF", "avatarBg": "#EDE9FE" },
    { "id": "vinita", "name": "Vinita", "initial": "V", "color": "#06B6D4", "badgeBg": "#06B6D4", "textColor": "#FFFFFF", "avatarBg": "#CFFAFE" }
  ],
  "solution": {
    "ada": { "row": 0, "col": 1 },
    "brigitte": { "row": 1, "col": 4 },
    "cameron": { "row": 2, "col": 2 },
    "edison": { "row": 3, "col": 0 },
    "darlene": { "row": 4, "col": 3 },
    "vinita": { "row": 5, "col": 5 }
  },
  "clues": [
    { "id": "clue-1", "suspectId": "ada", "text": "Ada was beside Brigitte.", "condition": { "type": "beside_suspect", "subject": "ada", "reference": "brigitte" } },
    { "id": "clue-2", "suspectId": "brigitte", "text": "Brigitte was north of Cameron.", "condition": { "type": "north_of", "subject": "brigitte", "reference": "cameron" } },
    { "id": "clue-3", "suspectId": "cameron", "text": "Cameron was in the same room as Darlene.", "condition": { "type": "same_room", "subject": "cameron", "reference": "darlene" } },
    { "id": "clue-4", "suspectId": "darlene", "text": "Darlene was west of Edison.", "condition": { "type": "west_of", "subject": "darlene", "reference": "edison" } },
    { "id": "clue-5", "suspectId": "edison", "text": "Edison was beside the chair.", "condition": { "type": "beside_object", "subject": "edison", "reference": "chair" } },
    { "id": "clue-6", "suspectId": "vinita", "text": "Vinita was south of Darlene.", "condition": { "type": "south_of", "subject": "vinita", "reference": "darlene" } },
    { "id": "clue-7", "suspectId": "brigitte", "text": "Brigitte was west of all suspects.", "condition": { "type": "west_of_all", "subject": "brigitte" } },
    { "id": "clue-8", "suspectId": "vinita", "text": "Vinita was in a corner.", "condition": { "type": "corner", "subject": "vinita" } },
    { "id": "clue-9", "suspectId": "ada", "text": "Ada was in Sector Alpha.", "condition": { "type": "in_room", "subject": "ada", "reference": "room_1" } }
  ]
}

DO NOT include a "cells" key. Provide exactly 9 clue objects in "clues". Output ONLY pure JSON.`;
}

/**
 * Builds the user prompt that specifies the generation constraints.
 */
export function buildUserPrompt(request: GenerationRequest): string {
  return `Generate a ${request.difficulty.replace('_', ' ')} murder mystery logic puzzle:
Grid: ${request.gridSize}x${request.gridSize}, Rooms: ${request.roomCount}, Suspects: ${request.suspectCount}, Clues: EXACTLY 9 clues (clue-1 through clue-9, MAX 1 direct location clue, majority relational/spatial clues). Theme: "${request.theme}". DO NOT include "cells" key. Output ONLY valid JSON object.`;
}
