import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

interface NavItem {
  path: string;
  label: string;
}

interface NavbarProps {
  greeting?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ greeting }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'Sobre' },
    { path: '/contact', label: 'Contato' }
  ];

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  const isActiveLink = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Botão para abrir a gaveta do menu lateral */}
        <button
          className="sidebar-drawer-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu lateral"
        >
          <span className="sidebar-drawer-icon">☰</span>
        </button>
        {/* Gaveta do menu lateral */}
        <div className={`sidebar-drawer-backdrop${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />
        <div className={`sidebar-drawer${sidebarOpen ? ' open' : ''}`}>
          <button className="sidebar-drawer-close" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu lateral">×</button>
          <DashboardSidebar />
        </div>
        <Link 
          to="/" 
          className="navbar-brand"
          onClick={closeMenu}
        >
          TEApoio
        </Link>
        {greeting && (
          <div className="navbar-greeting-inline">{greeting}</div>
        )}
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            {navItems.map((item: NavItem) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActiveLink(item.path) ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;