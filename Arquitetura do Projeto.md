Pastas e Arquivos
public/
- Contém arquivos estáticos que podem ser acessados diretamente pelo navegador.
- index.html: O arquivo de entrada da aplicação.

src/
- Contém o código-fonte da aplicação.
- assets/: Imagens, estilos e outros recursos estáticos, como CSS e fontes.
- components/: Componentes reutilizáveis da aplicação, construídos com React e utilizando bibliotecas como:
- Ant Design para componentes de UI.
- React Hook Form para gerenciamento de formulários.
- contexts/: Contextos da aplicação para gerenciamento de estado, utilizando React Context API.
- hooks/: Hooks personalizados para utilizar nos componentes, como hooks para autenticação e gerenciamento de estado.
- pages/: Páginas da aplicação, que utilizam os componentes e contextos para renderizar a UI.
- routes/: Definições de rotas da aplicação, utilizando React Router DOM para controle de navegação e acesso.
- schemas/: Esquemas de validação para formulários e dados, utilizando Zod para definir e validar os esquemas.
- services/: Serviços que lidam com requisições à API, utilizando Axios ou Fetch para realizar requisições HTTP.
- types/: Definições de tipos globais para a aplicação, utilizando TypeScript para garantir a segurança e consistência dos tipos.
- utils/: Funções utilitárias e helpers, como funções para formatação de dados e gerenciamento de erros.
- App.tsx: O componente principal da aplicação, que renderiza as rotas e contextos.
- index.tsx: O arquivo de entrada da aplicação, que renderiza o componente App.

services/
- api.ts: Arquivo que define a fila de requisições à API, utilizando Axios  para requisições HTTP.
- authService.ts: Serviço que lida com autenticação e autorização, utilizando tokens ou sessões para gerenciar o acesso.
- usersService.ts: Serviço que lida com operações relacionadas a usuários, como criação, leitura, atualização e exclusão.

contexts/
- AuthContext.tsx: Contexto que gerencia o estado de autenticação da aplicação, utilizando React Context API para compartilhar o estado entre os componentes.
- UsersContext.tsx: Contexto que gerencia o estado de usuários da aplicação, utilizando React Context API para compartilhar o estado entre os componentes.

Fluxo de Dados
- Os componentes da aplicação utilizam os contextos para acessar os dados e funções de gerenciamento de estado.
- Os contextos utilizam os serviços para realizar requisições à API e atualizar o estado da aplicação.
- Os serviços utilizam a fila de requisições definida em api.ts para realizar requisições à API.