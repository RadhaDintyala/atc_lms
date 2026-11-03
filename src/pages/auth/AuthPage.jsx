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

  // Handle switching between Student and Admin role
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setErrorMsg(null);
    setSignInIdentifier('');
    setSignInPassword('');
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
      await login(identifierClean, signInPassword);
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
                {role === 'admin' ? 'Email Address' : 'Student ID'}
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
                      ? 'Enter admin email (e.g. beacon.atc@gmail.om)'
                      : 'e.g. ATC260xxxx'
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
                      : 'Enter student password'
                  }
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#111111] border border-[#333333] text-white placeholder-[#71717A] text-xs focus:outline-none focus:border-[#F9C321] focus:ring-1 focus:ring-[#F9C321] transition-colors"
                />
              </div>
            </div>

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
