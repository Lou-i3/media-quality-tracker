import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MonitorStatus } from '@/generated/prisma/client';

/**
 * GET /api/tv-shows - List TV shows with optional filters
 * Query params:
 * - unmatched: "true" to filter shows without TMDB match
 * - limit: number of results (default 50)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unmatched = searchParams.get('unmatched') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const where = unmatched ? { tmdbId: null } : {};

    const shows = await prisma.tVShow.findMany({
      where,
      take: limit,
      orderBy: { title: 'asc' },
      select: {
        id: true,
        title: true,
        year: true,
        tmdbId: true,
        monitorStatus: true,
      },
    });

    return NextResponse.json({ shows });
  } catch (error) {
    console.error('Failed to fetch TV shows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TV shows' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, year, monitorStatus, notes, description, posterPath, backdropPath } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const show = await prisma.tVShow.create({
      data: {
        title: title.trim(),
        year: year ? parseInt(year, 10) : null,
        monitorStatus: monitorStatus && ['WANTED', 'UNWANTED'].includes(monitorStatus)
          ? (monitorStatus as MonitorStatus)
          : 'WANTED',
        notes: notes || null,
        description: description || null,
        posterPath: posterPath || null,
        backdropPath: backdropPath || null,
      },
    });

    return NextResponse.json(show, { status: 201 });
  } catch (error) {
    console.error('Failed to create TV show:', error);
    return NextResponse.json(
      { error: 'Failed to create TV show' },
      { status: 500 }
    );
  }
}
