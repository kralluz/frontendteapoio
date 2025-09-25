import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Typography, Button } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, AppstoreOutlined, BookOutlined, ProfileOutlined, HeartOutlined, StarOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid } from 'antd';
import AppRoutes from './routes';
import './App.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

const user = {
  name: 'João',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);

  // Verificar se estamos em uma rota que não deve mostrar header/sidebar
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/password-reset';

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Perfil',
      onClick: () => navigate('/perfil'),
    },
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
        navigate('/login');
      },
    },
  ];

  const sidebarMenuItems = [
    {
      key: '/biblioteca',
      icon: <BookOutlined />,
      label: 'Biblioteca',
    },
    {
      key: '/atividades',
      icon: <AppstoreOutlined />,
      label: 'Atividades',
    },
    {
      key: '/perfil-autista',
      icon: <ProfileOutlined />,
      label: 'Perfil do Autista',
    },
    {
      key: '/favoritos',
      icon: <StarOutlined />,
      label: 'Favoritos',
    },
    {
      key: '/curtidos',
      icon: <HeartOutlined />,
      label: 'Curtidos',
    },
    {
      key: '/configuracoes',
      icon: <SettingOutlined />,
      label: 'Configurações',
    },
  ];

  // Bottom bar items for mobile
  const bottomBarItems = [
    ...sidebarMenuItems.slice(0, 5), // Mostra apenas os primeiros 5 itens na bottom bar
  ].map(item => ({
    ...item,
    label: collapsed ? '' : item.label,
  }));

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  // Se estiver em rota de autenticação, renderizar apenas o conteúdo sem header/sidebar
  if (isAuthRoute) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <AppRoutes />
      </div>
    );
  }

  // Render bottom bar for mobile
  if (!screens.md) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src="/imagens/Logo.png"
              alt="Lyora Logo"
              style={{ height: 36, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}
            />
            <Title level={3} style={{ color: 'white', margin: 0 }}>
              Lyora
            </Title>
          </div>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Avatar src={user.avatar} />
              <span style={{ color: 'white', marginLeft: 8 }}>{user.name}</span>
            </div>
          </Dropdown>
        </Header>
        <Layout>
          <Content style={{
            padding: '24px',
            marginTop: 64,
            minHeight: 'calc(100vh - 64px - 80px)',
            overflow: 'auto'
          }}>
            <AppRoutes />
          </Content>
        </Layout>
        {/* Bottom Navigation Bar */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #e8e8e8',
          padding: '8px 0',
          zIndex: 1000,
          boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
        }}>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={bottomBarItems}
            onClick={handleMenuClick}
            style={{
              border: 'none',
              justifyContent: 'space-around',
              flex: 1
            }}
          />
        </div>
      </Layout>
    );
  }

  // Desktop layout with collapsible sidebar
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              marginRight: 16
            }}
            className="sider-toggle-btn"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src="/imagens/Logo.png"
              alt="Lyora Logo"
              style={{ height: 40, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}
            />
            <Title level={3} style={{ color: 'white', margin: 0 }}>
              Lyora
            </Title>
          </div>
        </div>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Avatar src={user.avatar} />
            <span style={{ color: 'white', marginLeft: 8 }}>{user.name}</span>
          </div>
        </Dropdown>
      </Header>
      <Layout>
        <Sider
          width={260}
          collapsed={collapsed}
          style={{
            position: 'fixed',
            top: 64,
            left: 0,
            height: 'calc(100vh - 64px)',
            background: '#f0f2f5',
            transition: 'all 0.2s',
            overflow: 'auto'
          }}
          collapsedWidth={80}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={sidebarMenuItems}
            onClick={handleMenuClick}
            style={{
              background: 'transparent',
              border: 'none',
              height: '100%'
            }}
          />
        </Sider>
        <Layout style={{
          marginTop: 64,
          marginLeft: collapsed ? 80 : 260,
          transition: 'margin-left 0.2s'
        }}>
          <Content style={{
            padding: '24px',
            minHeight: 'calc(100vh - 64px)',
            overflow: 'auto'
          }}>
            <AppRoutes />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;