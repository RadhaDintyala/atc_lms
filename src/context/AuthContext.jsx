import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = [
  {
    role: 'admin',
    name: 'Dr. Sarah Chen (Chief Mentor)',
    email: 'mentor.admin@apex.edu',
    tag: 'Mentor Admin',
    desc: 'Full administrative access: curriculum management, student roster, project approvals, reports.',
  },
  {
    role: 'student',
    name: 'Alex Rivers',
    email: 'alex.rivers@apex.edu',
    tag: '1st Year • Common Foundation',
    desc: 'Programming fundamentals, web architecture, Git workflows, prompt engineering.',
  },
  {
    role: 'student',
    name: 'Priya Patel',
    email: 'priya.patel@apex.edu',
    tag: '2nd Year • Full-Stack Track',
    desc: 'FastAPI, React, PostgreSQL, Docker, Redis, CI/CD, and project submissions.',
  },
  {
    role: 'student',
    name: 'Marcus Vance',
    email: 'marcus.vance@apex.edu',
    tag: '2nd Year • AI Engineering Track',
    desc: 'Python for AI, Vector DBs, RAG pipelines, Autonomous Agents, LLM evaluation.',
  },
  {
    role: 'student',
    name: 'Elena Rostova',
    email: 'elena.rostova@apex.edu',
    tag: '3rd Year • Advanced Capstone',
    desc: 'Distributed systems, system design, microservices, performance tuning, and capstone.',
  },
  {
    role: 'student',
    name: 'Devon Lane',
    email: 'devon.lane@apex.edu',
    tag: '2nd Year • Inactive (25d)',
    desc: 'Inactive student account flagged on admin dashboard for follow-up.',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('apexlms_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize auth
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        // By default, log in as Priya Patel (Year 2 Full-Stack) to give an immediate rich experience
        await switchDemoAccount('priya.patel@apex.edu');
        setLoading(false);
        return;
      }
      try {
        const data = await api.getMe();
        setUser(data.user);
        setProfile(data.profile);
      } catch (err) {
        console.warn('Session expired or invalid, logging into default demo account:', err);
        localStorage.removeItem('apexlms_token');
        setToken(null);
        await switchDemoAccount('priya.patel@apex.edu');
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await api.login(email, password);
      localStorage.setItem('apexlms_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setProfile(data.profile);
      return data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const switchDemoAccount = async (email) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await api.login(email, 'Password@123');
      localStorage.setItem('apexlms_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setProfile(data.profile);
      return data;
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('apexlms_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const data = await api.getMe();
      setUser(data.user);
      setProfile(data.profile);
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  const value = {
    user,
    profile,
    token,
    role: user?.role || 'student',
    isAdmin: user?.role === 'admin',
    loading,
    authError,
    login,
    logout,
    switchDemoAccount,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
