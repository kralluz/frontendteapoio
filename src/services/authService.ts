import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
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

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Salvar token e usuário no localStorage
    localStorage.setItem('@teapoio:token', response.data.token);
    localStorage.setItem('@teapoio:user', JSON.stringify(response.data.user));
    
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    
    // Salvar token e usuário no localStorage
    localStorage.setItem('@teapoio:token', response.data.token);
    localStorage.setItem('@teapoio:user', JSON.stringify(response.data.user));
    
    return response.data;
  },

  logout() {
    localStorage.removeItem('@teapoio:token');
    localStorage.removeItem('@teapoio:user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('@teapoio:user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('@teapoio:token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
