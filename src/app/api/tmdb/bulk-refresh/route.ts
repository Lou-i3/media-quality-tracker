/**
 * Bulk refresh metadata for all matched shows
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { refreshShowMetadata } from '@/lib/tmdb/service';
import { TMDB_CONFIG } from '@/lib/tmdb/config';

export async function POST() {
  if (!TMDB_CONFIG.apiKey) {
    return NextResponse.json(
      { error: 'TMDB API key not configured' },
      { status: 400 }
    );
  }

  try {
    // Get all matched shows
    const matchedShows = await prisma.tVShow.findMany({
      where: { tmdbId: { not: null } },
      select: { id: true, title: true },
    });

    if (matchedShows.length === 0) {
      return NextResponse.json({
        refreshed: 0,
        failed: 0,
        total: 0,
        results: [],
      });
    }

    const results: { showId: number; title: string; success: boolean; error?: string }[] = [];
    let refreshed = 0;
    let failed = 0;

    // Process shows one at a time to respect rate limits
    for (const show of matchedShows) {
      try {
        await refreshShowMetadata(show.id);
        results.push({ showId: show.id, title: show.title, success: true });
        refreshed++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({ showId: show.id, title: show.title, success: false, error: errorMessage });
        failed++;
      }

      // Small delay to avoid rate limiting (TMDB allows 40 requests per 10 seconds)
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    return NextResponse.json({
      refreshed,
      failed,
      total: matchedShows.length,
      results,
    });
  } catch (error) {
    console.error('Bulk refresh failed:', error);
    return NextResponse.json(
      { error: 'Failed to refresh metadata' },
      { status: 500 }
    );
  }
}
