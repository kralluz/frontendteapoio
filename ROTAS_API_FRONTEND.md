# Documentação das Rotas da API - Frontend TEA Poio

## Visão Geral

Este documento descreve todas as rotas da API implementadas no frontend da aplicação TEA Poio. O frontend está completamente sincronizado com as rotas do backend.

### Base URL
```
http://localhost:3333/api
```

Configurada via variável de ambiente: `REACT_APP_API_URL`

---

## 🔐 AUTENTICAÇÃO

### Arquivos
- **Service**: `/src/services/authService.ts`
- **Context**: `/src/contexts/AuthContext.tsx`

### Rotas Implementadas

#### 1. POST /auth/register
**Descrição**: Registrar novo usuário

**Arquivo**: `authService.ts:40-48`

**Requisição**:
```typescript
interface RegisterData {
  email: string;
  password: string;
  name: string;
}
```

**Resposta**:
```typescript
interface AuthResponse {
  user: User;
  token: string;
}
```

**Uso**:
```typescript
const result = await authService.register({
  email: 'usuario@email.com',
  password: 'senha123',
  name: 'Nome do Usuário'
});
```

---

#### 2. POST /auth/login
**Descrição**: Fazer login

**Arquivo**: `authService.ts:30-38`

**Requisição**:
```typescript
interface LoginCredentials {
  email: string;
  password: string;
}
```

**Resposta**:
```typescript
interface AuthResponse {
  user: User;
  token: string;
}
```

**Uso**:
```typescript
const result = await authService.login({
  email: 'usuario@email.com',
  password: 'senha123'
});
```

---

#### 3. Logout (Local)
**Descrição**: Fazer logout (limpa localStorage)

**Arquivo**: `authService.ts:50-53`

**Uso**:
```typescript
authService.logout();
```

---

## 👤 USUÁRIOS

### Arquivos
- **Service**: `/src/services/userService.ts`

### Rotas Implementadas

#### 1. GET /users/me
**Descrição**: Obter dados do usuário logado

**Arquivo**: `userService.ts:21-24`

**Autenticação**: Requerida (Bearer Token automático)

**Resposta**:
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  createdAt: string;
  updatedAt: string;
}
```

**Uso**:
```typescript
const user = await userService.getMe();
```

---

#### 2. PUT /users/me
**Descrição**: Atualizar dados do usuário logado

**Arquivo**: `userService.ts:26-33`

**Autenticação**: Requerida

**Requisição**:
```typescript
interface UpdateUserData {
  name?: string;
  avatar?: string;
}
```

**Uso**:
```typescript
const updatedUser = await userService.updateMe({
  name: 'Novo Nome',
  avatar: 'https://exemplo.com/avatar.jpg'
});
```

---

#### 3. GET /users/:id
**Descrição**: Obter dados públicos de um usuário específico

**Arquivo**: `userService.ts:35-38`

**Autenticação**: Não requerida

**Resposta**:
```typescript
interface PublicUser {
  id: string;
  name: string;
  avatar?: string;
  createdAt: string;
  _count: {
    articles: number;
    activities: number;
  };
}
```

**Uso**:
```typescript
const user = await userService.getById('uuid-do-usuario');
```

---

## 📝 ARTIGOS

### Arquivos
- **Service**: `/src/services/articleService.ts`

### Rotas Implementadas

#### 1. GET /articles
**Descrição**: Listar todos os artigos publicados

**Arquivo**: `articleService.ts:51-54`

**Autenticação**: Não requerida

**Query Parameters**:
- `category?: string` - Filtrar por categoria
- `search?: string` - Buscar em título e conteúdo

**Resposta**:
```typescript
interface Article {
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
```

**Uso**:
```typescript
// Todos os artigos
const articles = await articleService.getAll();

// Com filtros
const articles = await articleService.getAll({
  category: 'educacao',
  search: 'autismo'
});
```

---

#### 2. GET /articles/:id
**Descrição**: Obter um artigo específico com comentários

**Arquivo**: `articleService.ts:56-59`

**Autenticação**: Não requerida

**Uso**:
```typescript
const article = await articleService.getById('uuid-do-artigo');
```

---

#### 3. POST /articles
**Descrição**: Criar novo artigo

**Arquivo**: `articleService.ts:61-64`

**Autenticação**: Requerida

**Requisição**:
```typescript
interface CreateArticleData {
  title: string;          // Mínimo 5 caracteres
  content: string;        // Mínimo 10 caracteres
  excerpt?: string;
  image?: string;         // URL válida
  category: string;
  readTime?: number;      // Inteiro positivo
  published?: boolean;    // Default: true
}
```

**Uso**:
```typescript
const newArticle = await articleService.create({
  title: 'Título do Artigo',
  content: 'Conteúdo completo...',
  excerpt: 'Resumo do artigo',
  category: 'educacao',
  readTime: 5,
  published: true
});
```

---

#### 4. PUT /articles/:id
**Descrição**: Atualizar artigo (apenas autor)

**Arquivo**: `articleService.ts:66-69`

**Autenticação**: Requerida

**Autorização**: Apenas o autor pode editar

**Uso**:
```typescript
const updatedArticle = await articleService.update('uuid-do-artigo', {
  title: 'Novo Título',
  content: 'Novo conteúdo'
});
```

---

#### 5. DELETE /articles/:id
**Descrição**: Deletar artigo (apenas autor)

**Arquivo**: `articleService.ts:71-73`

**Autenticação**: Requerida

**Autorização**: Apenas o autor pode deletar

**Uso**:
```typescript
await articleService.delete('uuid-do-artigo');
```

---

## 🎯 ATIVIDADES

### Arquivos
- **Service**: `/src/services/activityService.ts`

### Rotas Implementadas

#### 1. GET /activities
**Descrição**: Listar todas as atividades publicadas

**Arquivo**: `activityService.ts:58-61`

**Autenticação**: Não requerida

**Query Parameters**:
- `category?: string` - Filtrar por categoria
- `difficulty?: string` - Filtrar por dificuldade
- `search?: string` - Buscar em título e descrição

**Resposta**:
```typescript
interface Activity {
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
```

**Uso**:
```typescript
// Todas as atividades
const activities = await activityService.getAll();

// Com filtros
const activities = await activityService.getAll({
  category: 'jogos',
  difficulty: 'facil',
  search: 'coordenacao'
});
```

---

#### 2. GET /activities/:id
**Descrição**: Obter uma atividade específica com comentários

**Arquivo**: `activityService.ts:63-66`

**Uso**:
```typescript
const activity = await activityService.getById('uuid-da-atividade');
```

---

#### 3. POST /activities
**Descrição**: Criar nova atividade

**Arquivo**: `activityService.ts:68-71`

**Autenticação**: Requerida

**Requisição**:
```typescript
interface CreateActivityData {
  title: string;          // Mínimo 5 caracteres
  description: string;    // Mínimo 10 caracteres
  content: string;        // Mínimo 10 caracteres
  image?: string;         // URL válida
  difficulty: string;
  ageRange: string;
  duration: number;       // Inteiro positivo (minutos)
  materials: string[];    // Array de materiais necessários
  steps: string[];        // Array de passos
  category: string;
  published?: boolean;    // Default: true
}
```

**Uso**:
```typescript
const newActivity = await activityService.create({
  title: 'Atividade de Coordenação',
  description: 'Descrição da atividade',
  content: 'Conteúdo detalhado...',
  difficulty: 'facil',
  ageRange: '3-6',
  duration: 30,
  materials: ['Papel', 'Lápis de cor', 'Tesoura'],
  steps: ['Passo 1', 'Passo 2', 'Passo 3'],
  category: 'coordenacao'
});
```

---

#### 4. PUT /activities/:id
**Descrição**: Atualizar atividade (apenas autor)

**Arquivo**: `activityService.ts:73-76`

**Autenticação**: Requerida

**Uso**:
```typescript
const updatedActivity = await activityService.update('uuid-da-atividade', {
  title: 'Novo Título',
  duration: 45
});
```

---

#### 5. DELETE /activities/:id
**Descrição**: Deletar atividade (apenas autor)

**Arquivo**: `activityService.ts:78-80`

**Autenticação**: Requerida

**Uso**:
```typescript
await activityService.delete('uuid-da-atividade');
```

---

## 🧩 PERFIS DE AUTISMO

### Arquivos
- **Service**: `/src/services/autismProfileService.ts`

### Rotas Implementadas

#### 1. GET /autism-profiles
**Descrição**: Listar perfis do usuário logado

**Arquivo**: `autismProfileService.ts:35-38`

**Autenticação**: Requerida

**Resposta**:
```typescript
interface AutismProfile {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  level: string;
  interests: string[];
  sensitivities: string[];
  strengths: string[];
  challenges: string[];
  notes?: string;
  photo?: string;
  parentId: string;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Uso**:
```typescript
const profiles = await autismProfileService.getAll();
```

---

#### 2. GET /autism-profiles/:id
**Descrição**: Obter um perfil específico (apenas do próprio usuário)

**Arquivo**: `autismProfileService.ts:40-43`

**Autenticação**: Requerida

**Autorização**: Apenas o responsável pode visualizar

**Uso**:
```typescript
const profile = await autismProfileService.getById('uuid-do-perfil');
```

---

#### 3. POST /autism-profiles
**Descrição**: Criar novo perfil de autismo

**Arquivo**: `autismProfileService.ts:45-48`

**Autenticação**: Requerida

**Requisição**:
```typescript
interface CreateProfileData {
  name: string;           // Mínimo 2 caracteres
  age: number;            // Inteiro positivo
  diagnosis: string;
  level: string;
  interests: string[];
  sensitivities: string[];
  strengths: string[];
  challenges: string[];
  notes?: string;
  photo?: string;         // URL válida
}
```

**Uso**:
```typescript
const newProfile = await autismProfileService.create({
  name: 'João Silva',
  age: 8,
  diagnosis: 'TEA Nível 1',
  level: 'NIVEL_1',
  interests: ['Dinossauros', 'Matemática', 'Lego'],
  sensitivities: ['Barulhos altos', 'Luzes fortes'],
  strengths: ['Memória visual', 'Raciocínio lógico'],
  challenges: ['Interação social', 'Transições'],
  notes: 'Prefere ambientes estruturados'
});
```

---

#### 4. PUT /autism-profiles/:id
**Descrição**: Atualizar perfil (apenas responsável)

**Arquivo**: `autismProfileService.ts:50-53`

**Autenticação**: Requerida

**Uso**:
```typescript
const updatedProfile = await autismProfileService.update('uuid-do-perfil', {
  age: 9,
  interests: ['Dinossauros', 'Matemática', 'Lego', 'Astronomia']
});
```

---

#### 5. DELETE /autism-profiles/:id
**Descrição**: Deletar perfil (apenas responsável)

**Arquivo**: `autismProfileService.ts:55-57`

**Autenticação**: Requerida

**Uso**:
```typescript
await autismProfileService.delete('uuid-do-perfil');
```

---

## 💬 COMENTÁRIOS

### Arquivos
- **Service**: `/src/services/interactionService.ts`

### Rotas Implementadas

#### 1. POST /comments
**Descrição**: Criar comentário em artigo ou atividade

**Arquivo**: `interactionService.ts:28-31`

**Autenticação**: Requerida

**Requisição**:
```typescript
interface CreateCommentData {
  content: string;        // Mínimo 1 caractere
  articleId?: string;     // UUID do artigo
  activityId?: string;    // UUID da atividade
}
```

**Nota**: Deve fornecer `articleId` OU `activityId` (não ambos)

**Resposta**:
```typescript
interface Comment {
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
```

**Uso**:
```typescript
// Comentar em um artigo
const comment = await commentService.create({
  content: 'Ótimo artigo!',
  articleId: 'uuid-do-artigo'
});

// Comentar em uma atividade
const comment = await commentService.create({
  content: 'Atividade muito útil!',
  activityId: 'uuid-da-atividade'
});
```

---

#### 2. DELETE /comments/:id
**Descrição**: Deletar comentário (apenas autor)

**Arquivo**: `interactionService.ts:33-35`

**Autenticação**: Requerida

**Autorização**: Apenas o autor do comentário pode deletar

**Uso**:
```typescript
await commentService.delete('uuid-do-comentario');
```

---

## 👍 LIKES

### Arquivos
- **Service**: `/src/services/interactionService.ts`

### Rotas Implementadas

#### 1. POST /likes
**Descrição**: Adicionar/remover like (toggle) em artigo ou atividade

**Arquivo**: `interactionService.ts:67-70`

**Autenticação**: Requerida

**Requisição**:
```typescript
interface ToggleLikeData {
  articleId?: string;
  activityId?: string;
}
```

**Resposta**:
```typescript
interface LikeResponse {
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
```

**Uso**:
```typescript
// Toggle like em artigo
const result = await likeService.toggle({
  articleId: 'uuid-do-artigo'
});

// Toggle like em atividade
const result = await likeService.toggle({
  activityId: 'uuid-da-atividade'
});
```

---

#### 2. GET /likes/my-likes
**Descrição**: Obter todos os likes do usuário logado

**Arquivo**: `interactionService.ts:72-75`

**Autenticação**: Requerida

**Resposta**:
```typescript
interface Like {
  id: string;
  userId: string;
  articleId?: string;
  activityId?: string;
  createdAt: string;
  article?: Article;      // Objeto completo do artigo
  activity?: Activity;    // Objeto completo da atividade
}
```

**Uso**:
```typescript
const myLikes = await likeService.getMyLikes();
```

---

## ⭐ FAVORITOS

### Arquivos
- **Service**: `/src/services/interactionService.ts`

### Rotas Implementadas

#### 1. POST /favorites
**Descrição**: Adicionar/remover favorito (toggle) em artigo ou atividade

**Arquivo**: `interactionService.ts:107-110`

**Autenticação**: Requerida

**Requisição**:
```typescript
interface ToggleFavoriteData {
  articleId?: string;
  activityId?: string;
}
```

**Resposta**:
```typescript
interface FavoriteResponse {
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
```

**Uso**:
```typescript
// Toggle favorito em artigo
const result = await favoriteService.toggle({
  articleId: 'uuid-do-artigo'
});

// Toggle favorito em atividade
const result = await favoriteService.toggle({
  activityId: 'uuid-da-atividade'
});
```

---

#### 2. GET /favorites/my-favorites
**Descrição**: Obter todos os favoritos do usuário logado

**Arquivo**: `interactionService.ts:112-115`

**Autenticação**: Requerida

**Resposta**:
```typescript
interface Favorite {
  id: string;
  userId: string;
  articleId?: string;
  activityId?: string;
  createdAt: string;
  article?: Article;      // Objeto completo do artigo
  activity?: Activity;    // Objeto completo da atividade
}
```

**Uso**:
```typescript
const myFavorites = await favoriteService.getMyFavorites();
```

---

## 🔒 AUTENTICAÇÃO AUTOMÁTICA

### Configuração do Axios

O cliente Axios está configurado para adicionar automaticamente o token JWT em todas as requisições:

**Arquivo**: `/src/services/api.ts`

```typescript
// Interceptor de request - adiciona token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@teapoio:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response - trata erro 401 (token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@teapoio:token');
      localStorage.removeItem('@teapoio:user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Funcionalidades**:
- Token JWT adicionado automaticamente no header `Authorization: Bearer <token>`
- Logout automático quando o token expira (erro 401)
- Redirecionamento para login em caso de não autenticado

---

## 📦 ESTRUTURA DE PASTAS

```
src/
├── services/
│   ├── api.ts                      # Cliente Axios configurado
│   ├── authService.ts              # Autenticação
│   ├── userService.ts              # Usuários
│   ├── articleService.ts           # Artigos
│   ├── activityService.ts          # Atividades
│   ├── autismProfileService.ts     # Perfis de Autismo
│   └── interactionService.ts       # Likes, Favoritos, Comentários
├── types/
│   └── index.ts                    # Tipos compartilhados
└── contexts/
    └── AuthContext.tsx             # Context de autenticação
```

---

## 🎯 RESUMO DE IMPLEMENTAÇÃO

### ✅ Rotas Implementadas (100%)

| Categoria | Rotas Implementadas | Total Backend | Status |
|-----------|---------------------|---------------|---------|
| Autenticação | 2 | 2 | ✅ 100% |
| Usuários | 3 | 3 | ✅ 100% |
| Artigos | 5 | 5 | ✅ 100% |
| Atividades | 5 | 5 | ✅ 100% |
| Perfis Autismo | 5 | 5 | ✅ 100% |
| Comentários | 2 | 2 | ✅ 100% |
| Likes | 2 | 2 | ✅ 100% |
| Favoritos | 2 | 2 | ✅ 100% |
| **TOTAL** | **26** | **26** | **✅ 100%** |

### 🎨 Melhorias Implementadas

1. **TypeScript**: Interfaces completas e tipadas para todas as rotas
2. **Organização**: Services separados por domínio
3. **Segurança**: Interceptors para autenticação automática
4. **Tratamento de Erros**: Logout automático em caso de token expirado
5. **Persistência**: LocalStorage para token e usuário
6. **Tipos Compartilhados**: Arquivo centralizado de tipos

---

## 📝 NOTAS IMPORTANTES

1. Todas as rotas que requerem autenticação recebem o token automaticamente via interceptor
2. O token é armazenado no localStorage com a chave `@teapoio:token`
3. O usuário é armazenado no localStorage com a chave `@teapoio:user`
4. Em caso de erro 401, o sistema faz logout automático e redireciona para `/login`
5. Todas as interfaces TypeScript estão alinhadas com o backend

---

## 🚀 Como Usar

### Exemplo Completo

```typescript
import { authService } from './services/authService';
import { articleService } from './services/articleService';
import { likeService } from './services/interactionService';

// 1. Fazer login
const { user, token } = await authService.login({
  email: 'usuario@email.com',
  password: 'senha123'
});

// 2. Buscar artigos (token adicionado automaticamente)
const articles = await articleService.getAll({
  category: 'educacao'
});

// 3. Dar like em um artigo
const likeResult = await likeService.toggle({
  articleId: articles[0].id
});

// 4. Criar novo artigo
const newArticle = await articleService.create({
  title: 'Meu Artigo',
  content: 'Conteúdo do artigo...',
  category: 'educacao'
});

// 5. Fazer logout
authService.logout();
```

---

**Última atualização**: 30 de outubro de 2025

**Desenvolvedor**: Sistema TEA Poio

**Versão**: 1.0.0
