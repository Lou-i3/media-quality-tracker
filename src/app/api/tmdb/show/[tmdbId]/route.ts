/**
 * TMDB show details API route
 * GET /api/tmdb/show/[tmdbId] - Get show details for preview before matching
 */

import { NextResponse } from 'next/server';
import { getShowDetails, TMDBError, isTmdbConfigured, getPosterUrl, getBackdropUrl } from '@/lib/tmdb';

interface RouteParams {
  params: Promise<{ tmdbId: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  if (!isTmdbConfigured()) {
    return NextResponse.json(
      { error: 'TMDB API key not configured' },
      { status: 503 }
    );
  }

  const { tmdbId: tmdbIdParam } = await params;
  const tmdbId = parseInt(tmdbIdParam, 10);

  if (isNaN(tmdbId)) {
    return NextResponse.json(
      { error: 'Invalid TMDB ID' },
      { status: 400 }
    );
  }

  try {
    const show = await getShowDetails(tmdbId);

    // Transform to include full image URLs
    return NextResponse.json({
      id: show.id,
      name: show.name,
      originalName: show.original_name,
      description: show.overview,
      posterUrl: getPosterUrl(show.poster_path, 'w500'),
      backdropUrl: getBackdropUrl(show.backdrop_path),
      firstAirDate: show.first_air_date,
      lastAirDate: show.last_air_date,
      voteAverage: show.vote_average,
      voteCount: show.vote_count,
      genres: show.genres.map((g) => g.name),
      networks: show.networks.map((n) => n.name),
      status: show.status,
      numberOfSeasons: show.number_of_seasons,
      numberOfEpisodes: show.number_of_episodes,
      originalLanguage: show.original_language,
      inProduction: show.in_production,
      tagline: show.tagline,
      seasons: show.seasons.map((s) => ({
        id: s.id,
        name: s.name,
        seasonNumber: s.season_number,
        episodeCount: s.episode_count,
        airDate: s.air_date,
        posterUrl: getPosterUrl(s.poster_path, 'w185'),
      })),
    });
  } catch (error) {
    if (error instanceof TMDBError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    console.error('TMDB show details error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch show details' },
      { status: 500 }
    );
  }
}
