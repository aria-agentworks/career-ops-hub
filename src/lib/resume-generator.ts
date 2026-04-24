import { getDemoProfile, getDemoJob } from './demo-data';

interface ResumeContent {
  fullName: string; title: string; email: string; phone: string; location: string;
  linkedin: string; github: string; website: string;
  summary: string; skills: string[];
  experience: Array<{ company: string; role: string; startDate: string; endDate: string; highlights: string[] }>;
  education: Array<{ school: string; degree: string; field: string; year: string }>;
}

export function generateResumeContent(jobId?: string): ResumeContent {
  const profile = getDemoProfile();
  const base: ResumeContent = {
    fullName: profile.fullName,
    title: profile.title,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    linkedin: profile.linkedin,
    github: profile.github,
    website: profile.website,
    summary: profile.summary,
    skills: profile.skills.split(',').map(s => s.trim()).filter(Boolean),
    experience: JSON.parse(profile.experience || '[]'),
    education: JSON.parse(profile.education || '[]'),
  };

  if (!jobId) return base;

  const job = getDemoJob(jobId);
  if (!job) return base;

  const eval_ = job.evaluation;
  if (!eval_) return base;

  // Tailor summary
  const jobDesc = job.description.toLowerCase();
  const relevantSkills = base.skills.filter(s => jobDesc.includes(s.toLowerCase()));
  const otherSkills = base.skills.filter(s => !relevantSkills.includes(s));
  base.skills = [...relevantSkills, ...otherSkills];

  // Tailor summary based on evaluation
  if (eval_.tailoringNotes) {
    base.summary = `Results-driven software engineer with ${profile.yearsOfExperience}+ years of experience building scalable systems. ${eval_.strengths ? JSON.parse(eval_.strengths)[0] : ''}. Passionate about delivering high-impact solutions.`;
  }

  return base;
}
