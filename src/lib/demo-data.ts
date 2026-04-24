// Comprehensive demo data for Career Ops Hub

export interface Experience { company: string; role: string; startDate: string; endDate: string; highlights: string[]; }
export interface Education { school: string; degree: string; field: string; year: string; }
export interface ProfileData {
  id: string; fullName: string; title: string; email: string; phone: string; location: string;
  website: string; linkedin: string; github: string; summary: string; skills: string;
  experience: string; education: string; desiredRole: string; desiredSalary: string;
  desiredLocation: string; workPreference: string; yearsOfExperience: number; noticePeriod: string;
  createdAt: string; updatedAt: string;
}

export interface JobData {
  id: string; title: string; company: string; location: string; url: string; description: string;
  salaryMin: number; salaryMax: number; salaryCurrency: string; jobType: string; workMode: string;
  seniority: string; status: string; score: number; grade: string; scoreBreakdown: string;
  evaluationNotes: string; tags: string; createdAt: string; updatedAt: string;
  evaluation?: EvaluationData;
}

export interface EvaluationData {
  id: string; jobId: string; roleMatch: number; cvAlignment: number; compensation: number;
  growthPotential: number; companyCulture: number; technicalStack: number; locationFit: number;
  seniorityFit: number; marketDemand: number; overallPotential: number;
  strengths: string; weaknesses: string; recommendations: string; tailoringNotes: string;
}

export interface ResumeData {
  id: string; profileId: string; jobId: string; name: string; content: string;
  generatedAt: string; isDefault: boolean;
}

const DEMO_EXPERIENCE: Experience[] = [
  { company: 'TechScale Inc.', role: 'Senior Software Engineer', startDate: '2021-06', endDate: 'present', highlights: ['Led migration of monolith to microservices reducing latency by 40%', 'Built ML pipeline processing 2M+ events/day', 'Mentored team of 5 junior engineers', 'Implemented real-time analytics dashboard'] },
  { company: 'DataFlow Labs', role: 'Software Engineer II', startDate: '2019-03', endDate: '2021-05', highlights: ['Developed REST APIs serving 10K+ requests/sec', 'Built CI/CD pipeline with GitHub Actions', 'Reduced AWS costs by 35% through optimization'] },
  { company: 'StartUpX', role: 'Junior Software Engineer', startDate: '2017-01', endDate: '2019-02', highlights: ['Full-stack development with React and Node.js', 'Implemented authentication system with OAuth 2.0'] },
];

const DEMO_EDUCATION: Education[] = [
  { school: 'MIT', degree: 'M.S.', field: 'Computer Science', year: '2017' },
  { school: 'UC Berkeley', degree: 'B.S.', field: 'Computer Science', year: '2015' },
];

export const DEMO_PROFILE: ProfileData = {
  id: 'demo-profile-1',
  fullName: 'Alex Chen',
  title: 'Senior Software Engineer / ML Engineer',
  email: 'alex.chen@email.com',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA',
  website: 'alexchen.dev',
  linkedin: 'linkedin.com/in/alexchen',
  github: 'github.com/alexchen',
  summary: 'Results-driven Senior Software Engineer with 8+ years of experience building scalable distributed systems, ML pipelines, and full-stack applications. Proven track record of leading technical initiatives that improve performance by 40%+ and reduce costs by 35%. Passionate about AI/ML, system design, and mentoring engineering teams.',
  skills: 'Python,TypeScript,React,Node.js,AWS,PyTorch,TensorFlow,PostgreSQL,Redis,Docker,Kubernetes,Git,CI/CD,GraphQL,REST APIs,System Design,Machine Learning,Data Engineering,Airflow,Spark',
  experience: JSON.stringify(DEMO_EXPERIENCE),
  education: JSON.stringify(DEMO_EDUCATION),
  desiredRole: 'Senior/Staff Software Engineer, ML Engineer, AI Platform Engineer',
  desiredSalary: '$200,000 - $300,000',
  desiredLocation: 'Remote / San Francisco Bay Area',
  workPreference: 'remote',
  yearsOfExperience: 8,
  noticePeriod: '4 weeks',
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-04-20T14:30:00Z',
};

const demoJobs: { title: string; company: string; location: string; url: string; desc: string; salary: [number, number]; type: string; mode: string; seniority: string; status: string; score: number; tags: string; notes: string; strengths: string[]; weaknesses: string[]; recs: string; tailoring: string; dims: number[] }[] = [
  { title: 'Senior ML Engineer', company: 'Anthropic', location: 'San Francisco, CA', url: 'https://anthropic.com/careers/sr-ml-eng', desc: 'Join Anthropic to build safe, beneficial AI systems. You will work on scaling our foundation models, improving training infrastructure, and conducting novel research.', salary: [280, 420], type: 'full-time', mode: 'hybrid', seniority: 'senior', status: 'applied', score: 94, tags: 'ai,ml,research', notes: 'Excellent match - strong ML experience aligns with core mission', strengths: ['8+ years ML experience directly relevant', 'Published research experience', 'Scale systems to millions of events', 'Strong Python + PyTorch background'], weaknesses: ['No prior AI safety research publications'], recs: 'Highlight your AI safety interests and any relevant reading. Emphasize the scale of ML systems you have built.', tailoring: 'Lead with ML pipeline experience. Add AI safety interest to summary. Reorder skills to put PyTorch, model training first.', dims: [96, 92, 88, 98, 95, 90, 85, 94, 97, 93] },
  { title: 'Staff Software Engineer', company: 'Stripe', location: 'Remote', url: 'https://stripe.com/jobs/staff-swe', desc: 'Lead technical direction for payment processing systems handling billions in transactions. Drive architecture decisions and mentor senior engineers.', salary: [320, 450], type: 'full-time', mode: 'remote', seniority: 'staff', status: 'interviewing', score: 87, tags: 'payments,infrastructure,leadership', notes: 'Strong technical fit, stretch on staff-level scope', strengths: ['Distributed systems expertise', 'Leadership and mentoring experience', 'Performance optimization track record'], weaknesses: ['No fintech/payments domain experience', 'Staff-level scope may be a stretch'], recs: 'Emphasize your experience leading technical initiatives. Draw parallels between payment reliability and your latency optimization work.', tailoring: 'Add leadership impact metrics to experience. Emphasize system reliability and performance work.', dims: [85, 88, 95, 82, 86, 88, 92, 90, 78, 86] },
  { title: 'Senior Software Engineer', company: 'Vercel', location: 'Remote', url: 'https://vercel.com/careers/senior-swe', desc: 'Build the future of web deployment. Work on our edge computing platform, developer tools, and Next.js framework.', salary: [220, 320], type: 'full-time', mode: 'remote', seniority: 'senior', status: 'offer', score: 91, tags: 'frontend,infrastructure,developer-tools', notes: 'Great match - full-stack + infrastructure experience', strengths: ['Full-stack React + Node.js experience', 'CI/CD and dev tools background', 'Remote-first culture fit', 'Performance optimization expertise'], weaknesses: ['No Edge computing experience specifically'], recs: 'Highlight your developer tools experience. Your CI/CD work at DataFlow maps directly to Vercel\'s product.', tailoring: 'Lead with developer tools and CI/CD experience. Add React/TypeScript skills prominently. Mention Next.js projects.', dims: [92, 94, 78, 90, 96, 93, 95, 92, 88, 90] },
  { title: 'AI Platform Engineer', company: 'OpenAI', location: 'San Francisco, CA', url: 'https://openai.com/careers/ai-platform', desc: 'Design and build the infrastructure that powers the world\'s most advanced AI models. Work on model serving, training infrastructure, and inference optimization.', salary: [300, 450], type: 'full-time', mode: 'onsite', seniority: 'senior', status: 'saved', score: 89, tags: 'ai,infrastructure,platform', notes: 'Strong technical match, onsite requirement is a consideration', strengths: ['ML infrastructure experience', 'Scale systems expertise', 'Python + cloud native stack'], weaknesses: ['On-site only - conflicts with remote preference', 'No direct model serving experience'], recs: 'If willing to relocate, this is a top match. Emphasize your ML pipeline scale and infrastructure work.', tailoring: 'Focus on infrastructure and scale. De-emphasize frontend work. Lead with ML pipeline and data engineering.', dims: [90, 85, 92, 95, 88, 86, 65, 82, 96, 91] },
  { title: 'Senior Backend Engineer', company: 'Netflix', location: 'Los Gatos, CA', url: 'https://jobs.netflix.com/senior-backend', desc: 'Build and scale backend services for streaming platform serving 250M+ subscribers globally. Focus on recommendation systems and content delivery.', salary: [250, 400], type: 'full-time', mode: 'hybrid', seniority: 'senior', status: 'applied', score: 82, tags: 'backend,streaming,recommendations', notes: 'Good technical fit, hybrid model works', strengths: ['Large-scale distributed systems', 'Data pipeline experience', 'Performance optimization'], weaknesses: ['No media/streaming domain experience', 'Hybrid requirement - partial match'], recs: 'Focus on scale - your 2M+ events/day experience is compelling. Draw parallels to streaming at scale.', tailoring: 'Emphasize scale numbers prominently. Add data engineering experience. Highlight PostgreSQL and Redis expertise.', dims: [80, 84, 90, 78, 82, 80, 75, 80, 85, 80] },
  { title: 'Software Engineer III', company: 'Google', location: 'Mountain View, CA', url: 'https://careers.google.com/swe3', desc: 'Join Google Cloud Platform team to build next-generation cloud infrastructure. Work on large-scale distributed systems serving billions of requests.', salary: [230, 380], type: 'full-time', mode: 'hybrid', seniority: 'senior', status: 'rejected', score: 78, tags: 'cloud,infrastructure,large-scale', notes: 'Competitive but solid application', strengths: ['Cloud infrastructure experience', 'System design skills', 'Strong CS fundamentals'], weaknesses: ['Competitive hiring bar', 'No Google-scale specific experience', 'Multiple interview rounds needed'], recs: 'Practice system design interviews extensively. Focus on distributed systems and scalability patterns.', tailoring: 'Lead with cloud and scale experience. Add specific metrics for systems you have built.', dims: [76, 80, 82, 75, 80, 78, 72, 78, 88, 76] },
  { title: 'Senior Full Stack Engineer', company: 'Retool', location: 'San Francisco, CA', url: 'https://retool.com/careers/senior-fs', desc: 'Build internal tools platform used by 50K+ companies. Work on the IDE, data connectors, and component library.', salary: [200, 300], type: 'full-time', mode: 'onsite', seniority: 'senior', status: 'saved', score: 85, tags: 'fullstack,developer-tools,ide', notes: 'Great product fit with full-stack skills', strengths: ['Strong React + Node.js experience', 'Developer tools background', 'End-to-end feature delivery'], weaknesses: ['On-site requirement', 'Smaller company risk tolerance'], recs: 'Your full-stack experience is a perfect fit. Emphasize your ability to build complete products end-to-end.', tailoring: 'Highlight full-stack projects. Emphasize React component work and API development equally.', dims: [88, 90, 72, 80, 85, 86, 68, 82, 82, 84] },
  { title: 'ML Engineer', company: 'ElevenLabs', location: 'Remote (EU/US)', url: 'https://elevenlabs.io/careers/ml-eng', desc: 'Work on cutting-edge voice AI technology. Build and improve our TTS and voice cloning models. Research novel architectures for speech synthesis.', salary: [180, 280], type: 'full-time', mode: 'remote', seniority: 'mid', status: 'interviewing', score: 72, tags: 'ai,ml,voice,audio', notes: 'Good ML match but different domain (voice AI)', strengths: ['ML pipeline experience', 'Python + PyTorch skills', 'Remote-friendly'], weaknesses: ['No speech/audio domain experience', 'Mid-level role may be under-target', 'Smaller team = broader responsibilities'], recs: 'If interested in exploring voice AI, this could be a great pivot. Emphasize transferable ML skills.', tailoring: 'Focus on ML fundamentals and transferable skills. De-emphasize web development for this role.', dims: [70, 68, 65, 80, 75, 72, 85, 75, 78, 68] },
  { title: 'Principal Engineer', company: 'Databricks', location: 'Amsterdam / Remote', url: 'https://databricks.com/careers/principal', desc: 'Set technical vision for data platform serving Fortune 500 companies. Define architecture patterns and drive engineering excellence.', salary: [350, 500], type: 'full-time', mode: 'remote', seniority: 'principal', status: 'saved', score: 65, tags: 'data,platform,leadership', notes: 'Ambitious target - principal level requires broader scope', strengths: ['Strong technical foundation', 'Data pipeline expertise'], weaknesses: ['Principal level is a significant stretch', 'No data platform specific experience at scale', 'Requires industry thought leadership'], recs: 'Consider applying for Senior or Staff level first. Build thought leadership through blog posts and talks.', tailoring: 'Focus on impact and leadership. Add metrics for business outcomes influenced by technical decisions.', dims: [62, 65, 75, 70, 68, 60, 80, 55, 72, 60] },
  { title: 'Senior SRE', company: 'Cloudflare', location: 'Austin, TX / Remote', url: 'https://cloudflare.com/careers/senior-sre', desc: 'Ensure reliability and performance of internet infrastructure serving 25M+ HTTP requests/sec. On-call rotation, incident response, capacity planning.', salary: [200, 320], type: 'full-time', mode: 'remote', seniority: 'senior', status: 'saved', score: 70, tags: 'sre,infrastructure,reliability', notes: 'Good infrastructure fit, different focus area', strengths: ['Distributed systems knowledge', 'Cloud infrastructure (AWS)', 'Monitoring and observability skills'], weaknesses: ['No formal SRE experience', 'On-call requirements', 'Different domain focus'], recs: 'Reframe your operations experience as SRE-adjacent. Your scale experience is highly relevant.', tailoring: 'Emphasize operational aspects of your roles. Add any incident response or monitoring experience.', dims: [72, 68, 78, 65, 70, 75, 78, 72, 68, 65] },
  { title: 'Head of Engineering', company: 'n8n', location: 'Remote (EU)', url: 'https://n8n.io/careers/head-eng', desc: 'Lead the engineering team of 30+ building the leading workflow automation platform. Define technical strategy and grow the team.', salary: [200, 300], type: 'full-time', mode: 'remote', seniority: 'director', status: 'saved', score: 55, tags: 'leadership,management,startup', notes: 'Leadership role - significant pivot from IC', strengths: ['Mentoring and team leadership', 'Full-stack technical knowledge'], weaknesses: ['No formal management experience at this level', 'Career pivot from IC to management', 'Team building experience is limited to 5 reports'], recs: 'This is a leadership leap. Consider tech lead roles first to build management credentials.', tailoring: 'Reframe mentoring as leadership. Add any cross-functional collaboration or stakeholder management examples.', dims: [50, 52, 60, 55, 58, 48, 75, 60, 65, 50] },
  { title: 'Frontend Engineer', company: 'Figma', location: 'San Francisco, CA', url: 'https://figma.com/careers/frontend', desc: 'Build the web interface for the world\'s most popular design tool. Focus on performance, canvas rendering, and real-time collaboration.', salary: [180, 280], type: 'full-time', mode: 'hybrid', seniority: 'mid', status: 'saved', score: 60, tags: 'frontend,canvas,performance', notes: 'Frontend-focused role, limited alignment with backend-heavy profile', strengths: ['React and TypeScript proficiency', 'Performance optimization experience'], weaknesses: ['Role is frontend-only, profile is backend-heavy', 'No canvas/WebGL experience', 'Mid-level may be under-target', 'On-site requirement'], recs: 'This role is too frontend-focused for your backend-heavy profile. Consider full-stack roles instead.', tailoring: 'Would need major profile shift. Not recommended as a primary application.', dims: [55, 58, 60, 58, 62, 52, 55, 60, 72, 55] },
  { title: 'DevOps Engineer', company: 'HashiCorp', location: 'Remote', url: 'https://hashicorp.com/careers/devops', desc: 'Build and maintain deployment infrastructure using Terraform and Vault. Automate everything and improve developer productivity.', salary: [180, 260], type: 'full-time', mode: 'remote', seniority: 'senior', status: 'saved', score: 74, tags: 'devops,terraform,automation', notes: 'Good infrastructure match with some DevOps overlap', strengths: ['Docker and Kubernetes experience', 'CI/CD pipeline building', 'Cloud infrastructure (AWS)', 'Remote-friendly'], weaknesses: ['No Terraform-specific experience', 'DevOps is adjacent but not primary focus'], recs: 'Your infrastructure and automation experience transfers well. Learn Terraform basics before applying.', tailoring: 'Emphasize infrastructure-as-code and automation. Add Docker/K8s prominently.', dims: [72, 70, 75, 72, 70, 78, 82, 78, 70, 72] },
  { title: 'Data Engineer', company: 'Snowflake', location: 'Remote', url: 'https://snowflake.com/careers/data-eng', desc: 'Build and optimize data pipelines on Snowflake\'s cloud data platform. Work with Spark, Airflow, and dbt for Fortune 500 clients.', salary: [190, 300], type: 'full-time', mode: 'remote', seniority: 'senior', status: 'withdrawn', score: 76, tags: 'data,pipeline,cloud', notes: 'Good data pipeline alignment', strengths: ['Data pipeline experience', 'Python expertise', 'Cloud infrastructure', 'Processing large datasets'], weaknesses: ['No Snowflake-specific experience', 'dbt and Airflow experience not mentioned', 'Shift from ML engineering to data engineering'], recs: 'Your data pipeline experience is relevant. Familiarize yourself with Snowflake and dbt before applying.', tailoring: 'Highlight data pipeline scale. Add any ETL/ELT experience. Emphasize Python and SQL skills.', dims: [78, 72, 78, 74, 75, 72, 85, 78, 80, 74] },
  { title: 'Senior Mobile Engineer', company: 'Discord', location: 'San Francisco, CA', url: 'https://discord.com/careers/senior-mobile', desc: 'Build the Discord mobile app used by 200M+ users. Focus on React Native performance, real-time messaging, and media features.', salary: [200, 320], type: 'full-time', mode: 'hybrid', seniority: 'senior', status: 'saved', score: 35, tags: 'mobile,react-native,realtime', notes: 'Poor fit - no mobile development experience', strengths: ['React web experience is adjacent', 'Real-time systems understanding'], weaknesses: ['No mobile development experience', 'No React Native specifically', 'Completely different platform expertise needed'], recs: 'Not recommended. Your profile has no mobile development experience.', tailoring: 'Not applicable - fundamentally different skill set required.', dims: [30, 25, 40, 35, 38, 20, 55, 40, 42, 30] },
];

function makeJob(j: typeof demoJobs[0], i: number): JobData {
  const dims = j.dims;
  const strengths = j.strengths;
  const weaknesses = j.weaknesses;
  return {
    id: `demo-job-${i}`,
    title: j.title,
    company: j.company,
    location: j.location,
    url: j.url,
    description: j.desc,
    salaryMin: j.salary[0],
    salaryMax: j.salary[1],
    salaryCurrency: 'USD',
    jobType: j.type,
    workMode: j.mode,
    seniority: j.seniority,
    status: j.status,
    score: j.score,
    grade: j.score >= 90 ? 'A' : j.score >= 80 ? 'B' : j.score >= 70 ? 'C' : j.score >= 60 ? 'D' : 'F',
    scoreBreakdown: JSON.stringify({ roleMatch: dims[0], cvAlignment: dims[1], compensation: dims[2], growthPotential: dims[3], companyCulture: dims[4], technicalStack: dims[5], locationFit: dims[6], seniorityFit: dims[7], marketDemand: dims[8], overallPotential: dims[9] }),
    evaluationNotes: j.notes,
    tags: j.tags,
    createdAt: new Date(Date.now() - i * 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
    evaluation: {
      id: `demo-eval-${i}`,
      jobId: `demo-job-${i}`,
      roleMatch: dims[0], cvAlignment: dims[1], compensation: dims[2], growthPotential: dims[3],
      companyCulture: dims[4], technicalStack: dims[5], locationFit: dims[6], seniorityFit: dims[7],
      marketDemand: dims[8], overallPotential: dims[9],
      strengths: JSON.stringify(strengths),
      weaknesses: JSON.stringify(weaknesses),
      recommendations: j.recs,
      tailoringNotes: j.tailoring,
    },
  };
}

export function getDemoProfile(): ProfileData { return DEMO_PROFILE; }
export function getDemoJobs(): JobData[] { return demoJobs.map((j, i) => makeJob(j, i)); }
export function getDemoJob(id: string): JobData | undefined { return getDemoJobs().find(j => j.id === id); }

export function getDemoResumes(): ResumeData[] {
  return [
    { id: 'demo-resume-0', profileId: 'demo-profile-1', jobId: 'demo-job-0', name: 'Alex Chen - Anthropic ML Engineer', content: JSON.stringify({ tailored: true }), generatedAt: new Date(Date.now() - 86400000).toISOString(), isDefault: false },
    { id: 'demo-resume-1', profileId: 'demo-profile-1', jobId: 'demo-job-2', name: 'Alex Chen - Vercel Staff SWE', content: JSON.stringify({ tailored: true }), generatedAt: new Date(Date.now() - 172800000).toISOString(), isDefault: false },
    { id: 'demo-resume-2', profileId: 'demo-profile-1', jobId: 'demo-job-1', name: 'Alex Chen - Stripe Staff SWE', content: JSON.stringify({ tailored: true }), generatedAt: new Date(Date.now() - 259200000).toISOString(), isDefault: false },
    { id: 'demo-resume-3', profileId: 'demo-profile-1', jobId: null, name: 'Alex Chen - General Resume', content: JSON.stringify({ tailored: false }), generatedAt: new Date(Date.now() - 345600000).toISOString(), isDefault: true },
    { id: 'demo-resume-4', profileId: 'demo-profile-1', jobId: 'demo-job-4', name: 'Alex Chen - OpenAI Platform', content: JSON.stringify({ tailored: true }), generatedAt: new Date(Date.now() - 432000000).toISOString(), isDefault: false },
  ];
}

export function getDemoDashboardStats() {
  const jobs = getDemoJobs();
  const grades = jobs.map(j => j.grade);
  return {
    totalJobs: jobs.length,
    avgScore: Math.round(jobs.reduce((s, j) => s + j.score, 0) / jobs.length),
    topMatches: jobs.filter(j => j.grade === 'A' || j.grade === 'B').length,
    activeApplications: jobs.filter(j => ['applied', 'interviewing', 'offer'].includes(j.status)).length,
    gradeDistribution: [
      { grade: 'A', count: grades.filter(g => g === 'A').length },
      { grade: 'B', count: grades.filter(g => g === 'B').length },
      { grade: 'C', count: grades.filter(g => g === 'C').length },
      { grade: 'D', count: grades.filter(g => g === 'D').length },
      { grade: 'F', count: grades.filter(g => g === 'F').length },
    ],
    pipelineStatus: [
      { status: 'Saved', count: jobs.filter(j => j.status === 'saved').length },
      { status: 'Applied', count: jobs.filter(j => j.status === 'applied').length },
      { status: 'Interviewing', count: jobs.filter(j => j.status === 'interviewing').length },
      { status: 'Offer', count: jobs.filter(j => j.status === 'offer').length },
      { status: 'Accepted', count: jobs.filter(j => j.status === 'accepted').length },
      { status: 'Rejected', count: jobs.filter(j => j.status === 'rejected').length },
      { status: 'Withdrawn', count: jobs.filter(j => j.status === 'withdrawn').length },
    ],
    recentEvaluations: jobs.slice(0, 5).map(j => ({ id: j.id, title: j.title, company: j.company, score: j.score, grade: j.grade, date: j.createdAt })),
  };
}
