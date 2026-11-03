import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  ExternalLink,
  FolderGit2,
  FileText,
  Video,
  Code,
  GraduationCap,
  Check,
  PlayCircle,
} from 'lucide-react';
import { getProjectByTopicId } from '../../data/projectCatalog.js';

export default function TopicDetailPage({ topicId, onBack, onOpenProjectModal }) {
  const { profile } = useAuth();
  const [topic, setTopic] = useState(null);
  const [resources, setResources] = useState([]);
  const [resourceProgressMap, setResourceProgressMap] = useState(new Map());
  const [topicStatus, setTopicStatus] = useState('not_started');
  const [loading, setLoading] = useState(true);
  const [updatingResource, setUpdatingResource] = useState(null);

  useEffect(() => {
    async function loadTopic() {
      if (!topicId) return;
      try {
        setLoading(true);
        const [topicData, resList, progData] = await Promise.all([
          api.getTopic(topicId),
          api.getResources(topicId),
          api.getProgress().catch(() => null),
        ]);
        setTopic(topicData);
        setResources(resList || []);

        if (progData) {
          const tp = progData.topicProgress?.find((p) => p.topic_id === topicId);
          if (tp) setTopicStatus(tp.status);

          const rMap = new Map();
          progData.resourceProgress?.forEach((rp) => {
            rMap.set(rp.resource_id, rp.status);
          });
          setResourceProgressMap(rMap);
        }
      } catch (err) {
        console.error('Failed to load topic details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTopic();
  }, [topicId, profile?.id]);

  const handleToggleResource = async (resId) => {
    const current = resourceProgressMap.get(resId) || 'not_started';
    const newStatus = current === 'completed' ? 'not_started' : 'completed';

    try {
      setUpdatingResource(resId);
      await api.updateResourceStatus(resId, newStatus);
      setResourceProgressMap((prev) => {
        const next = new Map(prev);
        next.set(resId, newStatus);
        return next;
      });
    } catch (err) {
      alert(`Error updating resource: ${err.message}`);
    } finally {
      setUpdatingResource(null);
    }
  };

  if (loading || !topic) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#F9C321] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-[#71717A] uppercase tracking-wider">Loading topic specification...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#111111] hover:underline transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Curriculum Roadmap</span>
      </button>

      {/* Main Topic Header Card */}
      <div className="bg-white rounded-xl border border-[#E4E4E7] p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-[#111111] bg-[#F4F4F5] px-2.5 py-0.5 rounded-md border border-[#E4E4E7]">
                {topic.category?.name || 'Curriculum Module'}
              </span>
              <StatusBadge status={topic.difficulty} type="difficulty" />
              <span className="text-xs text-[#71717A] flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                {topic.estimated_duration_minutes} minutes
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
              {topic.title}
            </h1>
          </div>

          {/* Status Display */}
          <div className="flex items-center gap-2 bg-[#FAFAFA] p-2.5 rounded-lg border border-[#E4E4E7] self-start shrink-0">
            <span className="text-xs font-bold text-[#71717A] pl-1">Status:</span>
            <StatusBadge status={topicStatus} type="topic" className="text-xs px-2.5 py-1 font-bold" />
            {topicStatus !== 'completed' && (
              <span className="text-[11px] text-[#111111] bg-[#FEF9E6] border border-[#F5D365] px-2 py-0.5 rounded font-semibold">
                Project Required
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="text-xs sm:text-sm text-[#111111] leading-relaxed bg-[#FAFAFA] p-4 rounded-lg border border-[#E4E4E7]">
          <p>{topic.description}</p>
        </div>

        {/* Learning Objectives Checklist */}
        {topic.learning_objectives && topic.learning_objectives.length > 0 && (
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] mb-3">
              Learning Objectives & Practical Competencies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {topic.learning_objectives.map((obj, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-[#E4E4E7]"
                >
                  <div className="mt-0.5 p-0.5 rounded bg-[#111111] text-white shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-xs font-semibold text-[#111111] leading-snug">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Associated Project Task Section (Only rendered if topic has an associated practical project) */}
      {topic && getProjectByTopicId(topic.id) && !['top-001', 'top-002', 'top-006'].includes(topic.id) && (() => {
        const projectSpec = getProjectByTopicId(topic.id);
        return (
          <div className="bg-[#111111] text-white rounded-xl border border-[#262626] p-6 sm:p-7 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#222222] border border-[#333333] text-[#F9C321] font-mono text-[11px] font-bold uppercase tracking-wider">
                    <FolderGit2 className="w-3.5 h-3.5" />
                    Mandatory Curriculum Project
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#222222] text-[#A1A1AA] border border-[#333333] text-xs font-mono">
                    Difficulty: {projectSpec.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {projectSpec.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                  {projectSpec.short_summary || (typeof projectSpec.overview === 'string' ? projectSpec.overview.slice(0, 220) + '...' : '')}
                </p>
                {projectSpec.tech_stack && projectSpec.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {projectSpec.tech_stack.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1C1C1E] text-[#F9C321] border border-[#2E2E32]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                <button
                  onClick={() => onOpenProjectModal(topic)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] text-xs font-bold transition-colors cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4 text-[#111111]" />
                  <span>Start Project</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Learning Resources List */}
      <div className="bg-white rounded-xl border border-[#E4E4E7] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
          <div>
            <h3 className="text-base font-bold text-[#111111] uppercase tracking-wider">Curated Learning Resources</h3>
            <p className="text-xs text-[#71717A] mt-0.5">
              Check off resources as you complete them to track mastery. Opening links does not auto-complete.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-[#111111] bg-[#F4F4F5] px-2.5 py-1 rounded-md border border-[#E4E4E7]">
            {resources.length} {resources.length === 1 ? 'Resource' : 'Resources'}
          </span>
        </div>

        {resources.length === 0 ? (
          <div className="p-8 text-center bg-[#FAFAFA] rounded-lg border border-dashed border-[#E4E4E7]">
            <BookOpen className="w-8 h-8 text-[#71717A] mx-auto mb-2" />
            <p className="text-xs text-[#71717A]">No resources attached to this topic yet.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {resources.map((res) => {
              const resStatus = resourceProgressMap.get(res.id) || 'not_started';
              const isCompleted = resStatus === 'completed';
              const isUpdating = updatingResource === res.id;

              return (
                <div
                  key={res.id}
                  className={`p-3.5 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                    isCompleted
                      ? 'bg-[#FAFAFA] border-[#E4E4E7] border-l-4 border-l-[#111111]'
                      : 'bg-white border-[#E4E4E7] hover:border-[#111111]'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleResource(res.id)}
                      disabled={isUpdating}
                      className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                        isCompleted
                          ? 'bg-[#111111] border-[#111111] text-white'
                          : 'border-[#D4D4D8] hover:border-[#111111] bg-white'
                      }`}
                      title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#111111]">
                          {getResourceIcon(res.type)}
                          {res.type}
                        </span>
                        <StatusBadge status={res.difficulty} type="difficulty" />
                        <span className="text-[11px] text-[#71717A] font-mono">
                          {res.duration_minutes}m
                        </span>
                        {res.is_sample && (
                          <span className="text-[10px] text-[#111111] bg-[#FEF9E6] px-1.5 py-0.2 rounded font-mono border border-[#F5D365]">
                            Sample Link
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#111111] mb-0.5">{res.title}</h4>
                      <p className="text-xs text-[#71717A] line-clamp-1">{res.description}</p>
                    </div>
                  </div>

                  {/* External Resource URL Link */}
                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4E4E7] bg-white hover:bg-[#F4F4F5] text-[#111111] text-xs font-semibold transition-colors"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#71717A]" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
