import API from './api';

export const adminSignup = (data) => API.post('/admin/signup', data);
export const adminLogin = (data) => API.post('/admin/login', data);
export const adminGoogleLogin = (data) => API.post('/admin/google', data);
export const adminForgotPassword = (data) => API.post('/admin/forgot-password', data);
export const adminResetPassword = (token, data) => API.post(`/admin/reset-password/${token}`, data);

export const getAdminProfile = () => API.get('/admin/profile');
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminComplaints = (params = {}) => API.get('/admin/complaints', { params });
export const getComplaints = () => API.get('/admin/complaints');

// Requested naming for complaints management
export const updateComplaintStatus = (id, status) =>
  API.put(`/admin/update-complaint/${id}`, { status });

// Backward-compatible function used by existing admin UI
export const updateAdminComplaint = (id, data) => API.put(`/admin/update-complaint/${id}`, data);

export const getAllComplaints = () => API.get('/admin/complaints');
export const getAdminUsers = () => API.get('/admin/users');
