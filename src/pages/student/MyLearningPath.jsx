import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  CircleDashed,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function MyLearningPath({ onSelectTopic }) {
  const { profile } = useAuth();
  const [curriculum, setCurriculum] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Updating status indicator
  const [updatingTopicId, setUpdatingTopicId] = useState(null);

  const fetchData = async () => {
    if (!profile?.id) return;
    try {
      setLoading(true);
      const [curr, prog] = await Promise.all([
        api.getCurriculum(),
        api.getProgress(profile.id),
      ]);
      setCurriculum(curr);
      setProgressData(prog);
    } catch (err) {
      console.error('Failed to load curriculum:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile?.id]);

  const handleStatusChange = async (topicId, newStatus) => {
    try {
      setUpdatingTopicId(topicId);
      const res = await api.updateTopicStatus(topicId, newStatus);
      // Update local state smoothly
      setProgressData((prev) => ({
        ...prev,
        ...res.progress,
        topicProgress: [
          ...prev.topicProgress.filter((p) => p.topic_id !== topicId),
          res.record,
        ],
      }));
    } catch (err) {
      alert(`Error updating topic status: ${err.message}`);
    } finally {
      setUpdatingTopicId(null);
    }
  };

  if (loading || !curriculum || !progressData) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Loading your tailored roadmap...</p>
        </div>
      </div>
    );
  }

  // Get topic progress status map
  const topicStatusMap = new Map();
  progressData.topicProgress?.forEach((tp) => {
    topicStatusMap.set(tp.topic_id, tp.status);
  });

  // Filter topics
  const applicableTopics = curriculum.topics.filter((t) => t.is_applicable !== false);

  const filteredTopics = applicableTopics.filter((topic) => {
    const status = topicStatusMap.get(topic.id) || 'not_started';

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = topic.title.toLowerCase().includes(q);
      const matchDesc = topic.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && topic.category_id !== selectedCategory) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && status !== statusFilter) {
      return false;
    }

    // Difficulty filter
    if (difficultyFilter !== 'all' && topic.difficulty !== difficultyFilter) {
      return false;
    }

    return true;
  });

  // Group filtered topics by category
  const categoriesWithTopics = curriculum.categories
    .map((cat) => {
      const catTopics = filteredTopics.filter((t) => t.category_id === cat.id);
      return {
        ...cat,
        topics: catTopics,
      };
    })
    .filter((cat) => cat.topics.length > 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Overall Metric */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Learning Path & Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Structured roadmap for {profile?.current_year === 'year_1' ? '1st Year' : profile?.current_year === 'year_2' ? '2nd Year' : '3rd Year'} •{' '}
            {profile?.track_id === 'fullstack' ? 'Full-Stack Track' : profile?.track_id === 'ai' ? 'AI Engineering Track' : 'Common Foundation'}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-right">
            <span className="text-xs text-slate-500 font-semibold uppercase">Progress</span>
            <p className="text-lg font-bold font-mono text-amber-500 leading-none">
              {progressData.overallPercentage}%
            </p>
          </div>
          <div className="w-28">
            <ProgressBar value={progressData.overallPercentage} showPercentage={false} size="sm" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search topics, skills, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 bg-white"
            >
              <option value="all">All Curriculum Categories</option>
              {curriculum.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 bg-white"
            >
              <option value="all">All Progress Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 bg-white"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips / Clear */}
        {(searchQuery || selectedCategory !== 'all' || statusFilter !== 'all' || difficultyFilter !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Showing <span className="font-bold text-slate-800">{filteredTopics.length}</span> matching topics
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setStatusFilter('all');
                setDifficultyFilter('all');
              }}
              className="text-amber-700 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Curriculum Categories & Topic Cards */}
      {categoriesWithTopics.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No topics match your filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try resetting your search query or status filters to view your engineering path.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {categoriesWithTopics.map((cat, catIdx) => (
            <div key={cat.id} className="space-y-3">
              {/* Category Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-xs">
                    {catIdx + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{cat.name}</h3>
                    <p className="text-xs text-slate-500">{cat.description}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  {cat.topics.length} {cat.topics.length === 1 ? 'topic' : 'topics'}
                </span>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.topics.map((topic) => {
                  const status = topicStatusMap.get(topic.id) || 'not_started';
                  const isUpdating = updatingTopicId === topic.id;

                  return (
                    <div
                      key={topic.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Meta header */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <StatusBadge status={topic.difficulty} type="difficulty" />
                            <span className="text-[11px] text-slate-400 font-mono">
                              {topic.estimated_duration_minutes}m
                            </span>
                          </div>
                          {/* Status Dropdown Selector */}
                          <div className="relative">
                            <select
                              value={status}
                              disabled={isUpdating}
                              onChange={(e) => handleStatusChange(topic.id, e.target.value)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border appearance-none pr-6 cursor-pointer focus:outline-hidden transition-all ${
                                status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : status === 'in_progress'
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <option value="not_started">Not Started</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h4
                          onClick={() => onSelectTopic(topic.id)}
                          className="font-bold text-slate-900 text-base mb-1.5 cursor-pointer hover:text-amber-600 transition-colors"
                        >
                          {topic.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                          {topic.description}
                        </p>

                        {/* Objectives preview */}
                        {topic.learning_objectives && topic.learning_objectives.length > 0 && (
                          <div className="space-y-1 mb-4">
                            {topic.learning_objectives.slice(0, 2).map((obj, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1 shrink-0" />
                                <span className="truncate">{obj}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Detail view button */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          {topic.suggested_project ? 'Has Associated Project' : 'Curriculum Unit'}
                        </span>
                        <button
                          onClick={() => onSelectTopic(topic.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-amber-600 transition-colors group-hover:translate-x-0.5"
                        >
                          <span>Explore Topic & Resources</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
