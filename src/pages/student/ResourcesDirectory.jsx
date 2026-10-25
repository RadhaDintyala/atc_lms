import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import {
  Search,
  BookOpen,
  ExternalLink,
  Check,
  FileText,
  Video,
  Code,
  GraduationCap,
  Sparkles,
  Info,
} from 'lucide-react';

export default function ResourcesDirectory() {
  const { profile } = useAuth();
  const [resources, setResources] = useState([]);
  const [resourceProgressMap, setResourceProgressMap] = useState(new Map());
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [completionFilter, setCompletionFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function loadResources() {
      try {
        setLoading(true);
        const [resList, progData] = await Promise.all([
          api.getResources(),
          profile?.id ? api.getProgress(profile.id) : null,
        ]);
        setResources(resList || []);

        if (progData) {
          const rMap = new Map();
          progData.resourceProgress?.forEach((rp) => {
            rMap.set(rp.resource_id, rp.status);
          });
          setResourceProgressMap(rMap);
        }
      } catch (err) {
        console.error('Failed to load resources:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResources();
  }, [profile?.id]);

  const handleToggleResource = async (resId) => {
    const current = resourceProgressMap.get(resId) || 'not_started';
    const newStatus = current === 'completed' ? 'not_started' : 'completed';

    try {
      setUpdatingId(resId);
      await api.updateResourceStatus(resId, newStatus);
      setResourceProgressMap((prev) => {
        const next = new Map(prev);
        next.set(resId, newStatus);
        return next;
      });
    } catch (err) {
      alert(`Error updating resource status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'Video':
        return <Video className="w-4 h-4 text-rose-500" />;
      case 'Course':
        return <GraduationCap className="w-4 h-4 text-purple-500" />;
      case 'Repository':
        return <Code className="w-4 h-4 text-emerald-500" />;
      default:
        return <FileText className="w-4 h-4 text-blue-500" />;
    }
  };

  const filteredResources = resources.filter((res) => {
    const isCompleted = resourceProgressMap.get(res.id) === 'completed';

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        res.title.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.url.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (typeFilter !== 'all' && res.type !== typeFilter) return false;
    if (difficultyFilter !== 'all' && res.difficulty !== difficultyFilter) return false;

    if (completionFilter === 'completed' && !isCompleted) return false;
    if (completionFilter === 'uncompleted' && isCompleted) return false;

    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Learning Resources Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Documentation, official tutorials, interactive courses, and repositories across all engineering tracks.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Opening links does not auto-complete resources. Click checkbox to track.</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search resources, topics, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 bg-white"
            >
              <option value="all">All Resource Types</option>
              <option value="Documentation">Documentation</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Course">Course</option>
              <option value="Video">Video</option>
              <option value="Repository">Repository</option>
              <option value="Practice">Practice</option>
            </select>
          </div>

          <div>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 bg-white"
            >
              <option value="all">All Difficulty Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <select
              value={completionFilter}
              onChange={(e) => setCompletionFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed Only</option>
              <option value="uncompleted">Uncompleted Only</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            Showing <span className="font-bold text-slate-800">{filteredResources.length}</span> resources
          </span>
          {(searchQuery || typeFilter !== 'all' || difficultyFilter !== 'all' || completionFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setDifficultyFilter('all');
                setCompletionFilter('all');
              }}
              className="text-amber-700 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Resources Table/Grid */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading resources library...</div>
      ) : filteredResources.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-800">No resources found</p>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((res) => {
            const isCompleted = resourceProgressMap.get(res.id) === 'completed';
            const isUpdating = updatingId === res.id;

            return (
              <div
                key={res.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-emerald-50/30 border-emerald-200'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        {getResourceIcon(res.type)}
                        {res.type}
                      </span>
                      <StatusBadge status={res.difficulty} type="difficulty" />
                      <span className="text-[11px] text-slate-400 font-mono">
                        {res.duration_minutes}m
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleResource(res.id)}
                      disabled={isUpdating}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white hover:border-amber-500'
                      }`}
                      title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                    {res.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {res.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {res.is_sample && (
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
                        Sample Link
                      </span>
                    )}
                  </div>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <span>Launch Resource</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
