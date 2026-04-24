import { NextRequest, NextResponse } from 'next/server';
import { db, isDbAvailable } from '@/lib/db';
import { getDemoJobs } from '@/lib/demo-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const grade = searchParams.get('grade');
  const search = searchParams.get('search');

  try {
    if (isDbAvailable && db) {
      const where: Record<string, unknown> = {};
      if (status) where.status = status;
      if (grade) where.grade = grade;
      if (search) {
        where.OR = [
          { title: { contains: search } },
          { company: { contains: search } },
          { location: { contains: search } },
        ];
      }

      const jobs = await db.job.findMany({
        where: Object.keys(where).length > 0 ? where : undefined,
        include: { evaluation: true },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(jobs);
    }
  } catch (error) {
    console.warn('DB query failed, using demo data:', error);
  }

  let jobs = getDemoJobs();

  if (status) {
    jobs = jobs.filter(j => j.status === status);
  }
  if (grade) {
    jobs = jobs.filter(j => j.grade === grade);
  }
  if (search) {
    const q = search.toLowerCase();
    jobs = jobs.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q)
    );
  }

  return NextResponse.json(jobs);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (isDbAvailable && db) {
      const job = await db.job.create({
        data: {
          title: body.title || 'Untitled Job',
          company: body.company || 'Unknown Company',
          location: body.location,
          url: body.url,
          description: body.description || '',
          salaryMin: body.salaryMin,
          salaryMax: body.salaryMax,
          jobType: body.jobType || 'full-time',
          workMode: body.workMode || 'remote',
          seniority: body.seniority,
          status: body.status || 'saved',
          score: body.score,
          grade: body.grade,
          scoreBreakdown: body.scoreBreakdown || '{}',
          evaluationNotes: body.evaluationNotes,
          tags: body.tags || '',
        },
      });
      return NextResponse.json(job, { status: 201 });
    }

    const demoJob = {
      id: `demo-job-new-${Date.now()}`,
      title: body.title || 'Untitled Job',
      company: body.company || 'Unknown Company',
      location: body.location || '',
      url: body.url || '',
      description: body.description || '',
      salaryMin: body.salaryMin || 0,
      salaryMax: body.salaryMax || 0,
      salaryCurrency: 'USD',
      jobType: body.jobType || 'full-time',
      workMode: body.workMode || 'remote',
      seniority: body.seniority || '',
      status: body.status || 'saved',
      score: body.score || 0,
      grade: body.grade || 'C',
      scoreBreakdown: body.scoreBreakdown || '{}',
      evaluationNotes: body.evaluationNotes || '',
      tags: body.tags || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json(demoJob, { status: 201 });
  } catch (error) {
    console.error('Failed to create job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
