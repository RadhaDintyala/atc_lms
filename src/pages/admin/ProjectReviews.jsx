import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import Modal from '../../components/Modal.jsx';
import {
  FileCheck2,
  Search,
  ExternalLink,
  Github,
  MessageSquare,
} from 'lucide-react';

export default function ProjectReviews() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Review Modal
  const [reviewingProject, setReviewingProject] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('approved');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const list = await api.getProjects();
      setProjects(list || []);
    } catch (err) {
      console.error('Failed to load project reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openReviewModal = (proj) => {
    setReviewingProject(proj);
    setReviewStatus(proj.status === 'submitted' || proj.status === 'under_review' ? 'approved' : proj.status);
    setReviewFeedback(proj.reviewer_feedback || '');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewFeedback.trim()) {
      alert('Please enter evaluation notes and constructive feedback.');
      return;
    }

    try {
      setSubmittingReview(true);
      await api.reviewProject(reviewingProject.id, {
        status: reviewStatus,
        feedback: reviewFeedback.trim(),
      });
      setReviewingProject(null);
      await loadProjects();
    } catch (err) {
      alert(`Error submitting review: ${err.message}`);
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchStudent = p.student_name?.toLowerCase().includes(q);
      const matchRoll = p.student_roll?.toLowerCase().includes(q);
      if (!matchTitle && !matchStudent && !matchRoll) return false;
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E4E7]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
            Mentor Project Evaluations
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] mt-1">
            Review student repository architectures, inspect live deployments, and approve capstone submissions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E4E4E7] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name, roll number, project title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-[#111111] placeholder-[#71717A]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] bg-white text-[#111111]"
            >
              <option value="all">All Review Statuses</option>
              <option value="submitted">Submitted (Needs Review)</option>
              <option value="under_review">Under Review</option>
              <option value="changes_requested">Changes Requested</option>
              <option value="approved">Approved</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E4E4E7] text-xs">
          <span className="text-[#71717A]">
            Total submissions: <span className="font-bold text-[#111111]">{filteredProjects.length}</span>
          </span>
          {(searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-[#111111] font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#71717A]">Loading submissions...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-xl border border-dashed border-[#E4E4E7]">
          <FileCheck2 className="w-10 h-10 text-[#71717A] mx-auto mb-2" />
          <h3 className="font-bold text-[#111111] text-base">No submissions found</h3>
          <p className="text-xs text-[#71717A] mt-1">Try resetting your status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-xl border border-[#E4E4E7] p-5 shadow-xs hover:border-[#111111] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <StatusBadge status={proj.status} type="project" />
                    <span className="font-bold text-[#111111] text-xs">
                      {proj.student_name}{' '}
                      <span className="text-[#71717A] font-mono">({proj.student_roll})</span>
                    </span>
                    <span className="text-[10px] text-[#111111] bg-[#F4F4F5] px-2 py-0.5 rounded border border-[#E4E4E7] font-semibold">
                      {proj.student_year === 'year_1' ? '1st Year' : proj.student_year === 'year_2' ? '2nd Year' : '3rd Year'} • {proj.student_track}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#111111]">{proj.title}</h3>
                  <p className="text-xs text-[#52525B] mt-0.5">{proj.problem_statement}</p>
                </div>

                <button
                  onClick={() => openReviewModal(proj)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                    proj.status === 'approved'
                      ? 'bg-[#111111] hover:bg-[#262626] text-white'
                      : 'bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111]'
                  }`}
                >
                  {proj.status === 'approved' ? 'Update Review' : 'Evaluate Project'}
                </button>
              </div>

              {/* Description */}
              <div className="bg-[#FAFAFA] p-4 rounded-lg border border-[#E4E4E7] space-y-2 text-xs">
                <p className="text-[#111111] leading-relaxed">{proj.description}</p>
                {proj.completion_notes && (
                  <p className="text-[#52525B] italic">
                    <span className="font-bold text-[#111111]">Student Notes: </span>
                    {proj.completion_notes}
                  </p>
                )}
                {proj.architecture_notes && (
                  <p className="text-[#52525B] bg-white p-2.5 rounded-lg border border-[#E4E4E7]">
                    <span className="font-bold text-[#111111]">Architecture & Design: </span>
                    {proj.architecture_notes}
                  </p>
                )}
                {proj.testing_notes && (
                  <p className="text-[#52525B] bg-white p-2.5 rounded-lg border border-[#E4E4E7]">
                    <span className="font-bold text-[#111111]">Testing Evidence: </span>
                    {proj.testing_notes}
                  </p>
                )}
                {proj.tech_stack && proj.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.tech_stack.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#E4E4E7] text-[#111111] font-semibold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Links & Current Feedback */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E4E4E7] text-xs">
                <div className="flex items-center gap-4 flex-wrap">
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#111111] hover:underline font-bold"
                    >
                      <Github className="w-4 h-4 text-[#111111]" />
                      <span>Inspect Repository</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#71717A]" />
                    </a>
                  )}
                  {proj.deployment_url && (
                    <a
                      href={proj.deployment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#111111] hover:underline font-bold"
                    >
                      <ExternalLink className="w-4 h-4 text-[#F9C321]" />
                      <span>Verify Live Demo</span>
                    </a>
                  )}
                  {proj.demo_video_url && (
                    <a
                      href={proj.demo_video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#111111] hover:underline font-semibold"
                    >
                      <ExternalLink className="w-4 h-4 text-[#71717A]" />
                      <span>Demo Video</span>
                    </a>
                  )}
                  {proj.documentation_url && (
                    <a
                      href={proj.documentation_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#111111] hover:underline font-semibold"
                    >
                      <ExternalLink className="w-4 h-4 text-[#71717A]" />
                      <span>Documentation</span>
                    </a>
                  )}
                </div>

                {proj.reviewer_feedback && (
                  <div className="p-2.5 rounded-lg bg-[#FEF9E6] border border-[#F5D365] text-xs text-[#111111] flex items-start gap-2 max-w-md">
                    <MessageSquare className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Recorded Feedback: </span>
                      <span>{proj.reviewer_feedback}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mentor Review Evaluation Modal */}
      <Modal
        isOpen={Boolean(reviewingProject)}
        onClose={() => setReviewingProject(null)}
        title={reviewingProject ? `Evaluate: ${reviewingProject.title}` : 'Mentor Project Evaluation'}
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E4E4E7] space-y-1">
            <p className="font-bold text-[#111111]">
              Student: {reviewingProject?.student_name} ({reviewingProject?.student_roll})
            </p>
            <p className="text-[#71717A] text-[11px]">
              Repository:{' '}
              <a
                href={reviewingProject?.github_url}
                target="_blank"
                rel="noreferrer"
                className="text-[#111111] underline font-mono font-bold"
              >
                {reviewingProject?.github_url || 'None provided'}
              </a>
            </p>
          </div>

          <div>
            <label className="block font-bold text-[#111111] mb-1">Decision / Status *</label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                  reviewStatus === 'approved'
                    ? 'border-[#111111] bg-[#111111] text-white font-bold'
                    : 'border-[#E4E4E7] bg-white hover:bg-[#F4F4F5] text-[#111111]'
                }`}
              >
                <input
                  type="radio"
                  name="reviewStatus"
                  value="approved"
                  checked={reviewStatus === 'approved'}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  className="sr-only"
                />
                <span>Approve & Accept</span>
              </label>

              <label
                className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                  reviewStatus === 'changes_requested'
                    ? 'border-[#F5D365] bg-[#FEF9E6] text-[#111111] font-bold'
                    : 'border-[#E4E4E7] bg-white hover:bg-[#F4F4F5] text-[#111111]'
                }`}
              >
                <input
                  type="radio"
                  name="reviewStatus"
                  value="changes_requested"
                  checked={reviewStatus === 'changes_requested'}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  className="sr-only"
                />
                <span>Request Changes</span>
              </label>

              <label
                className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                  reviewStatus === 'under_review'
                    ? 'border-[#111111] bg-[#F4F4F5] text-[#111111] font-bold'
                    : 'border-[#E4E4E7] bg-white hover:bg-[#F4F4F5] text-[#111111]'
                }`}
              >
                <input
                  type="radio"
                  name="reviewStatus"
                  value="under_review"
                  checked={reviewStatus === 'under_review'}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  className="sr-only"
                />
                <span>Keep Under Review</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#111111] mb-1">
              Mentor Evaluation Feedback & Next Steps *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Provide constructive feedback regarding code structure, testing coverage, documentation quality, or specific required revisions..."
              value={reviewFeedback}
              onChange={(e) => setReviewFeedback(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-[#111111]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E4E7]">
            <button
              type="button"
              onClick={() => setReviewingProject(null)}
              className="px-4 py-2 rounded-lg border border-[#E4E4E7] text-[#111111] hover:bg-[#F4F4F5] font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingReview}
              className="px-4 py-2 rounded-lg bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] font-bold cursor-pointer"
            >
              {submittingReview ? 'Recording...' : 'Submit Evaluation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
