import { NextRequest, NextResponse } from 'next/server';
import { db, isDbAvailable } from '@/lib/db';
import { getDemoJob } from '@/lib/demo-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (isDbAvailable && db) {
      const job = await db.job.findFirst({
        where: { id },
        include: { evaluation: true },
      });
      if (job) return NextResponse.json(job);
    }
  } catch (error) {
    console.warn('DB query failed, using demo data:', error);
  }

  const job = getDemoJob(id);
  if (job) return NextResponse.json(job);
  return NextResponse.json({ error: 'Job not found' }, { status: 404 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    if (isDbAvailable && db) {
      const job = await db.job.update({
        where: { id },
        data: body,
        include: { evaluation: true },
      });
      return NextResponse.json(job);
    }

    const job = getDemoJob(id);
    if (job) {
      return NextResponse.json({ ...job, ...body });
    }
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  } catch (error) {
    console.error('Failed to update job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}
