import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="page" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: '120px', marginBottom: '20px' }}>🔍</div>
      
      <h1 style={{ 
        fontSize: '4rem', 
        color: '#667eea',
        marginBottom: '20px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        404
      </h1>
      
      <h2 style={{ 
        color: '#333',
        marginBottom: '30px',
        fontSize: '2rem'
      }}>
        Página Não Encontrada
      </h2>
      
      <p style={{ 
        fontSize: '1.2rem',
        color: '#666',
        marginBottom: '40px',
        maxWidth: '600px',
        margin: '0 auto 40px'
      }}>
        Oops! A página que você está procurando não existe. 
        Ela pode ter sido movida, deletada ou você digitou o endereço incorreto.
      </p>
      
      <div style={{ marginBottom: '40px' }}>
        <Link 
          to="/"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '15px 30px',
            textDecoration: 'none',
            borderRadius: '30px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
          }}
        >
          🏠 Voltar para Home
        </Link>
      </div>
      
      <div className="features" style={{ marginTop: '50px' }}>
        <div className="feature">
          <h3>🔍 Pesquisar</h3>
          <p>Tente usar a navegação ou pesquisar pelo conteúdo que você procura</p>
        </div>
        
        <div className="feature">
          <h3>📞 Contato</h3>
          <p>
            <Link to="/contact" style={{ color: '#667eea', textDecoration: 'none' }}>
              Entre em contato
            </Link> se você acha que isso é um erro
          </p>
        </div>
        
        <div className="feature">
          <h3>ℹ️ Ajuda</h3>
          <p>
            Visite nossa página <Link to="/about" style={{ color: '#667eea', textDecoration: 'none' }}>
              Sobre
            </Link> para mais informações
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;