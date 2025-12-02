import { api } from './api';
import { User } from './authService';

interface UpdateUserData {
  name?: string;
  avatar?: string;
}

interface ChangePasswordData {
  currentPassword?: string;
  newPassword?: string;
}

const getMe = async (): Promise<User> => {
  const response = await api.get('/users/me');
  return response.data;
};

const getById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

const updateMe = async (data: UpdateUserData) => {
  const response = await api.put('/users/me', data);
  return response.data;
};

const changePassword = async (data: ChangePasswordData) => {
  const response = await api.put('/users/me/password', data);
  return response.data;
};

export const userService = {
  getMe,
  getById,
  updateMe,
  changePassword,
};