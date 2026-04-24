import { NextResponse } from 'next/server';
import { db, isDbAvailable } from '@/lib/db';
import { getDemoResumes } from '@/lib/demo-data';

export async function GET() {
  try {
    if (isDbAvailable && db) {
      const resumes = await db.resume.findMany({
        orderBy: { generatedAt: 'desc' },
      });
      return NextResponse.json(resumes);
    }
  } catch (error) {
    console.warn('DB query failed, using demo data:', error);
  }

  return NextResponse.json(getDemoResumes());
}
