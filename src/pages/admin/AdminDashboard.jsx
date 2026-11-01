import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import StatCard from '../../components/StatCard.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  TrendingUp,
  UserX,
  FileCheck2,
  Layers,
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
          <div className="w-8 h-8 border-2 border-[#F9C321] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-[#71717A] uppercase tracking-wider">Aggregating cohort intelligence...</p>
        </div>
      </div>
    );
  }

  // Disciplined Yellow-Black-White Cohort Distribution
  const trackDistributionData = [
    { name: 'Common Foundation', value: analytics.byTrack.common || 0, color: '#111111' },
    { name: 'Full-Stack & App Dev', value: analytics.byTrack.fullstack || 0, color: '#F9C321' },
    { name: 'AI Engineering', value: analytics.byTrack.ai || 0, color: '#A1A1AA' },
  ];

  const yearDistributionData = [
    { name: '1st Year', count: analytics.byYear.year_1 || 0 },
    { name: '2nd Year', count: analytics.byYear.year_2 || 0 },
    { name: '3rd Year', count: analytics.byYear.year_3 || 0 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E4E7]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
            Administrator & Mentor Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] mt-1">
            Real-time cohort oversight, topic mastery metrics, pending reviews, and inactive student detection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('admin-curriculum')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] text-xs font-bold transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Manage Courses</span>
          </button>
          <button
            onClick={() => onNavigateTab('admin-resources')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white hover:bg-[#F4F4F5] text-[#111111] text-xs font-bold transition-colors border border-[#E4E4E7] cursor-pointer"
          >
            <span>Update Sources</span>
          </button>
          <button
            onClick={() => onNavigateTab('admin-reviews')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#111111] hover:bg-[#262626] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-[#F9C321]" />
            <span>Reviews ({analytics.pendingProjectReviews})</span>
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
          badge="Cohort"
          badgeColor="neutral"
          onClick={() => onNavigateTab('admin-students')}
        />
        <StatCard
          title="Avg. Completion"
          value={`${analytics.averageCompletion}%`}
          subtitle="Across all engineering tracks"
          icon={TrendingUp}
          badge="Mastery"
          badgeColor="dark"
        />
        <StatCard
          title="Pending Project Reviews"
          value={analytics.pendingProjectReviews}
          subtitle="Submissions awaiting mentor check"
          icon={FolderGit2}
          badge={analytics.pendingProjectReviews > 0 ? 'Action Needed' : 'All Clear'}
          badgeColor={analytics.pendingProjectReviews > 0 ? 'yellow' : 'dark'}
          onClick={() => onNavigateTab('admin-reviews')}
        />
        <StatCard
          title="Inactive Students (>14d)"
          value={analytics.inactiveStudents?.length || 0}
          subtitle="No progress in 14+ days"
          icon={UserX}
          badge={analytics.inactiveStudents?.length > 0 ? 'Flagged' : 'Optimal'}
          badgeColor={analytics.inactiveStudents?.length > 0 ? 'yellow' : 'neutral'}
          onClick={() => onNavigateTab('admin-students')}
        />
      </div>

      {/* Cohort Distribution & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Track Distribution (Pie) */}
        <div className="bg-white rounded-xl border border-[#E4E4E7] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider mb-1">Track Specialization Mix</h3>
            <p className="text-xs text-[#71717A] mb-4">Students enrolled by specialization track</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trackDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
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
                          <div className="bg-[#111111] text-white p-2 rounded-lg text-xs font-mono border border-[#2E2E32]">
                            <p className="font-bold">{d.name}</p>
                            <p className="text-[#A1A1AA]">{d.value} students</p>
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

          <div className="space-y-1.5 pt-3 border-t border-[#E4E4E7] text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#52525B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#111111]"></span>
                Common Foundation (1st Yr)
              </span>
              <span className="font-mono font-bold text-[#111111]">{analytics.byTrack.common || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#52525B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F9C321]"></span>
                Full-Stack & App Dev
              </span>
              <span className="font-mono font-bold text-[#111111]">{analytics.byTrack.fullstack || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#52525B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A1A1AA]"></span>
                AI Engineering
              </span>
              <span className="font-mono font-bold text-[#111111]">{analytics.byTrack.ai || 0}</span>
            </div>
          </div>
        </div>

        {/* Year Distribution (Bar) */}
        <div className="bg-white rounded-xl border border-[#E4E4E7] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider mb-1">Students by Year</h3>
            <p className="text-xs text-[#71717A] mb-4">Enrollment distribution across academic years</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearDistributionData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#71717A' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#71717A' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#111111] text-white p-2 rounded-lg text-xs font-mono border border-[#2E2E32]">
                            <p className="font-bold">{payload[0].payload.name}</p>
                            <p className="text-[#A1A1AA]">{payload[0].value} students</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#111111" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-xs text-[#71717A]">
            <span>Year 1 = Common • Year 2 = Tracks • Year 3 = Capstone</span>
          </div>
        </div>

        {/* Inactive Students Alert Section */}
        <div className="bg-white rounded-xl border border-[#E4E4E7] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#111111]" />
                <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Inactive Students Alert</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FEF9E6] text-[#111111] border border-[#F5D365] font-bold">
                {analytics.inactiveStudents?.length || 0} flagged
              </span>
            </div>
            <p className="text-xs text-[#71717A] mb-3">
              Students without activity for over 14 consecutive days.
            </p>

            {analytics.inactiveStudents?.length === 0 ? (
              <div className="p-4 text-center bg-[#FAFAFA] rounded-lg border border-[#E4E4E7] text-xs text-[#71717A]">
                <CheckCircle2 className="w-6 h-6 text-[#111111] mx-auto mb-1" />
                All students active within the last 14 days!
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {analytics.inactiveStudents.map((st) => (
                  <div
                    key={st.profile_id}
                    className="p-3 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#111111]">{st.full_name}</p>
                      <p className="text-[11px] text-[#71717A] font-mono">
                        {st.roll_number} • Inactive {st.days_inactive}d
                      </p>
                    </div>
                    <span className="text-[#111111] font-bold font-mono text-xs">
                      {st.overall_percentage}% done
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#E4E4E7]">
            <button
              onClick={() => onNavigateTab('admin-students')}
              className="w-full text-center text-xs font-bold text-[#111111] hover:underline cursor-pointer"
            >
              View Full Student Roster &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Topic-Wise Completion & Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic-Wise Completion Stats */}
        <div className="bg-white rounded-xl border border-[#E4E4E7] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E4E4E7]">
            <h3 className="font-bold text-[#111111] text-sm uppercase tracking-wider">Topic-Wise Student Completion</h3>
            <span className="text-xs text-[#71717A] font-mono">Top Topics Sample</span>
          </div>

          <div className="space-y-3">
            {analytics.topicStats?.slice(0, 6).map((topic) => (
              <div key={topic.topic_id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#111111] truncate pr-2">
                    {topic.title}
                  </span>
                  <span className="font-mono text-[#71717A] shrink-0">
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
        <div className="bg-white rounded-xl border border-[#E4E4E7] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E4E4E7]">
            <h3 className="font-bold text-[#111111] text-sm uppercase tracking-wider">Recent Student Activity</h3>
            <span className="text-xs text-[#71717A] font-mono">Live Audit Log</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {analytics.recentActivity?.slice(0, 6).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="font-bold text-[#111111] truncate">
                    {log.student_name}{' '}
                    <span className="text-[10px] text-[#71717A] font-mono font-normal">({log.roll_number})</span>
                  </p>
                  <p className="text-[#52525B] text-[11px] leading-snug">{log.description}</p>
                </div>
                <span className="text-[10px] text-[#71717A] shrink-0 font-mono mt-0.5">
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
