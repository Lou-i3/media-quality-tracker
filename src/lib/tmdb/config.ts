/**
 * TMDB API configuration
 * Reads API key from environment and provides base URLs for API calls
 */

export const TMDB_CONFIG = {
  /** TMDB API base URL */
  apiBaseUrl: 'https://api.themoviedb.org/3',

  /** TMDB image base URL */
  imageBaseUrl: 'https://image.tmdb.org/t/p',

  /** Rate limit: TMDB allows ~40 requests per 10 seconds */
  rateLimit: {
    maxRequests: 40,
    windowMs: 10000,
  },
} as const;

/**
 * Get the TMDB API key at runtime
 * Must be a function to avoid Next.js standalone build caching the value at build time
 */
export function getTmdbApiKey(): string {
  return process.env.TMDB_API_KEY || '';
}

/**
 * Check if TMDB integration is configured
 * Reads environment variable at runtime for standalone/Docker deployments
 */
export function isTmdbConfigured(): boolean {
  return !!process.env.TMDB_API_KEY;
}
