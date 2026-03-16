import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token based on route scope (admin vs user)
API.interceptors.request.use((config) => {
  const isAdminRequest = String(config.url || '').startsWith('/admin');
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');

  if (isAdminRequest && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  if (!isAdminRequest && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle auth failures for each area separately
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const requestUrl = String(error.config?.url || '');
      const isAdminRequest = requestUrl.startsWith('/admin');

      if (isAdminRequest) {
        const publicAuthPaths = [
          '/admin/login',
          '/admin/signup',
          '/admin/forgot-password',
        ];
        const isPublicAuthPath =
          publicAuthPaths.includes(window.location.pathname) ||
          window.location.pathname.startsWith('/admin/reset-password/');

        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        if (!isPublicAuthPath) {
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const inAdminArea = window.location.pathname.startsWith('/admin');
      if (!inAdminArea && window.location.pathname !== '/signin') {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
