import axios from 'axios';
import { authService } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || ' http://localhost:3333';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@teapoio:token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para tratar erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      authService.logout();
    }

    return Promise.reject(error);
  }
);

export default api;
