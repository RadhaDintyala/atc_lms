import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import Modal from '../../components/Modal.jsx';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  Info,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function ResourceManagement() {
  const [resources, setResources] = useState([]);
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');

  // Modals & Forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    topic_id: '',
    description: '',
    type: 'Documentation',
    url: '',
    duration_minutes: 60,
    difficulty: 'Beginner',
    display_order: 1,
    published: true,
    is_sample: false,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [resList, curr] = await Promise.all([
        api.getResources(),
        api.getCurriculum(),
      ]);
      setResources(resList || []);
      setCurriculum(curr);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNew = () => {
    const firstTopic = curriculum?.topics[0]?.id || '';
    setForm({
      title: '',
      topic_id: firstTopic,
      description: '',
      type: 'Documentation',
      url: 'https://',
      duration_minutes: 60,
      difficulty: 'Beginner',
      display_order: 1,
      published: true,
      is_sample: false,
    });
    setEditingResource(null);
    setIsModalOpen(true);
  };

  const handleEdit = (res) => {
    setEditingResource(res);
    setForm({
      title: res.title,
      topic_id: res.topic_id,
      description: res.description,
      type: res.type,
      url: res.url,
      duration_minutes: res.duration_minutes,
      difficulty: res.difficulty,
      display_order: res.display_order,
      published: res.published,
      is_sample: res.is_sample,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (resId) => {
    if (!window.confirm('Delete this learning resource from the curriculum?')) return;
    try {
      await api.deleteResource(resId);
      await loadData();
    } catch (err) {
      alert(`Error deleting resource: ${err.message}`);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        title: form.title.trim(),
        topic_id: form.topic_id,
        description: form.description.trim(),
        type: form.type,
        url: form.url.trim(),
        duration_minutes: Number(form.duration_minutes),
        difficulty: form.difficulty,
        display_order: Number(form.display_order) || 1,
        published: form.published,
        is_sample: form.is_sample,
      };

      if (editingResource) {
        await api.updateResource(editingResource.id, payload);
      } else {
        await api.createResource(payload);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      alert(`Error saving resource: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !curriculum) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Loading resource catalog...</p>
        </div>
      </div>
    );
  }

  // Topic lookup map
  const topicMap = new Map();
  curriculum.topics.forEach((t) => topicMap.set(t.id, t.title));

  const filteredResources = resources.filter((res) => {
    if (typeFilter !== 'all' && res.type !== typeFilter) return false;
    if (topicFilter !== 'all' && res.topic_id !== topicFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchDesc = res.description.toLowerCase().includes(q);
      const matchUrl = res.url.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchUrl) return false;
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Sample Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Curriculum Resource Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain external course links, API documentation, video lectures, and hands-on repositories.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Resource</span>
        </button>
      </div>

      {/* Sample Content Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Dummy & Sample Resource Identifier Notice</p>
          <p className="leading-relaxed">
            Resources tagged with <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300 font-semibold">Sample Link</span> contain initial placeholder endpoints (<code className="font-mono">https://example.com/resources/*</code>) designed to be easily replaced by mentors with real URLs without needing code redeployments.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by resource title, URL, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
            >
              <option value="all">All Resource Types</option>
              <option value="Documentation">Documentation</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Course">Course</option>
              <option value="Video">Video</option>
              <option value="Repository">Repository</option>
              <option value="Article">Article</option>
              <option value="Practice">Practice</option>
            </select>
          </div>

          <div>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
            >
              <option value="all">Filter by Topic (All)</option>
              {curriculum.topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            Total resources: <span className="font-bold text-slate-800">{filteredResources.length}</span>
          </span>
          {(searchQuery || typeFilter !== 'all' || topicFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setTopicFilter('all');
              }}
              className="text-amber-700 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Resource Title & Type</th>
                <th className="px-4 py-3.5">Assigned Topic</th>
                <th className="px-4 py-3.5">URL & Sample Flag</th>
                <th className="px-4 py-3.5">Duration & Level</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    No resources found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredResources.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 max-w-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 text-xs">{res.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {res.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{res.description}</p>
                      </div>
                    </td>

                    <td className="px-4 py-4 max-w-xs">
                      <span className="font-semibold text-slate-800 line-clamp-1">
                        {topicMap.get(res.topic_id) || res.topic_id}
                      </span>
                    </td>

                    <td className="px-4 py-4 max-w-xs">
                      <div className="space-y-1">
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[11px] text-cyan-800 hover:underline flex items-center gap-1 truncate"
                        >
                          <span className="truncate">{res.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                        </a>
                        {res.is_sample && (
                          <span className="inline-block text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono font-bold">
                            Sample Content
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <StatusBadge status={res.difficulty} type="difficulty" />
                        <span className="text-[11px] text-slate-500 font-mono block">
                          {res.duration_minutes}m
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(res)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          title="Edit Resource"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(res.id)}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                          title="Delete Resource"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resource Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingResource ? 'Edit Learning Resource' : 'Add New Learning Resource'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Resource Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. FastAPI Async Tutorial & Complete Architecture Guide"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Topic *</label>
              <select
                required
                value={form.topic_id}
                onChange={(e) => setForm({ ...form, topic_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
              >
                {curriculum.topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Resource Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
              >
                <option value="Documentation">Documentation</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Course">Course</option>
                <option value="Video">Video</option>
                <option value="Repository">Repository</option>
                <option value="Article">Article</option>
                <option value="Practice">Practice</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">External Resource URL *</label>
            <input
              type="url"
              required
              placeholder="https://fastapi.tiangolo.com/tutorial/"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Duration (Mins)</label>
              <input
                type="number"
                min={5}
                max={600}
                value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Display Order</label>
              <input
                type="number"
                min={1}
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={form.is_sample}
                onChange={(e) => setForm({ ...form, is_sample: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-400"
              />
              <span>Mark as Sample / Placeholder Content</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-400"
              />
              <span>Published (Visible to students)</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold shadow-xs"
            >
              {saving ? 'Saving...' : editingResource ? 'Update Resource' : 'Save Resource'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
