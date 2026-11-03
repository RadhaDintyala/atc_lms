/**
 * API Service for Beacon LMS
 * Handles JWT authentication, request headers, and standardised error envelopes.
 *
 * In production (Vercel → Render split deployment):
 *   Set VITE_API_BASE_URL=https://your-backend.onrender.com/api in Vercel env vars.
 *
 * In local development:
 *   Leave VITE_API_BASE_URL unset — the Vite dev server proxies /api → localhost:3000.
 */

// Clean and auto-normalize base URL to prevent missing /api or double slashes
let rawBase = (import.meta.env.VITE_API_BASE_URL || '/api').trim();
rawBase = rawBase.replace(/\/+$/, ''); // remove trailing slashes
if (rawBase && !rawBase.endsWith('/api') && rawBase.startsWith('http')) {
  rawBase = `${rawBase}/api`;
}
const BASE_URL = rawBase || '/api';

function getToken() {
  return localStorage.getItem('beacon_token') || localStorage.getItem('apexlms_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers,
  });

  // Handle file downloads (like CSV)
  if (options.responseType === 'blob') {
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Download failed' }));
      throw new Error(err.error || 'Network request failed');
    }
    return response.blob();
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/signup')) {
      // Session expired or invalid — clear token and dispatch event
      localStorage.removeItem('beacon_token');
      localStorage.removeItem('apexlms_token');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('beacon:auth-expired', { detail: data.error || 'Session expired' }));
      }
    }
    throw new Error(data.error || 'An unexpected error occurred');
  }

  return data;
}

export const api = {
  // Auth
  login: (identifier, password, options = {}) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: identifier, identifier, password, ...options }),
    }),
  signup: (signupData) =>
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    }),
  getMe: () => request('/auth/me'),
  getTrackStatus: () => request('/auth/me/track-status'),
  updateTrack: (track_id) =>
    request('/auth/me/track', {
      method: 'PUT',
      body: JSON.stringify({ track_id }),
    }),
  updateYear: (year, track_id) =>
    request('/auth/me/year', {
      method: 'PUT',
      body: JSON.stringify({ year, track_id }),
    }),

  // Students
  getStudents: () => request('/students'),
  createStudent: (studentData) =>
    request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),
  getStudentDetail: (id) => request(`/students/${id}`),
  updateStudent: (id, updateData) =>
    request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    }),
  deleteStudent: (id) =>
    request(`/students/${id}`, {
      method: 'DELETE',
    }),

  // Curriculum & Topics
  getCurriculum: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/curriculum${query ? `?${query}` : ''}`);
  },
  getTopic: (id) => request(`/topics/${id}`),
  createTopic: (topicData) =>
    request('/topics', {
      method: 'POST',
      body: JSON.stringify(topicData),
    }),
  updateTopic: (id, topicData) =>
    request(`/topics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(topicData),
    }),
  deleteTopic: (id) =>
    request(`/topics/${id}`, {
      method: 'DELETE',
    }),

  // Categories
  createCategory: (catData) =>
    request('/categories', {
      method: 'POST',
      body: JSON.stringify(catData),
    }),
  updateCategory: (id, catData) =>
    request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(catData),
    }),
  deleteCategory: (id) =>
    request(`/categories/${id}`, {
      method: 'DELETE',
    }),

  // Resources
  getResources: (topicId) =>
    request(`/resources${topicId ? `?topic_id=${topicId}` : ''}`),
  createResource: (resData) =>
    request('/resources', {
      method: 'POST',
      body: JSON.stringify(resData),
    }),
  updateResource: (id, resData) =>
    request(`/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resData),
    }),
  deleteResource: (id) =>
    request(`/resources/${id}`, {
      method: 'DELETE',
    }),

  // Progress
  getProgress: (studentId) =>
    request(`/progress${studentId ? `?student_id=${studentId}` : ''}`),
  updateTopicStatus: (topic_id, status, notes) =>
    request('/progress/topic', {
      method: 'POST',
      body: JSON.stringify({ topic_id, status, notes }),
    }),
  updateResourceStatus: (resource_id, status) =>
    request('/progress/resource', {
      method: 'POST',
      body: JSON.stringify({ resource_id, status }),
    }),

  // Projects
  getProjects: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/projects${query ? `?${query}` : ''}`);
  },
  getProject: (id) => request(`/projects/${id}`),
  saveProject: (projData) =>
    request('/projects', {
      method: 'POST',
      body: JSON.stringify(projData),
    }),
  reviewProject: (id, reviewData) =>
    request(`/projects/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),

  // Admin Analytics & Reports
  getAnalytics: () => request('/admin/analytics'),
  downloadProgressCSV: () =>
    request('/reports/progress-csv', {
      responseType: 'blob',
    }),
};
