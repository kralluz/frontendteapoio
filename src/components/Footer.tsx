import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <span className="footer-brand">🧩 TEApoio</span>
        <span className="footer-text">&copy; {new Date().getFullYear()} - Todos os direitos reservados</span>
        <nav className="footer-nav">
          <a href="/about" className="footer-link">Sobre</a>
          <a href="/contact" className="footer-link">Contato</a>
          <a href="/biblioteca" className="footer-link">Biblioteca</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
