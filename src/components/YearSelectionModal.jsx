import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import {
  GraduationCap,
  Code2,
  Cpu,
  Lock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  X,
} from 'lucide-react';

export default function YearSelectionModal({ isOpen, onClose }) {
  const { profile, updateTrack } = useAuth();
  const [selectedTrack, setSelectedTrack] = useState(profile?.track_id || 'fullstack');
  const [trackStatus, setTrackStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const currentYear = profile?.current_year || 'year_1';
  const isYearOne = currentYear === 'year_1';

  const yearLabel =
    currentYear === 'year_1'
      ? '1st Year • Common Foundation'
      : currentYear === 'year_2'
      ? '2nd Year • Core Engineering'
      : '3rd Year • Advanced Capstone';

  useEffect(() => {
    if (!isOpen) return;
    setSelectedTrack(profile?.track_id || 'fullstack');
    setErrorMessage(null);
    let mounted = true;

    async function checkEligibility() {
      try {
        setLoadingStatus(true);
        const res = await api.getTrackStatus();
        if (mounted) {
          setTrackStatus(res);
        }
      } catch (err) {
        if (mounted) {
          setTrackStatus({ allowed: false, reason: err.message || 'Unable to verify stream eligibility.' });
        }
      } finally {
        if (mounted) setLoadingStatus(false);
      }
    }

    checkEligibility();

    return () => {
      mounted = false;
    };
  }, [isOpen, profile?.track_id]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!trackStatus?.allowed) return;
    if (selectedTrack === profile?.track_id) {
      if (onClose) onClose();
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);
      await updateTrack(selectedTrack);
      if (onClose) onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to switch specialization stream.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E4E4E7] max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#111111] text-white p-6 relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-[#71717A] hover:text-white hover:bg-[#262626] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#F9C321] px-2 py-0.5 rounded bg-[#222222]">
              Specialization Stream
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white">
            Engineering Stream Management
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Review stream options or switch tracks. Policy allows switching only upon completing your active module.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Locked Academic Year Badge */}
          <div className="p-4 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#111111] text-[#F9C321]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                  Academic Year
                </p>
                <p className="text-sm font-black text-[#111111]">{yearLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F4F4F5] text-[#52525B] text-xs font-semibold border border-[#E4E4E7]">
              <Lock className="w-3.5 h-3.5 text-[#71717A]" />
              <span>Locked</span>
            </div>
          </div>

          {/* Eligibility Banner */}
          {loadingStatus ? (
            <div className="p-4 rounded-xl border border-[#E4E4E7] bg-white flex items-center justify-center gap-2 text-xs text-[#71717A]">
              <div className="w-4 h-4 border-2 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
              <span>Checking module completion prerequisites...</span>
            </div>
          ) : isYearOne ? (
            <div className="p-3.5 rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] text-xs text-[#52525B] flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-[#71717A] mt-0.5 shrink-0" />
              <div>
                <strong className="text-[#111111] block mb-0.5">Common Foundation Locked</strong>
                All 1st Year engineering cohorts follow the unified foundational curriculum. Specialization tracks open upon advancing to 2nd Year.
              </div>
            </div>
          ) : !trackStatus?.allowed ? (
            <div className="p-3.5 rounded-xl border border-[#F5D365] bg-[#FEF9E6] text-xs text-[#7A5800] flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#B45309] mt-0.5 shrink-0" />
              <div>
                <strong className="text-[#111111] block mb-0.5">Current Module Incomplete</strong>
                {trackStatus?.reason || 'You must complete all required topics in your current module before switching streams.'}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-[#86EFAC] bg-[#F0FDF4] text-xs text-[#166534] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] mt-0.5 shrink-0" />
              <div>
                <strong className="text-[#111111] block mb-0.5">Stream Switch Eligible</strong>
                You have completed all required topics in your active module! You may switch your specialization stream below.
              </div>
            </div>
          )}

          {/* Specialization Options (2nd & 3rd Year) */}
          {!isYearOne && (
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-bold text-[#111111] uppercase tracking-wider">
                Select Stream
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Fullstack Card */}
                <button
                  type="button"
                  disabled={!trackStatus?.allowed}
                  onClick={() => setSelectedTrack('fullstack')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedTrack === 'fullstack'
                      ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                      : 'border-[#E4E4E7] bg-white text-[#111111] hover:border-[#A1A1AA]'
                  } ${!trackStatus?.allowed ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Code2 className={`w-5 h-5 ${selectedTrack === 'fullstack' ? 'text-[#F9C321]' : 'text-[#111111]'}`} />
                    {profile?.track_id === 'fullstack' && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${selectedTrack === 'fullstack' ? 'bg-[#222222] text-[#F9C321]' : 'bg-[#FEF9E6] text-[#111111]'}`}>
                        Current
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">Full-Stack & App Dev</h4>
                    <p className={`text-[11px] mt-0.5 ${selectedTrack === 'fullstack' ? 'text-[#A1A1AA]' : 'text-[#71717A]'}`}>
                      Modern web apps, mobile cross-platform, cloud deployment & backend architectures.
                    </p>
                  </div>
                </button>

                {/* AI Engineering Card */}
                <button
                  type="button"
                  disabled={!trackStatus?.allowed}
                  onClick={() => setSelectedTrack('ai')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedTrack === 'ai'
                      ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                      : 'border-[#E4E4E7] bg-white text-[#111111] hover:border-[#A1A1AA]'
                  } ${!trackStatus?.allowed ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Cpu className={`w-5 h-5 ${selectedTrack === 'ai' ? 'text-[#F9C321]' : 'text-[#111111]'}`} />
                    {profile?.track_id === 'ai' && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${selectedTrack === 'ai' ? 'bg-[#222222] text-[#F9C321]' : 'bg-[#FEF9E6] text-[#111111]'}`}>
                        Current
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">AI Engineering</h4>
                    <p className={`text-[11px] mt-0.5 ${selectedTrack === 'ai' ? 'text-[#A1A1AA]' : 'text-[#71717A]'}`}>
                      Machine learning pipelines, LLM agents, vector embeddings & neural models.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAFAFA] border-t border-[#E4E4E7] flex items-center justify-between">
          <div className="text-xs text-[#71717A]">
            {isYearOne
              ? 'Academic year & stream locked'
              : trackStatus?.allowed
              ? 'Eligible to update stream'
              : 'Complete current module to switch'}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-3.5 rounded-lg border border-[#E4E4E7] text-[#111111] font-bold text-xs hover:bg-[#F4F4F5] transition-colors cursor-pointer"
            >
              Close
            </button>
            {!isYearOne && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!trackStatus?.allowed || saving || selectedTrack === profile?.track_id}
                className="py-2 px-4 rounded-lg bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Switch Stream</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
