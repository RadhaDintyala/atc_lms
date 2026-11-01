import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Menu,
  GraduationCap,
  ChevronDown,
  User,
  ShieldCheck,
  UserCheck,
  LogOut,
  Settings,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function Navbar({ onToggleSidebar, onNavigateTab }) {
  const { user, profile, isAdmin, logout, setShowYearModal } = useAuth();
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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#111111] text-white border border-[#111111]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#F9C321]" />
          <span>Mentor Admin</span>
        </span>
      );
    }

    const yearLabel =
      profile?.current_year === 'year_1'
        ? '1st Year'
        : profile?.current_year === 'year_2'
        ? '2nd Year'
        : '3rd Year';

    const trackLabel =
      profile?.track_id === 'fullstack'
        ? 'Full-Stack'
        : profile?.track_id === 'ai'
        ? 'AI Engineering'
        : 'Foundation';

    return (
      <button
        type="button"
        onClick={() => setShowYearModal(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FEF9E6] hover:bg-[#FDF2C8] text-[#111111] border border-[#F5D365] transition-colors cursor-pointer group"
        title="Click to switch your Year of study"
      >
        <span>{yearLabel} • {trackLabel}</span>
        <span className="text-[10px] bg-[#F9C321] px-1.5 py-0.2 text-[#111111] font-bold rounded">
          Change
        </span>
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E4E4E7] px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 rounded-lg text-[#111111] hover:bg-[#F4F4F5] transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#111111] text-[#F9C321] flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4 text-[#F9C321]" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-black text-[#111111] text-lg tracking-tight">
                  Beacon<span className="text-[#F9C321]">.</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right: Track Badge & User Account Menu */}
        <div className="flex items-center gap-3">
          {/* Active Track indicator */}
          <div className="hidden sm:flex items-center">
            {getTrackBadge()}
          </div>

          {/* User Account Menu Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[#E4E4E7] bg-white hover:bg-[#F4F4F5] transition-colors text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-md bg-[#111111] text-[#F9C321] flex items-center justify-center font-bold text-xs">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[#111111] leading-tight truncate max-w-[140px]">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-[10px] text-[#71717A] truncate max-w-[140px]">
                  {isAdmin ? 'Mentor Administrator' : profile?.roll_number || 'Student'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-xl border border-[#E4E4E7] py-2 z-50 animate-in fade-in duration-100">
                {/* Account Details Header */}
                <div className="px-4 py-3 border-b border-[#E4E4E7] bg-[#FAFAFA]">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#111111] text-[#F9C321] flex items-center justify-center font-bold text-sm shrink-0">
                      {user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#111111] truncate">
                        {user?.full_name}
                      </p>
                      <p className="text-[11px] text-[#71717A] truncate font-mono mt-0.5">
                        {user?.email}
                      </p>
                      <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FEF9E6] text-[#111111] border border-[#F9C321]/40">
                        {isAdmin ? 'Mentor Administrator' : 'Engineering Student'}
                      </span>
                    </div>
                  </div>

                  {!isAdmin && profile && (
                    <div className="mt-2.5 pt-2 border-t border-[#E4E4E7] text-[11px] text-[#71717A] space-y-0.5">
                      {profile.roll_number && (
                        <p className="font-mono text-[10px] text-[#111111]">
                          ID: <span className="font-bold">{profile.roll_number}</span>
                        </p>
                      )}
                      <p className="truncate text-[#52525B]">
                        {profile.department || 'Engineering'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Navigation Links */}
                <div className="py-1">
                  {!isAdmin ? (
                    <>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          if (onNavigateTab) onNavigateTab('profile');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-[#111111] hover:bg-[#F4F4F5] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-[#71717A]" />
                        <span>My Academic Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setShowYearModal(true);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-[#111111] hover:bg-[#F4F4F5] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <GraduationCap className="w-4 h-4 text-[#71717A]" />
                        <span>Change Year of Study & Track</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          if (onNavigateTab) onNavigateTab('admin-settings');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-[#111111] hover:bg-[#F4F4F5] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-[#71717A]" />
                        <span>Platform Architecture & Health</span>
                      </button>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          if (onNavigateTab) onNavigateTab('admin-curriculum');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-[#111111] hover:bg-[#F4F4F5] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Layers className="w-4 h-4 text-[#71717A]" />
                        <span>Curriculum Architecture</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Sign Out Button */}
                <div className="border-t border-[#E4E4E7] pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
