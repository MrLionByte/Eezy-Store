import api from '../api/axiosConfig';
import API_ENDPOINTS from '../config/apiEndpoints';

export const authService = {
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.auth.login, credentials);
    return response.data;
  },
  
  signup: async (userData) => {
    const response = await api.post(API_ENDPOINTS.auth.signup, userData);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post(API_ENDPOINTS.auth.logout);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  }
};

export const userService = {
  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.users.profile);
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await api.put(API_ENDPOINTS.users.profile, data);
    return response.data;
  },
  
  changePassword: async (passwordData) => {
    const response = await api.post(API_ENDPOINTS.users.changePassword, passwordData);
    return response.data;
  }
};

export const productService = {
  getProducts: async (params) => {
    const response = await api.get(API_ENDPOINTS.products.list, { params });
    return response.data;
  },
  
  getProductById: async (id) => {
    const response = await api.get(API_ENDPOINTS.products.detail(id));
    return response.data;
  }
};

// Add more services as needed