/**
 * Refresh metadata for a single show
 */

import { NextRequest, NextResponse } from 'next/server';
import { refreshShowMetadata } from '@/lib/tmdb/service';
import { TMDB_CONFIG } from '@/lib/tmdb/config';

interface Params {
  params: Promise<{ showId: string }>;
}

export async function POST(request: NextRequest, { params }: Params) {
  if (!TMDB_CONFIG.apiKey) {
    return NextResponse.json(
      { error: 'TMDB API key not configured' },
      { status: 400 }
    );
  }

  try {
    const { showId } = await params;
    const id = parseInt(showId, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid show ID' }, { status: 400 });
    }

    await refreshShowMetadata(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Refresh metadata failed:', error);
    const message = error instanceof Error ? error.message : 'Failed to refresh metadata';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
