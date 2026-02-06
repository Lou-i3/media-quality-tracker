/**
 * TMDB image URL helpers
 * Builds full URLs from TMDB image paths with size variants
 */

import { TMDB_CONFIG } from './config';

/** Available poster sizes */
export type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';

/** Available backdrop sizes */
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';

/** Available still (episode screenshot) sizes */
export type StillSize = 'w92' | 'w185' | 'w300' | 'original';

/**
 * Build a full poster image URL
 * @param path - TMDB poster path (e.g., "/abc123.jpg")
 * @param size - Image size variant (default: w342)
 * @returns Full URL or null if path is null/undefined
 */
export function getPosterUrl(path: string | null | undefined, size: PosterSize = 'w342'): string | null {
  if (!path) return null;
  return `${TMDB_CONFIG.imageBaseUrl}/${size}${path}`;
}

/**
 * Build a full backdrop image URL
 * @param path - TMDB backdrop path (e.g., "/xyz789.jpg")
 * @param size - Image size variant (default: w1280)
 * @returns Full URL or null if path is null/undefined
 */
export function getBackdropUrl(path: string | null | undefined, size: BackdropSize = 'w1280'): string | null {
  if (!path) return null;
  return `${TMDB_CONFIG.imageBaseUrl}/${size}${path}`;
}

/**
 * Build a full still (episode screenshot) URL
 * @param path - TMDB still path
 * @param size - Image size variant (default: w300)
 * @returns Full URL or null if path is null/undefined
 */
export function getStillUrl(path: string | null | undefined, size: StillSize = 'w300'): string | null {
  if (!path) return null;
  return `${TMDB_CONFIG.imageBaseUrl}/${size}${path}`;
}
