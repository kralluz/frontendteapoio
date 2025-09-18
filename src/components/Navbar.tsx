
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const user = {
  name: 'João',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
};

const Navbar: React.FC = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fecha o menu ao clicar fora
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link 
          to="/" 
          className="navbar-brand"
        >
          TEApoio
        </Link>
        {/* Usuário miniatura e menu */}
        <div className="navbar-user" ref={userMenuRef} style={{ position: 'relative', marginLeft: 'auto', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <div
            className="navbar-user-info"
            onClick={() => setUserMenuOpen((open) => !open)}
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            tabIndex={0}
            role="button"
            aria-haspopup="true"
            aria-expanded={userMenuOpen}
          >
            <img src={user.avatar} alt="Avatar" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #764ba2', background: '#eee' }} />
            <span style={{ color: '#764ba2', fontWeight: 600, fontSize: '1.08rem', marginLeft: 4 }}>{user.name}</span>
          </div>
          {userMenuOpen && (
            <div className="navbar-user-menu" style={{ position: 'absolute', top: 48, right: 0, background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(102,126,234,0.13)', minWidth: 160, zIndex: 1001, padding: '8px 0' }}>
              <Link to="/profile" className="navbar-user-menu-item" style={{ display: 'block', padding: '10px 18px', color: '#764ba2', textDecoration: 'none', fontWeight: 500, transition: 'background 0.2s' }} onClick={() => setUserMenuOpen(false)}>
                Perfil
              </Link>
              <Link to="/settings" className="navbar-user-menu-item" style={{ display: 'block', padding: '10px 18px', color: '#764ba2', textDecoration: 'none', fontWeight: 500, transition: 'background 0.2s' }} onClick={() => setUserMenuOpen(false)}>
                Configurações
              </Link>
              <button
                className="navbar-user-menu-item"
                style={{ display: 'block', padding: '10px 18px', color: '#e53e3e', background: 'none', border: 'none', width: '100%', textAlign: 'left', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}
                onClick={() => { 
                  setUserMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;