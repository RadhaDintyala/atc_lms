import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
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
  CircleDashed,
  Award,
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
          api.getProgress(),
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
    setProgress(null);
    setCurriculum(null);
    loadData();
  }, [profile?.id]);

  if (loading || !progress || !curriculum) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#F9C321] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-[#71717A] uppercase tracking-wider">Computing progress metrics...</p>
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

  // Disciplined Yellow-Black-White Pie Chart Colors
  const pieData = [
    { name: 'Completed', value: progress.completedRequiredTopics, color: '#111111' },
    { name: 'In Progress', value: progress.inProgressTopics, color: '#F9C321' },
    { name: 'Pending', value: progress.pendingTopics, color: '#E4E4E7' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E4E7]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
            Academic Progress Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] mt-1">
            Topic completion ratios, cohort milestones, and category mastery breakdown.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FEF9E6] text-[#111111] border border-[#F5D365] text-xs font-bold">
          <Award className="w-4 h-4 text-[#111111]" />
          <span>Curriculum Mastery: {progress.overallPercentage}%</span>
        </div>
      </div>

      {/* Visual Progress Cards & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-xl border border-[#E4E4E7] p-5 shadow-xs">
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider mb-1">Topic Completion Ratio</h3>
          <p className="text-xs text-[#71717A] mb-4">Distribution of assigned curriculum units</p>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
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
                        <div className="bg-[#111111] text-white p-2.5 rounded-lg text-xs shadow-lg font-mono border border-[#2E2E32]">
                          <p className="font-bold">{data.name}</p>
                          <p className="text-[#A1A1AA]">{data.value} topics</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E4E4E7] text-center">
            <div className="p-2 rounded-lg bg-[#111111] text-white">
              <span className="text-[10px] font-bold uppercase block text-[#A1A1AA]">Done</span>
              <span className="font-mono font-bold text-base">{progress.completedRequiredTopics}</span>
            </div>
            <div className="p-2 rounded-lg bg-[#FEF9E6] text-[#111111] border border-[#F5D365]">
              <span className="text-[10px] font-bold uppercase block text-[#111111]">Active</span>
              <span className="font-mono font-bold text-base">{progress.inProgressTopics}</span>
            </div>
            <div className="p-2 rounded-lg bg-[#F4F4F5] text-[#111111] border border-[#E4E4E7]">
              <span className="text-[10px] font-bold uppercase block text-[#71717A]">Pending</span>
              <span className="font-mono font-bold text-base">{progress.pendingTopics}</span>
            </div>
          </div>
        </div>

        {/* Category Completion Bar Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E4E4E7] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1 pb-2 border-b border-[#E4E4E7]">
              <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Category-Wise Completion (%)</h3>
              <span className="text-xs font-mono text-[#111111] font-bold">
                Overall: {progress.overallPercentage}%
              </span>
            </div>
            <p className="text-xs text-[#71717A] mb-4">
              Real-time mastery across each curriculum category
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#71717A' }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#71717A' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#111111] text-white p-2.5 rounded-lg text-xs shadow-xl space-y-1 border border-[#2E2E32]">
                            <p className="font-bold text-[#F9C321]">{data.fullName}</p>
                            <p className="font-mono text-[#A1A1AA]">Completed: {data.completed} / {data.total} topics</p>
                            <p className="font-mono text-white font-bold">{data.percentage}% Completed</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="percentage" radius={[3, 3, 0, 0]}>
                    {categoryChartData.map((entry, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={entry.percentage === 100 ? '#111111' : entry.percentage > 0 ? '#F9C321' : '#E4E4E7'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="text-[11px] text-[#71717A] pt-2 border-t border-[#E4E4E7] flex items-center justify-between">
            <span>Black = 100% completed • Yellow = In progress • Neutral = Not started</span>
          </div>
        </div>
      </div>

      {/* Completed vs Pending Review Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completed Topics */}
        <div className="bg-white rounded-xl border border-[#E4E4E7] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#111111]" />
              <h3 className="font-bold text-[#111111] text-sm uppercase tracking-wider">Completed Milestones</h3>
            </div>
            <span className="text-xs font-mono font-bold text-white bg-[#111111] px-2 py-0.5 rounded">
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
                  className="p-3 rounded-lg border border-[#E4E4E7] bg-white flex items-center justify-between hover:border-[#111111] transition-colors cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-[#111111] truncate">{t.title}</h4>
                    <p className="text-[11px] text-[#71717A] font-mono">
                      Duration: {t.estimated_duration_minutes}m
                    </p>
                  </div>
                  <StatusBadge status="completed" type="topic" />
                </div>
              ))}
          </div>
        </div>

        {/* Pending Topics */}
        <div className="bg-white rounded-xl border border-[#E4E4E7] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2">
              <CircleDashed className="w-4 h-4 text-[#71717A]" />
              <h3 className="font-bold text-[#111111] text-sm uppercase tracking-wider">Pending Work</h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#111111] bg-[#F4F4F5] px-2 py-0.5 rounded border border-[#E4E4E7]">
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
                  className="p-3 rounded-lg border border-[#E4E4E7] bg-white flex items-center justify-between hover:border-[#111111] transition-colors cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-[#111111] truncate">{t.title}</h4>
                    <p className="text-[11px] text-[#71717A] font-mono">
                      Difficulty: {t.difficulty} • {t.estimated_duration_minutes}m
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#111111]">Inspect →</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
