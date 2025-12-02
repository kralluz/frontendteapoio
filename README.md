# React TypeScript Template com Router DOM

Um template completo para projetos React em TypeScript com React Router DOM, configurado para build otimizado na pasta `dist`.

## 🚀 Funcionalidades

- ⚛️ **React 18** - Versão mais recente do React
- 🔷 **TypeScript** - Tipagem estática para maior segurança
- 🗺️ **React Router DOM v6** - Navegação moderna entre páginas
- 📱 **Design Responsivo** - Layout que f unciona em todos os dispositivos
- 🎨 **CSS Moderno** - Estilos com gradientes e animações
- 📁 **Estrutura Organizada** - Componentes e páginas bem estruturados
- 🔧 **Build Otimizado** - Output configurado para pasta `dist`

## 📁 Estrutura do Projeto

```
frontendteapoio/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── dist/ (gerado após build)
├── package.json
├── tsconfig.json
└── .env
```

## 🛠️ Instalação

1. **Clone ou baixe o template**
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env.local
   ```
   Edite o arquivo `.env.local` com suas configurações (veja [ENV_CONFIG.md](./ENV_CONFIG.md) para detalhes)

## 📜 Scripts Disponíveis

### Desenvolvimento
```bash
# Inicia o servidor de desenvolvimento
npm start
```

### Build
```bash
# Build de produção (output na pasta dist)
npm run build

# Build limpo (remove dist antes)
npm run build:prod

# Limpa apenas a pasta dist
npm run build:clean
```

### TypeScript
```bash
# Verifica tipos sem gerar build
npm run type-check
```

### Testes
```bash
# Executa os testes
npm test
```

## 🎯 Páginas Incluídas

### 🏠 Home (`/`)
- Página inicial com apresentação do template
- Grid de funcionalidades
- Lista de recursos incluídos

### ℹ️ Sobre (`/about`)
- Informações sobre a equipe
- Missão e visão
- Tecnologias utilizadas
- Cards da equipe com TypeScript interfaces

### 📧 Contato (`/contact`)
- Formulário de contato completo
- Validação de campos em TypeScript
- Estados de loading e sucesso
- Informações de contato alternativas

### 🔍 404 - Não Encontrada (`/*`)
- Página de erro 404 personalizada
- Links para navegação
- Design amigável ao usuário

## 🧭 Navegação

### Navbar Responsiva
- **Desktop:** Navegação horizontal com indicador ativo
- **Mobile:** Menu hambúrguer com animações
- **Sticky:** Permanece no topo durante scroll
- **Gradiente:** Design moderno com cores atrativas

### Funcionalidades do Router
- Navegação sem reload da página
- Indicador visual da página ativa
- Suporte a links diretos (deep linking)
- Página 404 para rotas inexistentes

## 🎨 Estilos e Design

### CSS Features
- **CSS Grid e Flexbox** para layouts responsivos
- **Gradientes** para visual moderno
- **Animações** suaves em hover e transições
- **Media queries** para diferentes tamanhos de tela
- **CSS customizado** sem frameworks externos

### Temas de Cores
- **Primária:** Gradiente azul/roxo (`#667eea` → `#764ba2`)
- **Secundária:** Tons de cinza para texto
- **Sucesso:** Verde para confirmações
- **Erro:** Vermelho para validações

## 🔧 Configuração TypeScript

### tsconfig.json
- Configurado para React com JSX
- Output para pasta `dist`
- Strict mode habilitado
- Source maps incluídos
- Otimizações de produção

### Tipos Incluídos
- Interfaces para componentes
- Tipos para props e estados
- Enums para constantes
- Generics onde apropriado

## 📦 Build e Deploy

### Build de Produção
O comando `npm run build` gera:
- Arquivos otimizados na pasta `dist/`
- CSS e JS minificados
- Assets otimizados
- Source maps para debug

### Configuração de Environment
O arquivo `.env` inclui:
```
REACT_APP_API_URL=https://api-backendtea.i5mfns.easypanel.host/api
BUILD_PATH=dist
TSC_COMPILE_ON_ERROR=true
ESLINT_NO_DEV_ERRORS=true
GENERATE_SOURCEMAP=true
```

Para mais informações sobre variáveis de ambiente, consulte [ENV_CONFIG.md](./ENV_CONFIG.md).

## 🚀 Próximos Passos

Para personalizar este template:

1. **Modifique as páginas** em `src/pages/`
2. **Adicione novos componentes** em `src/components/`
3. **Ajuste as rotas** em `src/App.tsx`
4. **Customize os estilos** nos arquivos CSS
5. **Configure seu backend** para integração

## 📝 Dependências Principais

- `react` (^18.2.0)
- `react-dom` (^18.2.0)
- `react-router-dom` (^6.15.0)
- `typescript` (^5.0.0)
- `react-scripts` (5.0.1)

## 🤝 Contribuição

Este é um template base. Sinta-se livre para:
- Adicionar novas funcionalidades
- Melhorar os estilos
- Otimizar a performance
- Adicionar testes

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ usando React + TypeScript + Router DOM**