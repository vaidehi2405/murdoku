/**
 * Curated pool of puzzle location themes for AI generation.
 * Provides variety in setting names, objects, and narrative flavor.
 */

const THEMES = [
  'luxury hotel',
  'art museum',
  'casino floor',
  'country estate',
  'wine cellar',
  'opera house',
  'private yacht',
  'ski lodge',
  'botanical garden',
  'cathedral',
  'lighthouse',
  'train station',
  'underground bunker',
  'rooftop bar',
  'antique shop',
  'jazz club',
  'theater backstage',
  'aquarium',
  'observatory',
  'haunted mansion',
  'embassy',
  'clocktower',
  'speakeasy',
  'harbor warehouse',
  'royal palace',
  'safari lodge',
  'submarine',
  'space station',
  'victorian manor',
  'arctic research base',
];

/**
 * Select a theme that hasn't been recently used.
 */
export function selectTheme(usedThemes: string[]): string {
  const available = THEMES.filter((t) => !usedThemes.includes(t));

  if (available.length === 0) {
    // All used — pick random from full list
    return THEMES[Math.floor(Math.random() * THEMES.length)];
  }

  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Get all available themes.
 */
export function getAllThemes(): string[] {
  return [...THEMES];
}
