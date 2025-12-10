import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Typography, Button, Drawer } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, BookOutlined, ProfileOutlined, StarOutlined, MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined, FileTextOutlined, ThunderboltOutlined, ExperimentOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import AppRoutes from './routes';
import './App.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Aplicar tema escuro ao carregar a aplicação
  useEffect(() => {
    const applyTheme = () => {
      const isDark = localStorage.getItem('darkTheme') === 'true';
      if (isDark) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    };

    // Aplicar tema inicial
    applyTheme();

    // Escutar mudanças no localStorage (sincroniza entre abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'darkTheme') {
        applyTheme();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Verificar se estamos em uma rota que não deve mostrar header/sidebar
  const isAuthRoute = location.pathname === '/login' ||
                       location.pathname === '/register' ||
                       location.pathname === '/register/professional' ||
                       location.pathname === '/password-reset';

  const isProfessional = user?.role === 'PROFESSIONAL';

  // Verificar se estamos em rotas que precisam ocupar toda a largura
  const isFullWidthRoute = location.pathname.startsWith('/artigo/') || 
                           location.pathname.startsWith('/atividade/');

  // Menu items principais para mobile (apenas os mais importantes)
  const mobileMenuItems = [
    {
      key: '/biblioteca',
      icon: <BookOutlined style={{ fontSize: '22px' }} />,
      label: 'Biblioteca',
      onClick: () => navigate('/biblioteca'),
    },
    {
      key: '/atividades',
      icon: <ExperimentOutlined style={{ fontSize: '22px' }} />,
      label: 'Atividades',
      onClick: () => navigate('/atividades'),
    },
    ...(isProfessional ? [{
      key: '/professional/dashboard',
      icon: <DashboardOutlined style={{ fontSize: '22px' }} />,
      label: 'Painel',
      onClick: () => navigate('/professional/dashboard'),
    }] : [{
      key: '/perfil-autista',
      icon: <ProfileOutlined style={{ fontSize: '22px' }} />,
      label: 'Perfis',
      onClick: () => navigate('/perfil-autista'),
    }]),
    {
      key: 'more',
      icon: <AppstoreOutlined style={{ fontSize: '22px' }} />,
      label: 'Mais',
      onClick: () => setMobileDrawerVisible(true),
    },
  ];

  const userMenuItems = [
    {
      key: 'user-info',
      label: (
        <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', marginBottom: '8px' }}>
          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{user?.name}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>{user?.email}</div>
        </div>
      ),
      disabled: true,
    },
    ...(!isProfessional ? [{
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Perfil',
      onClick: () => navigate('/perfil'),
    }] : []),
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Configurações',
      onClick: () => navigate('/configuracoes'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  const menuItems = [
    {
      key: '/',
      icon: <BookOutlined />,
      label: 'Biblioteca',
      onClick: () => navigate('/biblioteca'),
    },
    {
      key: '/atividades',
      icon: <ExperimentOutlined />,
      label: 'Atividades',
      onClick: () => navigate('/atividades'),
    },
    // Menu específico para profissionais
    ...(isProfessional ? [
      {
        key: 'divider-1',
        type: 'divider' as const,
      },
      {
        key: '/professional/dashboard',
        icon: <DashboardOutlined />,
        label: 'Painel do Profissional',
        onClick: () => navigate('/professional/dashboard'),
      },
      {
        key: '/professional/artigos',
        icon: <FileTextOutlined />,
        label: 'Meus Artigos',
        onClick: () => navigate('/professional/artigos'),
      },
      {
        key: '/professional/atividades',
        icon: <ThunderboltOutlined />,
        label: 'Minhas Atividades',
        onClick: () => navigate('/professional/atividades'),
      },
      {
        key: 'divider-2',
        type: 'divider' as const,
      },
    ] : []),
    // Menu para não profissionais
    ...(!isProfessional ? [
      {
        key: '/perfil-autista',
        icon: <ProfileOutlined />,
        label: 'Perfis',
        onClick: () => navigate('/perfil-autista'),
      },
    ] : []),
    {
      key: '/favoritos',
      icon: <StarOutlined />,
      label: 'Favoritos',
      onClick: () => navigate('/favoritos'),
    },
    {
      key: 'divider-3',
      type: 'divider' as const,
    },
    {
      key: '/configuracoes',
      icon: <SettingOutlined />,
      label: 'Configurações',
      onClick: () => navigate('/configuracoes'),
    },
  ];

  // Menu específico para o drawer mobile (sem repetir itens da barra inferior)
  const mobileDrawerMenuItems = [
    // Para profissionais: apenas as opções exclusivas
    ...(isProfessional ? [
      {
        key: '/professional/artigos',
        icon: <FileTextOutlined />,
        label: 'Meus Artigos',
        onClick: () => navigate('/professional/artigos'),
      },
      {
        key: '/professional/atividades',
        icon: <ThunderboltOutlined />,
        label: 'Minhas Atividades',
        onClick: () => navigate('/professional/atividades'),
      },
      {
        key: 'divider-1',
        type: 'divider' as const,
      },
    ] : []),
    // Favoritos (comum para todos)
    {
      key: '/favoritos',
      icon: <StarOutlined />,
      label: 'Favoritos',
      onClick: () => navigate('/favoritos'),
    },
    {
      key: 'divider-2',
      type: 'divider' as const,
    },
    {
      key: '/configuracoes',
      icon: <SettingOutlined />,
      label: 'Configurações',
      onClick: () => navigate('/configuracoes'),
    },
  ];

  if (isAuthRoute) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content>
          <AppRoutes />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        background: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid #f0f0f0'
      }}>
        {!isMobile && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '18px',
              marginRight: '16px',
            }}
          />
        )}
        <Title level={3} style={{ margin: 0, flex: 1 }}>TeApoio</Title>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <Avatar 
            src={user?.avatar} 
            size="large"
            style={{ 
              backgroundColor: user?.avatar ? undefined : '#667eea',
              cursor: 'pointer'
            }}
          >
            {!user?.avatar && user?.name ? user.name.charAt(0).toUpperCase() : <UserOutlined />}
          </Avatar>
        </Dropdown>
      </Header>
      <Layout>
        {/* Menu lateral apenas para desktop */}
        {!isMobile && (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            breakpoint="lg"
            onBreakpoint={(broken) => {
              if (broken) setCollapsed(true);
            }}
            style={{
              background: 'white',
              boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
              position: 'fixed',
              left: 0,
              top: 64,
              bottom: 0,
              height: 'calc(100vh - 64px)',
              overflow: 'auto',
              zIndex: 100
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              style={{ borderRight: 0, paddingTop: 16 }}
              items={menuItems}
            />
          </Sider>
        )}
        <Content style={{
          margin: isFullWidthRoute ? '0' : (isMobile ? '16px' : '24px'),
          minHeight: 280,
          marginLeft: isFullWidthRoute ? (isMobile ? '0' : (collapsed ? '80px' : '200px')) : (isMobile ? '16px' : (collapsed ? '104px' : '224px')),
          marginRight: isFullWidthRoute ? '0' : (isMobile ? '16px' : '24px'),
          marginBottom: isFullWidthRoute ? (isMobile ? '60px' : '0') : (isMobile ? '88px' : '24px'),
          transition: 'margin-left 0.2s',
        }}>
          <AppRoutes />
        </Content>
      </Layout>

      {/* Menu inferior para mobile */}
      {isMobile && (
        <>
          <div className="mobile-bottom-nav">
            {mobileMenuItems.map((item) => {
              const isActive = location.pathname === item.key;
              return (
                <div
                  key={item.key}
                  onClick={item.onClick}
                  className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                >
                  {isActive && <div className="mobile-nav-indicator" />}
                  <div className="mobile-nav-icon">
                    {item.icon}
                  </div>
                  <span className="mobile-nav-label">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Drawer com menu completo para mobile */}
          <Drawer
            title="Menu"
            placement="bottom"
            onClose={() => setMobileDrawerVisible(false)}
            open={mobileDrawerVisible}
            height="auto"
            styles={{
              body: { padding: '0' }
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              style={{ border: 'none' }}
              items={mobileDrawerMenuItems}
              onClick={() => setMobileDrawerVisible(false)}
            />
          </Drawer>
        </>
      )}
    </Layout>
  );
};

export default App;
