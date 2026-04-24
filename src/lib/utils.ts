import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

export function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    A: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    B: 'bg-blue-100 text-blue-700 border-blue-200',
    C: 'bg-amber-100 text-amber-700 border-amber-200',
    D: 'bg-orange-100 text-orange-700 border-orange-200',
    F: 'bg-red-100 text-red-700 border-red-200',
  };
  return colors[grade] || 'bg-slate-100 text-slate-700';
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-emerald-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-amber-600';
  if (score >= 60) return 'text-orange-600';
  return 'text-red-600';
}

export function getScoreBg(score: number): string {
  if (score >= 90) return 'bg-emerald-500';
  if (score >= 80) return 'bg-blue-500';
  if (score >= 70) return 'bg-amber-500';
  if (score >= 60) return 'bg-orange-500';
  return 'bg-red-500';
}
