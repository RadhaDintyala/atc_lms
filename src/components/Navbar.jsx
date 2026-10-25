import React, { useState, useRef, useEffect } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext.jsx';
import {
  Menu,
  GraduationCap,
  ChevronDown,
  UserCheck,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Code2,
  Cpu,
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { user, profile, isAdmin, switchDemoAccount, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTrackBadge = () => {
    if (isAdmin) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          Mentor Admin
        </span>
      );
    }
    if (profile?.track_id === 'fullstack') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Code2 className="w-3.5 h-3.5" />
          Full-Stack Track
        </span>
      );
    }
    if (profile?.track_id === 'ai') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <Cpu className="w-3.5 h-3.5" />
          AI Engineering
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
        <Sparkles className="w-3.5 h-3.5" />
        Common Foundation
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-xs">
              <GraduationCap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                  Apex<span className="text-amber-500">LMS</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Engineering Roadmap
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500">
                1st • 2nd • 3rd Year Project-Based Curriculum
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right: Track Badge & Demo Account Switcher */}
        <div className="flex items-center gap-3">
          {/* Active Track indicator */}
          <div className="hidden sm:flex items-center">
            {getTrackBadge()}
          </div>

          {/* Demo Account Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left shadow-2xs"
            >
              <div className="w-7 h-7 rounded-full bg-amber-400/20 text-slate-800 flex items-center justify-center font-bold text-xs border border-amber-300">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight">
                  {user?.full_name || 'Demo User'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {isAdmin ? 'Chief Mentor' : profile?.roll_number || 'Student'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/70">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Switch Test Account (1-Click)
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Instantly test roles, tracks, and student cohorts.
                  </p>
                </div>

                <div className="py-1 max-h-72 overflow-y-auto">
                  {DEMO_ACCOUNTS.map((acc) => {
                    const isSelected = user?.email === acc.email;
                    return (
                      <button
                        key={acc.email}
                        onClick={() => {
                          switchDemoAccount(acc.email);
                          setDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-xs flex items-start gap-2.5 transition-colors hover:bg-amber-50/60 ${
                          isSelected ? 'bg-amber-50/90 font-medium' : ''
                        }`}
                      >
                        <div
                          className={`mt-0.5 p-1 rounded-md shrink-0 ${
                            acc.role === 'admin'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {acc.role === 'admin' ? (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900 truncate">
                              {acc.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {acc.tag.split('•')[0]}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {acc.tag}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 px-4 pt-2 pb-1">
                  <div className="text-[11px] text-slate-500 flex justify-between items-center">
                    <span>Active: {user?.email}</span>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="text-rose-600 hover:underline font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
