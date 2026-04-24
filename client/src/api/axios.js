import axios from 'axios';

const resolveBaseURL = () => {
  const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (envBaseUrl) {
    const cleaned = envBaseUrl.replace(/\/+$/, '');
    return /\/api$/i.test(cleaned) ? cleaned : `${cleaned}/api`;
  }

  return window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://codequest-wx5m.onrender.com/api';
};

const api = axios.create({
  baseURL: resolveBaseURL(),
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cq_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 – token expired/invalid
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cq_token');
      localStorage.removeItem('cq_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
