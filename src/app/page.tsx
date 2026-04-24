'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Sparkles, Briefcase, Columns, FileText, User,
  ChevronLeft, ChevronRight, Plus, X, Search,
  MapPin, DollarSign, Clock, Building2, Star, Download,
  ArrowRight, Loader2, TrendingUp, Target,
  Mail, Phone, Globe, Save,
  Trash2, BarChart3,
  Zap, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavStore } from '@/store/navigation';
import { toast } from 'sonner';
import { cn, getGradeColor, getScoreColor, getScoreBg } from '@/lib/utils';
import { format } from 'date-fns';

// ──────────── Types ────────────

interface DashboardStats {
  totalJobs: number;
  avgScore: number;
  topMatches: number;
  activeApplications: number;
  gradeDistribution: { grade: string; count: number }[];
  pipelineStatus: { status: string; count: number }[];
  recentEvaluations: { id: string; title: string; company: string; score: number; grade: string; date: string }[];
}

interface EvaluationResult {
  score: number;
  grade: string;
  dimensions: {
    roleMatch: number; cvAlignment: number; compensation: number;
    growthPotential: number; companyCulture: number; technicalStack: number;
    locationFit: number; seniorityFit: number; marketDemand: number; overallPotential: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string;
  tailoringNotes: string;
  jobTitle?: string;
  jobCompany?: string;
}

interface JobCard {
  id: string; title: string; company: string; location: string; url: string;
  description: string; salaryMin: number; salaryMax: number; salaryCurrency: string;
  jobType: string; workMode: string; seniority: string; status: string;
  score: number; grade: string; scoreBreakdown: string; evaluationNotes: string;
  tags: string; createdAt: string; updatedAt: string;
  evaluation?: {
    id: string; jobId: string;
    roleMatch: number; cvAlignment: number; compensation: number;
    growthPotential: number; companyCulture: number; technicalStack: number;
    locationFit: number; seniorityFit: number; marketDemand: number; overallPotential: number;
    strengths: string; weaknesses: string; recommendations: string; tailoringNotes: string;
  };
}

interface ProfileData {
  id: string; fullName: string; title: string; email: string; phone: string;
  location: string; website: string; linkedin: string; github: string;
  summary: string; skills: string; experience: string; education: string;
  desiredRole: string; desiredSalary: string; desiredLocation: string;
  workPreference: string; yearsOfExperience: number; noticePeriod: string;
  createdAt: string; updatedAt: string;
}

interface ResumeContent {
  fullName: string; title: string; email: string; phone: string; location: string;
  linkedin: string; github: string; website: string;
  summary: string; skills: string[];
  experience: Array<{ company: string; role: string; startDate: string; endDate: string; highlights: string[] }>;
  education: Array<{ school: string; degree: string; field: string; year: string }>;
}

// ──────────── Dimension Labels ────────────

const DIM_LABELS: Record<string, string> = {
  roleMatch: 'Role Match',
  cvAlignment: 'CV Alignment',
  compensation: 'Compensation',
  growthPotential: 'Growth Potential',
  companyCulture: 'Company Culture',
  technicalStack: 'Technical Stack',
  locationFit: 'Location Fit',
  seniorityFit: 'Seniority Fit',
  marketDemand: 'Market Demand',
  overallPotential: 'Overall Potential',
};

const GRADE_COLORS: Record<string, string> = {
  A: '#10b981', B: '#3b82f6', C: '#f59e0b', D: '#f97316', F: '#ef4444',
};

const STATUS_FLOW = ['saved', 'applied', 'interviewing', 'offer', 'accepted', 'rejected'];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  saved: { label: 'Saved', color: 'text-slate-700', bg: 'bg-slate-100' },
  applied: { label: 'Applied', color: 'text-blue-700', bg: 'bg-blue-100' },
  interviewing: { label: 'Interviewing', color: 'text-purple-700', bg: 'bg-purple-100' },
  offer: { label: 'Offer', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  accepted: { label: 'Accepted', color: 'text-green-700', bg: 'bg-green-100' },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100' },
  withdrawn: { label: 'Withdrawn', color: 'text-gray-500', bg: 'bg-gray-100' },
};

// ──────────── Skeleton Component ────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded bg-slate-200', className)} />;
}

// ──────────── NAV ITEMS ────────────

const NAV_ITEMS = [
  { view: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { view: 'evaluate' as const, label: 'Evaluate', icon: Sparkles },
  { view: 'jobs' as const, label: 'Jobs', icon: Briefcase },
  { view: 'tracker' as const, label: 'Tracker', icon: Columns },
  { view: 'resumes' as const, label: 'Resumes', icon: FileText },
  { view: 'profile' as const, label: 'Profile', icon: User },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SIDEBAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function Sidebar() {
  const { activeView, setActiveView } = useNavStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden md:flex flex-col fixed left-0 top-0 h-screen z-30 bg-[#1e3a5f] text-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}>
        {/* Logo */}
        <div className={cn('flex items-center gap-3 px-4 h-16 border-b border-white/10', collapsed && 'justify-center px-2')}>
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5 text-[#1e3a5f]" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold leading-tight">Career Ops Hub</h1>
              <p className="text-[10px] text-blue-200 leading-tight">AI Job Search</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                collapsed && 'justify-center px-2',
                activeView === item.view
                  ? 'bg-white/12 text-amber-400'
                  : 'text-blue-100 hover:bg-white/8 hover:text-white'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-12 border-t border-white/10 text-blue-200 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#1e3a5f] text-white border-t border-white/10 flex safe-area-inset-bottom">
        {NAV_ITEMS.map(item => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] transition-colors',
              activeView === item.view ? 'text-amber-400' : 'text-blue-200'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DASHBOARD VIEW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function DashboardView() {
  const { setActiveView } = useNavStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!stats) return <div className="text-center text-slate-500 py-12">Failed to load dashboard</div>;

  const statCards = [
    { label: 'Total Jobs Evaluated', value: stats.totalJobs, icon: Briefcase, color: 'text-[#1e3a5f]', bg: 'bg-blue-50' },
    { label: 'Average Score', value: stats.avgScore, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Top Matches', value: stats.topMatches, icon: Star, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Applications', value: stats.activeApplications, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{card.label}</span>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', card.bg)}>
                <card.icon className={cn('w-4 h-4', card.color)} />
              </div>
            </div>
            <div className={cn('text-3xl font-bold', card.color)}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Grade Distribution + Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#1e3a5f]" />
            Grade Distribution
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.gradeDistribution} barCategoryGap="20%">
                <XAxis dataKey="grade" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value: number) => [`${value} jobs`, 'Count']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.gradeDistribution.map((entry) => (
                    <Cell key={entry.grade} fill={GRADE_COLORS[entry.grade] || '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Columns className="w-4 h-4 text-[#1e3a5f]" />
            Application Pipeline
          </h3>
          <div className="space-y-3">
            {stats.pipelineStatus.filter(s => s.count > 0).map(item => {
              const cfg = STATUS_CONFIG[item.status.toLowerCase()];
              return (
                <div key={item.status} className="flex items-center gap-3">
                  <span className={cn('text-xs font-medium w-24 text-right', cfg?.color || 'text-slate-500')}>{item.status}</span>
                  <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-1000 animate-progress', cfg?.bg || 'bg-slate-300')}
                      style={{ width: `${Math.max(8, (item.count / stats.totalJobs) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-6">{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Evaluations */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#1e3a5f]" />
          Recent Evaluations
        </h3>
        <div className="space-y-2">
          {stats.recentEvaluations.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white', getScoreBg(item.score))}>
                {item.grade}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                <p className="text-xs text-slate-500">{item.company}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={cn('text-sm font-bold', getScoreColor(item.score))}>{item.score}</p>
                <p className="text-[10px] text-slate-400">{format(new Date(item.date), 'MMM d')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setActiveView('evaluate')}
          className="flex items-center gap-3 p-4 bg-[#1e3a5f] text-white rounded-xl hover:bg-[#1e3a5f]/90 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#1e3a5f]" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">Evaluate New Job</p>
            <p className="text-xs text-blue-200">Get AI-powered job fit analysis</p>
          </div>
          <ArrowRight className="w-4 h-4 ml-auto text-blue-200 group-hover:translate-x-1 transition-transform" />
        </button>
        <button
          onClick={() => setActiveView('resumes')}
          className="flex items-center gap-3 p-4 bg-white border border-slate-200 text-slate-800 rounded-xl hover:border-amber-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">Generate Resume</p>
            <p className="text-xs text-slate-500">Create tailored resume for any job</p>
          </div>
          <ArrowRight className="w-4 h-4 ml-auto text-slate-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVALUATE VIEW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function EvaluateView() {
  const { setActiveView } = useNavStore();
  const [mode, setMode] = useState<'url' | 'paste'>('paste');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [workMode, setWorkMode] = useState('remote');
  const [jobType, setJobType] = useState('full-time');
  const [seniority, setSeniority] = useState('senior');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const handleEvaluate = async () => {
    if (!description.trim() && mode === 'paste') {
      toast.error('Please paste a job description');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/jobs/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          jobTitle: jobTitle || undefined,
          jobCompany: company || undefined,
          location,
          workMode,
          jobType,
          seniority,
        }),
      });
      const data = await res.json();
      if (data.error) { toast.error(data.error); return; }
      setResult(data);
      toast.success('Evaluation complete!');
    } catch {
      toast.error('Evaluation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    try {
      await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: result.jobTitle || jobTitle || 'Untitled Position',
          company: result.jobCompany || company || 'Unknown Company',
          location,
          description,
          workMode,
          jobType,
          seniority,
          score: result.score,
          grade: result.grade,
          scoreBreakdown: JSON.stringify(result.dimensions),
          evaluationNotes: result.recommendations,
        }),
      });
      toast.success('Saved to tracker!');
      setActiveView('jobs');
    } catch {
      toast.error('Failed to save');
    }
  };

  const circumference = 2 * Math.PI * 50;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Evaluate a Job</h2>
          <p className="text-sm text-slate-500 mt-1">Get AI-powered insights on job fit</p>
        </div>
        {result && (
          <button onClick={() => setResult(null)} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
            <Plus className="w-4 h-4" /> New Evaluation
          </button>
        )}
      </div>

      {/* Form */}
      {!result && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
            <button
              onClick={() => setMode('paste')}
              className={cn('px-4 py-1.5 rounded-md text-sm font-medium transition-all', mode === 'paste' ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-slate-500 hover:text-slate-700')}
            >
              Paste Description
            </button>
            <button
              onClick={() => setMode('url')}
              className={cn('px-4 py-1.5 rounded-md text-sm font-medium transition-all', mode === 'url' ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-slate-500 hover:text-slate-700')}
            >
              Paste Job URL
            </button>
          </div>

          {mode === 'url' ? (
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Job URL</label>
              <input
                type="url"
                placeholder="https://company.com/careers/job-id"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
              />
            </div>
          ) : (
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Job Description</label>
              <textarea
                rows={6}
                placeholder="Paste the full job description here..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 resize-none"
              />
            </div>
          )}

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Job Title</label>
              <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g., Senior Engineer" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Company</label>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g., Google" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Location</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Remote" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400" />
            </div>
          </div>

          {/* Select Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Work Mode</label>
              <select value={workMode} onChange={e => setWorkMode(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white">
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Job Type</label>
              <select value={jobType} onChange={e => setJobType(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white">
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Seniority</label>
              <select value={seniority} onChange={e => setSeniority(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white">
                <option value="junior">Junior</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
                <option value="staff">Staff</option>
                <option value="principal">Principal</option>
                <option value="director">Director</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleEvaluate}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Evaluating...' : 'Evaluate Job'}
          </button>
        </div>
      )}

      {/* Results */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
          <p className="text-sm text-slate-500">Analyzing job fit...</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Score Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Score Circle */}
              <div className="relative flex-shrink-0">
                <svg width="128" height="128" className="transform -rotate-90">
                  <circle cx="64" cy="64" r="50" stroke="#e2e8f0" strokeWidth="10" fill="none" />
                  <circle
                    cx="64" cy="64" r="50"
                    stroke={GRADE_COLORS[result.grade] || '#94a3b8'}
                    strokeWidth="10" fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (result.score / 100) * circumference}
                    className="score-circle-animated"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={cn('text-3xl font-bold', getScoreColor(result.score))}>{result.score}</span>
                  <span className={cn('text-lg font-bold', getGradeColor(result.grade), 'px-2 py-0.5 rounded text-xs border')}>{result.grade}</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold text-slate-800">{result.jobTitle || jobTitle || 'Job Position'}</h3>
                <p className="text-sm text-slate-500 mt-1">{result.jobCompany || company || 'Company'}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  {location && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md flex items-center gap-1"><MapPin className="w-3 h-3" />{location}</span>}
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md">{workMode}</span>
                  <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-md">{jobType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dimension Bars */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#1e3a5f]" />
              Evaluation Dimensions
            </h4>
            <div className="space-y-3">
              {Object.entries(result.dimensions).map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-600">{DIM_LABELS[key] || key}</span>
                    <span className={cn('text-xs font-bold', getScoreColor(value))}>{value}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full animate-progress', getScoreBg(value))}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h4 className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" /> Strengths
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.strengths.map((s, i) => (
                  <span key={i} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg">{s}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h4 className="text-sm font-semibold text-amber-700 mb-3 flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4" /> Areas for Improvement
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.weaknesses.map((w, i) => (
                  <span key={i} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg">{w}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#1e3a5f]" /> Recommendations
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">{result.recommendations}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#1e3a5f] text-white rounded-lg font-medium text-sm hover:bg-[#1e3a5f]/90 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save to Tracker
            </button>
            <button
              onClick={() => { setActiveView('resumes'); }}
              className="px-5 py-2.5 bg-amber-500 text-white rounded-lg font-medium text-sm hover:bg-amber-600 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Generate Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// JOBS VIEW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function JobsView() {
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [workModeFilter, setWorkModeFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'company'>('score');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (gradeFilter) params.set('grade', gradeFilter);
    if (search) params.set('search', search);
    fetch(`/api/jobs?${params}`)
      .then(r => r.json())
      .then(data => { if (!cancelled) { setJobs(data); setLoading(false); } })
      .catch(() => { if (!cancelled) { toast.error('Failed to load jobs'); setLoading(false); } });
    return () => { cancelled = true; };
  }, [statusFilter, gradeFilter, search]);

  const filteredJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'score') return (b.score || 0) - (a.score || 0);
    if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return a.company.localeCompare(b.company);
  });

  const toggleStatus = async (jobId: string, newStatus: string) => {
    try {
      await fetch(`/api/jobs/${jobId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(`Status updated to ${newStatus}`);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    } catch { toast.error('Failed to update status'); }
  };

  const gradeChips = ['A', 'B', 'C', 'D', 'F'];
  const statusChips = ['saved', 'applied', 'interviewing', 'offer', 'rejected'];
  const workModeChips = ['remote', 'hybrid', 'onsite'];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Evaluated Jobs</h2>
          <p className="text-sm text-slate-500">{jobs.length} jobs found</p>
        </div>
        <div className="flex gap-2">
          {(['score', 'date', 'company'] as const).map(s => (
            <button key={s} onClick={() => setSortBy(s)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize', sortBy === s ? 'bg-[#1e3a5f] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300')}>
              {s === 'score' ? 'Score' : s === 'date' ? 'Date' : 'Company'}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search jobs by title, company, or location..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-medium text-slate-500 self-center mr-1">Grade:</span>
        {gradeChips.map(g => (
          <button key={g} onClick={() => setGradeFilter(gradeFilter === g ? null : g)}
            className={cn('px-2.5 py-1 rounded-md text-xs font-bold border transition-all', gradeFilter === g ? getGradeColor(g) + ' border-current' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300')}>
            {g}
          </button>
        ))}
        <span className="text-xs font-medium text-slate-500 self-center ml-2 mr-1">Status:</span>
        {statusChips.map(s => (
          <button key={s} onClick={() => setStatusFilter(statusFilter === s ? null : s)}
            className={cn('px-2.5 py-1 rounded-md text-xs font-medium border transition-all capitalize', statusFilter === s ? (STATUS_CONFIG[s]?.bg || 'bg-slate-100') + ' ' + (STATUS_CONFIG[s]?.color || 'text-slate-700') + ' border-current' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300')}>
            {s}
          </button>
        ))}
        <span className="text-xs font-medium text-slate-500 self-center ml-2 mr-1">Mode:</span>
        {workModeChips.map(m => (
          <button key={m} onClick={() => setWorkModeFilter(workModeFilter === m ? null : m)}
            className={cn('px-2.5 py-1 rounded-md text-xs font-medium border transition-all capitalize', workModeFilter === m ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300')}>
            {m}
          </button>
        ))}
      </div>

      {/* Job Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <Skeleton className="h-4 w-3/4 mb-3" />
              <Skeleton className="h-3 w-1/2 mb-2" />
              <Skeleton className="h-8 w-12 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.map(job => {
            const breakdown = job.evaluation ? {
              roleMatch: job.evaluation.roleMatch,
              cvAlignment: job.evaluation.cvAlignment,
              compensation: job.evaluation.compensation,
              growthPotential: job.evaluation.growthPotential,
              companyCulture: job.evaluation.companyCulture,
              technicalStack: job.evaluation.technicalStack,
              locationFit: job.evaluation.locationFit,
              seniorityFit: job.evaluation.seniorityFit,
              marketDemand: job.evaluation.marketDemand,
              overallPotential: job.evaluation.overallPotential,
            } : (job.scoreBreakdown ? JSON.parse(job.scoreBreakdown) : null);

            const strengths = job.evaluation?.strengths ? (typeof job.evaluation.strengths === 'string' ? JSON.parse(job.evaluation.strengths) : job.evaluation.strengths) : [];
            const weaknesses = job.evaluation?.weaknesses ? (typeof job.evaluation.weaknesses === 'string' ? JSON.parse(job.evaluation.weaknesses) : job.evaluation.weaknesses) : [];
            const isExpanded = expandedId === job.id;
            const statusCfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.saved;
            const initials = job.company.charAt(0).toUpperCase();
            const avatarColor = GRADE_COLORS[job.grade] || '#94a3b8';

            return (
              <div key={job.id} className={cn('bg-white rounded-xl shadow-sm border transition-all hover:shadow-md', isExpanded ? 'border-amber-300 col-span-1 md:col-span-2 xl:col-span-3' : 'border-slate-100')}>
                {/* Card Header */}
                <div className="p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : job.id)}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: avatarColor }}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 truncate">{job.title}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3" /> {job.company}
                      </p>
                    </div>
                    <div className={cn('px-2 py-1 rounded-lg text-xs font-bold text-white', getScoreBg(job.score))}>
                      {job.grade}
                    </div>
                  </div>

                  {/* Tags Row */}
                  <div className="flex flex-wrap gap-1.5 mt-3 ml-13">
                    {job.location && <span className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{job.location}</span>}
                    <span className={cn('text-[10px] px-2 py-0.5 rounded', statusCfg.bg, statusCfg.color)}>{statusCfg.label}</span>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{job.workMode}</span>
                    {job.salaryMin > 0 && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded flex items-center gap-0.5">
                        <DollarSign className="w-2.5 h-2.5" />{(job.salaryMin / 1000)}k-{(job.salaryMax / 1000)}k
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 animate-fade-in">
                    {/* Score Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-600">Overall Score</span>
                        <span className={cn('text-sm font-bold', getScoreColor(job.score))}>{job.score}/100</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full transition-all', getScoreBg(job.score))} style={{ width: `${job.score}%` }} />
                      </div>
                    </div>

                    {/* Dimensions */}
                    {breakdown && (
                      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-4">
                        {Object.entries(breakdown).map(([key, val]) => (
                          <div key={key} className="bg-slate-50 rounded-lg p-2">
                            <p className="text-[10px] text-slate-500 truncate">{DIM_LABELS[key] || key}</p>
                            <p className={cn('text-sm font-bold', getScoreColor(val as number))}>{val}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Strengths/Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {strengths.length > 0 && (
                        <div>
                          <p className="text-[10px] font-medium text-emerald-600 mb-1.5 uppercase tracking-wide">Strengths</p>
                          <div className="flex flex-wrap gap-1">{strengths.map((s: string, i: number) => (
                            <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">{s}</span>
                          ))}</div>
                        </div>
                      )}
                      {weaknesses.length > 0 && (
                        <div>
                          <p className="text-[10px] font-medium text-amber-600 mb-1.5 uppercase tracking-wide">Weaknesses</p>
                          <div className="flex flex-wrap gap-1">{weaknesses.map((w: string, i: number) => (
                            <span key={i} className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded">{w}</span>
                          ))}</div>
                        </div>
                      )}
                    </div>

                    {/* Status Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500 mr-1">Move to:</span>
                      {STATUS_FLOW.map(s => (
                        <button key={s} onClick={() => toggleStatus(job.id, s)}
                          className={cn('px-2 py-1 rounded text-[10px] font-medium border transition-all capitalize',
                            job.status === s ? (STATUS_CONFIG[s]?.bg || 'bg-slate-100') + ' ' + (STATUS_CONFIG[s]?.color || 'text-slate-700') + ' border-current' : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50')}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filteredJobs.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No jobs found matching your filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRACKER VIEW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function TrackerView() {
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs')
      .then(r => r.json())
      .then(data => { setJobs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const moveJob = async (jobId: string, newStatus: string) => {
    try {
      await fetch(`/api/jobs/${jobId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(`Moved to ${newStatus}`);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    } catch { toast.error('Failed to move job'); }
  };

  const columns = STATUS_FLOW.map(status => ({
    status,
    cfg: STATUS_CONFIG[status],
    jobs: jobs.filter(j => j.status === status),
  }));

  const statusColors: Record<string, string> = {
    saved: 'bg-slate-500',
    applied: 'bg-blue-500',
    interviewing: 'bg-purple-500',
    offer: 'bg-emerald-500',
    accepted: 'bg-green-600',
    rejected: 'bg-red-500',
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Application Tracker</h2>
        <p className="text-sm text-slate-500">Drag through your application pipeline</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <Skeleton className="h-4 w-16 mb-3" />
              {[1,2].map(j => <Skeleton key={j} className="h-16 mb-2 rounded-lg" />)}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {columns.map(col => {
            const idx = STATUS_FLOW.indexOf(col.status);
            return (
              <div key={col.status} className="flex-shrink-0 w-60">
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn('w-2 h-2 rounded-full', statusColors[col.status] || 'bg-slate-400')} />
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">{col.cfg.label}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-medium ml-auto">{col.jobs.length}</span>
                </div>

                {/* Cards */}
                <div className="space-y-2 min-h-[100px]">
                  {col.jobs.map(job => (
                    <div key={job.id} className="bg-white rounded-lg p-3 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <p className="text-xs font-semibold text-slate-800 truncate">{job.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">{job.company}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded text-white', getScoreBg(job.score))}>{job.grade}</span>
                        <div className="flex gap-0.5">
                          {idx > 0 && (
                            <button onClick={() => moveJob(job.id, STATUS_FLOW[idx - 1])}
                              className="p-1 rounded bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors" title={`Move to ${STATUS_CONFIG[STATUS_FLOW[idx - 1]]?.label}`}>
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                          )}
                          {idx < STATUS_FLOW.length - 1 && (
                            <button onClick={() => moveJob(job.id, STATUS_FLOW[idx + 1])}
                              className="p-1 rounded bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors" title={`Move to ${STATUS_CONFIG[STATUS_FLOW[idx + 1]]?.label}`}>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {col.jobs.length === 0 && (
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 flex items-center justify-center">
                      <span className="text-[10px] text-slate-400">No jobs</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RESUMES VIEW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ResumesView() {
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [resume, setResume] = useState<ResumeContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [resumeHistory, setResumeHistory] = useState<{ id: string; name: string; generatedAt: string }[]>([]);

  useEffect(() => {
    fetch('/api/jobs')
      .then(r => r.json())
      .then(data => {
        setJobs(data.filter((j: JobCard) => j.score > 0));
      });
    fetch('/api/resumes')
      .then(r => r.json())
      .then(data => setResumeHistory(data));
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resumes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: selectedJobId || undefined }),
      });
      const data = await res.json();
      setResume(data.content);
      toast.success('Resume generated!');
    } catch { toast.error('Failed to generate resume'); }
    finally { setLoading(false); }
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Resume Generator</h2>
        <p className="text-sm text-slate-500">Create tailored resumes for your target jobs</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-600 mb-1 block">Select a Job (optional)</label>
            <select value={selectedJobId} onChange={e => setSelectedJobId(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white">
              <option value="">General Resume (no specific job)</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title} at {j.company} ({j.grade})</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleGenerate} disabled={loading}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50 whitespace-nowrap">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Generating...' : 'Generate Resume'}
            </button>
          </div>
        </div>
      </div>

      {/* Resume Preview */}
      {resume && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in" id="resume-preview">
          {/* Header */}
          <div className="bg-[#1e3a5f] text-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{resume.fullName}</h3>
                <p className="text-blue-200 text-sm mt-1">{resume.title}</p>
              </div>
              <button onClick={handlePrint}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>
            <div className="flex flex-wrap gap-3 mt-3 text-xs text-blue-200">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{resume.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{resume.phone}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{resume.location}</span>
              {resume.linkedin && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{resume.linkedin}</span>}
              {resume.github && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{resume.github}</span>}
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 text-sm">
            {/* Summary */}
            {resume.summary && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 pb-1 border-b border-slate-200">Summary</h4>
                <p className="text-slate-600 text-xs leading-relaxed">{resume.summary}</p>
              </div>
            )}

            {/* Experience */}
            {resume.experience.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 pb-1 border-b border-slate-200">Experience</h4>
                <div className="space-y-3">
                  {resume.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{exp.role}</p>
                          <p className="text-xs text-slate-500">{exp.company}</p>
                        </div>
                        <p className="text-[10px] text-slate-400">{exp.startDate} — {exp.endDate}</p>
                      </div>
                      <ul className="mt-1 space-y-0.5">
                        {exp.highlights.map((h, j) => (
                          <li key={j} className="text-[11px] text-slate-600 flex gap-1.5">
                            <span className="text-amber-500 mt-0.5">•</span> {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resume.skills.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 pb-1 border-b border-slate-200">Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.map((skill, i) => (
                    <span key={i} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resume.education.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 pb-1 border-b border-slate-200">Education</h4>
                <div className="space-y-2">
                  {resume.education.map((edu, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{edu.degree} in {edu.field}</p>
                        <p className="text-xs text-slate-500">{edu.school}</p>
                      </div>
                      <p className="text-[10px] text-slate-400">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resume History */}
      {resumeHistory.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Resume History</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            {resumeHistory.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{r.name}</p>
                  <p className="text-[10px] text-slate-400">{format(new Date(r.generatedAt), 'MMM d, yyyy h:mm a')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROFILE VIEW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ProfileView() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'summary' | 'skills' | 'experience' | 'education' | 'preferences'>('basic');
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => { setProfile(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const update = (field: string, value: string | number) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      toast.success('Profile saved!');
    } catch { toast.error('Failed to save profile'); }
    finally { setSaving(false); }
  };

  const addSkill = () => {
    if (!profile || !newSkill.trim()) return;
    const skills = profile.skills.split(',').map(s => s.trim()).filter(Boolean);
    if (!skills.includes(newSkill.trim())) {
      skills.push(newSkill.trim());
      update('skills', skills.join(','));
    }
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    if (!profile) return;
    const skills = profile.skills.split(',').map(s => s.trim()).filter(Boolean).filter(s => s !== skill);
    update('skills', skills.join(','));
  };

  // Experience helpers
  const expList: Array<{ company: string; role: string; startDate: string; endDate: string; highlights: string[] }> = profile ? JSON.parse(profile.experience || '[]') : [];
  const eduList: Array<{ school: string; degree: string; field: string; year: string }> = profile ? JSON.parse(profile.education || '[]') : [];

  const addExperience = () => {
    const newList = [...expList, { company: '', role: '', startDate: '', endDate: '', highlights: [''] }];
    update('experience', JSON.stringify(newList));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newList = [...expList];
    newList[index] = { ...newList[index], [field]: value };
    update('experience', JSON.stringify(newList));
  };

  const removeExperience = (index: number) => {
    update('experience', JSON.stringify(expList.filter((_, i) => i !== index)));
  };

  const addEducation = () => {
    const newList = [...eduList, { school: '', degree: '', field: '', year: '' }];
    update('education', JSON.stringify(newList));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newList = [...eduList];
    newList[index] = { ...newList[index], [field]: value };
    update('education', JSON.stringify(newList));
  };

  const removeEducation = (index: number) => {
    update('education', JSON.stringify(eduList.filter((_, i) => i !== index)));
  };

  const completeness = profile ? [
    profile.fullName, profile.title, profile.email, profile.summary, profile.skills, profile.experience, profile.education
  ].filter(v => v && v.length > 0 && v !== '[]' && v !== '').length / 7 * 100 : 0;

  const tabs = [
    { key: 'basic' as const, label: 'Basic Info' },
    { key: 'summary' as const, label: 'Summary' },
    { key: 'skills' as const, label: 'Skills' },
    { key: 'experience' as const, label: 'Experience' },
    { key: 'education' as const, label: 'Education' },
    { key: 'preferences' as const, label: 'Preferences' },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!profile) return <div className="text-center text-slate-500 py-12">Failed to load profile</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Profile</h2>
          <p className="text-sm text-slate-500">Manage your professional information</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {/* Completeness Bar */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-600">Profile Completeness</span>
          <span className={cn('text-sm font-bold', completeness === 100 ? 'text-emerald-600' : 'text-amber-600')}>{Math.round(completeness)}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full transition-all', completeness === 100 ? 'bg-emerald-500' : 'bg-amber-500')} style={{ width: `${completeness}%` }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={cn('px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
              activeTab === tab.key ? 'bg-[#1e3a5f] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300')}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        {/* Basic Info */}
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', field: 'fullName', type: 'text' },
              { label: 'Title', field: 'title', type: 'text' },
              { label: 'Email', field: 'email', type: 'email' },
              { label: 'Phone', field: 'phone', type: 'text' },
              { label: 'Location', field: 'location', type: 'text' },
              { label: 'Website', field: 'website', type: 'text' },
              { label: 'LinkedIn', field: 'linkedin', type: 'text' },
              { label: 'GitHub', field: 'github', type: 'text' },
            ].map(item => (
              <div key={item.field}>
                <label className="text-xs font-medium text-slate-600 mb-1 block">{item.label}</label>
                <input
                  type={item.type}
                  value={profile[item.field as keyof ProfileData] as string || ''}
                  onChange={e => update(item.field, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                />
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {activeTab === 'summary' && (
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Professional Summary</label>
            <textarea
              rows={8}
              value={profile.summary}
              onChange={e => update('summary', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 resize-none"
              placeholder="Write a compelling professional summary..."
            />
            <p className="text-[10px] text-slate-400 mt-1">{profile.summary.length} characters</p>
          </div>
        )}

        {/* Skills */}
        {activeTab === 'skills' && (
          <div>
            <label className="text-xs font-medium text-slate-600 mb-2 block">Skills</label>
            <div className="flex gap-2 mb-3">
              <input
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder="Type a skill and press Enter"
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
              />
              <button onClick={addSkill} className="px-3 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#1e3a5f]/90 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.split(',').map(s => s.trim()).filter(Boolean).map(skill => (
                <span key={skill} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                </span>
              ))}
              {profile.skills.trim() === '' && <p className="text-xs text-slate-400">No skills added yet</p>}
            </div>
          </div>
        )}

        {/* Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            {expList.map((exp, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative">
                <button onClick={() => removeExperience(i)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-medium text-slate-500 mb-0.5 block">Role</label>
                    <input value={exp.role} onChange={e => updateExperience(i, 'role', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-400" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-500 mb-0.5 block">Company</label>
                    <input value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-400" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-500 mb-0.5 block">Start Date</label>
                    <input value={exp.startDate} onChange={e => updateExperience(i, 'startDate', e.target.value)} placeholder="YYYY-MM" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-400" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-500 mb-0.5 block">End Date</label>
                    <input value={exp.endDate} onChange={e => updateExperience(i, 'endDate', e.target.value)} placeholder="present" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-400" />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addExperience} className="flex items-center gap-2 text-sm text-[#1e3a5f] hover:text-[#1e3a5f]/80 font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
        )}

        {/* Education */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            {eduList.map((edu, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative">
                <button onClick={() => removeEducation(i)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-medium text-slate-500 mb-0.5 block">School</label>
                    <input value={edu.school} onChange={e => updateEducation(i, 'school', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-400" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-500 mb-0.5 block">Degree</label>
                    <input value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-400" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-500 mb-0.5 block">Field</label>
                    <input value={edu.field} onChange={e => updateEducation(i, 'field', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-400" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-500 mb-0.5 block">Year</label>
                    <input value={edu.year} onChange={e => updateEducation(i, 'year', e.target.value)} placeholder="YYYY" className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-400" />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addEducation} className="flex items-center gap-2 text-sm text-[#1e3a5f] hover:text-[#1e3a5f]/80 font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
        )}

        {/* Preferences */}
        {activeTab === 'preferences' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Desired Role</label>
              <input value={profile.desiredRole || ''} onChange={e => update('desiredRole', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Desired Salary</label>
              <input value={profile.desiredSalary || ''} onChange={e => update('desiredSalary', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Desired Location</label>
              <input value={profile.desiredLocation || ''} onChange={e => update('desiredLocation', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Work Preference</label>
              <select value={profile.workPreference} onChange={e => update('workPreference', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white">
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Years of Experience</label>
              <input type="number" value={profile.yearsOfExperience || 0} onChange={e => update('yearsOfExperience', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Notice Period</label>
              <input value={profile.noticePeriod || ''} onChange={e => update('noticePeriod', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function Home() {
  const { activeView } = useNavStore();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="md:ml-64 pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'evaluate' && <EvaluateView />}
          {activeView === 'jobs' && <JobsView />}
          {activeView === 'tracker' && <TrackerView />}
          {activeView === 'resumes' && <ResumesView />}
          {activeView === 'profile' && <ProfileView />}
        </div>
      </main>
    </div>
  );
}
