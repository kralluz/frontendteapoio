import React from 'react';
import { Layout, Card, Avatar, Typography, Button, Menu, List } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  StarOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

interface ProfileData {
  name: string;
  role: string;
  initials: string;
  diagnosis: string;
  children: {
    name: string;
    birthDate: string;
    age: number;
    avatar: string;
  }[];
  articles: {
    title: string;
    description: string;
  }[];
}

// Dados mockados para exemplo
const profileData: ProfileData = {
  name: 'Valeria Dias',
  role: 'Cuidadora',
  initials: 'VD',
  diagnosis: 'Transtorno do Espectro Autista',
  children: [
    {
      name: 'Lucas',
      birthDate: '15/05/2015',
      age: 8,
      avatar: '/path/to/avatar.png' // Substituir pelo caminho real da imagem
    }
  ],
  articles: [
    {
      title: 'Estratégias para ajudar crianças com TEA',
      description: 'Este artigo apresenta estratégias eficazes para ajudar crianças com TEA em suas rotinas diárias...'
    }
  ]
};

const Profile: React.FC = () => {
  return (
    <Layout style={{ background: '#f5f7fb', minHeight: '100vh' }}>
      {/* Menu Lateral */}
      <Sider
        width={250}
        style={{
          background: 'white',
          padding: '24px 0',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ padding: '0 24px', marginBottom: '24px', textAlign: 'center' }}>
          <Avatar
            size={100}
            style={{
              backgroundColor: '#667eea',
              fontSize: '32px',
              marginBottom: '16px'
            }}
          >
            {profileData.initials}
          </Avatar>
          <Title level={4} style={{ margin: '8px 0', color: '#111827' }}>
            {profileData.name}
          </Title>
          <Text type="secondary">{profileData.role}</Text>
        </div>

        <Menu
          mode="inline"
          defaultSelectedKeys={['profile']}
          style={{ borderRight: 0 }}
        >
          <Menu.Item key="profile" icon={<UserOutlined />}>
            Perfil
          </Menu.Item>
          <Menu.Item key="articles" icon={<BookOutlined />}>
            Artigos
          </Menu.Item>
          <Menu.Item key="favorites" icon={<StarOutlined />}>
            Favoritos
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            Configurações
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
            Sair
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Conteúdo Principal */}
      <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Cabeçalho do Perfil */}
        <Card
          style={{
            marginBottom: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>Perfil</Title>
            <Button
              type="primary"
              style={{
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              Editar perfil
            </Button>
          </div>
        </Card>

        {/* Seção de Diagnóstico */}
        <Card
          title="Diagnóstico"
          style={{
            marginBottom: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <Text>{profileData.diagnosis}</Text>
        </Card>

        {/* Seção de Crianças */}
        <Card
          title="Crianças"
          style={{
            marginBottom: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <List
            itemLayout="horizontal"
            dataSource={profileData.children}
            renderItem={child => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={child.avatar}
                      style={{ backgroundColor: '#667eea' }}
                    >
                      {child.name[0]}
                    </Avatar>
                  }
                  title={child.name}
                  description={`${child.birthDate} (${child.age} anos)`}
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Seção de Artigos */}
        <Card
          title="Artigos"
          extra={<Link to="/artigos" style={{ color: '#667eea' }}>Ver todos</Link>}
          style={{
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <List
            itemLayout="vertical"
            dataSource={profileData.articles}
            renderItem={article => (
              <List.Item>
                <List.Item.Meta
                  title={article.title}
                  description={article.description}
                />
              </List.Item>
            )}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default Profile;