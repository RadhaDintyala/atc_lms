import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import ProgressBar from '../../components/ProgressBar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
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
import {
  CheckCircle2,
  Clock,
  CircleDashed,
  Award,
  Sparkles,
  BarChart2,
  Calendar,
} from 'lucide-react';

export default function StudentProgress({ onSelectTopic }) {
  const { profile } = useAuth();
  const [progress, setProgress] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!profile?.id) return;
      try {
        setLoading(true);
        const [progData, currData] = await Promise.all([
          api.getProgress(profile.id),
          api.getCurriculum(),
        ]);
        setProgress(progData);
        setCurriculum(currData);
      } catch (err) {
        console.error('Failed to load progress details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [profile?.id]);

  if (loading || !progress || !curriculum) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Computing progress metrics...</p>
        </div>
      </div>
    );
  }

  // Create category completion dataset for Recharts
  const completedTopicIds = new Set(
    progress.topicProgress?.filter((tp) => tp.status === 'completed').map((tp) => tp.topic_id) || []
  );

  const categoryChartData = curriculum.categories.map((cat) => {
    const catTopics = curriculum.topics.filter(
      (t) => t.category_id === cat.id && t.is_applicable !== false
    );
    const completedCount = catTopics.filter((t) => completedTopicIds.has(t.id)).length;
    const totalCount = catTopics.length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      name: cat.name.length > 18 ? cat.name.slice(0, 16) + '...' : cat.name,
      fullName: cat.name,
      completed: completedCount,
      total: totalCount,
      percentage: pct,
    };
  }).filter((c) => c.total > 0);

  // Pie chart data
  const pieData = [
    { name: 'Completed', value: progress.completedRequiredTopics, color: '#10b981' },
    { name: 'In Progress', value: progress.inProgressTopics, color: '#f59e0b' },
    { name: 'Pending', value: progress.pendingTopics, color: '#e2e8f0' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Progress Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Topic completion ratios, cohort milestones, and category mastery breakdown.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
          <Award className="w-4 h-4 text-amber-600" />
          <span>Calculated via (Completed Required / Total Required) × 100</span>
        </div>
      </div>

      {/* Visual Progress Cards & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-2">Topic Completion Ratio</h3>
          <p className="text-xs text-slate-500 mb-4">Distribution of all assigned curriculum units</p>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2 rounded-lg text-xs shadow-lg font-mono">
                          <p className="font-bold">{data.name}</p>
                          <p>{data.value} topics</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
              <span className="text-[10px] font-bold uppercase block">Done</span>
              <span className="font-mono font-bold text-base">{progress.completedRequiredTopics}</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-800">
              <span className="text-[10px] font-bold uppercase block">Active</span>
              <span className="font-mono font-bold text-base">{progress.inProgressTopics}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
              <span className="text-[10px] font-bold uppercase block">Pending</span>
              <span className="font-mono font-bold text-base">{progress.pendingTopics}</span>
            </div>
          </div>
        </div>

        {/* Category Completion Bar Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">Category-Wise Completion (%)</h3>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                Overall: {progress.overallPercentage}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time mastery across each curriculum category
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl space-y-1">
                            <p className="font-bold text-amber-300">{data.fullName}</p>
                            <p className="font-mono">Completed: {data.completed} / {data.total} topics</p>
                            <p className="font-mono text-emerald-400 font-bold">{data.percentage}% Completed</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                    {categoryChartData.map((entry, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={entry.percentage === 100 ? '#10b981' : entry.percentage > 0 ? '#f59e0b' : '#cbd5e1'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Green = 100% completed • Amber = Partially completed • Gray = Not started</span>
          </div>
        </div>
      </div>

      {/* Completed vs Pending Review Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completed Topics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">Completed Milestones</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {progress.completedRequiredTopics} topics
            </span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {curriculum.topics
              .filter((t) => completedTopicIds.has(t.id))
              .map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTopic(t.id)}
                  className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 flex items-center justify-between hover:bg-emerald-50/60 transition-colors cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{t.title}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Duration: {t.estimated_duration_minutes}m
                    </p>
                  </div>
                  <StatusBadge status="completed" type="topic" />
                </div>
              ))}
          </div>
        </div>

        {/* Pending Topics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CircleDashed className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-base">Pending Work</h3>
            </div>
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {progress.pendingTopics + progress.inProgressTopics} topics
            </span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {curriculum.topics
              .filter((t) => !completedTopicIds.has(t.id) && t.is_applicable !== false)
              .map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTopic(t.id)}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:border-amber-300 hover:bg-amber-50/20 transition-colors cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{t.title}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Difficulty: {t.difficulty} • {t.estimated_duration_minutes}m
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Inspect</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
