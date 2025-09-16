import React from 'react';
import { Button, Layout, Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined, BookOutlined, AppstoreOutlined, MoreOutlined, HeartOutlined, MessageOutlined, ShareAltOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './Dashboard.css';

// Simulação de dados de usuário
const userName = 'João';
const userAvatar = 'https://randomuser.me/api/portraits/men/32.jpg';

// Simulação de dados de posts estilo feed
const feedPosts = [
  {
    id: 1,
    user: {
      name: 'João',
      avatar: userAvatar,
    },
    type: 'article',
    title: 'Como estimular a comunicação em crianças TEA',
    description: 'Dicas práticas para promover o desenvolvimento da fala e interação social.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    stats: '245 visualizações',
    likes: 32,
    comments: 5,
  },
  {
    id: 2,
    user: {
      name: 'Maria',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    type: 'activity',
    title: 'Atividade Sensorial: Caixa de Texturas',
    description: 'Exercício divertido para trabalhar percepção tátil e foco.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    stats: '120 curtidas',
    likes: 18,
    comments: 2,
  },
  {
    id: 3,
    user: {
      name: 'João',
      avatar: userAvatar,
    },
    type: 'article',
    title: 'Estratégias para rotina escolar',
    description: 'Como adaptar o ambiente escolar para crianças com TEA.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    stats: '180 visualizações',
    likes: 25,
    comments: 3,
  },
];


const Dashboard: React.FC = () => {
  // Menu de opções do post
  const postMenu = (
    <Menu>
      <Menu.Item key="1">Denunciar</Menu.Item>
      <Menu.Item key="2">Salvar</Menu.Item>
    </Menu>
  );

  return (
    <Layout className="dashboard-bg">
      <Layout.Content className="dashboard-center">
        {/* Saudação */}
        <div className="dashboard-greeting">
          <h1 className="dashboard-title">Bem-vindo, {userName}!</h1>
          <p className="dashboard-subtitle">Seu hub de recursos e atividades para apoio ao TEA.</p>
        </div>
        {/* Botões de destaque */}
        <div className="dashboard-actions">
          <Button
            type="primary"
            className="dashboard-gradient-btn dashboard-action-btn"
            icon={<BookOutlined />}
            href="/biblioteca"
            size="large"
          >Biblioteca</Button>
          <Button
            type="primary"
            className="dashboard-gradient-btn dashboard-action-btn"
            icon={<AppstoreOutlined />}
            href="/atividades"
            size="large"
          >Atividades</Button>
        </div>
        {/* Feed estilo Instagram */}
        <div className="dashboard-feed">
          {feedPosts.map(post => (
            <div className="insta-post-card" key={post.id}>
              {/* Header do post */}
              <div className="insta-post-header">
                <div className="insta-post-user">
                  <Avatar src={post.user.avatar} icon={<UserOutlined />} size={40} />
                  <div>
                    <span className="insta-post-username">{post.user.name}</span>
                    <div className="insta-post-type">{post.type === 'article' ? 'Artigo' : 'Atividade'}</div>
                  </div>
                </div>
                <Dropdown overlay={postMenu} trigger={['click']} placement="bottomRight">
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              </div>
              {/* Imagem do post */}
              <div className="insta-post-image">
                <img src={post.image} alt={post.title} />
              </div>
              {/* Corpo do post */}
              <div className="insta-post-body">
                <div className="insta-post-title">{post.title}</div>
                <div className="insta-post-desc">{post.description}</div>
              </div>
              {/* Ações do post */}
              <div className="insta-post-actions">
                <Button type="text" icon={<HeartOutlined style={{ color: '#764ba2', fontSize: 22 }} />} className="insta-post-action-btn">
                  <span>{post.likes}</span>
                </Button>
                <Button type="text" icon={<MessageOutlined style={{ color: '#764ba2', fontSize: 22 }} />} className="insta-post-action-btn">
                  <span>{post.comments}</span>
                </Button>
                <Button type="text" icon={<ShareAltOutlined style={{ color: '#764ba2', fontSize: 22 }} />} className="insta-post-action-btn" />
                <span className="insta-post-stats">{post.stats}</span>
              </div>
            </div>
          ))}
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default Dashboard;
