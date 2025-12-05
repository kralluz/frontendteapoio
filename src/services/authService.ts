import api from './api';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  crp?: string;
  specialty?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    articles: number;
    activities: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface ProfessionalRegisterData extends RegisterData {
  crp: string;
  specialty: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

interface DecodedToken {
  exp: number;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    localStorage.setItem('@teapoio:token', response.data.token);
    localStorage.setItem('@teapoio:user', JSON.stringify(response.data.user));
    
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    
    localStorage.setItem('@teapoio:token', response.data.token);
    localStorage.setItem('@teapoio:user', JSON.stringify(response.data.user));
    
    return response.data;
  },

  async registerProfessional(data: ProfessionalRegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register/professional', data);
    
    localStorage.setItem('@teapoio:token', response.data.token);
    localStorage.setItem('@teapoio:user', JSON.stringify(response.data.user));
    
    return response.data;
  },

  logout() {
    localStorage.removeItem('@teapoio:token');
    localStorage.removeItem('@teapoio:user');
    // Forçar o recarregamento da página para limpar o estado da aplicação
    window.location.href = '/login';
  },

  getCurrentUser(): User | null {
    if (!this.isAuthenticated()) {
      return null;
    }
    const userStr = localStorage.getItem('@teapoio:user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('@teapoio:token');
  },

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }
    return true;
  }
};
