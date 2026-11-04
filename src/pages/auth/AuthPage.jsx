import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Lock,
  Mail,
  KeyRound,
  Hash,
} from 'lucide-react';

export default function AuthPage() {
  const { login, authError } = useAuth();
  const [role, setRole] = useState('student'); // 'student' | 'admin'

  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Student Cohort & Stream Choice on Login
  const [selectedYear, setSelectedYear] = useState('year_1'); // 'year_1' | 'year_2' | 'year_3'
  const [selectedTrack, setSelectedTrack] = useState('fullstack'); // 'fullstack' | 'ai'

  // Handle switching between Student and Admin role
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setErrorMsg(null);
    setSignInIdentifier('');
    setSignInPassword('');
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    const identifierClean = signInIdentifier.trim();
    if (!identifierClean || !signInPassword) {
      setErrorMsg(
        role === 'student'
          ? 'Please enter both your Student ID and password.'
          : 'Please enter both your email address and password.'
      );
      return;
    }
    try {
      setSignInLoading(true);
      if (role === 'student') {
        await login(identifierClean, signInPassword, {
          year: selectedYear,
          track_id: selectedYear === 'year_1' ? 'common' : selectedTrack,
        });
      } else {
        await login(identifierClean, signInPassword);
      }
    } catch (err) {
      if (role === 'student') {
        setErrorMsg('Please recheck your password and id.');
      } else {
        setErrorMsg(err.message || 'Please recheck your email and password.');
      }
    } finally {
      setSignInLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#F9C321] text-[#111111] font-black mb-3">
          <GraduationCap className="w-7 h-7 text-[#111111]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Beacon<span className="text-[#F9C321]">.</span>
        </h1>
        <p className="mt-1 text-xs text-[#A1A1AA]">
          Engineering Project Roadmap & Adaptive Learning Platform
        </p>

        {/* Portal Role Selector (Student vs Admin) */}
        <div className="mt-5 p-1 bg-[#1A1A1A] border border-[#2E2E32] rounded-lg grid grid-cols-2 gap-1 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => handleRoleSelect('student')}
            className={`py-1.5 px-3 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              role === 'student'
                ? 'bg-[#F9C321] text-[#111111] shadow'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`py-1.5 px-3 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              role === 'admin'
                ? 'bg-[#F9C321] text-[#111111] shadow'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Sub-header status indicator */}
        <div className="mt-3 text-[11px] font-bold text-[#F9C321] flex items-center justify-center gap-1.5">
          {role === 'student' ? (
            <>
              <UserCheck className="w-3.5 h-3.5 text-[#F9C321]" />
              <span>Student Access Portal</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#F9C321]" />
              <span>Administrator Sign In</span>
            </>
          )}
        </div>
      </div>

      {/* Main Auth Container */}
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#18181B] py-7 px-6 sm:px-8 rounded-xl border border-[#2E2E32] shadow-xl">
          {(errorMsg || authError) && (
            <div className="mb-5 p-3 rounded-lg bg-[#2E1818] border border-[#522020] text-red-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
              <span>{errorMsg || authError}</span>
            </div>
          )}

          {/* ===================== SIGN IN FORM ===================== */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {role === 'admin' ? (
              <div className="p-2.5 rounded-lg bg-[#1F1D13] border border-[#524410] text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#F9C321] shrink-0" />
                <span className="text-[11px] text-[#D4D4D8]">
                  Enter authorized Super Admin credentials to access the command center.
                </span>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-[#1F1D13] border border-[#524410] text-xs flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#F9C321] shrink-0" />
                <span className="text-[11px] text-[#D4D4D8]">
                  Sign in using your assigned Student ID and password.
                </span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                {role === 'admin' ? 'Email Address' : 'Student ID or Full Name'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717A]">
                  {role === 'admin' ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <Hash className="w-4 h-4" />
                  )}
                </div>
                <input
                  type={role === 'admin' ? 'email' : 'text'}
                  required
                  value={signInIdentifier}
                  onChange={(e) => setSignInIdentifier(e.target.value)}
                  placeholder={
                    role === 'admin'
                      ? 'Enter admin email'
                      : 'e.g. ATC2602003 or Gonuguntla Nischal'
                  }
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#111111] border border-[#333333] text-white placeholder-[#71717A] text-xs focus:outline-none focus:border-[#F9C321] focus:ring-1 focus:ring-[#F9C321] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717A]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder={
                    role === 'admin'
                      ? 'Enter admin password'
                      : 'e.g. ATCY26B1001'
                  }
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#111111] border border-[#333333] text-white placeholder-[#71717A] text-xs focus:outline-none focus:border-[#F9C321] focus:ring-1 focus:ring-[#F9C321] transition-colors"
                />
              </div>
            </div>

            {role === 'student' && (
              <div className="space-y-3 pt-2 border-t border-[#27272A]">
                {/* Year of Study Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                      Academic Year
                    </label>
                    <span className="text-[10px] text-[#F9C321] font-semibold">Locked once set</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'year_1', label: '1st Year', sub: 'Foundation' },
                      { id: 'year_2', label: '2nd Year', sub: 'Core Track' },
                      { id: 'year_3', label: '3rd Year', sub: 'Capstone' },
                    ].map((yr) => (
                      <button
                        key={yr.id}
                        type="button"
                        onClick={() => handleYearChange(yr.id)}
                        className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                          selectedYear === yr.id
                            ? 'bg-[#F9C321] text-[#111111] border-[#F9C321] font-bold shadow-sm'
                            : 'bg-[#111111] text-[#D4D4D8] border-[#333333] hover:border-[#52525B]'
                        }`}
                      >
                        <div className="text-xs font-bold leading-tight">{yr.label}</div>
                        <div className={`text-[10px] ${selectedYear === yr.id ? 'text-[#111111]' : 'text-[#71717A]'}`}>
                          {yr.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specialization Stream Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                      Specialization Stream
                    </label>
                    {selectedYear !== 'year_1' && (
                      <span className="text-[10px] text-[#A1A1AA]">Switchable per module</span>
                    )}
                  </div>

                  {selectedYear === 'year_1' ? (
                    <div className="p-2.5 rounded-lg bg-[#111111] border border-[#27272A] text-xs text-[#A1A1AA] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">Common Foundation</span>
                        <span className="text-[10px] text-[#71717A]">Unified curriculum for all 1st-year students</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#27272A] text-[#F9C321] font-bold">Standard</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTrack('fullstack')}
                        className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                          selectedTrack === 'fullstack'
                            ? 'bg-[#F9C321] text-[#111111] border-[#F9C321] font-bold shadow-sm'
                            : 'bg-[#111111] text-[#D4D4D8] border-[#333333] hover:border-[#52525B]'
                        }`}
                      >
                        <div className="text-xs font-bold">Full-Stack & App Dev</div>
                        <div className={`text-[10px] ${selectedTrack === 'fullstack' ? 'text-[#111111]' : 'text-[#71717A]'}`}>
                          Web, Mobile & Cloud
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedTrack('ai')}
                        className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                          selectedTrack === 'ai'
                            ? 'bg-[#F9C321] text-[#111111] border-[#F9C321] font-bold shadow-sm'
                            : 'bg-[#111111] text-[#D4D4D8] border-[#333333] hover:border-[#52525B]'
                        }`}
                      >
                        <div className="text-xs font-bold">AI Engineering</div>
                        <div className={`text-[10px] ${selectedTrack === 'ai' ? 'text-[#111111]' : 'text-[#71717A]'}`}>
                          ML, LLMs & Pipelines
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-[#71717A] leading-relaxed pt-1">
                  🔒 Academic year is locked upon login. Stream can only be switched after completing all required topics in your current module.
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={signInLoading}
              className="w-full mt-3 py-2.5 px-4 rounded-lg bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {signInLoading ? (
                <div className="w-4 h-4 border-2 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>
                    {role === 'admin'
                      ? 'Sign In as Super Admin'
                      : 'Sign In as Student'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#111111]" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
