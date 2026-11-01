import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import {
  User,
  Github,
  CheckCircle2,
  Save,
  AlertCircle,
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
      <div className="pb-4 border-b border-[#E4E4E7]">
        <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
          Student Profile & Academic Credentials
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A] mt-1">
          Review academic enrollment, track specialization, and update personal developer information.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-[#FEF9E6] text-[#111111] border border-[#F5D365]'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#111111]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Top Profile Card */}
      <div className="bg-white rounded-xl border border-[#E4E4E7] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="relative">
          {profile?.profile_image ? (
            <img
              src={profile.profile_image}
              alt={user?.full_name}
              className="w-20 h-20 rounded-xl object-cover border border-[#E4E4E7]"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-[#111111] text-[#F9C321] font-bold text-2xl flex items-center justify-center">
              {user?.full_name?.charAt(0) || 'S'}
            </div>
          )}
        </div>

        <div className="space-y-1.5 flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-[#111111]">{user?.full_name}</h2>
            <StatusBadge status={user?.status} type="account" />
          </div>
          <p className="text-xs text-[#71717A] font-mono">
            Roll Number: <span className="font-bold text-[#111111]">{profile?.roll_number}</span> • ID: {profile?.id}
          </p>
          <p className="text-xs text-[#52525B]">
            {profile?.department} • {profile?.college}
          </p>
          <div className="pt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#FEF9E6] text-[#111111] border border-[#F5D365]">
              {yearLabel}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#F4F4F5] text-[#111111] border border-[#E4E4E7]">
              {trackLabel}
            </span>
          </div>
        </div>

        {progress && (
          <div className="w-full sm:w-44 bg-[#FAFAFA] p-3.5 rounded-lg border border-[#E4E4E7] shrink-0 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1">
              Curriculum Mastery
            </span>
            <span className="text-2xl font-black font-mono text-[#111111]">
              {progress.overallPercentage}%
            </span>
            <div className="mt-2">
              <ProgressBar value={progress.overallPercentage} showPercentage={false} size="sm" />
            </div>
          </div>
        )}
      </div>

      {/* Profile Form (Permitted Details vs Locked Academic Record) */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-[#E4E4E7] p-5 sm:p-6 shadow-xs space-y-5">
        <div>
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider mb-1">Editable Profile Details</h3>
          <p className="text-xs text-[#71717A]">
            You may update your display name, developer links, and profile image.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-[#111111] mb-1">Full Name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] text-[#111111]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-[#111111] mb-1">GitHub Profile URL</label>
            <div className="relative">
              <Github className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
              <input
                type="url"
                placeholder="https://github.com/username"
                value={form.github_url}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] font-mono text-xs text-[#111111]"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-[#111111] mb-1">Profile Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={form.profile_image}
              onChange={(e) => setForm({ ...form, profile_image: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#E4E4E7] focus:outline-none focus:border-[#111111] font-mono text-xs text-[#111111]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#E4E4E7]">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] text-xs font-bold transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
