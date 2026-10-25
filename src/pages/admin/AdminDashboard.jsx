import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import StatCard from '../../components/StatCard.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  TrendingUp,
  Clock,
  Layers,
  ArrowRight,
  UserX,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export default function AdminDashboard({ onNavigateTab }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const data = await api.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Aggregating cohort intelligence...</p>
        </div>
      </div>
    );
  }

  const trackDistributionData = [
    { name: 'Common Foundation', value: analytics.byTrack.common || 0, color: '#ca8a04' },
    { name: 'Full-Stack & App Dev', value: analytics.byTrack.fullstack || 0, color: '#3b82f6' },
    { name: 'AI Engineering', value: analytics.byTrack.ai || 0, color: '#8b5cf6' },
  ];

  const yearDistributionData = [
    { name: '1st Year', count: analytics.byYear.year_1 || 0 },
    { name: '2nd Year', count: analytics.byYear.year_2 || 0 },
    { name: '3rd Year', count: analytics.byYear.year_3 || 0 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Administrator & Mentor Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time cohort oversight, topic mastery metrics, pending reviews, and early inactive student detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('admin-reviews')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold transition-all shadow-xs"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Pending Reviews ({analytics.pendingProjectReviews})</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered"
          value={analytics.totalStudents}
          subtitle={`${analytics.activeStudents} active student accounts`}
          icon={Users}
          badge="Cohort Roster"
          badgeColor="slate"
          onClick={() => onNavigateTab('admin-students')}
        />
        <StatCard
          title="Avg. Curriculum Completion"
          value={`${analytics.averageCompletion}%`}
          subtitle="Across all engineering tracks"
          icon={TrendingUp}
          badge="Mastery"
          badgeColor="emerald"
        />
        <StatCard
          title="Pending Project Reviews"
          value={analytics.pendingProjectReviews}
          subtitle="Submissions awaiting mentor check"
          icon={FolderGit2}
          badge={analytics.pendingProjectReviews > 0 ? 'Action Required' : 'All Clear'}
          badgeColor={analytics.pendingProjectReviews > 0 ? 'amber' : 'emerald'}
          onClick={() => onNavigateTab('admin-reviews')}
        />
        <StatCard
          title="Inactive Students (>14d)"
          value={analytics.inactiveStudents?.length || 0}
          subtitle="No progress update in 14+ days"
          icon={UserX}
          badge={analytics.inactiveStudents?.length > 0 ? 'Follow-up' : 'Optimal'}
          badgeColor={analytics.inactiveStudents?.length > 0 ? 'rose' : 'slate'}
          onClick={() => onNavigateTab('admin-students')}
        />
      </div>

      {/* Cohort Distribution & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Track Distribution (Pie) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Track Specialization Mix</h3>
            <p className="text-xs text-slate-500 mb-4">Students enrolled by specialization track</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trackDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {trackDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2 rounded-lg text-xs shadow-lg font-mono">
                            <p className="font-bold">{d.name}</p>
                            <p>{d.value} students</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Common Foundation (1st Yr)
              </span>
              <span className="font-mono font-bold text-slate-800">{analytics.byTrack.common || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                Full-Stack & App Dev
              </span>
              <span className="font-mono font-bold text-slate-800">{analytics.byTrack.fullstack || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                AI Engineering
              </span>
              <span className="font-mono font-bold text-slate-800">{analytics.byTrack.ai || 0}</span>
            </div>
          </div>
        </div>

        {/* Year Distribution (Bar) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Students by Engineering Year</h3>
            <p className="text-xs text-slate-500 mb-4">Enrollment distribution across 1st, 2nd, and 3rd year</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearDistributionData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-2 rounded-lg text-xs font-mono">
                            <p className="font-bold">{payload[0].payload.name}</p>
                            <p>{payload[0].value} students</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#ca8a04" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Year 1 = Common • Year 2 = Tracks • Year 3 = Capstone</span>
          </div>
        </div>

        {/* Inactive Students Alert Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">Inactive Students Alert</h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {analytics.inactiveStudents?.length || 0} flagged
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Students with no topic or project updates for over 14 consecutive days.
            </p>

            {analytics.inactiveStudents?.length === 0 ? (
              <div className="p-4 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                All students active within the last 14 days!
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {analytics.inactiveStudents.map((st) => (
                  <div
                    key={st.profile_id}
                    className="p-3 rounded-xl border border-rose-100 bg-rose-50/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{st.full_name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {st.roll_number} • Last active {st.days_inactive}d ago
                      </p>
                    </div>
                    <span className="text-rose-700 font-bold font-mono text-xs">
                      {st.overall_percentage}% done
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('admin-students')}
              className="w-full text-center text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              View Full Student Roster &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Topic-Wise Completion & Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic-Wise Completion Stats */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Topic-Wise Student Completion</h3>
            <span className="text-xs text-slate-500 font-mono">Top Topics Sample</span>
          </div>

          <div className="space-y-3">
            {analytics.topicStats?.slice(0, 6).map((topic) => (
              <div key={topic.topic_id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 truncate pr-2">
                    {topic.title}
                  </span>
                  <span className="font-mono text-slate-500 shrink-0">
                    {topic.completed_count} / {analytics.totalStudents} completed
                  </span>
                </div>
                <ProgressBar
                  value={topic.completed_count}
                  max={analytics.totalStudents}
                  showPercentage={false}
                  size="sm"
                  color="yellow"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Student Activity Stream */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Recent Student Activity</h3>
            <span className="text-xs text-slate-500 font-mono">Live Audit Log</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {analytics.recentActivity?.slice(0, 6).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {log.student_name}{' '}
                    <span className="text-[10px] text-slate-400 font-mono">({log.roll_number})</span>
                  </p>
                  <p className="text-slate-600 text-[11px] leading-snug">{log.description}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono mt-0.5">
                  {new Date(log.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
