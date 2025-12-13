import axios from 'axios';
import { storage } from '../utils/storage';
import { refreshTokenFlow } from './refreshToken';

const api = axios.create({
  baseURL: 'http://localhost:5114',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const success = await refreshTokenFlow();

      if (success) {
        const newToken = storage.getToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;


