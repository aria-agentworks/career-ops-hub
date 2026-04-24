import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    return NextResponse.json({
      success: true,
      jobId: id,
      status: body.status || 'saved',
      message: `Job status updated to ${body.status || 'saved'}`,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
