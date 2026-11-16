import axios from 'axios';

// In development, target http://localhost:5000/api directly or use env var
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export const getRemedy = async (data) => {
  const response = await api.post('/consultation', data);
  return response.data;
};

export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'all') {
    params.append('category', filters.category);
  }
  if (filters.search) {
    params.append('search', filters.search);
  }
  const query = params.toString();
  const endpoint = query ? `/products?${query}` : '/products';
  const response = await api.get(endpoint);
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/consultations');
  return response.data;
};

export default api;
