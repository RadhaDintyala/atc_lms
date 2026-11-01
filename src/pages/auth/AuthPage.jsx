import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Lock,
  Mail,
  User,
  BadgeCheck,
  Code2,
  Cpu,
  Hash,
} from 'lucide-react';

export default function AuthPage() {
  const { login, signup, authError } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Sign Up State
  const [role, setRole] = useState('student'); // 'student' | 'admin'
  const [fullName, setFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [year, setYear] = useState('year_1');
  const [track, setTrack] = useState('common');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [college, setCollege] = useState('Beacon Institute of Technology');
  const [rollNumber, setRollNumber] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);

  // Handle year change in signup form
  const handleYearChange = (newYear) => {
    setYear(newYear);
    if (newYear === 'year_1') {
      setTrack('common');
    } else if (track === 'common') {
      setTrack('fullstack');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    const emailClean = signInEmail.trim().toLowerCase();
    if (!emailClean || !signInPassword) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }
    try {
      setSignInLoading(true);
      await login(emailClean, signInPassword);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    const emailClean = signUpEmail.trim().toLowerCase();
    const nameClean = fullName.trim();

    if (!nameClean || !emailClean || !signUpPassword) {
      setErrorMsg('Please fill in your full name, email address, and password.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters in length.');
      return;
    }

    try {
      setSignUpLoading(true);
      await signup({
        role,
        full_name: nameClean,
        email: emailClean,
        password: signUpPassword,
        year: role === 'student' ? year : undefined,
        track_id: role === 'student' ? track : undefined,
        department: department.trim(),
        college: college.trim(),
        roll_number: rollNumber.trim() || undefined,
      });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check form details.');
    } finally {
      setSignUpLoading(false);
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

        {/* Auth Mode Toggle Tabs */}
        <div className="mt-6 p-1 bg-[#1A1A1A] border border-[#2E2E32] rounded-lg grid grid-cols-2 gap-1 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-[#F9C321] text-[#111111]'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#F9C321] text-[#111111]'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Main Auth Container */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#18181B] py-7 px-6 sm:px-8 rounded-xl border border-[#2E2E32] shadow-xl">
          {(errorMsg || authError) && (
            <div className="mb-5 p-3 rounded-lg bg-[#2E1818] border border-[#522020] text-red-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
              <span>{errorMsg || authError}</span>
            </div>
          )}

          {/* ===================== SIGN IN FORM ===================== */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717A]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="name@university.edu"
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
                    placeholder="Enter your password"
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
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-[#111111]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ===================== SIGN UP FORM ===================== */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Role Selector Card */}
              <div>
                <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">
                  Select Your Account Role
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      role === 'student'
                        ? 'bg-[#1C1C1E] border-[#F9C321] text-white'
                        : 'bg-[#111111] border-[#2E2E32] text-[#71717A] hover:border-[#444]'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-md shrink-0 ${
                        role === 'student'
                          ? 'bg-[#F9C321] text-[#111111] font-bold'
                          : 'bg-[#1C1C1E] text-[#71717A]'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        Student
                        {role === 'student' && <BadgeCheck className="w-3.5 h-3.5 text-[#F9C321]" />}
                      </div>
                      <p className="text-[10px] text-[#A1A1AA] mt-0.5 leading-snug">
                        Complete curriculum & submit projects
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      role === 'admin'
                        ? 'bg-[#1C1C1E] border-white text-white'
                        : 'bg-[#111111] border-[#2E2E32] text-[#71717A] hover:border-[#444]'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-md shrink-0 ${
                        role === 'admin'
                          ? 'bg-white text-[#111111] font-bold'
                          : 'bg-[#1C1C1E] text-[#71717A]'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        Mentor / Admin
                        {role === 'admin' && <BadgeCheck className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <p className="text-[10px] text-[#A1A1AA] mt-0.5 leading-snug">
                        Review submissions & manage syllabus
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Name & Email */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717A]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Maya Sharma"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#111111] border border-[#333333] text-white placeholder-[#71717A] text-xs focus:outline-none focus:border-[#F9C321] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717A]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="e.g. maya@institution.edu"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#111111] border border-[#333333] text-white placeholder-[#71717A] text-xs focus:outline-none focus:border-[#F9C321] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                    Password * (Min. 6 characters)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717A]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Create a secure password"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#111111] border border-[#333333] text-white placeholder-[#71717A] text-xs focus:outline-none focus:border-[#F9C321] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Student-specific details: Year of Study, Track, Roll Number */}
              {role === 'student' && (
                <div className="p-3.5 rounded-lg bg-[#111111] border border-[#2E2E32] space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#F9C321] uppercase tracking-wider mb-1.5">
                      Select Your Year of Study
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleYearChange('year_1')}
                        className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                          year === 'year_1'
                            ? 'bg-[#F9C321] text-[#111111] font-bold border-[#F9C321]'
                            : 'bg-[#18181B] border-[#2E2E32] text-[#A1A1AA] hover:text-white'
                        }`}
                      >
                        <p className="text-xs font-bold">1st Year</p>
                        <p className={`text-[10px] ${year === 'year_1' ? 'text-[#111111]' : 'text-[#71717A]'}`}>
                          Foundation
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleYearChange('year_2')}
                        className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                          year === 'year_2'
                            ? 'bg-[#F9C321] text-[#111111] font-bold border-[#F9C321]'
                            : 'bg-[#18181B] border-[#2E2E32] text-[#A1A1AA] hover:text-white'
                        }`}
                      >
                        <p className="text-xs font-bold">2nd Year</p>
                        <p className={`text-[10px] ${year === 'year_2' ? 'text-[#111111]' : 'text-[#71717A]'}`}>
                          Core Track
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleYearChange('year_3')}
                        className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                          year === 'year_3'
                            ? 'bg-[#F9C321] text-[#111111] font-bold border-[#F9C321]'
                            : 'bg-[#18181B] border-[#2E2E32] text-[#A1A1AA] hover:text-white'
                        }`}
                      >
                        <p className="text-xs font-bold">3rd Year</p>
                        <p className={`text-[10px] ${year === 'year_3' ? 'text-[#111111]' : 'text-[#71717A]'}`}>
                          Capstone
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Track selection (shown if 2nd or 3rd year) */}
                  {year !== 'year_1' ? (
                    <div>
                      <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                        Specialization Track
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setTrack('fullstack')}
                          className={`py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            track === 'fullstack'
                              ? 'bg-white text-[#111111] border-white font-bold'
                              : 'bg-[#18181B] border-[#2E2E32] text-[#A1A1AA]'
                          }`}
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>Full-Stack Track</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTrack('ai')}
                          className={`py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            track === 'ai'
                              ? 'bg-white text-[#111111] border-white font-bold'
                              : 'bg-[#18181B] border-[#2E2E32] text-[#A1A1AA]'
                          }`}
                        >
                          <Cpu className="w-3.5 h-3.5" />
                          <span>AI Engineering</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#A1A1AA] bg-[#18181B] p-2 rounded border border-[#2E2E32]">
                      1st Year students follow the <strong>Common Foundation</strong> track covering programming, web architecture, and prompt engineering.
                    </p>
                  )}

                  {/* Roll Number / Student ID */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">
                      Roll Number / Student ID (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717A]">
                        <Hash className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="e.g. ENG2026-0488"
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#18181B] border border-[#333333] text-white placeholder-[#71717A] text-xs font-mono focus:outline-none focus:border-[#F9C321] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Admin specific details */}
              {role === 'admin' && (
                <div className="p-3 rounded-lg bg-[#111111] border border-[#2E2E32] text-xs text-[#A1A1AA] space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <ShieldCheck className="w-4 h-4 text-[#F9C321]" />
                    <span>Mentor Administrator Permissions</span>
                  </div>
                  <p className="text-[11px] text-[#71717A]">
                    Admin accounts have full authority to modify course topics, learning resources, and track all student cohorts in real-time.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={signUpLoading}
                className="w-full mt-3 py-2.5 px-4 rounded-lg bg-[#F9C321] hover:bg-[#E5B01D] text-[#111111] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {signUpLoading ? (
                  <div className="w-4 h-4 border-2 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Create {role === 'admin' ? 'Admin' : 'Student'} Account</span>
                    <ArrowRight className="w-4 h-4 text-[#111111]" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
