import api from './api';
import { User } from './authService';

export interface UpdateUserData {
  name?: string;
  avatar?: string;
}

export interface PublicUser {
  id: string;
  name: string;
  avatar?: string;
  createdAt: string;
  _count: {
    articles: number;
    activities: number;
  };
}

export const userService = {
  async getMe(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  async updateMe(data: UpdateUserData): Promise<User> {
    const response = await api.put<User>('/users/me', data);

    // Atualizar localStorage
    localStorage.setItem('@teapoio:user', JSON.stringify(response.data));

    return response.data;
  },

  async getById(id: string): Promise<PublicUser> {
    const response = await api.get<PublicUser>(`/users/${id}`);
    return response.data;
  }
};
