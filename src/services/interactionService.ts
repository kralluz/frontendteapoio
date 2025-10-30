import api from './api';

export interface CreateCommentData {
  content: string;
  articleId?: string;
  activityId?: string;
}

export const commentService = {
  async create(data: CreateCommentData): Promise<any> {
    const response = await api.post('/comments', data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/comments/${id}`);
  }
};

export interface ToggleLikeData {
  articleId?: string;
  activityId?: string;
}

export const likeService = {
  async toggle(data: ToggleLikeData): Promise<any> {
    const response = await api.post('/likes', data);
    return response.data;
  },

  async getMyLikes(): Promise<any[]> {
    const response = await api.get('/likes/my-likes');
    return response.data;
  }
};

export interface ToggleFavoriteData {
  articleId?: string;
  activityId?: string;
}

export const favoriteService = {
  async toggle(data: ToggleFavoriteData): Promise<any> {
    const response = await api.post('/favorites', data);
    return response.data;
  },

  async getMyFavorites(): Promise<any[]> {
    const response = await api.get('/favorites/my-favorites');
    return response.data;
  }
};
