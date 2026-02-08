/**
 * Episode Files API
 * GET: List files for an episode with playback tests
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const episodeId = parseInt(id, 10);

    if (isNaN(episodeId)) {
      return NextResponse.json({ error: 'Invalid episode ID' }, { status: 400 });
    }

    const files = await prisma.episodeFile.findMany({
      where: { episodeId },
      orderBy: { filename: 'asc' },
      select: {
        id: true,
        filename: true,
        quality: true,
        playbackTests: {
          orderBy: { testedAt: 'desc' },
          include: {
            platform: true,
          },
        },
      },
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error('Failed to fetch episode files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch episode files' },
      { status: 500 }
    );
  }
}
