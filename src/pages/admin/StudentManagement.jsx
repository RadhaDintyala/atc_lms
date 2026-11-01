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
  AlertCircle,
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
    college: 'Beacon Institute of Technology',
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
        college: 'Beacon Institute of Technology',
        current_year: 'year_1',
        track_id: 'common',
        github_url: '',
      });
      await loadStudents();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create student');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');
      await api.updateStudent(selectedStudent.id, editForm);
      setIsEditOpen(false);
      await loadStudents();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (st) => {
    const newStatus = st.account_status === 'active' ? 'inactive' : 'active';
    try {
      await api.updateStudent(st.id, { status: newStatus });
      await loadStudents();
    } catch (err) {
      alert(`Error updating student status: ${err.message}`);
    }
  };

  const openEdit = (st) => {
    setSelectedStudent(st);
    setEditForm({
      full_name: st.full_name,
      roll_number: st.roll_number,
      department: st.department || '',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E4E7]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
            Student Account Administration
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] mt-1">
            Manage student registrations, academic tracks, year assignments, and progress monitoring.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg('');
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] text-xs font-bold transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E4E4E7] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, roll, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-[#111111] placeholder-[#71717A]"
            />
          </div>

          <div>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] bg-white text-[#111111]"
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
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] bg-white text-[#111111]"
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
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] bg-white text-[#111111]"
            >
              <option value="all">All Account Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Warning filter checkbox */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#E4E4E7] text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-[#111111]">
            <input
              type="checkbox"
              checked={onlyInactiveWarning}
              onChange={(e) => setOnlyInactiveWarning(e.target.checked)}
              className="rounded text-[#111111] focus:ring-[#111111]"
            />
            <span className="flex items-center gap-1 font-bold text-[#111111]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#F9C321]" />
              Show only inactive students (&gt;14 days without updates)
            </span>
          </label>

          <span className="text-[#71717A]">
            Showing <span className="font-bold text-[#111111]">{filteredStudents.length}</span> students
          </span>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-[#E4E4E7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAFA] border-b border-[#E4E4E7] text-[#71717A] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3">Student Details</th>
                <th className="px-4 py-3">Year & Track</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Projects</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-[#71717A]">
                    Loading student roster...
                  </td>
                </tr>
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-[#71717A]">
                    No students match current filters.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-md bg-[#111111] text-[#F9C321] font-bold flex items-center justify-center shrink-0 text-xs">
                          {st.full_name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#111111] text-xs">{st.full_name}</span>
                            {st.is_inactive_warning && (
                              <span
                                className="p-0.5 rounded bg-[#FEF9E6] text-[#111111] border border-[#F5D365]"
                                title="No progress in 14+ days"
                              >
                                <AlertTriangle className="w-3 h-3 text-[#111111]" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#71717A] font-mono">
                            {st.roll_number} • {st.email}
                          </p>
                          <p className="text-[10px] text-[#71717A]">{st.department}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <span className="font-bold text-[#111111] block">
                          {st.current_year === 'year_1' ? '1st Year' : st.current_year === 'year_2' ? '2nd Year' : '3rd Year'}
                        </span>
                        <StatusBadge status={st.track_id} type="track" />
                      </div>
                    </td>

                    <td className="px-4 py-3.5 w-44">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-bold font-mono text-[#111111]">
                            {st.progress?.overallPercentage || 0}%
                          </span>
                          <span className="text-[#71717A] font-mono">
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

                    <td className="px-4 py-3.5 font-mono text-[#111111]">
                      <span className="font-semibold">{st.approved_projects_count} approved</span>
                      <span className="text-[#71717A] block text-[10px]">
                        ({st.projects_count} total)
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={st.account_status} type="account" />
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailProfileId(st.id)}
                          className="p-1.5 rounded-lg border border-[#E4E4E7] text-[#111111] hover:bg-[#F4F4F5] transition-colors cursor-pointer"
                          title="View Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEdit(st)}
                          className="p-1.5 rounded-lg border border-[#E4E4E7] text-[#111111] hover:bg-[#F4F4F5] transition-colors cursor-pointer"
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(st)}
                          className={`p-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                            st.account_status === 'active'
                              ? 'border-[#E4E4E7] text-[#71717A] hover:text-[#111111] hover:bg-[#F4F4F5]'
                              : 'border-[#111111] bg-[#111111] text-white hover:bg-[#262626]'
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
          <div className="px-5 py-3 border-t border-[#E4E4E7] flex items-center justify-between text-xs text-[#71717A]">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1.5 rounded-md border border-[#E4E4E7] text-[#111111] hover:bg-[#F4F4F5] disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1.5 rounded-md border border-[#E4E4E7] text-[#111111] hover:bg-[#F4F4F5] disabled:opacity-30 cursor-pointer"
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
            <div className="p-3 rounded-lg bg-[#FEF9E6] text-[#111111] border border-[#F5D365] font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#111111] shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#111111] mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Liam Zhang"
                value={createForm.full_name}
                onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-[#111111]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#111111] mb-1">College Email *</label>
              <input
                type="email"
                required
                placeholder="liam.zhang@beacon.edu"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-[#111111]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#111111] mb-1">Roll Number * (Unique)</label>
              <input
                type="text"
                required
                placeholder="ENG2026-0488"
                value={createForm.roll_number}
                onChange={(e) => setCreateForm({ ...createForm, roll_number: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] font-mono text-[#111111]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#111111] mb-1">Initial Password *</label>
              <input
                type="password"
                required
                placeholder="Enter temporary password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-[#111111]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#111111] mb-1">Engineering Year</label>
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
                className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] bg-white text-[#111111]"
              >
                <option value="year_1">1st Year (Common Foundation)</option>
                <option value="year_2">2nd Year (Core Track)</option>
                <option value="year_3">3rd Year (Advanced Capstone)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#111111] mb-1">Specialization Track</label>
              <select
                value={createForm.track_id}
                onChange={(e) => setCreateForm({ ...createForm, track_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] bg-white text-[#111111]"
              >
                <option value="common">Common Foundation</option>
                <option value="fullstack">Full-Stack & Application Dev</option>
                <option value="ai">AI Engineering</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#111111] mb-1">Department</label>
            <input
              type="text"
              value={createForm.department}
              onChange={(e) => setCreateForm({ ...createForm, department: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-[#111111]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E4E7]">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#E4E4E7] text-[#111111] hover:bg-[#F4F4F5] font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] font-bold cursor-pointer"
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
            <div className="p-3 rounded-lg bg-[#FEF9E6] text-[#111111] border border-[#F5D365] font-bold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block font-bold text-[#111111] mb-1">Full Name</label>
            <input
              type="text"
              required
              value={editForm.full_name}
              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-[#111111]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#111111] mb-1">Roll Number</label>
              <input
                type="text"
                required
                value={editForm.roll_number}
                onChange={(e) => setEditForm({ ...editForm, roll_number: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] font-mono text-[#111111]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#111111] mb-1">Account Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] bg-white text-[#111111]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive (Deactivated)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#111111] mb-1">Engineering Year</label>
              <select
                value={editForm.current_year}
                onChange={(e) => setEditForm({ ...editForm, current_year: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] bg-white text-[#111111]"
              >
                <option value="year_1">1st Year (Common Foundation)</option>
                <option value="year_2">2nd Year (Core Track)</option>
                <option value="year_3">3rd Year (Advanced Capstone)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#111111] mb-1">Specialization Track</label>
              <select
                value={editForm.track_id}
                onChange={(e) => setEditForm({ ...editForm, track_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] bg-white text-[#111111]"
              >
                <option value="common">Common Foundation</option>
                <option value="fullstack">Full-Stack & Application Dev</option>
                <option value="ai">AI Engineering</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#111111] mb-1">Department</label>
            <input
              type="text"
              value={editForm.department}
              onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-[#111111]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E4E7]">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#E4E4E7] text-[#111111] hover:bg-[#F4F4F5] font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] font-bold cursor-pointer"
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
