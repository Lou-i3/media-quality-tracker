/**
 * TMDB API configuration
 * Reads API key from environment and provides base URLs for API calls
 */

export const TMDB_CONFIG = {
  /** TMDB API base URL */
  apiBaseUrl: 'https://api.themoviedb.org/3',

  /** TMDB image base URL */
  imageBaseUrl: 'https://image.tmdb.org/t/p',

  /** API key (Read Access Token) from environment */
  apiKey: process.env.TMDB_API_KEY || '',

  /** Rate limit: TMDB allows ~40 requests per 10 seconds */
  rateLimit: {
    maxRequests: 40,
    windowMs: 10000,
  },
} as const;

/**
 * Check if TMDB integration is configured
 */
export function isTmdbConfigured(): boolean {
  return !!TMDB_CONFIG.apiKey;
}
