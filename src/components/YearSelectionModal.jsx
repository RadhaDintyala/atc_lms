import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  GraduationCap,
  Code2,
  Cpu,
  Layers,
  ArrowRight,
  Check,
  X,
} from 'lucide-react';

export default function YearSelectionModal({ isOpen, onClose }) {
  const { profile, updateYear } = useAuth();
  const [selectedYear, setSelectedYear] = useState(profile?.current_year || 'year_1');
  const [selectedTrack, setSelectedTrack] = useState(profile?.track_id || 'common');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleYearPick = (year) => {
    setSelectedYear(year);
    if (year === 'year_1') {
      setSelectedTrack('common');
    } else if (selectedTrack === 'common') {
      setSelectedTrack('fullstack');
    }
  };

  const handleConfirm = async () => {
    try {
      setSaving(true);
      await updateYear(selectedYear, selectedTrack);
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to update year:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/70">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E4E4E7] max-w-2xl w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#111111] text-white p-6 relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-[#71717A] hover:text-white hover:bg-[#262626] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#F9C321] px-2 py-0.5 rounded bg-[#222222]">
              Cohort Selection
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white">
            Select Your Year of Study
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-1 max-w-lg">
            Choose your academic year to enter your personalized dashboard, learning path, and assigned tasks.
          </p>
        </div>

        {/* Content: 3 Year Options */}
        <div className="p-6 space-y-3 max-h-[65vh] overflow-y-auto">
          {/* 1st Year Option */}
          <div
            onClick={() => handleYearPick('year_1')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
              selectedYear === 'year_1'
                ? 'border-[#111111] bg-[#FEF9E6]/50 shadow-xs'
                : 'border-[#E4E4E7] hover:border-[#A1A1AA] hover:bg-[#FAFAFA]'
            }`}
          >
            <div
              className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
                selectedYear === 'year_1'
                  ? 'bg-[#111111] text-[#F9C321]'
                  : 'bg-[#F4F4F5] text-[#111111]'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#111111] text-sm">
                  1st Year • Common Foundation
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FEF9E6] text-[#111111] border border-[#F5D365]">
                  Core Foundation
                </span>
              </div>
              <p className="text-xs text-[#52525B] mt-1">
                Core programming, web fundamentals, Git workflows, prompt engineering, and first project sprints.
              </p>
            </div>
            <div className="shrink-0 self-center">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedYear === 'year_1'
                    ? 'border-[#111111] bg-[#111111] text-[#F9C321]'
                    : 'border-[#D4D4D8]'
                }`}
              >
                {selectedYear === 'year_1' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>

          {/* 2nd Year Option */}
          <div
            onClick={() => handleYearPick('year_2')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-3 ${
              selectedYear === 'year_2'
                ? 'border-[#111111] bg-[#FEF9E6]/50 shadow-xs'
                : 'border-[#E4E4E7] hover:border-[#A1A1AA] hover:bg-[#FAFAFA]'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
                  selectedYear === 'year_2'
                    ? 'bg-[#111111] text-[#F9C321]'
                    : 'bg-[#F4F4F5] text-[#111111]'
                }`}
              >
                <Code2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#111111] text-sm">
                    2nd Year • Core Specialization
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F4F4F5] text-[#111111] border border-[#E4E4E7]">
                    Track Choice
                  </span>
                </div>
                <p className="text-xs text-[#52525B] mt-1">
                  Dive into specialized engineering tracks: Full-Stack web development or AI Engineering & LLMs.
                </p>
              </div>
              <div className="shrink-0 self-center">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedYear === 'year_2'
                      ? 'border-[#111111] bg-[#111111] text-[#F9C321]'
                      : 'border-[#D4D4D8]'
                  }`}
                >
                  {selectedYear === 'year_2' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* Specialization Track Chooser for Year 2 */}
            {selectedYear === 'year_2' && (
              <div className="pt-2 border-t border-[#E4E4E7]">
                <p className="text-[11px] font-bold text-[#111111] uppercase tracking-wider mb-2">
                  Choose Your Specialization Track:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTrack('fullstack');
                    }}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      selectedTrack === 'fullstack'
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-[#111111] border-[#E4E4E7] hover:bg-[#F4F4F5]'
                    }`}
                  >
                    <Code2 className="w-4 h-4 shrink-0" />
                    <span>Full-Stack Track</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTrack('ai');
                    }}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      selectedTrack === 'ai'
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-[#111111] border-[#E4E4E7] hover:bg-[#F4F4F5]'
                    }`}
                  >
                    <Cpu className="w-4 h-4 shrink-0" />
                    <span>AI Engineering</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3rd Year Option */}
          <div
            onClick={() => handleYearPick('year_3')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
              selectedYear === 'year_3'
                ? 'border-[#111111] bg-[#FEF9E6]/50 shadow-xs'
                : 'border-[#E4E4E7] hover:border-[#A1A1AA] hover:bg-[#FAFAFA]'
            }`}
          >
            <div
              className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
                selectedYear === 'year_3'
                  ? 'bg-[#111111] text-[#F9C321]'
                  : 'bg-[#F4F4F5] text-[#111111]'
              }`}
            >
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#111111] text-sm">
                  3rd Year • Advanced Capstone
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#111111] text-white border border-[#111111]">
                  Capstone Level
                </span>
              </div>
              <p className="text-xs text-[#52525B] mt-1">
                Distributed systems, production microservices, CI/CD, cloud deployments, and end-to-end capstone portfolio.
              </p>
            </div>
            <div className="shrink-0 self-center">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedYear === 'year_3'
                    ? 'border-[#111111] bg-[#111111] text-[#F9C321]'
                    : 'border-[#D4D4D8]'
                }`}
              >
                {selectedYear === 'year_3' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 bg-[#FAFAFA] border-t border-[#E4E4E7] flex items-center justify-between gap-4">
          <div className="text-xs text-[#52525B]">
            Selected: <strong className="text-[#111111]">
              {selectedYear === 'year_1' ? '1st Year (Common Foundation)' : selectedYear === 'year_2' ? `2nd Year (${selectedTrack === 'ai' ? 'AI Engineering' : 'Full-Stack'})` : '3rd Year (Advanced Capstone)'}
            </strong>
          </div>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="py-2 px-5 rounded-lg bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Enter Year Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
