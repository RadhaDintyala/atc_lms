import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import Modal from '../../components/Modal.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import {
  User,
  Mail,
  GraduationCap,
  Building2,
  FolderGit2,
  Calendar,
  Clock,
  CheckCircle2,
  ExternalLink,
  Github,
} from 'lucide-react';

export default function StudentDetailModal({ profileId, isOpen, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      if (!profileId || !isOpen) return;
      try {
        setLoading(true);
        const res = await api.getStudentDetail(profileId);
        setData(res);
      } catch (err) {
        console.error('Failed to load student detail:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [profileId, isOpen]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={data?.user?.full_name ? `${data.user.full_name} — Academic Dossier` : 'Student Profile Detail'}
      maxWidth="max-w-3xl"
    >
      {loading || !data ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading student dossier...</div>
      ) : (
        <div className="space-y-6 text-xs">
          {/* Header summary */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-slate-900">{data.user.full_name}</h3>
                <StatusBadge status={data.user.status} type="account" />
              </div>
              <p className="text-slate-500 font-mono">
                {data.profile.roll_number} • {data.user.email}
              </p>
              <p className="text-slate-600 mt-1">
                {data.profile.department} • {data.profile.college}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge status={data.profile.track_id} type="track" />
                <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {data.profile.current_year === 'year_1' ? '1st Year' : data.profile.current_year === 'year_2' ? '2nd Year' : '3rd Year'}
                </span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center sm:text-right shrink-0">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                Curriculum Mastery
              </span>
              <span className="text-2xl font-black font-mono text-amber-500">
                {data.progress?.overallPercentage || 0}%
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {data.progress?.completedRequiredTopics || 0} of {data.progress?.totalRequiredTopics || 0} topics
              </p>
            </div>
          </div>

          {/* Project Submissions in Detail */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Submitted Projects ({data.projects?.length || 0})
            </h4>
            {data.projects?.length === 0 ? (
              <p className="text-slate-400 italic p-3 bg-slate-50 rounded-lg text-center">
                No project submissions yet.
              </p>
            ) : (
              <div className="space-y-2">
                {data.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">{proj.title}</span>
                        <StatusBadge status={proj.status} type="project" />
                      </div>
                      <p className="text-slate-500 line-clamp-1">{proj.problem_statement}</p>
                      {proj.reviewer_feedback && (
                        <p className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px] mt-1 border border-amber-200">
                          Mentor Note: {proj.reviewer_feedback}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {proj.github_url && (
                        <a
                          href={proj.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
                          title="GitHub Repo"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {proj.deployment_url && (
                        <a
                          href={proj.deployment_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-cyan-700"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Topic Progress Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Topic Status Records
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {data.topicProgress?.map((tp) => (
                <div
                  key={tp.id}
                  className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between"
                >
                  <span className="font-mono text-slate-700 truncate pr-2">{tp.topic_id}</span>
                  <StatusBadge status={tp.status} type="topic" />
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Activity History
            </h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {data.activityLogs?.map((log) => (
                <div
                  key={log.id}
                  className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]"
                >
                  <span className="text-slate-700 truncate pr-2">{log.description}</span>
                  <span className="text-slate-400 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
