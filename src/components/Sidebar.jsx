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
          className="fixed inset-0 z-40 bg-[#111111]/60 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-[57px] left-0 z-40 h-full md:h-[calc(100vh-57px)] w-64 bg-white border-r border-[#E4E4E7] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="py-4 px-3 flex-1 overflow-y-auto">
          {/* Role header in sidebar */}
          <div className="px-3 py-2.5 mb-3 bg-[#FAFAFA] rounded-lg border border-[#E4E4E7]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
              {isAdmin ? 'ADMINISTRATOR PORTAL' : 'STUDENT WORKSPACE'}
            </p>
            <p className="text-xs font-bold text-[#111111] truncate mt-0.5">
              {user?.full_name}
            </p>
            {!isAdmin && profile && (
              <p className="text-[11px] text-[#71717A] font-mono mt-0.5">
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
                  id={`nav-${item.id}`}
                  data-testid={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#111111]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#F9C321]' : 'text-[#71717A]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#F9C321]" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Banner & Sign Out */}
        <div className="p-3 border-t border-[#E4E4E7] bg-[#FAFAFA]">
          {!isAdmin && (
            <div className="p-3 rounded-lg bg-[#FEF9E6] border border-[#F5D365] mb-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111]">
                  Current Track
                </span>
                <span className="w-2 h-2 rounded-full bg-[#F9C321]"></span>
              </div>
              <p className="text-xs font-bold text-[#111111] leading-tight">
                {profile?.current_year === 'year_1'
                  ? 'Common Foundation Year'
                  : profile?.track_id === 'fullstack'
                  ? 'Full-Stack & App Dev'
                  : profile?.track_id === 'ai'
                  ? 'AI Engineering Track'
                  : 'Common Curriculum'}
              </p>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#71717A] hover:text-[#111111] hover:bg-white rounded-lg border border-transparent hover:border-[#E4E4E7] transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}
