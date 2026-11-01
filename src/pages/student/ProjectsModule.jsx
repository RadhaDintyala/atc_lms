import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import Modal from '../../components/Modal.jsx';
import { PROJECT_CATALOG, getProjectByTopicId } from '../../data/projectCatalog.js';
import {
  FolderGit2,
  Github,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  FileCode,
  Calendar,
  Sparkles,
  Search,
  Filter,
  BookOpen,
  Layers,
  CheckSquare,
  ShieldCheck,
  Terminal,
  Award,
  FileText,
  PlayCircle,
  HelpCircle,
  ChevronRight,
  Send,
  Save,
  Check,
  X,
  Code2,
} from 'lucide-react';

export default function ProjectsModule({ initialTopicForProject, onClearInitialTopic }) {
  const { profile } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trackFilter, setTrackFilter] = useState('all');

  // Selected project for detailed workspace modal
  const [selectedProjectSpec, setSelectedProjectSpec] = useState(null);
  const [workspaceTab, setWorkspaceTab] = useState('spec'); // 'spec' | 'rubric' | 'submit'

  // Submission Form State
  const [form, setForm] = useState({
    id: null,
    topic_id: '',
    title: '',
    problem_statement: '',
    tech_stack: '',
    github_url: '',
    deployment_url: '',
    description: '',
    completion_notes: '',
    architecture_notes: '',
    demo_video_url: '',
    testing_notes: '',
    documentation_url: '',
    status: 'draft',
  });

  // Validation errors
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Interactive submission checklist state
  const [checklist, setChecklist] = useState({
    readme: true,
    envExample: true,
    noSecrets: true,
    deployedApp: false,
    architectureDoc: false,
    testEvidence: false,
  });

  // Load submissions from API
  const loadSubmissions = async () => {
    if (!profile?.id) return;
    try {
      setLoading(true);
      const data = await api.getProjects({ student_id: profile.id });
      setSubmissions(data || []);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [profile?.id]);

  // Open modal if navigated with an initial topic
  useEffect(() => {
    if (initialTopicForProject) {
      const spec = getProjectByTopicId(initialTopicForProject.id);
      if (spec) {
        openProjectWorkspace(spec);
      }
      if (onClearInitialTopic) onClearInitialTopic();
    }
  }, [initialTopicForProject]);

  // Determine submission for a given topic
  const getTopicSubmission = (topicId) => {
    return submissions.find((s) => s.topic_id === topicId) || null;
  };

  const getNormalizedStatus = (sub) => {
    if (!sub) return 'not_started';
    if (sub.status === 'approved') return 'completed';
    if (sub.status === 'under_review') return 'under_review';
    if (sub.status === 'submitted') return 'submitted';
    if (sub.status === 'draft') return 'in_progress';
    return sub.status;
  };

  // Open Workspace for a project specification
  const openProjectWorkspace = (spec, initialTab = 'spec') => {
    setSelectedProjectSpec(spec);
    setWorkspaceTab(initialTab);
    setErrors({});
    setSaveSuccessMessage('');

    // Check if student already has a submission for this topic
    const existing = submissions.find((s) => s.topic_id === spec.topic_id);

    if (existing) {
      setForm({
        id: existing.id,
        topic_id: spec.topic_id,
        title: existing.title || spec.title,
        problem_statement: existing.problem_statement || spec.short_summary,
        tech_stack: Array.isArray(existing.tech_stack)
          ? existing.tech_stack.join(', ')
          : existing.tech_stack || (spec.tech_stack || []).join(', '),
        github_url: existing.github_url || '',
        deployment_url: existing.deployment_url || '',
        description: existing.description || (typeof spec.overview === 'string' ? spec.overview : spec.short_summary),
        completion_notes: existing.completion_notes || '',
        architecture_notes: existing.architecture_notes || '',
        demo_video_url: existing.demo_video_url || '',
        testing_notes: existing.testing_notes || '',
        documentation_url: existing.documentation_url || '',
        status: existing.status,
      });
    } else {
      setForm({
        id: null,
        topic_id: spec.topic_id,
        title: spec.title,
        problem_statement: spec.short_summary,
        tech_stack: (spec.tech_stack || []).join(', '),
        github_url: profile?.github_url || '',
        deployment_url: '',
        description: typeof spec.overview === 'string' ? spec.overview : spec.short_summary,
        completion_notes: '',
        architecture_notes: '',
        demo_video_url: '',
        testing_notes: '',
        documentation_url: '',
        status: 'draft',
      });
    }
  };

  const handleStartProject = async (spec) => {
    openProjectWorkspace(spec, 'submit');
    try {
      if (profile?.id && spec.topic_id) {
        await api.updateTopicStatus(spec.topic_id, 'in_progress');
      }
    } catch (err) {
      console.warn('Failed to update status to in_progress:', err);
    }
  };

  // URL Validation Helpers
  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isValidGitHubUrl = (url) => {
    if (!isValidUrl(url)) return false;
    try {
      const parsed = new URL(url);
      return (
        (parsed.hostname === 'github.com' || parsed.hostname === 'www.github.com') &&
        parsed.pathname.split('/').filter(Boolean).length >= 2
      );
    } catch {
      return false;
    }
  };

  // Handle Save Draft or Submit
  const handleSaveOrSubmit = async (targetStatus) => {
    setSaveSuccessMessage('');
    const validationErrors = {};

    if (targetStatus === 'submitted') {
      // Strict validation for formal submission: GitHub URL is required
      if (!form.github_url.trim()) {
        validationErrors.github_url = 'GitHub repository URL containing your project is required for submission.';
      } else if (!isValidGitHubUrl(form.github_url.trim())) {
        validationErrors.github_url =
          'Please enter a valid GitHub repository URL (e.g., https://github.com/username/project-repo).';
      }

      if (form.deployment_url && form.deployment_url.trim() && !isValidUrl(form.deployment_url.trim())) {
        validationErrors.deployment_url =
          'Please enter a valid URL (starting with https:// or http://).';
      }

      if (form.demo_video_url && !isValidUrl(form.demo_video_url.trim())) {
        validationErrors.demo_video_url = 'Please enter a valid URL for the demonstration video.';
      }

      if (form.documentation_url && !isValidUrl(form.documentation_url.trim())) {
        validationErrors.documentation_url = 'Please enter a valid URL for documentation / schema.';
      }

      if (!form.title.trim()) {
        validationErrors.title = 'Project title is required.';
      }
    } else {
      // Soft validation for draft
      if (form.github_url && !isValidUrl(form.github_url.trim())) {
        validationErrors.github_url = 'Please enter a valid URL format for GitHub.';
      }
      if (form.deployment_url && !isValidUrl(form.deployment_url.trim())) {
        validationErrors.deployment_url = 'Please enter a valid URL format for deployment.';
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setWorkspaceTab('submit');
      return;
    }

    setErrors({});
    try {
      setSaving(true);
      const payload = {
        ...(form.id ? { id: form.id } : {}),
        topic_id: form.topic_id,
        title: form.title.trim(),
        problem_statement: form.problem_statement.trim(),
        tech_stack: form.tech_stack
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        github_url: form.github_url.trim(),
        deployment_url: form.deployment_url.trim(),
        description: form.description.trim(),
        completion_notes: form.completion_notes.trim(),
        architecture_notes: form.architecture_notes.trim(),
        demo_video_url: form.demo_video_url.trim(),
        testing_notes: form.testing_notes.trim(),
        documentation_url: form.documentation_url.trim(),
        status: targetStatus,
      };

      const saved = await api.saveProject(payload);

      setForm((prev) => ({
        ...prev,
        id: saved.id || prev.id,
        status: targetStatus,
      }));

      setSaveSuccessMessage(
        targetStatus === 'submitted'
          ? '🎉 Project successfully submitted for mentor evaluation! Your progress has been updated.'
          : '💾 Progress saved as draft. You can continue updating your code and return anytime.'
      );

      await loadSubmissions();
    } catch (err) {
      alert(`Error saving project: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Filter Catalog
  const filteredCatalog = PROJECT_CATALOG.filter((spec) => {
    const sub = getTopicSubmission(spec.topic_id);
    const normalizedStatus = getNormalizedStatus(sub);

    // Filter by Status
    if (statusFilter !== 'all') {
      if (statusFilter === 'not_started' && normalizedStatus !== 'not_started') return false;
      if (statusFilter === 'in_progress' && normalizedStatus !== 'in_progress') return false;
      if (statusFilter === 'submitted' && normalizedStatus !== 'submitted') return false;
      if (statusFilter === 'under_review' && normalizedStatus !== 'under_review') return false;
      if (statusFilter === 'completed' && normalizedStatus !== 'completed') return false;
    }

    // Filter by Track / Category
    if (trackFilter !== 'all') {
      if (trackFilter === 'common' && spec.track_id !== 'common') return false;
      if (trackFilter === 'fullstack' && spec.track_id !== 'fullstack') return false;
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (spec.title || '').toLowerCase().includes(q);
      const matchTopic = (spec.topic_title || '').toLowerCase().includes(q);
      const matchDesc = (spec.short_summary || '').toLowerCase().includes(q);
      const matchTech = (spec.tech_stack || []).some((v) =>
        v && v.toLowerCase().includes(q)
      );
      if (!matchTitle && !matchTopic && !matchDesc && !matchTech) return false;
    }

    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-7">
      {/* Top Banner & Header */}
      <div className="bg-[#111111] text-white rounded-xl p-6 sm:p-7 border border-[#262626]">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#222222] border border-[#333333] text-[#F9C321] text-xs font-mono font-bold tracking-wide">
            <FolderGit2 className="w-3.5 h-3.5 text-[#F9C321]" />
            <span>ATC Curriculum Capstone Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Hands-on Engineering Projects
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
            Put your theoretical knowledge to the test. Build industry-grade applications,
            containerize full-stack services, and submit verified GitHub repositories and live
            deployments for comprehensive mentor evaluation.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs text-[#A1A1AA]">
            <span className="flex items-center gap-1.5 bg-[#1C1C1E] px-2.5 py-1 rounded-md border border-[#2E2E32]">
              <FolderGit2 className="w-3.5 h-3.5 text-[#F9C321]" />
              <span>9 Active Capstone Projects</span>
            </span>
            <span className="flex items-center gap-1.5 bg-[#1C1C1E] px-2.5 py-1 rounded-md border border-[#2E2E32]">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Standardized Scoring Rubrics</span>
            </span>
            <span className="flex items-center gap-1.5 bg-[#1C1C1E] px-2.5 py-1 rounded-md border border-[#2E2E32]">
              <Github className="w-3.5 h-3.5 text-[#F9C321]" />
              <span>Mandatory GitHub & Live Demo</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-xl border border-[#E4E4E7] p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title, framework, or skill (e.g. FastAPI, MERN, Docker, Spring Boot)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-[#111111] placeholder-[#71717A]"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#111111] bg-[#F4F4F5] border border-[#E4E4E7] px-2.5 py-1.5 rounded-lg">
            <Filter className="w-3.5 h-3.5 text-[#71717A]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-semibold text-[#111111] focus:outline-none text-xs cursor-pointer"
            >
              <option value="all">All Statuses ({PROJECT_CATALOG.length})</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress (Draft)</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#111111] bg-[#F4F4F5] border border-[#E4E4E7] px-2.5 py-1.5 rounded-lg">
            <Layers className="w-3.5 h-3.5 text-[#71717A]" />
            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value)}
              className="bg-transparent font-semibold text-[#111111] focus:outline-none text-xs cursor-pointer"
            >
              <option value="all">All Tracks</option>
              <option value="common">Common Foundation (1st Year)</option>
              <option value="fullstack">Full-Stack & Application Dev (2nd Year)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-xs text-[#71717A] flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-[#F9C321] border-t-transparent rounded-full animate-spin" />
          <span className="font-bold uppercase tracking-wider">Loading project portfolio...</span>
        </div>
      ) : filteredCatalog.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-xl border border-dashed border-[#E4E4E7] space-y-3">
          <FolderGit2 className="w-10 h-10 text-[#71717A] mx-auto" />
          <h3 className="text-base font-bold text-[#111111]">No matching projects found</h3>
          <p className="text-xs text-[#71717A] max-w-md mx-auto">
            Try adjusting your search query or status filter to see available curriculum projects.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setTrackFilter('all');
            }}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-[#111111] text-white hover:bg-[#262626] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalog.map((spec) => {
            const sub = getTopicSubmission(spec.topic_id);
            const normStatus = getNormalizedStatus(sub);
            const isNotStarted = !sub || normStatus === 'not_started';
            const isDraft = sub && (sub.status === 'draft' || normStatus === 'in_progress');

            return (
              <div
                key={spec.topic_id}
                className="bg-white rounded-xl border border-[#E4E4E7] hover:border-[#111111] shadow-xs transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#111111]">
                      {spec.topic_title}
                    </span>
                    <StatusBadge status={normStatus} type="project" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#111111] group-hover:underline transition-colors leading-snug">
                      {spec.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-[#71717A] mt-0.5">{spec.category}</p>
                  </div>

                  <p className="text-xs text-[#52525B] line-clamp-3 leading-relaxed">
                    {spec.short_summary || (typeof spec.overview === 'string' ? spec.overview.slice(0, 160) : '')}
                  </p>

                  {/* Highlights / Badges */}
                  <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] font-mono text-[#111111]">
                    <span className="px-2 py-0.5 bg-[#F4F4F5] border border-[#E4E4E7] rounded font-semibold">
                      {spec.difficulty}
                    </span>
                    {spec.tech_stack && spec.tech_stack.slice(0, 2).map((tech, ti) => (
                      <span key={ti} className="px-2 py-0.5 bg-[#FEF9E6] border border-[#F5D365] text-[#111111] rounded font-semibold">
                        {tech.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom / Action */}
                <div className="p-3.5 bg-[#FAFAFA] border-t border-[#E4E4E7] flex items-center justify-between gap-3">
                  <div className="text-[11px] text-[#71717A]">
                    {sub?.submitted_at ? (
                      <span className="font-bold text-[#111111]">
                        Submitted {new Date(sub.submitted_at).toLocaleDateString()}
                      </span>
                    ) : sub ? (
                      <span className="font-semibold text-[#111111]">Draft saved</span>
                    ) : (
                      <span className="text-[#A1A1AA]">Not started</span>
                    )}
                  </div>

                  {isNotStarted ? (
                    <button
                      id={`project-start-btn-${spec.topic_id}`}
                      data-testid={`project-start-btn-${spec.topic_id}`}
                      onClick={() => handleStartProject(spec)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] text-xs font-bold transition-all cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4 text-[#111111]" />
                      <span>Start Project</span>
                    </button>
                  ) : isDraft ? (
                    <button
                      id={`project-continue-btn-${spec.topic_id}`}
                      data-testid={`project-continue-btn-${spec.topic_id}`}
                      onClick={() => openProjectWorkspace(spec, 'submit')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#111111] hover:bg-[#262626] text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-[#F9C321]" />
                      <span>Continue Project</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      id={`project-view-btn-${spec.topic_id}`}
                      data-testid={`project-view-btn-${spec.topic_id}`}
                      onClick={() => openProjectWorkspace(spec, 'submit')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#111111] hover:bg-[#262626] text-[#F9C321] text-xs font-bold transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F9C321]" />
                      <span>View Submission</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comprehensive Project Detail & Workspace Modal */}
      {selectedProjectSpec && (
        <Modal
          isOpen={!!selectedProjectSpec}
          onClose={() => setSelectedProjectSpec(null)}
          title={selectedProjectSpec.title}
          maxWidth="max-w-5xl"
        >
          <div className="space-y-5">
            {/* Modal Header Bar */}
            <div className="bg-[#111111] text-white p-5 rounded-xl border border-[#2E2E32] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#222222] text-[#F9C321] border border-[#333333] font-mono text-xs font-bold">
                    {selectedProjectSpec.topic_title}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#222222] text-[#A1A1AA] border border-[#333333] text-xs">
                    Difficulty: {selectedProjectSpec.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-white">{selectedProjectSpec.title}</h2>
                <p className="text-xs text-[#A1A1AA]">{selectedProjectSpec.short_summary}</p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <StatusBadge
                  status={getNormalizedStatus(getTopicSubmission(selectedProjectSpec.topic_id))}
                  type="project"
                />
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-[#E4E4E7] pb-2">
              <button
                id="tab-spec"
                onClick={() => setWorkspaceTab('spec')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  workspaceTab === 'spec'
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#111111]'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Project Specification</span>
              </button>

              <button
                id="tab-rubric"
                onClick={() => setWorkspaceTab('rubric')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  workspaceTab === 'rubric'
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#111111]'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Evaluation Rubric</span>
              </button>

              <button
                id="tab-submit"
                onClick={() => setWorkspaceTab('submit')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  workspaceTab === 'submit'
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#111111]'
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Submission Workspace</span>
              </button>
            </div>

            {/* TAB 1: Detailed Project Specification */}
            {workspaceTab === 'spec' && (
              <div className="space-y-6 text-xs text-slate-700 leading-relaxed max-h-[62vh] overflow-y-auto pr-2">
                {/* Start Project Banner */}
                <div className="bg-[#FAFAFA] border border-[#E4E4E7] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-[#111111] text-sm">Ready to begin this curriculum project?</h4>
                    <p className="text-[#71717A] text-xs mt-0.5">
                      Submit your project GitHub repository URL in the workspace to evaluate this track as completed.
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartProject(selectedProjectSpec)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] font-bold text-xs shrink-0 transition-colors cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4 text-[#111111]" />
                    <span>Start Project</span>
                  </button>
                </div>

                {/* Real-World Use Case & Overview */}
                <div className="bg-[#FEF9E6] border border-[#F5D365] rounded-xl p-5 space-y-2">
                  <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-[#111111]" />
                    <span>Project Overview & Real-World Use Case</span>
                  </h3>
                  <div className="text-[#111111] whitespace-pre-line leading-relaxed text-xs">
                    {selectedProjectSpec.overview}
                  </div>
                </div>

                {/* Objectives and Learning Outcomes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl p-5 space-y-2.5">
                    <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#111111]" />
                      <span>Objectives & Learning Outcomes</span>
                    </h3>
                    <ul className="space-y-1.5">
                      {(selectedProjectSpec.objectives || []).map((obj, i) => (
                        <li key={i} className="flex items-start gap-2 text-[#52525B]">
                          <Check className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5 stroke-[3]" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl p-5 space-y-2.5">
                    <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-[#111111]" />
                      <span>Prerequisites</span>
                    </h3>
                    <ul className="space-y-1.5">
                      {(selectedProjectSpec.prerequisites || []).map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-[#52525B]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#111111] shrink-0 mt-1.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Core Features: Mandatory MVP Requirements */}
                <div className="space-y-4">
                  <div className="border border-[#E4E4E7] rounded-xl p-5 space-y-4 bg-white">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7]">
                      <div>
                        <h3 className="text-sm font-bold text-[#111111]">
                          Core Features & Functional Requirements
                        </h3>
                        <p className="text-[11px] text-[#71717A]">
                          Mandatory modules that must be implemented for passing evaluation.
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-[#111111] text-white text-[10px] font-mono font-bold uppercase">
                        Mandatory
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(selectedProjectSpec.core_features || []).map((feat, i) => (
                        <div
                          key={i}
                          className="p-3.5 bg-[#FAFAFA] rounded-lg border border-[#E4E4E7] space-y-1.5"
                        >
                          <h4 className="font-bold text-[#111111] flex items-center gap-1.5">
                            <CheckSquare className="w-3.5 h-3.5 text-[#111111]" />
                            <span>{feat.title}</span>
                          </h4>
                          <p className="text-[#52525B] leading-relaxed text-xs">{feat.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MVP Requirements List */}
                  {selectedProjectSpec.mvp_requirements && (
                    <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl p-5 space-y-2.5">
                      <h4 className="font-bold text-[#111111] text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#111111]" />
                        <span>Minimum Viable Product (MVP) Checklist</span>
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[#111111]">
                        {selectedProjectSpec.mvp_requirements.map((req, i) => (
                          <li key={i} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#E4E4E7]">
                            <Check className="w-3.5 h-3.5 text-[#111111] shrink-0 stroke-[3]" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Optional Advanced Features */}
                  {selectedProjectSpec.optional_features && (
                    <div className="border border-[#E4E4E7] bg-[#FAFAFA] rounded-xl p-5 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7]">
                        <div>
                          <h3 className="text-sm font-bold text-[#111111]">
                            Optional Advanced Features
                          </h3>
                          <p className="text-[11px] text-[#71717A]">
                            Recommended for students aiming for distinction and portfolio excellence.
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-[#E4E4E7] text-[#111111] text-[10px] font-mono font-bold uppercase">
                          Optional
                        </span>
                      </div>

                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[#52525B]">
                        {selectedProjectSpec.optional_features.map((opt, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#E4E4E7]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#111111] shrink-0" />
                            <span>{opt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Tech Stack & Implementation Milestones */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Recommended Stack */}
                  <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl p-5 space-y-3">
                    <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#111111]" />
                      <span>Recommended Technology Stack</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(selectedProjectSpec.tech_stack || []).map((t, ti) => (
                        <span
                          key={ti}
                          className="font-mono text-[11px] text-[#111111] bg-white px-2.5 py-1 rounded-md border border-[#E4E4E7] font-semibold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl p-5 space-y-3">
                    <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#111111]" />
                      <span>Step-by-Step Implementation Milestones</span>
                    </h3>
                    <div className="space-y-2">
                      {(selectedProjectSpec.milestones || []).map((m, i) => (
                        <div key={i} className="p-2.5 bg-white rounded-lg border border-[#E4E4E7] space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#111111] font-mono text-[11px]">
                              Milestone {m.step}: {m.title}
                            </span>
                          </div>
                          <p className="text-[#52525B] text-[11px]">{m.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* UI/UX Expectations & Testing Guidelines */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-[#E4E4E7] rounded-xl p-4 space-y-2 bg-white">
                    <h4 className="font-bold text-[#111111] flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-[#111111]" />
                      <span>Expected UI / UX Experience</span>
                    </h4>
                    <p className="text-[#52525B] leading-relaxed whitespace-pre-line text-xs">
                      {selectedProjectSpec.ui_ux_requirements}
                    </p>
                  </div>

                  <div className="border border-[#E4E4E7] rounded-xl p-4 space-y-2 bg-white">
                    <h4 className="font-bold text-[#111111] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#111111]" />
                      <span>Testing & Validation Requirements</span>
                    </h4>
                    {Array.isArray(selectedProjectSpec.testing_requirements) ? (
                      <ul className="list-disc pl-4 space-y-1 text-[#52525B] text-xs">
                        {selectedProjectSpec.testing_requirements.map((tr, i) => (
                          <li key={i}>{tr}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[#52525B] text-xs">{selectedProjectSpec.testing_requirements}</p>
                    )}
                  </div>
                </div>

                {/* Common Mistakes */}
                <div className="bg-[#FEF9E6] border border-[#F5D365] rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-[#111111] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[#111111]" />
                    <span>Common Mistakes & Important Implementation Considerations</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-[#52525B] text-xs">
                    {(selectedProjectSpec.common_mistakes || []).map((mis, i) => (
                      <li key={i}>{mis}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: Evaluation Rubric */}
            {workspaceTab === 'rubric' && (
              <div className="space-y-4 text-xs text-[#111111] max-h-[62vh] overflow-y-auto pr-2">
                <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl p-4">
                  <h3 className="font-bold text-[#111111] text-sm">Evaluation Criteria & Scoring Rubric</h3>
                  <p className="text-[#71717A] mt-1">
                    Projects are evaluated against strict criteria on a 100-point scale. A minimum of
                    70% overall with all mandatory MVP requirements fulfilled is required for approval.
                  </p>
                </div>

                <div className="overflow-x-auto border border-[#E4E4E7] rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#111111] text-white font-bold border-b border-[#262626]">
                        <th className="p-3">Evaluation Category</th>
                        <th className="p-3 w-24 text-center">Weight</th>
                        <th className="p-3">Grading Expectations & Quality Standards</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4E4E7] bg-white">
                      {(selectedProjectSpec.scoring_rubric || []).map((item, i) => (
                        <tr key={i} className="hover:bg-[#FAFAFA]">
                          <td className="p-3 font-bold text-[#111111]">{item.category}</td>
                          <td className="p-3 text-center font-mono font-bold text-[#111111] bg-[#FEF9E6]">
                            {item.max_points} pts
                          </td>
                          <td className="p-3 text-[#52525B] leading-relaxed">{item.criteria}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: Submission Workspace */}
            {workspaceTab === 'submit' && (
              <div className="space-y-5 text-xs text-[#111111] max-h-[62vh] overflow-y-auto pr-2">
                {/* Save message */}
                {saveSuccessMessage && (
                  <div className="p-3.5 rounded-lg bg-[#FEF9E6] border border-[#F5D365] text-[#111111] font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#111111] shrink-0" />
                    <span>{saveSuccessMessage}</span>
                  </div>
                )}

                {/* Deliverables Checklist (Mandatory Section 3) */}
                <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#111111] text-xs uppercase tracking-wider flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-[#111111]" />
                      <span>Mandatory Submission Checklist</span>
                    </h3>
                    <span className="text-[11px] text-[#71717A] font-medium">
                      Ensure all deliverables are prepared before final submission
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-[#E4E4E7] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.readme}
                        onChange={(e) => setChecklist({ ...checklist, readme: e.target.checked })}
                        className="rounded text-[#111111] focus:ring-[#111111]"
                      />
                      <span className="font-semibold text-[#111111]">
                        README.md with setup & execution commands
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-[#E4E4E7] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.envExample}
                        onChange={(e) => setChecklist({ ...checklist, envExample: e.target.checked })}
                        className="rounded text-[#111111] focus:ring-[#111111]"
                      />
                      <span className="font-semibold text-[#111111]">
                        .env.example file included
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-[#E4E4E7] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.noSecrets}
                        onChange={(e) => setChecklist({ ...checklist, noSecrets: e.target.checked })}
                        className="rounded text-[#111111] focus:ring-[#111111]"
                      />
                      <span className="font-semibold text-[#111111]">
                        Zero committed secrets, passwords, or API keys
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-[#E4E4E7] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.deployedApp}
                        onChange={(e) => setChecklist({ ...checklist, deployedApp: e.target.checked })}
                        className="rounded text-[#111111] focus:ring-[#111111]"
                      />
                      <span className="font-semibold text-[#111111]">
                        Live deployed URL or Docker execution demo
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submission Form Fields */}
                <div className="space-y-4">
                  {/* GitHub URL (A) */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Github className="w-4 h-4 text-slate-700" />
                        <span>Deliverable A: GitHub Repository URL *</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Must contain source code, README & .env.example
                      </span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/your-username/project-repo"
                      value={form.github_url}
                      onChange={(e) => {
                        setForm({ ...form, github_url: e.target.value });
                        if (errors.github_url) setErrors({ ...errors, github_url: null });
                      }}
                      className={`w-full px-3.5 py-2 rounded-lg border font-mono text-xs ${
                        errors.github_url
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-[#E4E4E7] focus:border-[#111111]'
                      } focus:outline-none`}
                    />
                    {errors.github_url && (
                      <p className="text-red-600 text-[11px] font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.github_url}</span>
                      </p>
                    )}
                  </div>

                  {/* Deployed Project URL (B) */}
                  <div>
                    <label className="block font-bold text-[#111111] mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ExternalLink className="w-4 h-4 text-[#111111]" />
                        <span>
                          Deliverable B: Deployed Application URL *
                          {selectedProjectSpec.topic_id === 'top-014' && ' / Docker Hub Demo'}
                        </span>
                      </span>
                      <span className="text-[10px] text-[#71717A] font-normal">
                        Publicly accessible URL (or container demo link for Docker)
                      </span>
                    </label>
                    <input
                      type="url"
                      placeholder={
                        selectedProjectSpec.topic_id === 'top-014'
                          ? 'https://hub.docker.com/r/username/app or https://my-app.run.app'
                          : 'https://my-project-live.vercel.app'
                      }
                      value={form.deployment_url}
                      onChange={(e) => {
                        setForm({ ...form, deployment_url: e.target.value });
                        if (errors.deployment_url) setErrors({ ...errors, deployment_url: null });
                      }}
                      className={`w-full px-3.5 py-2 rounded-lg border font-mono text-xs ${
                        errors.deployment_url
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-[#E4E4E7] focus:border-[#111111]'
                      } focus:outline-none`}
                    />
                    {errors.deployment_url && (
                      <p className="text-red-600 text-[11px] font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.deployment_url}</span>
                      </p>
                    )}
                  </div>

                  {/* Additional Deliverables (C) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block font-bold text-[#111111] mb-1 flex items-center gap-1.5">
                        <PlayCircle className="w-3.5 h-3.5 text-[#111111]" />
                        <span>Demo Video URL (Loom / YouTube / Drive)</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://loom.com/share/..."
                        value={form.demo_video_url}
                        onChange={(e) => setForm({ ...form, demo_video_url: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#111111] mb-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#111111]" />
                        <span>Documentation / ER Diagram / Schema URL</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://api-docs.app/docs or ER Diagram link"
                        value={form.documentation_url}
                        onChange={(e) => setForm({ ...form, documentation_url: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-xs"
                      />
                    </div>
                  </div>

                  {/* Architecture & Decisions */}
                  <div>
                    <label className="block font-bold text-[#111111] mb-1">
                      Architecture & Key Implementation Decisions (Deliverable C)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Explain your architectural design pattern (e.g., MVC, 3-tier, async queues), state management, database schema design, and critical trade-offs..."
                      value={form.architecture_notes}
                      onChange={(e) => setForm({ ...form, architecture_notes: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-xs"
                    />
                  </div>

                  {/* Testing Evidence */}
                  <div>
                    <label className="block font-bold text-[#111111] mb-1">
                      Testing Evidence & Validation Notes (Deliverable C)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Document test coverage percentages, test commands executed (e.g., pytest, jest), and verified edge cases..."
                      value={form.testing_notes}
                      onChange={(e) => setForm({ ...form, testing_notes: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-xs"
                    />
                  </div>

                  {/* Completion Notes */}
                  <div>
                    <label className="block font-bold text-[#111111] mb-1">
                      Remarks / Instructions for Evaluator
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Add demo credentials (e.g. admin@hospital.local / DoctorPass123), special environment notes, or Docker run commands..."
                      value={form.completion_notes}
                      onChange={(e) => setForm({ ...form, completion_notes: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-xs"
                    />
                  </div>
                </div>

                {/* Mentor Feedback Display if reviewed */}
                {(() => {
                  const sub = getTopicSubmission(selectedProjectSpec.topic_id);
                  if (sub?.reviewer_feedback) {
                    return (
                      <div className="p-4 rounded-xl bg-[#FEF9E6] border border-[#F5D365] space-y-1.5">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-[#111111]" />
                          <h4 className="font-bold text-[#111111] text-xs">
                            Mentor Evaluation Feedback
                          </h4>
                          <span className="text-[10px] text-[#71717A] font-mono">
                            Reviewed on {sub.reviewed_at ? new Date(sub.reviewed_at).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <p className="text-[#111111] leading-relaxed pl-6">{sub.reviewer_feedback}</p>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E4E4E7]">
                  <div className="text-[11px] text-[#71717A]">
                    {form.status === 'approved' ? (
                      <span className="text-[#111111] font-bold">
                        ✓ Approved by Mentor. Locked in Academic Portfolio.
                      </span>
                    ) : (
                      <span>Drafts can be saved and updated at any time before review.</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleSaveOrSubmit('draft')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E4E4E7] hover:bg-[#F4F4F5] text-[#111111] text-xs font-bold transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Progress as Draft</span>
                    </button>

                    <button
                      type="button"
                      disabled={saving || form.status === 'approved'}
                      onClick={() => handleSaveOrSubmit('submitted')}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit for Evaluation</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
