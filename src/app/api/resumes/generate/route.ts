import { NextRequest, NextResponse } from 'next/server';
import { generateResumeContent } from '@/lib/resume-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId } = body;

    const resume = generateResumeContent(jobId || undefined);

    return NextResponse.json({
      id: `resume-${Date.now()}`,
      name: `${resume.fullName} - ${jobId ? 'Tailored Resume' : 'General Resume'}`,
      content: resume,
      generatedAt: new Date().toISOString(),
      isDefault: !jobId,
    });
  } catch (error) {
    console.error('Resume generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    );
  }
}
