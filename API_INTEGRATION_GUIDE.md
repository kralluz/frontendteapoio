# 🔗 Guia de Integração - Frontend com Backend API

## 📋 Visão Geral

Este documento explica como o frontend TeApoio está integrado com o backend API.

## 🛠️ Configuração

### 1. Variáveis de Ambiente

O arquivo `.env.local` contém:

```env
VITE_API_URL=http://localhost:3333/api
```

### 2. Dependências Instaladas

- `axios` - Cliente HTTP para requisições

## 📁 Estrutura de Services

```
src/services/
├── api.ts                      # Cliente Axios configurado
├── authService.ts              # Autenticação (login, registro)
├── userService.ts              # Gerenciamento de usuário
├── articleService.ts           # CRUD de artigos
├── activityService.ts          # CRUD de atividades
├── autismProfileService.ts     # CRUD de perfis autistas
└── interactionService.ts       # Likes, favoritos, comentários
```

## 🔐 Autenticação

### Como Funciona

1. **Login/Registro**: Retorna `token` JWT e dados do `user`
2. **Armazenamento**: Token e user salvos no `localStorage`
3. **Interceptor**: Token automaticamente adicionado em todas as requisições
4. **Logout**: Remove token e redireciona para login se token expirar

### Exemplo de Uso

```typescript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { login, user, isAuthenticated, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: '123456' });
      // Usuário logado com sucesso
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Bem-vindo, {user?.name}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};
```

## 📝 Consumindo a API

### Artigos

```typescript
import { articleService } from '../services/articleService';

// Listar todos os artigos
const articles = await articleService.getAll();

// Filtrar por categoria
const articles = await articleService.getAll({ category: 'Educação' });

// Buscar por texto
const articles = await articleService.getAll({ search: 'autismo' });

// Obter artigo específico
const article = await articleService.getById('article-id');

// Criar artigo (requer autenticação)
const newArticle = await articleService.create({
  title: 'Título do Artigo',
  content: 'Conteúdo completo...',
  excerpt: 'Resumo',
  category: 'Educação',
  image: 'https://...',
  readTime: 10
});

// Atualizar artigo (requer autenticação)
await articleService.update('article-id', { title: 'Novo Título' });

// Deletar artigo (requer autenticação)
await articleService.delete('article-id');
```

### Atividades

```typescript
import { activityService } from '../services/activityService';

// Listar todas as atividades
const activities = await activityService.getAll();

// Filtrar
const activities = await activityService.getAll({
  category: 'Sensorial',
  difficulty: 'Fácil',
  search: 'cores'
});

// Obter atividade específica
const activity = await activityService.getById('activity-id');

// Criar atividade (requer autenticação)
const newActivity = await activityService.create({
  title: 'Jogo de Cores',
  description: 'Descrição da atividade',
  content: 'Conteúdo detalhado',
  difficulty: 'Fácil',
  ageRange: '3-6 anos',
  duration: 30,
  materials: ['Papel', 'Tinta'],
  steps: ['Passo 1', 'Passo 2'],
  category: 'Sensorial',
  image: 'https://...'
});
```

### Perfis Autistas

```typescript
import { autismProfileService } from '../services/autismProfileService';

// Listar meus perfis (requer autenticação)
const profiles = await autismProfileService.getAll();

// Criar perfil (requer autenticação)
const newProfile = await autismProfileService.create({
  name: 'João',
  age: 5,
  diagnosis: 'TEA Nível 1',
  level: 'Leve',
  interests: ['Dinossauros', 'Números'],
  sensitivities: ['Ruídos altos'],
  strengths: ['Memória visual'],
  challenges: ['Comunicação verbal'],
  notes: 'Observações adicionais'
});

// Atualizar perfil
await autismProfileService.update('profile-id', { age: 6 });

// Deletar perfil
await autismProfileService.delete('profile-id');
```

### Curtidas e Favoritos

```typescript
import { likeService, favoriteService } from '../services/interactionService';

// Toggle like em artigo
await likeService.toggle({ articleId: 'article-id' });

// Toggle like em atividade
await likeService.toggle({ activityId: 'activity-id' });

// Obter meus likes
const myLikes = await likeService.getMyLikes();

// Toggle favorito
await favoriteService.toggle({ articleId: 'article-id' });

// Obter meus favoritos
const myFavorites = await favoriteService.getMyFavorites();
```

### Comentários

```typescript
import { commentService } from '../services/interactionService';

// Criar comentário em artigo
await commentService.create({
  content: 'Ótimo artigo!',
  articleId: 'article-id'
});

// Criar comentário em atividade
await commentService.create({
  content: 'Muito útil!',
  activityId: 'activity-id'
});

// Deletar comentário
await commentService.delete('comment-id');
```

## 🎨 Exemplo Completo em Componente

```typescript
import React, { useState, useEffect } from 'react';
import { articleService, Article } from '../services/articleService';
import { likeService, favoriteService } from '../services/interactionService';

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await articleService.getAll();
      setArticles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (articleId: string) => {
    try {
      await likeService.toggle({ articleId });
      // Recarregar artigos para atualizar contagem
      await loadArticles();
    } catch (err) {
      console.error('Erro ao curtir:', err);
    }
  };

  const handleFavorite = async (articleId: string) => {
    try {
      await favoriteService.toggle({ articleId });
      alert('Favorito adicionado/removido!');
    } catch (err) {
      console.error('Erro ao favoritar:', err);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Artigos</h1>
      {articles.map(article => (
        <div key={article.id}>
          <h2>{article.title}</h2>
          <p>{article.excerpt}</p>
          <p>Por: {article.author.name}</p>
          <p>👍 {article._count?.likes || 0} curtidas</p>
          <button onClick={() => handleLike(article.id)}>Curtir</button>
          <button onClick={() => handleFavorite(article.id)}>Favoritar</button>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
```

## 🚨 Tratamento de Erros

### Estrutura de Erro

```typescript
try {
  await articleService.create(data);
} catch (error: any) {
  if (error.response) {
    // Erro retornado pela API
    console.log(error.response.data.message);
    console.log(error.response.status);
  } else if (error.request) {
    // Requisição foi feita mas sem resposta
    console.log('Servidor não respondeu');
  } else {
    // Outro tipo de erro
    console.log(error.message);
  }
}
```

### Interceptor Automático

O arquivo `api.ts` já possui um interceptor que:
- Adiciona automaticamente o token JWT em todas as requisições
- Redireciona para `/login` se o token expirar (401)

## 🔄 Atualização de Dados

### Revalidação Automática

Para manter dados sincronizados:

```typescript
// Opção 1: Recarregar dados após mutação
const handleUpdate = async () => {
  await articleService.update(id, data);
  await loadArticles(); // Recarrega lista
};

// Opção 2: Atualizar estado localmente
const handleUpdate = async () => {
  const updated = await articleService.update(id, data);
  setArticles(prev => prev.map(a => a.id === id ? updated : a));
};
```

## 📌 Próximos Passos

1. ✅ Backend criado e configurado
2. ✅ Services de API implementados
3. ✅ AuthContext integrado
4. 🔄 Atualizar páginas existentes para usar a API
5. 🔄 Implementar loading states
6. 🔄 Implementar feedback visual (toasts)
7. 🔄 Adicionar validação de formulários

## 🎯 Como Atualizar as Páginas

### Biblioteca.tsx

```typescript
// Antes: dados hardcoded
const articles = [/* ... */];

// Depois: dados da API
const [articles, setArticles] = useState<Article[]>([]);

useEffect(() => {
  articleService.getAll().then(setArticles);
}, []);
```

### PerfilAutista.tsx

```typescript
// Usar autismProfileService
const [profiles, setProfiles] = useState<AutismProfile[]>([]);

useEffect(() => {
  autismProfileService.getAll().then(setProfiles);
}, []);
```

---

**Tudo pronto para integração! 🚀**
