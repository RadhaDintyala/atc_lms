import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import StatCard from '../../components/StatCard.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import {
  CheckCircle2,
  Clock,
  CircleDashed,
  FolderGit2,
  ArrowRight,
  ExternalLink,
  Github,
  Sparkles,
  BookOpen,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function StudentDashboard({ onNavigateToTopic, onNavigateTab }) {
  const { user, profile } = useAuth();
  const [progress, setProgress] = useState(null);
  const [projects, setProjects] = useState([]);
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!profile?.id) return;
      try {
        setLoading(true);
        const [progData, projData, currData] = await Promise.all([
          api.getProgress(profile.id),
          api.getProjects({ student_id: profile.id }),
          api.getCurriculum(),
        ]);
        setProgress(progData);
        setProjects(projData);
        setCurriculum(currData);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [profile?.id]);

  if (loading || !progress) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Loading your engineering roadmap...</p>
        </div>
      </div>
    );
  }

  const nextTopic = progress.nextRecommendedTopic;
  const yearName =
    profile?.current_year === 'year_1'
      ? '1st Year Foundation'
      : profile?.current_year === 'year_2'
      ? '2nd Year Specialization'
      : '3rd Year Capstone';

  const trackName =
    profile?.track_id === 'fullstack'
      ? 'Full-Stack & Application Development'
      : profile?.track_id === 'ai'
      ? 'AI Engineering'
      : 'Common Foundation';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              {yearName} • {trackName}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.full_name}!
            </h1>
            <p className="text-sm text-slate-300">
              Department of {profile?.department} • Roll No: <span className="font-mono text-amber-300 font-semibold">{profile?.roll_number}</span>
            </p>
          </div>

          {/* Quick Progress Dial */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex items-center gap-5 shrink-0">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Overall Completion</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black font-mono text-amber-400">
                  {progress.overallPercentage}%
                </span>
                <span className="text-xs text-slate-400">of required</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                {progress.completedRequiredTopics} of {progress.totalRequiredTopics} topics done
              </p>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Completed Topics"
          value={progress.completedRequiredTopics}
          subtitle={`Out of ${progress.totalRequiredTopics} required topics`}
          icon={CheckCircle2}
          badge={`${progress.overallPercentage}%`}
          badgeColor="emerald"
        />
        <StatCard
          title="In Progress"
          value={progress.inProgressTopics}
          subtitle="Currently active topics"
          icon={Clock}
          badge="Active"
          badgeColor="amber"
        />
        <StatCard
          title="Pending Topics"
          value={progress.pendingTopics}
          subtitle="Awaiting start in path"
          icon={CircleDashed}
          badge="Remaining"
          badgeColor="slate"
        />
        <StatCard
          title="Projects Submitted"
          value={projects.length}
          subtitle={`${projects.filter((p) => p.status === 'approved').length} approved by mentors`}
          icon={FolderGit2}
          badge={projects.some((p) => p.status === 'submitted') ? 'Review Pending' : 'Portfolio'}
          badgeColor="cyan"
          onClick={() => onNavigateTab('projects')}
        />
      </div>

      {/* Curriculum Progress Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span>Curriculum Progress Breakdown</span>
          <span className="text-xs font-normal text-slate-500">Recalculated in real-time</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-700">1. Common Foundation</span>
              <span className="text-xs font-mono font-bold text-slate-900">
                {progress.breakdown?.commonFoundationPercentage || 0}%
              </span>
            </div>
            <ProgressBar
              value={progress.breakdown?.commonFoundationPercentage || 0}
              color="yellow"
              showPercentage={false}
              size="md"
            />
            <p className="text-[11px] text-slate-500 mt-2">
              Programming, Web, Git, Prompt Engineering & API Basics
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-700">
                2. Specialization Track ({profile?.track_id === 'ai' ? 'AI Eng.' : 'Full-Stack'})
              </span>
              <span className="text-xs font-mono font-bold text-slate-900">
                {progress.breakdown?.trackPercentage || 0}%
              </span>
            </div>
            <ProgressBar
              value={progress.breakdown?.trackPercentage || 0}
              color="cyan"
              showPercentage={false}
              size="md"
            />
            <p className="text-[11px] text-slate-500 mt-2">
              Core 2nd-year specialization curriculum
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-700">3. Advanced Capstone</span>
              <span className="text-xs font-mono font-bold text-slate-900">
                {progress.breakdown?.thirdYearPercentage || 0}%
              </span>
            </div>
            <ProgressBar
              value={progress.breakdown?.thirdYearPercentage || 0}
              color="blue"
              showPercentage={false}
              size="md"
            />
            <p className="text-[11px] text-slate-500 mt-2">
              Architecture, system design, and deployment capstone
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Next Milestone & Project Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Next Topic (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Next Recommended Milestone</h3>
              </div>
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Highest Priority
              </span>
            </div>

            {nextTopic ? (
              <div className="p-5 rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-amber-900 font-mono">
                    TOPIC #{nextTopic.id}
                  </span>
                  <StatusBadge status={nextTopic.difficulty} type="difficulty" />
                  <span className="text-xs text-slate-500">
                    Est. Duration: {nextTopic.estimated_duration_minutes} mins
                  </span>
                </div>

                <h4 className="text-lg font-bold text-slate-900 mb-2">
                  {nextTopic.title}
                </h4>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {nextTopic.description}
                </p>

                {nextTopic.learning_objectives && nextTopic.learning_objectives.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    <p className="text-xs font-semibold text-slate-700">Key Objectives:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {nextTopic.learning_objectives.slice(0, 2).map((obj, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-amber-100">
                  <button
                    onClick={() => onNavigateToTopic(nextTopic.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold transition-all shadow-xs"
                  >
                    <span>Launch Learning Module</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigateTab('learning-path')}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 underline"
                  >
                    View in roadmap
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900">Curriculum Completed!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  You have completed all required topics for your current year and track.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>External resources and projects linked in each topic</span>
            <button
              onClick={() => onNavigateTab('resources')}
              className="text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1"
            >
              Browse Resource Library <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Project Submissions Review (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">Project Submissions</h3>
              <button
                onClick={() => onNavigateTab('projects')}
                className="text-xs font-semibold text-amber-700 hover:underline"
              >
                + New Submission
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">No project submissions yet</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Submit a project to earn mentor review approval and build your portfolio.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 3).map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => onNavigateTab('projects')}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate pr-2">
                        {proj.title}
                      </h4>
                      <StatusBadge status={proj.status} type="project" />
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                      {proj.problem_statement}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{proj.tech_stack?.slice(0, 2).join(', ')}</span>
                      <span>{proj.submitted_at ? new Date(proj.submitted_at).toLocaleDateString() : 'Draft'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">GitHub:</span>
            {profile?.github_url ? (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-slate-800 hover:text-slate-950 hover:underline"
              >
                <Github className="w-3.5 h-3.5" />
                {profile.github_url.replace('https://github.com/', '')}
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            ) : (
              <button
                onClick={() => onNavigateTab('profile')}
                className="text-amber-700 hover:underline text-xs"
              >
                + Link GitHub Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
