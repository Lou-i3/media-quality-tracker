/**
 * TypeScript types for TMDB API responses
 * Based on TMDB API v3: https://developer.themoviedb.org/reference
 */

/** Search result for a TV show */
export interface TMDBSearchResult {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string; // "YYYY-MM-DD"
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
}

/** Search response wrapper */
export interface TMDBSearchResponse {
  page: number;
  results: TMDBSearchResult[];
  total_pages: number;
  total_results: number;
}

/** Genre object */
export interface TMDBGenre {
  id: number;
  name: string;
}

/** Network (broadcaster) */
export interface TMDBNetwork {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

/** Season summary (from show details) */
export interface TMDBSeasonSummary {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string | null;
  season_number: number;
  episode_count: number;
  vote_average: number;
}

/** Full TV show details */
export interface TMDBShowDetails {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres: TMDBGenre[];
  networks: TMDBNetwork[];
  origin_country: string[];
  original_language: string;
  status: string; // "Returning Series", "Ended", "Canceled", etc.
  type: string; // "Scripted", "Documentary", etc.
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: TMDBSeasonSummary[];
  homepage: string | null;
  in_production: boolean;
  tagline: string;
}

/** Episode details */
export interface TMDBEpisode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string | null;
  episode_number: number;
  season_number: number;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  production_code: string;
}

/** Full season details with episodes */
export interface TMDBSeasonDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string | null;
  season_number: number;
  episodes: TMDBEpisode[];
  vote_average: number;
}

/** Error response from TMDB API */
export interface TMDBErrorResponse {
  success: false;
  status_code: number;
  status_message: string;
}

/** Our internal match result with confidence score */
export interface TMDBMatchResult {
  tmdbShow: TMDBSearchResult;
  confidence: number; // 0-100
  matchReasons: string[];
}
