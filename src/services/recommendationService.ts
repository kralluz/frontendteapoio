import { api } from './api';
import { Article } from './articleService';
import { Activity } from './activityService';

export interface Recommendations {
  articles: Article[];
  activities: Activity[];
}

export const recommendationService = {
  async getRecommendations(): Promise<Recommendations> {
    const response = await api.get<Recommendations>('/recommendations');
    return response.data;
  },

  async getArticleRecommendations(id: string): Promise<Article[]> {
    const response = await api.get<Article[]>(`/recommendations/articles/${id}`);
    return response.data;
  },

  async getActivityRecommendations(id: string): Promise<Activity[]> {
    const response = await api.get<Activity[]>(`/recommendations/activities/${id}`);
    return response.data;
  },
};
