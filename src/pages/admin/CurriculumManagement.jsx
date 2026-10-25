import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import Modal from '../../components/Modal.jsx';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  BookOpen,
  Sparkles,
  FolderPlus,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function CurriculumManagement() {
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [yearFilter, setYearFilter] = useState('all');
  const [trackFilter, setTrackFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [editingCat, setEditingCat] = useState(null);

  // Topic Form
  const [topicForm, setTopicForm] = useState({
    title: '',
    category_id: '',
    year_id: 'year_1',
    track_id: 'common',
    description: '',
    learning_objectives: '',
    estimated_duration_minutes: 120,
    difficulty: 'Beginner',
    is_required: true,
    is_published: true,
    suggested_project: '',
  });

  // Category Form
  const [catForm, setCatForm] = useState({
    name: '',
    description: '',
    year_id: 'year_1',
    track_id: 'common',
    order: 1,
  });

  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getCurriculum();
      setCurriculum(data);
    } catch (err) {
      console.error('Failed to load curriculum:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNewTopic = () => {
    const firstCat = curriculum?.categories[0]?.id || '';
    setTopicForm({
      title: '',
      category_id: firstCat,
      year_id: 'year_1',
      track_id: 'common',
      description: '',
      learning_objectives: '',
      estimated_duration_minutes: 120,
      difficulty: 'Beginner',
      is_required: true,
      is_published: true,
      suggested_project: '',
    });
    setEditingTopic(null);
    setIsTopicModalOpen(true);
  };

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
    setTopicForm({
      title: topic.title,
      category_id: topic.category_id,
      year_id: topic.year_id,
      track_id: topic.track_id,
      description: topic.description,
      learning_objectives: Array.isArray(topic.learning_objectives)
        ? topic.learning_objectives.join('\n')
        : topic.learning_objectives || '',
      estimated_duration_minutes: topic.estimated_duration_minutes,
      difficulty: topic.difficulty,
      is_required: topic.is_required,
      is_published: topic.is_published,
      suggested_project: topic.suggested_project || '',
    });
    setIsTopicModalOpen(true);
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm('Are you sure you want to delete this topic and its resources?')) return;
    try {
      await api.deleteTopic(topicId);
      await loadData();
    } catch (err) {
      alert(`Error deleting topic: ${err.message}`);
    }
  };

  const handleSaveTopic = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        title: topicForm.title.trim(),
        category_id: topicForm.category_id,
        year_id: topicForm.year_id,
        track_id: topicForm.track_id,
        description: topicForm.description.trim(),
        learning_objectives: topicForm.learning_objectives
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        estimated_duration_minutes: Number(topicForm.estimated_duration_minutes),
        difficulty: topicForm.difficulty,
        is_required: topicForm.is_required,
        is_published: topicForm.is_published,
        suggested_project: topicForm.suggested_project.trim(),
        order: editingTopic?.order || 1,
      };

      if (editingTopic) {
        await api.updateTopic(editingTopic.id, payload);
      } else {
        await api.createTopic(payload);
      }
      setIsTopicModalOpen(false);
      await loadData();
    } catch (err) {
      alert(`Error saving topic: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        name: catForm.name.trim(),
        description: catForm.description.trim(),
        year_id: catForm.year_id,
        track_id: catForm.track_id,
        order: Number(catForm.order) || 1,
      };
      if (editingCat) {
        await api.updateCategory(editingCat.id, payload);
      } else {
        await api.createCategory(payload);
      }
      setIsCatModalOpen(false);
      await loadData();
    } catch (err) {
      alert(`Error saving category: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !curriculum) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Loading curriculum specifications...</p>
        </div>
      </div>
    );
  }

  // Filter topics
  const filteredTopics = curriculum.topics.filter((topic) => {
    if (yearFilter !== 'all' && topic.year_id !== yearFilter) return false;
    if (trackFilter !== 'all' && topic.track_id !== trackFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!topic.title.toLowerCase().includes(q) && !topic.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Curriculum Architecture & Topics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure learning paths across 1st Year Common Foundation, 2nd Year Tracks, and 3rd Year Capstone.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCatForm({
                name: '',
                description: '',
                year_id: 'year_1',
                track_id: 'common',
                order: curriculum.categories.length + 1,
              });
              setEditingCat(null);
              setIsCatModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs"
          >
            <FolderPlus className="w-4 h-4 text-slate-500" />
            <span>+ Add Category</span>
          </button>
          <button
            onClick={handleOpenNewTopic}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Topic</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search topics, competencies, descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
            >
              <option value="all">All Engineering Years</option>
              <option value="year_1">1st Year (Common Foundation)</option>
              <option value="year_2">2nd Year (Core Specialization)</option>
              <option value="year_3">3rd Year (Advanced Capstone)</option>
            </select>
          </div>

          <div>
            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
            >
              <option value="all">All Specialization Tracks</option>
              <option value="common">Common Foundation</option>
              <option value="fullstack">Full-Stack & App Dev</option>
              <option value="ai">AI Engineering</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            Total Topics in catalog: <span className="font-bold text-slate-800">{filteredTopics.length}</span>
          </span>
          {(searchQuery || yearFilter !== 'all' || trackFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setYearFilter('all');
                setTrackFilter('all');
              }}
              className="text-amber-700 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Topics Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Topic & Objectives</th>
                <th className="px-4 py-3.5">Target Year & Track</th>
                <th className="px-4 py-3.5">Difficulty & Est. Duration</th>
                <th className="px-4 py-3.5">Status & Required</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTopics.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    No curriculum topics found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredTopics.map((topic) => {
                  const cat = curriculum.categories.find((c) => c.id === topic.category_id);
                  return (
                    <tr key={topic.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 max-w-md">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-bold text-slate-900 text-xs">{topic.title}</span>
                            <span className="font-mono text-[10px] text-slate-400">({topic.id})</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mb-1">
                            {topic.description}
                          </p>
                          <span className="inline-block text-[10px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                            Category: {cat?.name || 'Unassigned'}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <span className="font-semibold text-slate-800 block">
                            {topic.year_id === 'year_1' ? '1st Year' : topic.year_id === 'year_2' ? '2nd Year' : '3rd Year'}
                          </span>
                          <StatusBadge status={topic.track_id} type="track" />
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <StatusBadge status={topic.difficulty} type="difficulty" />
                          <span className="text-[11px] text-slate-500 font-mono block">
                            {topic.estimated_duration_minutes} mins
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              topic.is_required
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {topic.is_required ? 'Required Topic' : 'Elective'}
                          </span>
                          <span
                            className={`block text-[10px] ${
                              topic.is_published ? 'text-emerald-600 font-semibold' : 'text-slate-400'
                            }`}
                          >
                            {topic.is_published ? '● Published' : '○ Draft Hidden'}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEditTopic(topic)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            title="Edit Topic"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTopic(topic.id)}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                            title="Delete Topic"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Topic Create/Edit Modal */}
      <Modal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        title={editingTopic ? 'Edit Topic Specification' : 'Create New Curriculum Topic'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveTopic} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Topic Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Asynchronous Microservices with FastAPI"
              value={topicForm.title}
              onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                required
                value={topicForm.category_id}
                onChange={(e) => setTopicForm({ ...topicForm, category_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
              >
                {curriculum.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Engineering Year</label>
              <select
                value={topicForm.year_id}
                onChange={(e) => setTopicForm({ ...topicForm, year_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
              >
                <option value="year_1">1st Year (Common)</option>
                <option value="year_2">2nd Year (Tracks)</option>
                <option value="year_3">3rd Year (Advanced)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Specialization Track</label>
              <select
                value={topicForm.track_id}
                onChange={(e) => setTopicForm({ ...topicForm, track_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
              >
                <option value="common">Common Foundation</option>
                <option value="fullstack">Full-Stack & App Dev</option>
                <option value="ai">AI Engineering</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description *</label>
            <textarea
              rows={2}
              required
              placeholder="Comprehensive summary of what the engineering student will master..."
              value={topicForm.description}
              onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Learning Objectives (One objective per line)
            </label>
            <textarea
              rows={3}
              placeholder="Understand asynchronous coroutines&#10;Implement dependency injection in FastAPI&#10;Write integration tests with PyTest"
              value={topicForm.learning_objectives}
              onChange={(e) => setTopicForm({ ...topicForm, learning_objectives: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 font-mono text-[11px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estimated Duration (Mins)</label>
              <input
                type="number"
                min={15}
                max={600}
                value={topicForm.estimated_duration_minutes}
                onChange={(e) => setTopicForm({ ...topicForm, estimated_duration_minutes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Difficulty Level</label>
              <select
                value={topicForm.difficulty}
                onChange={(e) => setTopicForm({ ...topicForm, difficulty: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Associated Project Prompt</label>
            <input
              type="text"
              placeholder="e.g. Build a high-throughput async product API with Swagger documentation."
              value={topicForm.suggested_project}
              onChange={(e) => setTopicForm({ ...topicForm, suggested_project: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={topicForm.is_required}
                onChange={(e) => setTopicForm({ ...topicForm, is_required: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-400"
              />
              <span>Required for Completion %</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={topicForm.is_published}
                onChange={(e) => setTopicForm({ ...topicForm, is_published: e.target.checked })}
                className="rounded text-amber-500 focus:ring-amber-400"
              />
              <span>Published (Visible to Students)</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsTopicModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold shadow-xs"
            >
              {saving ? 'Saving...' : editingTopic ? 'Update Topic' : 'Create Topic'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title={editingCat ? 'Edit Curriculum Category' : 'Add New Category'}
      >
        <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Messaging & Event Streaming"
              value={catForm.name}
              onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={catForm.description}
              onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Engineering Year</label>
              <select
                value={catForm.year_id}
                onChange={(e) => setCatForm({ ...catForm, year_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
              >
                <option value="year_1">1st Year Foundation</option>
                <option value="year_2">2nd Year Core Specialization</option>
                <option value="year_3">3rd Year Advanced Capstone</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Specialization Track</label>
              <select
                value={catForm.track_id}
                onChange={(e) => setCatForm({ ...catForm, track_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
              >
                <option value="common">Common Foundation</option>
                <option value="fullstack">Full-Stack & App Dev</option>
                <option value="ai">AI Engineering</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCatModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold shadow-xs"
            >
              {saving ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
