import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import {
  User,
  Mail,
  GraduationCap,
  Building2,
  Github,
  Calendar,
  ShieldAlert,
  CheckCircle2,
  Save,
  Lock,
  ExternalLink,
} from 'lucide-react';

export default function StudentProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [progress, setProgress] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    github_url: '',
    profile_image: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user && profile) {
      setForm({
        full_name: user.full_name || '',
        github_url: profile.github_url || '',
        profile_image: profile.profile_image || '',
      });
    }
  }, [user, profile]);

  useEffect(() => {
    async function loadProgress() {
      if (!profile?.id) return;
      try {
        const data = await api.getProgress(profile.id);
        setProgress(data);
      } catch (err) {
        console.error('Failed to load profile progress:', err);
      }
    }
    loadProgress();
  }, [profile?.id]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile?.id) return;

    try {
      setSaving(true);
      setMessage({ text: '', type: '' });
      await api.updateStudent(profile.id, {
        full_name: form.full_name.trim(),
        github_url: form.github_url.trim(),
        profile_image: form.profile_image.trim(),
      });
      await refreshProfile();
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message || 'Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const yearLabel =
    profile?.current_year === 'year_1'
      ? '1st Year'
      : profile?.current_year === 'year_2'
      ? '2nd Year'
      : '3rd Year';

  const trackLabel =
    profile?.track_id === 'fullstack'
      ? 'Full-Stack & Application Development'
      : profile?.track_id === 'ai'
      ? 'AI Engineering'
      : 'Common Foundation';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Profile & Academic Credentials
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review academic enrollment, track specialization, and update personal developer information.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Top Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          {profile?.profile_image ? (
            <img
              src={profile.profile_image}
              alt={user?.full_name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-300 shadow-xs"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-slate-900 text-amber-400 font-extrabold text-2xl flex items-center justify-center border-2 border-amber-300 shadow-xs">
              {user?.full_name?.charAt(0) || 'S'}
            </div>
          )}
        </div>

        <div className="space-y-1.5 flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-slate-900">{user?.full_name}</h2>
            <StatusBadge status={user?.status} type="account" />
          </div>
          <p className="text-xs text-slate-500 font-mono">
            Roll Number: <span className="font-bold text-slate-800">{profile?.roll_number}</span> • ID: {profile?.id}
          </p>
          <p className="text-xs text-slate-600">
            {profile?.department} • {profile?.college}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
              {yearLabel}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-900 border border-cyan-200">
              {trackLabel}
            </span>
          </div>
        </div>

        {progress && (
          <div className="w-full sm:w-48 bg-slate-50 p-4 rounded-xl border border-slate-200/80 shrink-0 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Curriculum Mastery
            </span>
            <span className="text-2xl font-black font-mono text-slate-900">
              {progress.overallPercentage}%
            </span>
            <div className="mt-2">
              <ProgressBar value={progress.overallPercentage} showPercentage={false} size="sm" />
            </div>
          </div>
        )}
      </div>

      {/* Profile Form (Permitted Details vs Locked Academic Record) */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Editable Profile Details</h3>
          <p className="text-xs text-slate-500">
            You may update your display name, developer links, and profile image.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">GitHub Profile URL</label>
            <div className="relative">
              <Github className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="url"
                placeholder="https://github.com/username"
                value={form.github_url}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Profile Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={form.profile_image}
              onChange={(e) => setForm({ ...form, profile_image: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-400 font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Locked Academic Fields (Read-Only) */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-3">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Official Academic Enrollment Record (Mentor Admin Controlled)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">College Email</span>
              <span className="font-mono text-slate-800 font-medium truncate block mt-0.5">{user?.email}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Roll Number</span>
              <span className="font-mono text-slate-800 font-bold block mt-0.5">{profile?.roll_number}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Engineering Year</span>
              <span className="text-slate-800 font-semibold block mt-0.5">{yearLabel}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Department</span>
              <span className="text-slate-800 font-medium block mt-0.5">{profile?.department}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Specialization Track</span>
              <span className="text-slate-800 font-semibold block mt-0.5">{trackLabel}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Enrolled Date</span>
              <span className="font-mono text-slate-600 block mt-0.5">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold transition-all shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
