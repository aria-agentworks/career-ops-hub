import { getDemoProfile } from './demo-data';
import { getGrade } from './utils';

interface EvalRequest { description: string; jobTitle?: string; jobCompany?: string; }
interface EvalResult {
  score: number; grade: string;
  dimensions: { roleMatch: number; cvAlignment: number; compensation: number; growthPotential: number; companyCulture: number; technicalStack: number; locationFit: number; seniorityFit: number; marketDemand: number; overallPotential: number; };
  strengths: string[]; weaknesses: string[]; recommendations: string; tailoringNotes: string;
}

const DIMENSION_LABELS = ['roleMatch', 'cvAlignment', 'compensation', 'growthPotential', 'companyCulture', 'technicalStack', 'locationFit', 'seniorityFit', 'marketDemand', 'overallPotential'];

export async function evaluateJob(request: EvalRequest): Promise<EvalResult> {
  const profile = getDemoProfile();
  const profileSkills = profile.skills.split(',');
  const profileExp = JSON.parse(profile.experience || '[]') as Array<{ role: string; company: string; startDate: string; endDate: string }>;

  // Try AI evaluation
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const prompt = `You are an expert career advisor and technical recruiter. Evaluate this job against the candidate's profile.

CANDIDATE PROFILE:
- Name: ${profile.fullName}
- Title: ${profile.title}
- Skills: ${profile.skills}
- Experience: ${profileExp.map((e) => `${e.role} at ${e.company} (${e.startDate} - ${e.endDate})`).join('; ')}
- Summary: ${profile.summary}
- Desired Salary: ${profile.desiredSalary}
- Work Preference: ${profile.workPreference}
- Years of Experience: ${profile.yearsOfExperience}

JOB DESCRIPTION:
Title: ${request.jobTitle || 'Unknown'}
Company: ${request.jobCompany || 'Unknown'}
${request.description}

Score each dimension from 0 to 100 and provide analysis. Return ONLY valid JSON in this exact format:
{
  "dimensions": {
    "roleMatch": 0, "cvAlignment": 0, "compensation": 0, "growthPotential": 0,
    "companyCulture": 0, "technicalStack": 0, "locationFit": 0, "seniorityFit": 0,
    "marketDemand": 0, "overallPotential": 0
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": "detailed recommendation text",
  "tailoringNotes": "specific notes for tailoring the resume"
}`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a JSON-only response bot. Return only valid JSON, no markdown, no explanation.' },
        { role: 'user', content: prompt },
      ],
    });

    const content = completion.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const dims = parsed.dimensions || {};
      const overallScore = Math.round(Object.values(dims as Record<string, number>).reduce((a, b) => a + b, 0) / 10);
      return {
        score: overallScore,
        grade: getGrade(overallScore),
        dimensions: DIMENSION_LABELS.reduce((acc, label) => ({ ...acc, [label]: dims[label] || 50 }), {} as EvalResult['dimensions']),
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        recommendations: parsed.recommendations || '',
        tailoringNotes: parsed.tailoringNotes || '',
      };
    }
  } catch (e) {
    console.warn('AI evaluation failed, using fallback:', (e as Error).message);
  }

  // Fallback: heuristic scoring
  return heuristicEvaluation(request.description, profileSkills, profileExp);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function heuristicEvaluation(description: string, skills: string[], experience: any[]): EvalResult {
  const desc = description.toLowerCase();
  const dimScores = DIMENSION_LABELS.map(() => Math.floor(50 + Math.random() * 40));

  // Boost for skill matches
  const skillMatches = skills.filter(s => desc.includes(s.toLowerCase().trim()));
  dimScores[1] = Math.min(95, 50 + skillMatches.length * 12); // cvAlignment
  dimScores[5] = Math.min(95, 50 + skillMatches.length * 10); // technicalStack

  // Role match boost
  if (desc.includes('senior') && experience.length >= 2) dimScores[0] = Math.min(95, dimScores[0] + 15);
  if (desc.includes('full stack') || desc.includes('fullstack')) dimScores[0] += 10;

  const score = Math.round(dimScores.reduce((a, b) => a + b, 0) / 10);

  return {
    score,
    grade: getGrade(score),
    dimensions: DIMENSION_LABELS.reduce((acc, label, i) => ({ ...acc, [label]: dimScores[i] }), {} as EvalResult['dimensions']),
    strengths: ['Relevant technical experience', 'Strong educational background', 'Scale systems expertise'],
    weaknesses: ['Profile could be more tailored to this specific role'],
    recommendations: 'Update your profile to better match this role\'s requirements. Highlight relevant projects and achievements.',
    tailoringNotes: 'Reorder skills to match job requirements. Add relevant keywords to your summary.',
  };
}
