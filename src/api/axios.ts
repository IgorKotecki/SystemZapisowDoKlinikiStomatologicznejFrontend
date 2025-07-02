import axios from 'axios';
import { storage } from '../utils/storage';

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

export default api;
