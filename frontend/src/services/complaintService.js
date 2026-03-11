import API from './api';

// ─── Complaints ────────────────────────────────────────

export const createComplaint = (data) =>
  API.post('/complaints', data);

export const getMyComplaints = (params = {}) =>
  API.get('/complaints', { params });

export const getComplaintStats = () =>
  API.get('/complaints/stats');

export const getComplaint = (id) =>
  API.get(`/complaints/${id}`);

export const deleteComplaint = (id) =>
  API.delete(`/complaints/${id}`);

// ─── Auth (used directly from AuthContext, but exported for flexibility) ─

export const getProfile = () =>
  API.get('/auth/profile');

export const updateProfile = (data) =>
  API.put('/auth/profile', data);

export const changePassword = (data) =>
  API.put('/auth/change-password', data);
