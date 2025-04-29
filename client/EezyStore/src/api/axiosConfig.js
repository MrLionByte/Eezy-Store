import axios from 'axios';
import API_ENDPOINTS from '../config/apiEndpoints';

console.log(import.meta.env.VITE_API_URL);
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const publicUrls = [API_ENDPOINTS.auth.login, API_ENDPOINTS.auth.signup, API_ENDPOINTS.adminAuth.login];

// Request interceptor
api.interceptors.request.use(
  (config) => {
    
    const isPublicUrl = typeof config.url === 'string' && publicUrls.some(url => config.url.includes(url));
    
    if (!isPublicUrl) {
      const token = localStorage.getItem('token');      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || 
        error.response.status !== 401 || 
        originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url === '/customer/token/refresh') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    try {
      const response = await api.post(API_ENDPOINTS.auth.refreshToken);
      
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        
        originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;        
        return api(originalRequest);
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

export default api;