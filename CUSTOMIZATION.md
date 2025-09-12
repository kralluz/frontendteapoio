# Guia de Personalização - React TypeScript Template

## 🔧 Como Adicionar Novas Páginas

### 1. Criar Nova Página

Crie um novo arquivo em `src/pages/`, por exemplo `Dashboard.tsx`:

```typescript
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>Bem-vindo ao seu dashboard!</p>
    </div>
  );
};

export default Dashboard;
```

### 2. Adicionar Rota

Em `src/App.tsx`, adicione a nova rota:

```typescript
import Dashboard from './pages/Dashboard';

// Dentro do componente Routes:
<Route path="/dashboard" element={<Dashboard />} />
```

### 3. Adicionar Link na Navegação

Em `src/components/Navbar.tsx`, adicione o item no array `navItems`:

```typescript
const navItems: NavItem[] = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'Sobre' },
  { path: '/contact', label: 'Contato' },
  { path: '/dashboard', label: 'Dashboard' }, // Nova página
];
```

## 🎨 Como Personalizar Estilos

### Cores do Tema
Modifique as cores em `src/App.css`:

```css
/* Gradiente principal */
background: linear-gradient(135deg, #SEU_COR_1 0%, #SEU_COR_2 100%);

/* Cores de destaque */
.feature {
  background: #SUA_COR_BACKGROUND;
}
```

### Navbar
Customize a navegação em `src/components/Navbar.css`:

```css
.navbar {
  background: linear-gradient(135deg, #SUA_COR_1 0%, #SUA_COR_2 100%);
}
```

## 🔗 Como Adicionar Novos Componentes

### 1. Criar Componente

Em `src/components/`, por exemplo `Button.tsx`:

```typescript
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
```

### 2. Usar o Componente

```typescript
import Button from '../components/Button';

// No seu JSX:
<Button variant="primary" onClick={() => console.log('Clicado!')}>
  Clique Aqui
</Button>
```

## 📡 Como Integrar APIs

### 1. Criar Service

Crie `src/services/api.ts`:

```typescript
const API_BASE_URL = 'https://sua-api.com';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const apiService = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`);
    return response.json();
  },

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  }
};
```

### 2. Usar no Componente

```typescript
import React, { useState, useEffect } from 'react';
import { apiService, User } from '../services/api';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await apiService.getUsers();
        setUsers(userData);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="page">
      <h1>Usuários</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};
```

## 🔒 Como Adicionar Autenticação

### 1. Context de Autenticação

Crie `src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    // Implementar lógica de login
    setIsLoading(true);
    try {
      // Chamada para API
      const userData = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).then(res => res.json());
      
      setUser(userData);
      localStorage.setItem('token', userData.token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verificar se token é válido
      // setUser(userData);
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. Rota Protegida

```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Carregando...</div>;

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};
```

## 📱 Como Tornar Mais Responsivo

### Breakpoints Personalizados

```css
/* Mobile First */
.component {
  /* Estilos mobile */
}

/* Tablet */
@media (min-width: 768px) {
  .component {
    /* Estilos tablet */
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .component {
    /* Estilos desktop */
  }
}

/* Large Desktop */
@media (min-width: 1440px) {
  .component {
    /* Estilos tela grande */
  }
}
```

## 🚀 Deploy

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload da pasta dist/ no Netlify
```

### GitHub Pages
```bash
npm install --save-dev gh-pages

# No package.json:
"homepage": "https://seuusuario.github.io/seurepositorio",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

## 🔧 Dicas Avançadas

### Lazy Loading
```typescript
import React, { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));

// No JSX:
<Suspense fallback={<div>Carregando...</div>}>
  <Route path="/dashboard" element={<Dashboard />} />
</Suspense>
```

### Error Boundary
```typescript
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>, 
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo deu errado.</h1>;
    }

    return this.props.children;
  }
}
```

---

**Lembre-se:** Este template é apenas o ponto de partida. Customize conforme suas necessidades!