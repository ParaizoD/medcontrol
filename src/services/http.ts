import axios from 'axios';
import { env } from '@/lib/env';

export const http = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - injeta token
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log em desenvolvimento
    if (import.meta.env.DEV) {
      console.log('→ HTTP Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - trata erros globais
http.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('← HTTP Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('← HTTP Error:', error.response?.status, error.config?.url);
    }

    // Token inválido ou expirado
    if (error?.response?.status === 401) {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
