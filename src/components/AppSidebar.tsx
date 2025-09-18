import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppstoreOutlined,
  BookOutlined,
  DatabaseOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ConfigProvider } from 'antd';

const { Sider } = Layout;

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/atividades',
      icon: <AppstoreOutlined />,
      label: 'Menu de Atividades',
    },
    {
      key: '/biblioteca',
      icon: <BookOutlined />,
      label: 'Biblioteca de Artigos',
    },
    {
      key: '/banco-atividades',
      icon: <DatabaseOutlined />,
      label: 'Banco de Atividades',
    },
    {
      key: '/perfil-autista',
      icon: <UserOutlined />,
      label: 'Perfil do Autista',
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemSelectedBg: 'transparent',
            itemSelectedColor: '#ffffff',
          },
        },
      }}
    >
      <Sider
        width={260}
        style={{
          background: 'transparent',
          position: 'fixed',
          left: 0,
          height: 'calc(100vh - 70px)', // Altura total menos altura do navbar
          top: 70, // Começa abaixo do navbar
          paddingTop: 20,
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{
            background: 'transparent',
            border: 'none',
          }}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="app-sidebar-menu"
        />
      </Sider>
    </ConfigProvider>
  );
};

export default AppSidebar;