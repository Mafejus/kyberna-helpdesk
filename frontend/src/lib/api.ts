import axios from 'axios';

// Determine baseURL dynamically if env var is missing
let baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseURL && typeof window !== 'undefined') {
  // If no env var, use current hostname but port 4000
  baseURL = `${window.location.protocol}//${window.location.hostname}:4000`;
}

const api = axios.create({
  baseURL: baseURL || 'http://localhost:4000', // Ultimate fallback for SSR without env
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
       if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
       }
    }
    return Promise.reject(error);
  }
);

export default api;
