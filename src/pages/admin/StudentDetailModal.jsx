import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import Modal from '../../components/Modal.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import {
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
        <div className="p-8 text-center text-xs text-[#71717A]">Loading student dossier...</div>
      ) : (
        <div className="space-y-5 text-xs">
          {/* Header summary */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 p-4 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-[#111111]">{data.user.full_name}</h3>
                <StatusBadge status={data.user.status} type="account" />
              </div>
              <p className="text-[#71717A] font-mono">
                {data.profile.roll_number} • {data.user.email}
              </p>
              <p className="text-[#52525B] mt-0.5">
                {data.profile.department} • {data.profile.college}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge status={data.profile.track_id} type="track" />
                <span className="font-bold text-[#111111] bg-white px-2 py-0.5 rounded border border-[#E4E4E7]">
                  {data.profile.current_year === 'year_1' ? '1st Year' : data.profile.current_year === 'year_2' ? '2nd Year' : '3rd Year'}
                </span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E4E4E7] text-center sm:text-right shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-0.5">
                Curriculum Mastery
              </span>
              <span className="text-2xl font-black font-mono text-[#111111]">
                {data.progress?.overallPercentage || 0}%
              </span>
              <p className="text-[10px] text-[#71717A] mt-0.5">
                {data.progress?.completedRequiredTopics || 0} of {data.progress?.totalRequiredTopics || 0} topics
              </p>
            </div>
          </div>

          {/* Project Submissions in Detail */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] mb-2">
              Submitted Projects ({data.projects?.length || 0})
            </h4>
            {data.projects?.length === 0 ? (
              <p className="text-[#71717A] italic p-3 bg-[#FAFAFA] rounded-lg text-center border border-[#E4E4E7]">
                No project submissions yet.
              </p>
            ) : (
              <div className="space-y-2">
                {data.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3 rounded-lg border border-[#E4E4E7] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#111111]">{proj.title}</span>
                        <StatusBadge status={proj.status} type="project" />
                      </div>
                      <p className="text-[#71717A] line-clamp-1">{proj.problem_statement}</p>
                      {proj.reviewer_feedback && (
                        <p className="text-[#111111] bg-[#FEF9E6] px-2 py-0.5 rounded text-[11px] mt-1 border border-[#F5D365]">
                          Mentor Note: {proj.reviewer_feedback}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {proj.github_url && (
                        <a
                          href={proj.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-[#E4E4E7] hover:bg-[#F4F4F5] text-[#111111]"
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
                          className="p-1.5 rounded-lg border border-[#E4E4E7] hover:bg-[#F4F4F5] text-[#111111]"
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
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] mb-2">
              Topic Status Records
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {data.topicProgress?.map((tp) => (
                <div
                  key={tp.id}
                  className="p-2.5 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] flex items-center justify-between"
                >
                  <span className="text-xs text-[#111111] truncate pr-2 font-semibold" title={tp.topic_title || tp.topic_id}>
                    {tp.topic_title || tp.topic_id}
                  </span>
                  <StatusBadge status={tp.status} type="topic" />
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] mb-2">
              Activity History
            </h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {data.activityLogs?.map((log) => (
                <div
                  key={log.id}
                  className="p-2 rounded-lg bg-[#FAFAFA] border border-[#E4E4E7] flex items-center justify-between text-[11px]"
                >
                  <span className="text-[#111111] truncate pr-2">{log.description}</span>
                  <span className="text-[#71717A] font-mono shrink-0">
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
