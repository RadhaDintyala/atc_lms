import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import StatCard from '../../components/StatCard.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import {
  CheckCircle2,
  Check,
  Clock,
  CircleDashed,
  FolderGit2,
  ArrowRight,
  ExternalLink,
  Github,
  BookOpen,
  Calendar,
  AlertCircle,
  PlayCircle,
} from 'lucide-react';

export default function StudentDashboard({ onNavigateToTopic, onNavigateTab }) {
  const { user, profile, setShowYearModal } = useAuth();
  const [progress, setProgress] = useState(null);
  const [projects, setProjects] = useState([]);
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState('all'); // 'all' | 'pending' | 'completed'

  const loadDashboardData = async () => {
    if (!profile?.id) return;
    try {
      setLoading(true);
      // Strictly derive data for authenticated user from session token
      const [progData, projData, currData] = await Promise.all([
        api.getProgress(),
        api.getProjects(),
        api.getCurriculum(),
      ]);
      setProgress(progData);
      setProjects(projData || []);
      setCurriculum(currData);
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear previous user's dashboard data on profile change
    setProgress(null);
    setProjects([]);
    setCurriculum(null);
    loadDashboardData();
  }, [profile?.id, profile?.current_year, profile?.track_id]);

  const handleStartModule = async (topicId, currentStatus) => {
    if (currentStatus === 'not_started') {
      try {
        await api.updateTopicStatus(topicId, 'in_progress');
        const updatedProg = await api.getProgress();
        setProgress(updatedProg);
      } catch (err) {
        console.error('Failed to update status to in_progress:', err);
      }
    }
    onNavigateToTopic(topicId);
  };

  if (loading || !progress) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#F9C321] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-[#71717A] uppercase tracking-wider">Loading your engineering roadmap...</p>
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

  // Map of project for each topic
  const projectMap = new Map();
  (projects || []).forEach((p) => {
    if (p.topic_id) {
      projectMap.set(p.topic_id, p);
    }
  });

  // Topics for current Year & Track
  const topicProgressMap = new Map(
    (progress?.topicProgress || []).map((tp) => [tp.topic_id, tp.status])
  );

  const yearTopics = (curriculum?.topics || [])
    .filter(
      (t) =>
        t.year_id === profile?.current_year &&
        (t.track_id === 'common' || t.track_id === profile?.track_id)
    )
    .map((t) => {
      const proj = projectMap.get(t.id);
      const isProjectDone = proj && (proj.status === 'approved' || proj.status === 'submitted');
      const rawStatus = topicProgressMap.get(t.id) || 'not_started';
      const status = isProjectDone ? 'completed' : rawStatus;
      return {
        ...t,
        status,
        project: proj,
      };
    });

  const filteredYearTopics = yearTopics.filter((t) => {
    if (taskFilter === 'pending') return t.status !== 'completed';
    if (taskFilter === 'completed') return t.status === 'completed';
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner - Architectural Solid Dark Surface */}
      <div className="relative rounded-xl bg-[#111111] text-white p-6 sm:p-7 border border-[#262626]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#222222] text-[#F9C321] border border-[#333333] text-xs font-semibold">
                {yearName} • {trackName}
              </span>
              <button
                type="button"
                onClick={() => setShowYearModal(true)}
                className="px-2.5 py-1 rounded-md bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Change Year</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.full_name}!
            </h1>
            <p className="text-xs text-[#A1A1AA]">
              Department of {profile?.department} • Roll No: <span className="font-mono text-[#F9C321] font-bold">{profile?.roll_number}</span>
            </p>
          </div>

          {/* Quick Progress Dial */}
          <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#2E2E32] flex items-center gap-5 shrink-0">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-bold">Overall Completion</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black font-mono text-[#F9C321]">
                  {progress.overallPercentage}%
                </span>
                <span className="text-xs text-[#71717A]">of required</span>
              </div>
              <p className="text-[11px] text-[#A1A1AA] mt-1">
                {progress.completedRequiredTopics} of {progress.totalRequiredTopics} topics done
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Completed Topics"
          value={progress.completedRequiredTopics}
          subtitle={`Out of ${progress.totalRequiredTopics} required topics`}
          icon={CheckCircle2}
          badge={`${progress.overallPercentage}%`}
          badgeColor="dark"
        />
        <StatCard
          title="In Progress"
          value={progress.inProgressTopics}
          subtitle="Currently active topics"
          icon={Clock}
          badge="Active"
          badgeColor="yellow"
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
          badgeColor="neutral"
          onClick={() => onNavigateTab('projects')}
        />
      </div>

      {/* Curriculum Progress Breakdown */}
      <div className="bg-white rounded-xl border border-[#E4E4E7] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E4E4E7]">
          <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
            Curriculum Progress Breakdown
          </h2>
          <span className="text-xs text-[#71717A]">Real-time tracked</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[#FAFAFA] border border-[#E4E4E7]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-[#111111]">1. Common Foundation</span>
              <div className="flex items-center gap-1.5">
                {progress.breakdown?.commonFoundationPercentage === 100 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#111111] text-white">
                    Completed
                  </span>
                )}
                <span className="text-xs font-mono font-bold text-[#111111]">
                  {progress.breakdown?.commonFoundationPercentage || 0}%
                </span>
              </div>
            </div>
            <ProgressBar
              value={progress.breakdown?.commonFoundationPercentage || 0}
              color="yellow"
              showPercentage={false}
              size="md"
            />
            <div className="flex items-center justify-between mt-2.5 text-[11px] text-[#71717A]">
              <span>{progress.breakdown?.commonProjectsCompleted || 0} / {progress.breakdown?.commonProjectsTotal || 5} Projects</span>
              <span className="text-[#111111] font-semibold">GitHub Verified</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#FAFAFA] border border-[#E4E4E7]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-[#111111]">
                2. Specialization ({profile?.track_id === 'ai' ? 'AI Eng.' : 'Full-Stack'})
              </span>
              <div className="flex items-center gap-1.5">
                {progress.breakdown?.trackPercentage === 100 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#111111] text-white">
                    Completed
                  </span>
                )}
                <span className="text-xs font-mono font-bold text-[#111111]">
                  {progress.breakdown?.trackPercentage || 0}%
                </span>
              </div>
            </div>
            <ProgressBar
              value={progress.breakdown?.trackPercentage || 0}
              color="yellow"
              showPercentage={false}
              size="md"
            />
            <div className="flex items-center justify-between mt-2.5 text-[11px] text-[#71717A]">
              <span>{progress.breakdown?.trackProjectsCompleted || 0} / {progress.breakdown?.trackProjectsTotal || 4} Projects</span>
              <span className="text-[#111111] font-semibold">GitHub Verified</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#FAFAFA] border border-[#E4E4E7]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-[#111111]">3. Advanced Capstone</span>
              <span className="text-xs font-mono font-bold text-[#111111]">
                {progress.breakdown?.thirdYearPercentage || 0}%
              </span>
            </div>
            <ProgressBar
              value={progress.breakdown?.thirdYearPercentage || 0}
              color="yellow"
              showPercentage={false}
              size="md"
            />
            <p className="text-[11px] text-[#71717A] mt-2.5">
              Production systems, CI/CD, and portfolio defense
            </p>
          </div>
        </div>
      </div>

      {/* ===================== ASSIGNED YEAR TASKS & COMPLETION CENTER ===================== */}
      <div className="bg-white rounded-xl border border-[#E4E4E7] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-[#E4E4E7]">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[#FEF9E6] text-[#111111] border border-[#F5D365]">
                <BookOpen className="w-4 h-4 text-[#111111]" />
              </div>
              <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
                Assigned Tasks & Learning Roadmap ({yearName})
              </h2>
            </div>
            <p className="text-xs text-[#71717A] mt-1">
              Start modules and submit their associated engineering projects to automatically earn completion status.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-[#F4F4F5] rounded-lg self-start sm:self-center">
            <button
              onClick={() => setTaskFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                taskFilter === 'all'
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#71717A] hover:text-[#111111]'
              }`}
            >
              All ({yearTopics.length})
            </button>
            <button
              onClick={() => setTaskFilter('pending')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                taskFilter === 'pending'
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#71717A] hover:text-[#111111]'
              }`}
            >
              To Do ({yearTopics.filter((t) => t.status !== 'completed').length})
            </button>
            <button
              onClick={() => setTaskFilter('completed')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                taskFilter === 'completed'
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#71717A] hover:text-[#111111]'
              }`}
            >
              Completed ({yearTopics.filter((t) => t.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Task Cards List */}
        {filteredYearTopics.length === 0 ? (
          <div className="p-8 text-center bg-[#FAFAFA] rounded-lg border border-dashed border-[#E4E4E7]">
            <CheckCircle2 className="w-8 h-8 text-[#111111] mx-auto mb-2" />
            <p className="text-xs font-bold text-[#111111]">No tasks match this filter</p>
            <p className="text-[11px] text-[#71717A] mt-0.5">Great job staying on top of your engineering curriculum!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredYearTopics.map((topic) => {
              const isDone = topic.status === 'completed';
              const isInProgress = topic.status === 'in_progress';

              return (
                <div
                  key={topic.id}
                  className={`p-4 rounded-lg border transition-all flex flex-col justify-between ${
                    isDone
                      ? 'bg-white border-[#E4E4E7] border-l-4 border-l-[#111111]'
                      : isInProgress
                      ? 'bg-[#FEF9E6]/30 border-[#E4E4E7] border-l-4 border-l-[#F9C321]'
                      : 'bg-white border-[#E4E4E7] hover:border-[#111111]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#111111]">
                        Topic #{topic.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={topic.difficulty} type="difficulty" />
                        <StatusBadge status={topic.status} type="status" />
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-[#111111] mb-1 leading-snug">
                      {topic.title}
                    </h4>
                    <p className="text-xs text-[#52525B] line-clamp-2 mb-3">
                      {topic.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E4E4E7] gap-2">
                    {isDone ? (
                      <button
                        type="button"
                        onClick={() => onNavigateToTopic(topic.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-[#111111] text-white hover:bg-[#262626] cursor-pointer"
                        title="Project completed. Click to review module."
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Completed</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartModule(topic.id, topic.status)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] cursor-pointer group"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#111111]" />
                        <span>Start Module</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#111111] group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}

                    <div className="flex items-center gap-1.5">
                      {isDone ? (
                        <span className="text-[11px] font-semibold text-[#111111] bg-[#F4F4F5] px-2 py-0.5 rounded border border-[#E4E4E7] flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Project Done</span>
                        </span>
                      ) : topic.project ? (
                        <button
                          type="button"
                          onClick={() => onNavigateTab ? onNavigateTab('projects') : onNavigateToTopic(topic.id)}
                          className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <FolderGit2 className="w-3.5 h-3.5" />
                          <span className="capitalize">{topic.project.status.replace('_', ' ')} Project</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onNavigateTab ? onNavigateTab('projects') : onNavigateToTopic(topic.id)}
                          className="text-xs font-bold text-[#111111] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5 text-[#F9C321]" />
                          <span>Start Project</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Column Grid: Next Milestone & Project Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Next Topic (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E4E4E7] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-[#111111] text-[#F9C321]">
                  <BookOpen className="w-4 h-4 text-[#F9C321]" />
                </div>
                <h3 className="font-bold text-[#111111] text-sm uppercase tracking-wider">Next Recommended Milestone</h3>
              </div>
              <span className="text-[11px] font-bold text-[#111111] bg-[#FEF9E6] px-2.5 py-0.5 rounded border border-[#F5D365]">
                Priority Milestone
              </span>
            </div>

            {nextTopic ? (
              <div className="p-4 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA]">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#111111] font-mono">
                    TOPIC #{nextTopic.id}
                  </span>
                  <StatusBadge status={nextTopic.difficulty} type="difficulty" />
                  <span className="text-xs text-[#71717A]">
                    Est. Duration: {nextTopic.estimated_duration_minutes} mins
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#111111] mb-1.5">
                  {nextTopic.title}
                </h4>
                <p className="text-xs text-[#52525B] mb-3 line-clamp-2">
                  {nextTopic.description}
                </p>

                {nextTopic.learning_objectives && nextTopic.learning_objectives.length > 0 && (
                  <div className="space-y-1 mb-3">
                    <p className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">Key Objectives:</p>
                    <ul className="text-xs text-[#52525B] space-y-1">
                      {nextTopic.learning_objectives.slice(0, 2).map((obj, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#111111]"></span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E4E4E7]">
                  <button
                    onClick={() => onNavigateToTopic(nextTopic.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>Launch Learning Module</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigateTab('learning-path')}
                    className="text-xs font-semibold text-[#111111] hover:underline cursor-pointer"
                  >
                    View in roadmap
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-[#FAFAFA] rounded-lg border border-[#E4E4E7]">
                <CheckCircle2 className="w-8 h-8 text-[#111111] mx-auto mb-2" />
                <h4 className="font-bold text-[#111111]">Curriculum Completed!</h4>
                <p className="text-xs text-[#71717A] mt-1">
                  You have completed all required topics for your current year and track.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-xs text-[#71717A]">
            <span>External resources and projects linked in each topic</span>
            <button
              onClick={() => onNavigateTab('resources')}
              className="text-[#111111] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Browse Resource Library <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Project Submissions Review (1 col) */}
        <div className="bg-white rounded-xl border border-[#E4E4E7] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E4E4E7]">
              <h3 className="font-bold text-[#111111] text-sm uppercase tracking-wider">Project Submissions</h3>
              <button
                onClick={() => onNavigateTab('projects')}
                className="text-xs font-bold text-[#111111] hover:underline cursor-pointer"
              >
                + New Submission
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="p-6 text-center bg-[#FAFAFA] rounded-lg border border-dashed border-[#E4E4E7]">
                <FolderGit2 className="w-8 h-8 text-[#71717A] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#111111]">No project submissions yet</p>
                <p className="text-[11px] text-[#71717A] mt-1">
                  Submit a project to earn mentor review approval and build your portfolio.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {projects.slice(0, 3).map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => onNavigateTab('projects')}
                    className="p-3 rounded-lg border border-[#E4E4E7] hover:border-[#111111] bg-white transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-[#111111] truncate pr-2">
                        {proj.title}
                      </h4>
                      <StatusBadge status={proj.status} type="project" />
                    </div>
                    <p className="text-[11px] text-[#71717A] line-clamp-1 mb-2">
                      {proj.problem_statement}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[#71717A] font-mono">
                      <span>{proj.tech_stack?.slice(0, 2).join(', ')}</span>
                      <span>{proj.submitted_at ? new Date(proj.submitted_at).toLocaleDateString() : 'Draft'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-xs">
            <span className="text-[#71717A]">GitHub:</span>
            {profile?.github_url ? (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[#111111] font-bold hover:underline"
              >
                <Github className="w-3.5 h-3.5" />
                <span>{profile.github_url.replace('https://github.com/', '')}</span>
                <ExternalLink className="w-3 h-3 text-[#71717A]" />
              </a>
            ) : (
              <button
                onClick={() => onNavigateTab('profile')}
                className="text-[#111111] font-bold hover:underline text-xs cursor-pointer"
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
