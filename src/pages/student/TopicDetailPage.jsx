import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle2,
  ExternalLink,
  FolderGit2,
  FileText,
  Video,
  Code,
  GraduationCap,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';

export default function TopicDetailPage({ topicId, onBack, onOpenProjectModal }) {
  const { profile } = useAuth();
  const [topic, setTopic] = useState(null);
  const [resources, setResources] = useState([]);
  const [resourceProgressMap, setResourceProgressMap] = useState(new Map());
  const [topicStatus, setTopicStatus] = useState('not_started');
  const [loading, setLoading] = useState(true);
  const [updatingResource, setUpdatingResource] = useState(null);
  const [updatingTopic, setUpdatingTopic] = useState(false);

  useEffect(() => {
    async function loadTopic() {
      if (!topicId) return;
      try {
        setLoading(true);
        const [topicData, resList, progData] = await Promise.all([
          api.getTopic(topicId),
          api.getResources(topicId),
          profile?.id ? api.getProgress(profile.id) : null,
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

  const handleUpdateTopicStatus = async (newStatus) => {
    try {
      setUpdatingTopic(true);
      await api.updateTopicStatus(topicId, newStatus);
      setTopicStatus(newStatus);
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setUpdatingTopic(false);
    }
  };

  if (loading || !topic) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Loading topic specification...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Curriculum Roadmap</span>
      </button>

      {/* Main Topic Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {topic.category?.name || 'Curriculum Module'}
              </span>
              <StatusBadge status={topic.difficulty} type="difficulty" />
              <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                {topic.estimated_duration_minutes} minutes
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {topic.title}
            </h1>
          </div>

          {/* Status Controls */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 self-start shrink-0">
            <span className="text-xs font-semibold text-slate-500 pl-1">Status:</span>
            <div className="flex gap-1">
              {['not_started', 'in_progress', 'completed'].map((st) => {
                const isActive = topicStatus === st;
                return (
                  <button
                    key={st}
                    disabled={updatingTopic}
                    onClick={() => handleUpdateTopicStatus(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      isActive
                        ? st === 'completed'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : st === 'in_progress'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-700 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-4 rounded-xl border border-slate-100">
          <p>{topic.description}</p>
        </div>

        {/* Learning Objectives Checklist */}
        {topic.learning_objectives && topic.learning_objectives.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Learning Objectives & Practical Competencies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {topic.learning_objectives.map((obj, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs"
                >
                  <div className="mt-0.5 p-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-slate-800 leading-snug">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Associated Project Task Section */}
      <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/50 rounded-2xl border border-amber-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-amber-700" />
              <h3 className="text-base font-bold text-slate-900">
                Associated Practical Project Task
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              {topic.suggested_project ||
                'Build a production-ready application demonstrating the competencies covered in this topic.'}
            </p>
          </div>
          <button
            onClick={() => onOpenProjectModal(topic)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Submit Project for this Topic</span>
          </button>
        </div>
      </div>

      {/* Learning Resources List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Curated Learning Resources</h3>
            <p className="text-xs text-slate-500">
              Check off resources as you complete them to track mastery. Opening links does not auto-complete.
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            {resources.length} {resources.length === 1 ? 'Resource' : 'Resources'}
          </span>
        </div>

        {resources.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No resources attached to this topic yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((res) => {
              const resStatus = resourceProgressMap.get(res.id) || 'not_started';
              const isCompleted = resStatus === 'completed';
              const isUpdating = updatingResource === res.id;

              return (
                <div
                  key={res.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCompleted
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleResource(res.id)}
                      disabled={isUpdating}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-amber-500 bg-white'
                      }`}
                      title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                          {getResourceIcon(res.type)}
                          {res.type}
                        </span>
                        <StatusBadge status={res.difficulty} type="difficulty" />
                        <span className="text-[11px] text-slate-400 font-mono">
                          {res.duration_minutes}m
                        </span>
                        {res.is_sample && (
                          <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-mono border border-amber-200">
                            Sample Link
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-0.5">{res.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{res.description}</p>
                    </div>
                  </div>

                  {/* External Resource URL Link */}
                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
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
