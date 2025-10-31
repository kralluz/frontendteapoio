/**
 * Tipos compartilhados entre os serviços da aplicação TEA Poio
 */

// USUÁRIO
export interface Author {
  id: string;
  name: string;
  avatar?: string;
}

export interface UserProfile extends Author {
  email: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  createdAt: string;
  updatedAt: string;
}

// COMENTÁRIOS
export interface CommentUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface BaseComment {
  id: string;
  content: string;
  userId: string;
  user: CommentUser;
  createdAt: string;
  updatedAt: string;
}

// CONTADORES
export interface ContentCounts {
  comments: number;
  likes: number;
  favorites: number;
}

// FILTROS
export interface ArticleFilters {
  category?: string;
  search?: string;
}

export interface ActivityFilters {
  category?: string;
  difficulty?: string;
  search?: string;
}

// ROLES
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';

// DIFICULDADE
export type DifficultyLevel = 'FACIL' | 'MEDIO' | 'DIFICIL';

// NIVEL DE AUTISMO
export type AutismLevel = 'NIVEL_1' | 'NIVEL_2' | 'NIVEL_3';
