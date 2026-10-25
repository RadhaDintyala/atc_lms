import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import Modal from '../../components/Modal.jsx';
import {
  FolderGit2,
  Plus,
  Github,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  FileCode,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function ProjectsModule({ initialTopicForProject, onClearInitialTopic }) {
  const { profile, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    problem_statement: '',
    tech_stack: '',
    github_url: '',
    deployment_url: '',
    description: '',
    completion_notes: '',
    status: 'draft',
    topic_id: '',
  });

  const loadProjects = async () => {
    if (!profile?.id) return;
    try {
      setLoading(true);
      const data = await api.getProjects({ student_id: profile.id });
      setProjects(data || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [profile?.id]);

  // Open modal if navigated with an initial topic
  useEffect(() => {
    if (initialTopicForProject) {
      setForm({
        title: `${initialTopicForProject.title} Capstone Implementation`,
        problem_statement: `Engineering problem solving applying ${initialTopicForProject.title}.`,
        tech_stack: 'Python, FastAPI, Docker',
        github_url: profile?.github_url || 'https://github.com/my-student/project-repo',
        deployment_url: 'https://demo.myproject.app',
        description: initialTopicForProject.description,
        completion_notes: 'Initial implementation with full test suite and documentation.',
        status: 'draft',
        topic_id: initialTopicForProject.id,
      });
      setEditingProject(null);
      setIsModalOpen(true);
      if (onClearInitialTopic) onClearInitialTopic();
    }
  }, [initialTopicForProject]);

  const handleOpenNewModal = () => {
    setForm({
      title: '',
      problem_statement: '',
      tech_stack: '',
      github_url: profile?.github_url || '',
      deployment_url: '',
      description: '',
      completion_notes: '',
      status: 'draft',
      topic_id: '',
    });
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (proj) => {
    if (proj.status === 'approved') {
      alert('Approved projects cannot be modified as they are locked in your academic portfolio.');
      return;
    }
    setForm({
      id: proj.id,
      title: proj.title,
      problem_statement: proj.problem_statement,
      tech_stack: Array.isArray(proj.tech_stack) ? proj.tech_stack.join(', ') : proj.tech_stack || '',
      github_url: proj.github_url || '',
      deployment_url: proj.deployment_url || '',
      description: proj.description,
      completion_notes: proj.completion_notes || '',
      status: proj.status,
      topic_id: proj.topic_id || '',
    });
    setEditingProject(proj);
    setIsModalOpen(true);
  };

  const handleSubmit = async (submitStatus) => {
    if (!form.title.trim() || !form.problem_statement.trim() || !form.description.trim()) {
      alert('Please fill out Title, Problem Statement, and Project Description.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...(editingProject ? { id: editingProject.id } : {}),
        title: form.title.trim(),
        problem_statement: form.problem_statement.trim(),
        tech_stack: form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
        github_url: form.github_url.trim(),
        deployment_url: form.deployment_url.trim(),
        description: form.description.trim(),
        completion_notes: form.completion_notes.trim(),
        status: submitStatus,
        topic_id: form.topic_id || undefined,
      };

      await api.saveProject(payload);
      setIsModalOpen(false);
      await loadProjects();
    } catch (err) {
      alert(`Error saving project: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Engineering Project Submissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Submit repositories, live demos, and technical documentation for mentor review and portfolio approval.
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Project Submission</span>
        </button>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading project portfolio...</div>
      ) : projects.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
          <FolderGit2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No project submissions yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Build hands-on projects, push to GitHub, host your live demo, and submit them here to get verified review by mentors.
          </p>
          <button
            onClick={handleOpenNewModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-500 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Submission</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <StatusBadge status={proj.status} type="project" />
                    {proj.topic_title && (
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {proj.topic_title}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-mono">
                      {proj.submitted_at
                        ? `Submitted ${new Date(proj.submitted_at).toLocaleDateString()}`
                        : 'Draft created'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{proj.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{proj.problem_statement}</p>
                </div>

                <div className="flex items-center gap-2">
                  {proj.status !== 'approved' && (
                    <button
                      onClick={() => handleEditProject(proj)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Edit Submission
                    </button>
                  )}
                </div>
              </div>

              {/* Description & Tech Stack */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-2">
                <p className="text-xs text-slate-700 leading-relaxed">{proj.description}</p>
                {proj.completion_notes && (
                  <p className="text-xs text-slate-500 italic">
                    <span className="font-semibold text-slate-600">Completion Notes: </span>
                    {proj.completion_notes}
                  </p>
                )}
                {proj.tech_stack && proj.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.tech_stack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Links & Reviewer Feedback */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-4 flex-wrap">
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-slate-800 hover:text-slate-950 font-semibold"
                    >
                      <Github className="w-4 h-4 text-slate-700" />
                      <span>Repository</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                  {proj.deployment_url && (
                    <a
                      href={proj.deployment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-cyan-700 hover:text-cyan-900 font-semibold"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Live Deployment</span>
                    </a>
                  )}
                </div>

                {proj.reviewer_feedback && (
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2 max-w-lg">
                    <MessageSquare className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Mentor Feedback: </span>
                      <span>{proj.reviewer_feedback}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submission Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project Submission' : 'New Project Submission'}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Project Title *</label>
            <input
              type="text"
              placeholder="e.g. Distributed Task Queue & Realtime Notification Engine"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Problem Statement *</label>
            <input
              type="text"
              placeholder="What core engineering challenge or customer problem does this project solve?"
              value={form.problem_statement}
              onChange={(e) => setForm({ ...form, problem_statement: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">GitHub Repository URL</label>
              <input
                type="url"
                placeholder="https://github.com/username/repo-name"
                value={form.github_url}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Live Deployment URL</label>
              <input
                type="url"
                placeholder="https://my-app.run.app"
                value={form.deployment_url}
                onChange={(e) => setForm({ ...form, deployment_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Technology Stack (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. FastAPI, PostgreSQL, Docker, Redis, React"
              value={form.tech_stack}
              onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Short Project Description *</label>
            <textarea
              rows={3}
              placeholder="Detail your architecture, database schema, API design, and main features..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Completion Notes / Test Instructions</label>
            <textarea
              rows={2}
              placeholder="Instructions for mentors to run tests, credentials, or benchmarking results..."
              value={form.completion_notes}
              onChange={(e) => setForm({ ...form, completion_notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmit('draft')}
              className="px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 font-bold"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmit('submitted')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold shadow-xs"
            >
              Submit for Mentor Review
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
