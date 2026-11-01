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
        return <Video className="w-4 h-4 text-[#111111]" />;
      case 'Course':
        return <GraduationCap className="w-4 h-4 text-[#111111]" />;
      case 'Repository':
        return <Code className="w-4 h-4 text-[#111111]" />;
      default:
        return <FileText className="w-4 h-4 text-[#111111]" />;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E4E7]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
            Learning Resources Library
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] mt-1">
            Documentation, official tutorials, interactive courses, and repositories across all engineering tracks.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FEF9E6] text-[#111111] border border-[#F5D365] text-xs font-medium">
          <Info className="w-4 h-4 text-[#111111] shrink-0" />
          <span>Opening links does not auto-complete resources. Click checkbox to track.</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E4E4E7] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search resources, topics, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-[#111111] placeholder-[#71717A]"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] bg-white text-[#111111]"
            >
              <option value="all">All Content Types</option>
              <option value="Documentation">Documentation</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Video">Video Course</option>
              <option value="Repository">Repository / Code</option>
              <option value="Course">Full Course</option>
            </select>
          </div>

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

          <div>
            <select
              value={completionFilter}
              onChange={(e) => setCompletionFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] bg-white text-[#111111]"
            >
              <option value="all">All Statuses</option>
              <option value="uncompleted">To Study (Pending)</option>
              <option value="completed">Completed by Me</option>
            </select>
          </div>
        </div>

        {(searchQuery || typeFilter !== 'all' || difficultyFilter !== 'all' || completionFilter !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-[#E4E4E7] text-xs">
            <span className="text-[#71717A]">
              Showing <span className="font-bold text-[#111111]">{filteredResources.length}</span> matching resources
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setDifficultyFilter('all');
                setCompletionFilter('all');
              }}
              className="text-[#111111] font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Resources Table/Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#71717A] flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-[#F9C321] border-t-transparent rounded-full animate-spin" />
          <span>Loading resources library...</span>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-[#E4E4E7]">
          <BookOpen className="w-10 h-10 text-[#71717A] mx-auto mb-3" />
          <p className="text-sm font-bold text-[#111111]">No resources found</p>
          <p className="text-xs text-[#71717A] mt-1">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredResources.map((res) => {
            const isCompleted = resourceProgressMap.get(res.id) === 'completed';
            const isUpdating = updatingId === res.id;

            return (
              <div
                key={res.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-[#FAFAFA] border-[#E4E4E7] border-l-4 border-l-[#111111]'
                    : 'bg-white border-[#E4E4E7] hover:border-[#111111] shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111]">
                        {getResourceIcon(res.type)}
                        {res.type}
                      </span>
                      <StatusBadge status={res.difficulty} type="difficulty" />
                      <span className="text-[11px] text-[#71717A] font-mono">
                        {res.duration_minutes}m
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleResource(res.id)}
                      disabled={isUpdating}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-[#111111] border-[#111111] text-white'
                          : 'border-[#D4D4D8] bg-white hover:border-[#111111]'
                      }`}
                      title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-[#111111] mb-1 leading-snug">
                    {res.title}
                  </h3>
                  <p className="text-xs text-[#52525B] line-clamp-2 mb-3">
                    {res.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E4E4E7] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {res.is_sample && (
                      <span className="text-[10px] text-[#111111] bg-[#FEF9E6] px-2 py-0.5 rounded font-mono border border-[#F5D365]">
                        Sample Link
                      </span>
                    )}
                  </div>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4E4E7] bg-white hover:bg-[#F4F4F5] text-[#111111] text-xs font-bold transition-colors"
                  >
                    <span>Launch Resource</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#71717A]" />
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
