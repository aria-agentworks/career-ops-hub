import { NextRequest, NextResponse } from 'next/server';
import { evaluateJob } from '@/lib/ai-evaluator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      description,
      jobTitle,
      jobCompany,
      url,
      location,
      workMode,
      salaryMin,
      salaryMax,
      seniority,
      jobType,
    } = body;

    if (!description && !url) {
      return NextResponse.json(
        { error: 'Please provide a job description or URL' },
        { status: 400 }
      );
    }

    const result = await evaluateJob({
      description: description || '',
      jobTitle,
      jobCompany,
    });

    return NextResponse.json({
      ...result,
      jobTitle: jobTitle || 'Untitled Position',
      jobCompany: jobCompany || 'Unknown Company',
      location: location || '',
      url: url || '',
      workMode: workMode || 'remote',
      salaryMin: salaryMin || 0,
      salaryMax: salaryMax || 0,
      seniority: seniority || '',
      jobType: jobType || 'full-time',
    });
  } catch (error) {
    console.error('Evaluation failed:', error);
    return NextResponse.json(
      { error: 'Evaluation failed. Please try again.' },
      { status: 500 }
    );
  }
}
