import { NextResponse } from 'next/server';
import { db, isDbAvailable } from '@/lib/db';
import { getDemoDashboardStats } from '@/lib/demo-data';

export async function GET() {
  try {
    if (isDbAvailable && db) {
      const jobs = await db.job.findMany({ include: { evaluation: true } });
      const grades = jobs.map(j => j.grade || 'F');
      const totalJobs = jobs.length;
      const avgScore = totalJobs > 0 ? Math.round(jobs.reduce((s, j) => s + (j.score || 0), 0) / totalJobs) : 0;
      const topMatches = jobs.filter(j => j.grade === 'A' || j.grade === 'B').length;
      const activeApplications = jobs.filter(j => ['applied', 'interviewing', 'offer'].includes(j.status)).length;

      const gradeDistribution = ['A', 'B', 'C', 'D', 'F'].map(grade => ({
        grade,
        count: grades.filter(g => g === grade).length,
      }));

      const pipelineStatus = [
        { status: 'Saved', count: jobs.filter(j => j.status === 'saved').length },
        { status: 'Applied', count: jobs.filter(j => j.status === 'applied').length },
        { status: 'Interviewing', count: jobs.filter(j => j.status === 'interviewing').length },
        { status: 'Offer', count: jobs.filter(j => j.status === 'offer').length },
        { status: 'Accepted', count: jobs.filter(j => j.status === 'accepted').length },
        { status: 'Rejected', count: jobs.filter(j => j.status === 'rejected').length },
        { status: 'Withdrawn', count: jobs.filter(j => j.status === 'withdrawn').length },
      ];

      const recentEvaluations = jobs.slice(0, 5).map(j => ({
        id: j.id,
        title: j.title,
        company: j.company,
        score: Math.round(j.score || 0),
        grade: j.grade || 'F',
        date: j.createdAt.toISOString(),
      }));

      return NextResponse.json({
        totalJobs, avgScore, topMatches, activeApplications,
        gradeDistribution, pipelineStatus, recentEvaluations,
      });
    }
  } catch (error) {
    console.warn('DB query failed, using demo data:', error);
  }

  return NextResponse.json(getDemoDashboardStats());
}
