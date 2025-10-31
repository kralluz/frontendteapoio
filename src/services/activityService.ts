import api from './api';

export interface Comment {
  id: string;
  content: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  difficulty: string;
  ageRange: string;
  duration: number;
  materials: string[];
  steps: string[];
  category: string;
  published: boolean;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  _count?: {
    comments: number;
    likes: number;
    favorites: number;
  };
  comments?: Comment[];
}

export interface CreateActivityData {
  title: string;
  description: string;
  content: string;
  image?: string;
  difficulty: string;
  ageRange: string;
  duration: number;
  materials: string[];
  steps: string[];
  category: string;
  published?: boolean;
}

export const activityService = {
  async getAll(params?: { category?: string; difficulty?: string; search?: string }): Promise<Activity[]> {
    const response = await api.get<Activity[]>('/activities', { params });
    return response.data;
  },

  async getById(id: string): Promise<Activity> {
    const response = await api.get<Activity>(`/activities/${id}`);
    return response.data;
  },

  async create(data: CreateActivityData): Promise<Activity> {
    const response = await api.post<Activity>('/activities', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateActivityData>): Promise<Activity> {
    const response = await api.put<Activity>(`/activities/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/activities/${id}`);
  }
};
