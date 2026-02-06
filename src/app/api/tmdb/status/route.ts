/**
 * TMDB integration status API route
 * GET /api/tmdb/status - Get integration health and sync statistics
 */

import { NextResponse } from 'next/server';
import { getIntegrationStatus, isTmdbConfigured } from '@/lib/tmdb';

export async function GET() {
  const configured = isTmdbConfigured();

  if (!configured) {
    return NextResponse.json({
      configured: false,
      totalShows: 0,
      matchedShows: 0,
      unmatchedShows: 0,
      lastSyncedShow: null,
    });
  }

  try {
    const status = await getIntegrationStatus();

    return NextResponse.json({
      configured: true,
      ...status,
    });
  } catch (error) {
    console.error('TMDB status error:', error);
    return NextResponse.json(
      { error: 'Failed to get integration status' },
      { status: 500 }
    );
  }
}
