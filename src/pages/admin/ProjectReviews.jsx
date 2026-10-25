import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import Modal from '../../components/Modal.jsx';
import {
  FileCheck2,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Github,
  MessageSquare,
  History,
  Sparkles,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Mentor Project Evaluations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review student repository architectures, inspect live deployments, and approve capstone submissions.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
          Only authorized mentors can approve or request changes
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by student name, roll number, project title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
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

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            Total submissions: <span className="font-bold text-slate-800">{filteredProjects.length}</span>
          </span>
          {(searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-amber-700 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading submissions...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <FileCheck2 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-base">No submissions found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting your status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <StatusBadge status={proj.status} type="project" />
                    <span className="font-bold text-slate-900 text-xs">
                      {proj.student_name}{' '}
                      <span className="text-slate-500 font-mono">({proj.student_roll})</span>
                    </span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {proj.student_year === 'year_1' ? '1st Year' : proj.student_year === 'year_2' ? '2nd Year' : '3rd Year'} • {proj.student_track}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{proj.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{proj.problem_statement}</p>
                </div>

                <button
                  onClick={() => openReviewModal(proj)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold transition-all shadow-xs shrink-0"
                >
                  {proj.status === 'approved' ? 'Update Review' : 'Evaluate Project'}
                </button>
              </div>

              {/* Description */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                <p className="text-slate-700 leading-relaxed">{proj.description}</p>
                {proj.completion_notes && (
                  <p className="text-slate-500 italic">
                    <span className="font-semibold text-slate-600">Student Notes: </span>
                    {proj.completion_notes}
                  </p>
                )}
                {proj.tech_stack && proj.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.tech_stack.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Links & Current Feedback */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-4 flex-wrap">
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-slate-800 hover:underline font-semibold"
                    >
                      <Github className="w-4 h-4 text-slate-700" />
                      <span>Inspect Repository</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                  {proj.deployment_url && (
                    <a
                      href={proj.deployment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-cyan-700 hover:underline font-semibold"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Verify Live Demo</span>
                    </a>
                  )}
                </div>

                {proj.reviewer_feedback && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2 max-w-md">
                    <MessageSquare className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
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
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="font-semibold text-slate-900">
              Student: {reviewingProject?.student_name} ({reviewingProject?.student_roll})
            </p>
            <p className="text-slate-500 text-[11px]">
              Repository:{' '}
              <a
                href={reviewingProject?.github_url}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-700 underline font-mono"
              >
                {reviewingProject?.github_url || 'None provided'}
              </a>
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Decision / Status *</label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                  reviewStatus === 'approved'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
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
                className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                  reviewStatus === 'changes_requested'
                    ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
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
                className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                  reviewStatus === 'under_review'
                    ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
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
            <label className="block font-semibold text-slate-700 mb-1">
              Mentor Evaluation Feedback & Next Steps *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Provide constructive feedback regarding code structure, testing coverage, documentation quality, or specific required revisions..."
              value={reviewFeedback}
              onChange={(e) => setReviewFeedback(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setReviewingProject(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingReview}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold shadow-xs"
            >
              {submittingReview ? 'Recording...' : 'Submit Evaluation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
