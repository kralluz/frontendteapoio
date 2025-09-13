import React from 'react';

const Home: React.FC = () => {
  return (
    <div>
      <div className="hero">
        <h1>Bem-vindo ao Template React</h1>
        <p>Um template completo com React Router DOM e TypeScript para começar seus projetos rapidamente</p>
      </div>
      
      <div className="page">
        <div className="features">
          <div className="feature">
            <h3>🚀 React 18</h3>
            <p>Utilizando a versão mais recente do React com todas as funcionalidades modernas</p>
          </div>
          
          <div className="feature">
            <h3>🗺️ React Router</h3>
            <p>Navegação completa configurada com React Router DOM v6</p>
          </div>
          
          <div className="feature">
            <h3>📱 Responsivo</h3>
            <p>Layout responsivo que funciona perfeitamente em todos os dispositivos</p>
          </div>
          
          <div className="feature">
            <h3>🔷 TypeScript</h3>
            <p>Desenvolvimento com tipagem estática para maior segurança e produtividade</p>
          </div>
        </div>
        
        <h2>Funcionalidades Incluídas</h2>
        <ul>
          <li>Configuração completa do React Router DOM</li>
          <li>TypeScript configurado com tsconfig.json</li>
          <li>Build otimizado para pasta dist</li>
          <li>Navegação entre páginas</li>
          <li>Página 404 para rotas não encontradas</li>
          <li>CSS moderno e responsivo</li>
          <li>Estrutura de componentes organizada</li>
          <li>Scripts de desenvolvimento e build</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;