import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Status } from '@/generated/prisma/client';

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const showId = parseInt(id, 10);

    if (isNaN(showId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const { title, year, status, notes } = body;

    const updateData: {
      title?: string;
      year?: number | null;
      status?: Status;
      notes?: string | null;
    } = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      }
      updateData.title = title.trim();
    }

    if (year !== undefined) {
      updateData.year = year ? parseInt(year, 10) : null;
    }

    if (status !== undefined) {
      if (!['TO_CHECK', 'GOOD', 'BAD', 'DELETED'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      updateData.status = status as Status;
    }

    if (notes !== undefined) {
      updateData.notes = notes || null;
    }

    const show = await prisma.tVShow.update({
      where: { id: showId },
      data: updateData,
    });

    return NextResponse.json(show);
  } catch (error) {
    console.error('Failed to update TV show:', error);
    return NextResponse.json(
      { error: 'Failed to update TV show' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const showId = parseInt(id, 10);

    if (isNaN(showId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Delete the show and all related data (cascades defined in schema)
    await prisma.tVShow.delete({
      where: { id: showId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete TV show:', error);
    return NextResponse.json(
      { error: 'Failed to delete TV show' },
      { status: 500 }
    );
  }
}
