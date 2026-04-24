import { NextRequest, NextResponse } from 'next/server';
import { db, isDbAvailable } from '@/lib/db';
import { getDemoProfile } from '@/lib/demo-data';

export async function GET() {
  try {
    if (isDbAvailable && db) {
      const profile = await db.profile.findFirst();
      if (profile) {
        return NextResponse.json({
          id: profile.id,
          fullName: profile.fullName,
          title: profile.title,
          email: profile.email,
          phone: profile.phone || '',
          location: profile.location || '',
          website: profile.website || '',
          linkedin: profile.linkedin || '',
          github: profile.github || '',
          summary: profile.summary,
          skills: profile.skills,
          experience: profile.experience,
          education: profile.education,
          desiredRole: profile.desiredRole || '',
          desiredSalary: profile.desiredSalary || '',
          desiredLocation: profile.desiredLocation || '',
          workPreference: profile.workPreference,
          yearsOfExperience: profile.yearsOfExperience || 0,
          noticePeriod: profile.noticePeriod || '',
          createdAt: profile.createdAt.toISOString(),
          updatedAt: profile.updatedAt.toISOString(),
        });
      }
    }
  } catch (error) {
    console.warn('DB query failed, using demo data:', error);
  }

  return NextResponse.json(getDemoProfile());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profile = getDemoProfile();
    return NextResponse.json({ ...profile, ...body });
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
