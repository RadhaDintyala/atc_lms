import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import Modal from '../../components/Modal.jsx';
import StudentDetailModal from './StudentDetailModal.jsx';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [trackFilter, setTrackFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [onlyInactiveWarning, setOnlyInactiveWarning] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailProfileId, setDetailProfileId] = useState(null);

  // Form State for Create
  const [createForm, setCreateForm] = useState({
    full_name: '',
    email: '',
    password: '',
    roll_number: '',
    department: 'Computer Science & Engineering',
    college: 'Apex Institute of Technology',
    current_year: 'year_1',
    track_id: 'common',
    github_url: '',
  });

  // Form State for Edit
  const [editForm, setEditForm] = useState({
    full_name: '',
    roll_number: '',
    department: '',
    current_year: 'year_1',
    track_id: 'common',
    status: 'active',
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await api.getStudents();
      setStudents(data || []);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');
      await api.createStudent(createForm);
      setIsCreateOpen(false);
      setCreateForm({
        full_name: '',
        email: '',
        password: '',
        roll_number: '',
        department: 'Computer Science & Engineering',
        college: 'Apex Institute of Technology',
        current_year: 'year_1',
        track_id: 'common',
        github_url: '',
      });
      await loadStudents();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create student account');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      setSaving(true);
      setErrorMsg('');
      await api.updateStudent(selectedStudent.id, editForm);
      setIsEditOpen(false);
      setSelectedStudent(null);
      await loadStudents();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update student profile');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (student) => {
    const newStatus = student.account_status === 'active' ? 'inactive' : 'active';
    const confirmText = `Are you sure you want to ${newStatus === 'inactive' ? 'deactivate' : 'activate'} ${student.full_name}'s account?`;
    if (!window.confirm(confirmText)) return;

    try {
      await api.updateStudent(student.id, { status: newStatus });
      await loadStudents();
    } catch (err) {
      alert(`Error toggling account status: ${err.message}`);
    }
  };

  const openEdit = (st) => {
    setSelectedStudent(st);
    setEditForm({
      full_name: st.full_name,
      roll_number: st.roll_number,
      department: st.department,
      current_year: st.current_year,
      track_id: st.track_id,
      status: st.account_status,
    });
    setErrorMsg('');
    setIsEditOpen(true);
  };

  // Filter students
  const filteredStudents = students.filter((st) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = st.full_name?.toLowerCase().includes(q);
      const matchEmail = st.email?.toLowerCase().includes(q);
      const matchRoll = st.roll_number?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchRoll) return false;
    }

    if (yearFilter !== 'all' && st.current_year !== yearFilter) return false;
    if (trackFilter !== 'all' && st.track_id !== trackFilter) return false;
    if (statusFilter !== 'all' && st.account_status !== statusFilter) return false;
    if (onlyInactiveWarning && !st.is_inactive_warning) return false;

    return true;
  });

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Account Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage student registrations, academic tracks, year assignments, and progress monitoring.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg('');
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold transition-all shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, roll number, or email..."
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
              <option value="year_1">1st Year Foundation</option>
              <option value="year_2">2nd Year Specialization</option>
              <option value="year_3">3rd Year Capstone</option>
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

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
            >
              <option value="all">All Account Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Warning filter checkbox */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={onlyInactiveWarning}
              onChange={(e) => setOnlyInactiveWarning(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-400"
            />
            <span className="flex items-center gap-1 text-rose-700 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              Show only inactive students with no recent updates (&gt;14 days)
            </span>
          </label>

          <span className="text-slate-500">
            Showing <span className="font-bold text-slate-800">{filteredStudents.length}</span> students
          </span>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Student Details</th>
                <th className="px-4 py-3.5">Year & Track</th>
                <th className="px-4 py-3.5">Progress</th>
                <th className="px-4 py-3.5">Projects</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    Loading student roster...
                  </td>
                </tr>
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    No students match current filters.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-300 font-bold flex items-center justify-center shrink-0">
                          {st.full_name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs">{st.full_name}</span>
                            {st.is_inactive_warning && (
                              <span
                                className="p-0.5 rounded bg-rose-100 text-rose-700"
                                title="No progress in 14+ days"
                              >
                                <AlertTriangle className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {st.roll_number} • {st.email}
                          </p>
                          <p className="text-[10px] text-slate-400">{st.department}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-800 block">
                          {st.current_year === 'year_1' ? '1st Year' : st.current_year === 'year_2' ? '2nd Year' : '3rd Year'}
                        </span>
                        <StatusBadge status={st.track_id} type="track" />
                      </div>
                    </td>

                    <td className="px-4 py-4 w-44">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-bold font-mono text-slate-900">
                            {st.progress?.overallPercentage || 0}%
                          </span>
                          <span className="text-slate-400 font-mono">
                            {st.progress?.completedRequiredTopics || 0}/{st.progress?.totalRequiredTopics || 0}
                          </span>
                        </div>
                        <ProgressBar
                          value={st.progress?.overallPercentage || 0}
                          showPercentage={false}
                          size="sm"
                          color="yellow"
                        />
                      </div>
                    </td>

                    <td className="px-4 py-4 font-mono text-slate-700">
                      <span>{st.approved_projects_count} approved</span>
                      <span className="text-slate-400 block text-[10px]">
                        ({st.projects_count} total)
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={st.account_status} type="account" />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailProfileId(st.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          title="View Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEdit(st)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(st)}
                          className={`p-1.5 rounded-lg border text-xs font-semibold ${
                            st.account_status === 'active'
                              ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={st.account_status === 'active' ? 'Deactivate Student' : 'Activate Student'}
                        >
                          {st.account_status === 'active' ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1.5 rounded-md border border-slate-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1.5 rounded-md border border-slate-200 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Student Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Register Engineering Student">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Liam Zhang"
                value={createForm.full_name}
                onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">College Email *</label>
              <input
                type="email"
                required
                placeholder="liam.zhang@apex.edu"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Roll Number * (Unique)</label>
              <input
                type="text"
                required
                placeholder="ENG2026-0488"
                value={createForm.roll_number}
                onChange={(e) => setCreateForm({ ...createForm, roll_number: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Initial Password *</label>
              <input
                type="password"
                required
                placeholder="Password@123"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Engineering Year</label>
              <select
                value={createForm.current_year}
                onChange={(e) => {
                  const yr = e.target.value;
                  setCreateForm({
                    ...createForm,
                    current_year: yr,
                    track_id: yr === 'year_1' ? 'common' : createForm.track_id === 'common' ? 'fullstack' : createForm.track_id,
                  });
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
              >
                <option value="year_1">1st Year (Common Foundation)</option>
                <option value="year_2">2nd Year (Core Track)</option>
                <option value="year_3">3rd Year (Advanced Capstone)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Specialization Track</label>
              <select
                value={createForm.track_id}
                onChange={(e) => setCreateForm({ ...createForm, track_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
              >
                <option value="common">Common Foundation</option>
                <option value="fullstack">Full-Stack & Application Dev</option>
                <option value="ai">AI Engineering</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department</label>
            <input
              type="text"
              value={createForm.department}
              onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold shadow-xs"
            >
              {saving ? 'Creating Account...' : 'Register Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Student Profile & Track">
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={editForm.full_name}
              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Roll Number</label>
              <input
                type="text"
                required
                value={editForm.roll_number}
                onChange={(e) => setEditForm({ ...editForm, roll_number: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Account Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive (Deactivated)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Engineering Year</label>
              <select
                value={editForm.current_year}
                onChange={(e) => setEditForm({ ...editForm, current_year: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
              >
                <option value="year_1">1st Year (Common Foundation)</option>
                <option value="year_2">2nd Year (Core Track)</option>
                <option value="year_3">3rd Year (Advanced Capstone)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Specialization Track</label>
              <select
                value={editForm.track_id}
                onChange={(e) => setEditForm({ ...editForm, track_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 bg-white"
              >
                <option value="common">Common Foundation</option>
                <option value="fullstack">Full-Stack & Application Dev</option>
                <option value="ai">AI Engineering</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department</label>
            <input
              type="text"
              value={editForm.department}
              onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold shadow-xs"
            >
              {saving ? 'Updating...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Student Detail Modal */}
      <StudentDetailModal
        profileId={detailProfileId}
        isOpen={Boolean(detailProfileId)}
        onClose={() => setDetailProfileId(null)}
      />
    </div>
  );
}
