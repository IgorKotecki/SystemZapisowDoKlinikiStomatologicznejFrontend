import axios from 'axios';
import { storage } from '../utils/storage';
import { refreshTokenFlow } from './refreshToken';

const api = axios.create({
  baseURL: 'http://localhost:5114',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,
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
    
    if (originalRequest.url?.includes('/api/auth/login') || 
        originalRequest.url?.includes('/api/auth/register')) {
      return Promise.reject(error);
    }

    // Sprawdź czy to błąd 401 (Unauthorized) i nie próbowaliśmy już odświeżyć
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Próbuj odświeżyć token
        const newToken = await refreshTokenFlow();
        
        if (newToken) {
          // Zaktualizuj nagłówek z nowym tokenem
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // WYWOŁAJ PONOWNIE ORYGINALNE ŻĄDANIE
          return api(originalRequest);
        } else {
          // Jeśli odświeżenie się nie udało - przekieruj do logowania
          storage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        storage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;


