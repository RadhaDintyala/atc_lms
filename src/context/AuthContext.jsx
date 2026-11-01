import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem('beacon_token') || localStorage.getItem('apexlms_token') || null
  );
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [showYearModal, setShowYearModal] = useState(false);

  // Initialize auth on mount
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
        const data = await api.getMe();
        setUser(data.user);
        setProfile(data.profile || null);
      } catch (err) {
        console.warn('Session expired or invalid:', err);
        localStorage.removeItem('beacon_token');
        localStorage.removeItem('apexlms_token');
        setToken(null);
        setUser(null);
        setProfile(null);
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
      localStorage.setItem('beacon_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setProfile(data.profile || null);
      return data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (signupData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await api.signup(signupData);
      localStorage.setItem('beacon_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setProfile(data.profile || null);
      return data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('beacon_token');
    localStorage.removeItem('apexlms_token');
    setToken(null);
    setUser(null);
    setProfile(null);
    setShowYearModal(false);
  };

  const updateYear = async (year, track_id) => {
    try {
      const updatedProfile = await api.updateYear(year, track_id);
      setProfile((prev) => ({ ...prev, ...updatedProfile }));
      setShowYearModal(false);
      return updatedProfile;
    } catch (err) {
      console.error('Failed to update year:', err);
      throw err;
    }
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const data = await api.getMe();
      setUser(data.user);
      setProfile(data.profile || null);
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
    showYearModal,
    setShowYearModal,
    login,
    signup,
    logout,
    updateYear,
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
