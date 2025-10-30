import api from './api';
import { User } from './authService';

export const userService = {
  async getMe(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  async updateMe(data: { name?: string; avatar?: string }): Promise<User> {
    const response = await api.put<User>('/users/me', data);
    
    // Atualizar localStorage
    localStorage.setItem('@teapoio:user', JSON.stringify(response.data));
    
    return response.data;
  },

  async getById(id: string): Promise<any> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }
};
