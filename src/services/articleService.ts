import api from './api';

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  category: string;
  readTime: number;
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

export interface CreateArticleData {
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  category: string;
  readTime?: number;
  published?: boolean;
}

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
}

export const articleService = {
  async getAll(params?: { category?: string; search?: string }): Promise<Article[]> {
    const response = await api.get<Article[]>('/articles', { params });
    return response.data;
  },

  async getMyArticles(params?: { published?: boolean }): Promise<Article[]> {
    const response = await api.get<Article[]>('/articles/my', { params });
    return response.data;
  },

  async getById(id: string): Promise<Article> {
    const response = await api.get<Article>(`/articles/${id}`);
    return response.data;
  },

  async create(data: CreateArticleData): Promise<Article> {
    const response = await api.post<Article>('/articles', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateArticleData>): Promise<Article> {
    const response = await api.put<Article>(`/articles/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/articles/${id}`);
  }
};
