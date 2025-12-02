import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Typography, Button } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, BookOutlined, ProfileOutlined, StarOutlined, MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined, FileTextOutlined, ThunderboltOutlined, ExperimentOutlined } from '@ant-design/icons';
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

  // Verificar se estamos em uma rota que não deve mostrar header/sidebar
  const isAuthRoute = location.pathname === '/login' ||
                       location.pathname === '/register' ||
                       location.pathname === '/register/professional' ||
                       location.pathname === '/password-reset';

  const isProfessional = user?.role === 'PROFESSIONAL';

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
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '18px',
            marginRight: '16px',
          }}
        />
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
            boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ borderRight: 0, paddingTop: 16 }}
            items={menuItems}
          />
        </Sider>
        <Content style={{
          margin: '24px',
          minHeight: 280,
        }}>
          <AppRoutes />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
