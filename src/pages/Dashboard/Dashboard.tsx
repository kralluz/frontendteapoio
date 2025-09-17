import React from 'react';
import { Button, Layout, Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined, MoreOutlined, HeartOutlined, MessageOutlined, ShareAltOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './Dashboard.css';

// Simulação de dados de usuário
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
  {
    id: 4,
    user: {
      name: 'Carlos',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    type: 'activity',
    title: 'Jogo de Sequências Visuais',
    description: 'Atividade para estimular percepção visual e raciocínio lógico.',
    image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80',
    stats: '98 curtidas',
    likes: 12,
    comments: 1,
  },
  {
    id: 5,
    user: {
      name: 'Ana',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    type: 'article',
    title: 'A importância do brincar livre',
    description: 'Como o brincar espontâneo contribui para o desenvolvimento infantil.',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
    stats: '210 visualizações',
    likes: 29,
    comments: 4,
  },
  {
    id: 6,
    user: {
      name: 'João',
      avatar: userAvatar,
    },
    type: 'activity',
    title: 'Atividade de Recorte e Colagem',
    description: 'Estimule a coordenação motora fina com recortes e colagens divertidas.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    stats: '77 curtidas',
    likes: 8,
    comments: 0,
  },
  {
    id: 7,
    user: {
      name: 'Marina',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    type: 'article',
    title: 'Como lidar com seletividade alimentar',
    description: 'Dicas para ajudar crianças com TEA a ampliarem o repertório alimentar.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    stats: '156 visualizações',
    likes: 17,
    comments: 2,
  },
  {
    id: 8,
    user: {
      name: 'Lucas',
      avatar: 'https://randomuser.me/api/portraits/men/60.jpg',
    },
    type: 'activity',
    title: 'Circuito Motor em Casa',
    description: 'Monte um circuito simples para gastar energia e trabalhar o corpo.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    stats: '102 curtidas',
    likes: 14,
    comments: 1,
  },
];


const Dashboard: React.FC = () => {
  // const [filter, setFilter] = useState<'all' | 'article' | 'activity'>('all');
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
        {/* Conteúdo principal do Dashboard */}
        <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
          {/* Botões removidos conforme solicitado */}
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
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default Dashboard;
