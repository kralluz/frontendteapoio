import api from './api';
import { Article } from './articleService';
import { Activity } from './activityService';

// COMENTÁRIOS
export interface CreateCommentData {
  content: string;
  articleId?: string;
  activityId?: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  articleId?: string;
  activityId?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export const commentService = {
  async create(data: CreateCommentData): Promise<Comment> {
    const response = await api.post<Comment>('/comments', data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/comments/${id}`);
  }
};

// LIKES
export interface ToggleLikeData {
  articleId?: string;
  activityId?: string;
}

export interface LikeResponse {
  liked: boolean;
  message: string;
  like: {
    id: string;
    userId: string;
    articleId?: string;
    activityId?: string;
    createdAt: string;
  };
}

export interface Like {
  id: string;
  userId: string;
  articleId?: string;
  activityId?: string;
  createdAt: string;
  article?: Article;
  activity?: Activity;
}

export const likeService = {
  async toggle(data: ToggleLikeData): Promise<LikeResponse> {
    const response = await api.post<LikeResponse>('/likes', data);
    return response.data;
  },

  async getMyLikes(): Promise<Like[]> {
    const response = await api.get<Like[]>('/likes/my-likes');
    return response.data;
  }
};

// FAVORITOS
export interface ToggleFavoriteData {
  articleId?: string;
  activityId?: string;
}

export interface FavoriteResponse {
  favorited: boolean;
  message: string;
  favorite: {
    id: string;
    userId: string;
    articleId?: string;
    activityId?: string;
    createdAt: string;
  };
}

export interface Favorite {
  id: string;
  userId: string;
  articleId?: string;
  activityId?: string;
  createdAt: string;
  article?: Article;
  activity?: Activity;
}

export const favoriteService = {
  async toggle(data: ToggleFavoriteData): Promise<FavoriteResponse> {
    const response = await api.post<FavoriteResponse>('/favorites', data);
    return response.data;
  },

  async getMyFavorites(): Promise<Favorite[]> {
    const response = await api.get<Favorite[]>('/favorites/my-favorites');
    return response.data;
  }
};
