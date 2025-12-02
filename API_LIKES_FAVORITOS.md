# API de Likes e Favoritos - Documentação

## ✅ Status: IMPLEMENTADO NO BACKEND

A API já possui endpoints completos para likes e favoritos tanto de artigos quanto de atividades.

## 📋 Endpoints Disponíveis

### **LIKES**

#### 1. Toggle Like (Adicionar/Remover)
```
POST /api/likes
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "articleId": "uuid" // OU
  "activityId": "uuid"
}

Response (201/200):
{
  "liked": true, // true se adicionou, false se removeu
  "message": "Like adicionado" // ou "Like removido"
  "like": {
    "id": "uuid",
    "userId": "uuid",
    "articleId": "uuid",
    "createdAt": "2024-11-05T..."
  }
}
```

#### 2. Listar Meus Likes
```
GET /api/likes/my-likes
Authorization: Bearer {token}

Response (200):
[
  {
    "id": "uuid",
    "userId": "uuid",
    "articleId": "uuid",
    "createdAt": "2024-11-05T...",
    "article": {
      "id": "uuid",
      "title": "Título do artigo",
      "author": {
        "id": "uuid",
        "name": "Nome do autor",
        "avatar": "url"
      }
    }
  }
]
```

### **FAVORITOS**

#### 1. Toggle Favorito (Adicionar/Remover)
```
POST /api/favorites
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "articleId": "uuid" // OU
  "activityId": "uuid"
}

Response (201/200):
{
  "favorited": true, // true se adicionou, false se removeu
  "message": "Favorito adicionado" // ou "Favorito removido"
  "favorite": {
    "id": "uuid",
    "userId": "uuid",
    "activityId": "uuid",
    "createdAt": "2024-11-05T..."
  }
}
```

#### 2. Listar Meus Favoritos
```
GET /api/favorites/my-favorites
Authorization: Bearer {token}

Response (200):
[
  {
    "id": "uuid",
    "userId": "uuid",
    "activityId": "uuid",
    "createdAt": "2024-11-05T...",
    "activity": {
      "id": "uuid",
      "title": "Título da atividade",
      "author": {
        "id": "uuid",
        "name": "Nome do autor",
        "avatar": "url"
      },
      "_count": {
        "likes": 10,
        "comments": 5
      }
    }
  }
]
```

### **CONTADORES**

Ao buscar atividades ou artigos, o backend já retorna os contadores:

```typescript
{
  "id": "uuid",
  "title": "...",
  // ... outros campos
  "_count": {
    "likes": 10,      // Número total de likes
    "favorites": 5,   // Número total de favoritos
    "comments": 3     // Número total de comentários
  }
}
```

## ✅ O que já está implementado no Frontend

1. ✅ `interactionService.ts` - Serviços de like e favorito
2. ✅ `likeService.toggle()` - Toggle de like
3. ✅ `likeService.getMyLikes()` - Buscar meus likes
4. ✅ `favoriteService.toggle()` - Toggle de favorito
5. ✅ `favoriteService.getMyFavorites()` - Buscar meus favoritos

## ⚠️ O que falta implementar no Frontend

### 1. **Verificar se usuário curtiu/favoritou**

O backend retorna apenas o contador total, mas não informa se o **usuário atual** já curtiu/favoritou.

**Solução:** Precisamos fazer uma das seguintes opções:

#### Opção A: Modificar o backend (RECOMENDADO)
Adicionar campos `isLikedByCurrentUser` e `isFavoritedByCurrentUser` no retorno de `getById()`:

```typescript
// Modificar ActivityController.getById() e ArticleController.getById()
async getById(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.userId; // Se autenticado

  const activity = await prisma.activity.findUnique({
    where: { id },
    include: {
      author: { ... },
      _count: { ... }
    }
  });

  // Verificar se o usuário curtiu/favoritou
  let isLiked = false;
  let isFavorited = false;

  if (userId) {
    const like = await prisma.like.findFirst({
      where: { userId, activityId: id }
    });
    const favorite = await prisma.favorite.findFirst({
      where: { userId, activityId: id }
    });
    isLiked = !!like;
    isFavorited = !!favorite;
  }

  return res.json({
    ...activity,
    isLiked,
    isFavorited
  });
}
```

#### Opção B: Frontend busca separadamente
Criar endpoints:
```
GET /api/activities/:id/is-liked
GET /api/activities/:id/is-favorited
```

#### Opção C: Frontend verifica localmente
Buscar `getMyLikes()` e `getMyFavorites()` e verificar se o ID está na lista (menos eficiente).

### 2. **Atualizar interface de Activity/Article**

```typescript
export interface Activity {
  // ... campos existentes
  _count?: {
    comments: number;
    likes: number;
    favorites: number;
  };
  isLiked?: boolean;      // ← ADICIONAR
  isFavorited?: boolean;  // ← ADICIONAR
}
```

### 3. **Páginas que precisam implementar**

- ✅ `/src/pages/Article/Article.tsx` - Já tem os botões, precisa conectar à API
- ✅ `/src/pages/Atividade/Atividade.tsx` - Já tem os botões, precisa conectar à API
- ⚠️ `/src/pages/Atividades/Atividades.tsx` - Lista de atividades (cards)
- ⚠️ `/src/pages/Biblioteca/Biblioteca.tsx` - Lista de artigos (cards)
- ⚠️ `/src/pages/Curtidos/Curtidos.tsx` - Precisa implementar
- ⚠️ `/src/pages/Favoritos/Favoritos.tsx` - Precisa implementar

## 🚀 Próximos Passos

### 1. Modificar o Backend (RECOMENDADO)
```bash
cd /home/usuario/Documentos/GitHub/backendteapoio
```

Editar:
- `src/controllers/ActivityController.ts` - método `getById`
- `src/controllers/ArticleController.ts` - método `getById`

### 2. Atualizar Frontend
- Atualizar interfaces em `src/types/index.ts`
- Implementar lógica nas páginas `Article.tsx` e `Atividade.tsx`
- Criar páginas `Curtidos.tsx` e `Favoritos.tsx`

## 📝 Exemplo de Implementação no Frontend

```typescript
// Em Article.tsx ou Atividade.tsx
const [article, setArticle] = useState<Article | null>(null);

// Carregar artigo
const loadArticle = async () => {
  const data = await articleService.getById(id);
  setArticle(data);
};

// Toggle like
const handleLike = async () => {
  await likeService.toggle({ articleId: article.id });
  await loadArticle(); // Recarregar para atualizar estado
  message.success(article.isLiked ? 'Like removido' : 'Curtido!');
};

// Toggle favorito
const handleFavorite = async () => {
  await favoriteService.toggle({ articleId: article.id });
  await loadArticle(); // Recarregar para atualizar estado
  message.success(article.isFavorited ? 'Removido dos favoritos' : 'Adicionado aos favoritos!');
};

// Renderizar botão
<Button
  icon={article?.isLiked ? <HeartFilled /> : <HeartOutlined />}
  onClick={handleLike}
>
  {article?._count?.likes || 0}
</Button>
```

## 🎯 Resumo

### Backend: ✅ PRONTO
- Rotas de like/favorito funcionando
- Toggle funcionando
- Listar meus likes/favoritos funcionando

### Frontend: ⚠️ PARCIALMENTE IMPLEMENTADO
- ✅ Serviços criados
- ✅ Botões nas páginas de detalhe
- ❌ Falta conectar os botões à API
- ❌ Falta verificar estado (isLiked/isFavorited)
- ❌ Falta criar páginas Curtidos e Favoritos
