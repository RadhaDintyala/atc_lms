import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import {
  Search,
  BookOpen,
  ArrowRight,
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

  if (loading || !curriculum || !progressData) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#F9C321] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-[#71717A] uppercase tracking-wider">Loading your tailored roadmap...</p>
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
      const matchObj = topic.learning_objectives?.some((o) => o.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchObj) return false;
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

  // Group topics by category
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E4E7]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
            My Learning Path & Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] mt-1">
            Structured roadmap for {profile?.current_year === 'year_1' ? '1st Year' : profile?.current_year === 'year_2' ? '2nd Year' : '3rd Year'} •{' '}
            {profile?.track_id === 'fullstack' ? 'Full-Stack Track' : profile?.track_id === 'ai' ? 'AI Engineering Track' : 'Common Foundation'}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-[#E4E4E7] shadow-xs">
          <div className="text-right">
            <span className="text-[10px] text-[#71717A] font-bold uppercase tracking-wider block">Progress</span>
            <p className="text-xl font-black font-mono text-[#111111] leading-none mt-0.5">
              {progressData.overallPercentage}%
            </p>
          </div>
          <div className="w-24">
            <ProgressBar value={progressData.overallPercentage} showPercentage={false} size="sm" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E4E4E7] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search topics, skills, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-[#111111] placeholder-[#71717A]"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] bg-white text-[#111111]"
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
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] bg-white text-[#111111]"
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
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] bg-white text-[#111111]"
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
          <div className="flex items-center justify-between pt-2 border-t border-[#E4E4E7] text-xs">
            <span className="text-[#71717A]">
              Showing <span className="font-bold text-[#111111]">{filteredTopics.length}</span> matching topics
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setStatusFilter('all');
                difficultyFilter !== 'all' && setDifficultyFilter('all');
              }}
              className="text-[#111111] font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Curriculum Categories & Topic Cards */}
      {categoriesWithTopics.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-[#E4E4E7]">
          <BookOpen className="w-10 h-10 text-[#71717A] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#111111]">No topics match your filters</h3>
          <p className="text-xs text-[#71717A] mt-1 max-w-sm mx-auto">
            Try resetting your search query or status filters to view your engineering path.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {categoriesWithTopics.map((cat, catIdx) => (
            <div key={cat.id} className="space-y-3">
              {/* Category Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7]">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-[#111111] text-[#F9C321] flex items-center justify-center font-bold text-xs">
                    {catIdx + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-[#111111] text-sm uppercase tracking-wider">{cat.name}</h3>
                    <p className="text-xs text-[#71717A]">{cat.description}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold text-[#111111] bg-[#F4F4F5] px-2.5 py-0.5 rounded-md border border-[#E4E4E7]">
                  {cat.topics.length} {cat.topics.length === 1 ? 'topic' : 'topics'}
                </span>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {cat.topics.map((topic) => {
                  const status = topicStatusMap.get(topic.id) || 'not_started';

                  return (
                    <div
                      key={topic.id}
                      className="bg-white rounded-xl border border-[#E4E4E7] p-5 shadow-xs hover:border-[#111111] transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Meta header */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <StatusBadge status={topic.difficulty} type="difficulty" />
                            <span className="text-[11px] text-[#71717A] font-mono">
                              {topic.estimated_duration_minutes}m
                            </span>
                          </div>
                          {/* Status Badge */}
                          <StatusBadge status={status} type="topic" />
                        </div>

                        {/* Title & Description */}
                        <h4
                          onClick={() => onSelectTopic(topic.id)}
                          className="font-bold text-[#111111] text-base mb-1.5 cursor-pointer hover:underline transition-colors"
                        >
                          {topic.title}
                        </h4>
                        <p className="text-xs text-[#52525B] line-clamp-2 mb-3">
                          {topic.description}
                        </p>

                        {/* Objectives preview */}
                        {topic.learning_objectives && topic.learning_objectives.length > 0 && (
                          <div className="space-y-1 mb-4">
                            {topic.learning_objectives.slice(0, 2).map((obj, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#71717A]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1 shrink-0" />
                                <span className="truncate">{obj}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Start / Review Module button */}
                      <div className="pt-3 border-t border-[#E4E4E7] flex items-center justify-between">
                        <span className="text-[11px] text-[#71717A]">
                          {status === 'completed'
                            ? 'Project Completed'
                            : topic.suggested_project
                            ? 'Project Required'
                            : 'Curriculum Unit'}
                        </span>
                        <button
                          onClick={() => onSelectTopic(topic.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            status === 'completed'
                              ? 'bg-[#111111] text-white hover:bg-[#262626]'
                              : 'bg-[#F9C321] text-[#111111] hover:bg-[#E5B01D]'
                          }`}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{status === 'completed' ? 'Review Module' : 'Start Module'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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
