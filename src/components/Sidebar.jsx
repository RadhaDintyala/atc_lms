import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  FolderGit2,
  LineChart,
  User,
  Users,
  Layers,
  FileCheck2,
  FileSpreadsheet,
  Settings,
  Sparkles,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export default function Sidebar({ currentTab, setTab, isOpen, onClose }) {
  const { user, profile, isAdmin, logout } = useAuth();

  const studentNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learning-path', label: 'My Learning Path', icon: Compass },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'my-progress', label: 'My Progress', icon: LineChart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const adminNav = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-students', label: 'Students', icon: Users },
    { id: 'admin-curriculum', label: 'Curriculum', icon: Layers },
    { id: 'admin-resources', label: 'Resource Management', icon: BookOpen },
    { id: 'admin-reviews', label: 'Project Reviews', icon: FileCheck2 },
    { id: 'admin-reports', label: 'Reports & Analytics', icon: FileSpreadsheet },
    { id: 'admin-settings', label: 'Settings', icon: Settings },
  ];

  const navItems = isAdmin ? adminNav : studentNav;

  const handleNavClick = (tabId) => {
    setTab(tabId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-[61px] left-0 z-40 h-full md:h-[calc(100vh-61px)] w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="py-4 px-3 flex-1 overflow-y-auto">
          {/* Role header in sidebar */}
          <div className="px-3 py-2 mb-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isAdmin ? 'ADMINISTRATOR PORTAL' : 'STUDENT WORKSPACE'}
            </p>
            <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
              {user?.full_name}
            </p>
            {!isAdmin && profile && (
              <p className="text-[11px] text-slate-500 font-mono">
                {profile.roll_number}
              </p>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-400/15 text-slate-900 font-semibold border border-amber-300/80 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-amber-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Banner & Sign Out */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/50">
          {!isAdmin && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/70 mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-xs font-bold text-amber-900">
                  Engineering Track
                </span>
              </div>
              <p className="text-[11px] text-amber-800 leading-snug">
                {profile?.current_year === 'year_1'
                  ? 'Common Foundation Year'
                  : profile?.track_id === 'fullstack'
                  ? 'Full-Stack & Application Dev'
                  : profile?.track_id === 'ai'
                  ? 'AI Engineering Track'
                  : 'Common Curriculum'}
              </p>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}
