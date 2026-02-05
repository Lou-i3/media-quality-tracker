import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Status } from '@/generated/prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, year, status, notes } = body;

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
        status: status && ['TO_CHECK', 'GOOD', 'BAD', 'DELETED'].includes(status)
          ? (status as Status)
          : 'TO_CHECK',
        notes: notes || null,
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
