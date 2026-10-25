/**
 * API Service for ApexLMS
 * Handles JWT authentication, request headers, and standardized error envelopes.
 */

const BASE_URL = '/api';

function getToken() {
  return localStorage.getItem('apexlms_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
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
    throw new Error(data.error || 'An unexpected error occurred');
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => request('/auth/me'),

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
