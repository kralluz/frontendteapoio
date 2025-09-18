import React, { useState } from 'react';
import {
  Card, Row, Col, Button, Tag, Avatar, Space, Typography, Input,
  message
} from 'antd';
import {
  HeartOutlined, HeartFilled, StarOutlined, StarFilled,
  EyeOutlined, BookOutlined, ClockCircleOutlined, FireOutlined,
  UserOutlined, MessageOutlined, ShareAltOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

// Dados mock para os artigos
const mockArticles = [
  {
    id: 1,
    title: 'Guia Completo para Pais: Primeiros Passos no TEA',
    excerpt: 'Descubra as estratégias essenciais para apoiar seu filho no espectro do autismo. Este guia abrangente aborda desde o diagnóstico até as primeiras intervenções, oferecendo dicas práticas e baseadas em evidências científicas.',
    content: 'Conteúdo completo do artigo sobre primeiros passos no TEA...',
    author: {
      name: 'Dra. Maria Santos',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      role: 'Especialista em TEA'
    },
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    tags: ['Diagnóstico', 'Pais', 'Intervenção Precoce'],
    likes: 245,
    views: 1250,
    comments: 23,
    isLiked: false,
    isFavorited: false,
    publishedAt: '2024-01-15',
    readTime: 8,
    category: 'Guia para Pais'
  },
  {
    id: 2,
    title: 'Comunicação Alternativa e Aumentativa: Recursos Práticos',
    excerpt: 'Explore diferentes sistemas de comunicação para pessoas com TEA. Aprenda sobre PECs, comunicação por troca de imagens, dispositivos AAC e estratégias para promover a expressão e compreensão.',
    content: 'Conteúdo completo sobre comunicação alternativa...',
    author: {
      name: 'João Silva',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'Terapeuta da Fala'
    },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    tags: ['Comunicação', 'PECs', 'AAC'],
    likes: 189,
    views: 890,
    comments: 15,
    isLiked: false,
    isFavorited: true,
    publishedAt: '2024-01-12',
    readTime: 12,
    category: 'Comunicação'
  },
  {
    id: 3,
    title: 'Rotina Visual: Como Montar e Usar Eficazmente',
    excerpt: 'Aprenda a criar rotinas visuais que ajudam na organização e previsibilidade. Este artigo detalha como usar imagens, símbolos e cronogramas para melhorar a compreensão e reduzir a ansiedade.',
    content: 'Conteúdo completo sobre rotina visual...',
    author: {
      name: 'Ana Costa',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      role: 'Educadora Especial'
    },
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    tags: ['Rotina', 'Visual', 'Organização'],
    likes: 156,
    views: 720,
    comments: 8,
    isLiked: true,
    isFavorited: false,
    publishedAt: '2024-01-10',
    readTime: 6,
    category: 'Rotina e Organização'
  },
  {
    id: 4,
    title: 'Estratégias para Desenvolvimento Social em TEA',
    excerpt: 'Descubra técnicas comprovadas para apoiar o desenvolvimento de habilidades sociais. Do reconhecimento de emoções à formação de amizades, este guia oferece ferramentas práticas para terapeutas e pais.',
    content: 'Conteúdo completo sobre desenvolvimento social...',
    author: {
      name: 'Pedro Oliveira',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      role: 'Psicólogo'
    },
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    tags: ['Social', 'Habilidades', 'Interação'],
    likes: 312,
    views: 1450,
    comments: 31,
    isLiked: false,
    isFavorited: false,
    publishedAt: '2024-01-08',
    readTime: 15,
    category: 'Desenvolvimento Social'
  },
  {
    id: 5,
    title: 'Atividades Sensoriais para Regulação Emocional',
    excerpt: 'Explore atividades práticas que ajudam na autorregulação sensorial. Aprenda sobre caixas de texturas, atividades de movimento e estratégias para lidar com sobrecargas sensoriais.',
    content: 'Conteúdo completo sobre atividades sensoriais...',
    author: {
      name: 'Carla Mendes',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      role: 'Terapeuta Ocupacional'
    },
    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=800&q=80',
    tags: ['Sensorial', 'Regulação', 'Atividades'],
    likes: 278,
    views: 1100,
    comments: 19,
    isLiked: true,
    isFavorited: true,
    publishedAt: '2024-01-05',
    readTime: 10,
    category: 'Atividades Práticas'
  }
];

// Filtros disponíveis
const filterTags = [
  { key: 'all', label: 'Todos', icon: <BookOutlined /> },
  { key: 'recent', label: 'Recentes', icon: <ClockCircleOutlined /> },
  { key: 'popular', label: 'Mais Populares', icon: <FireOutlined /> },
  { key: 'communication', label: 'Comunicação', icon: <MessageOutlined /> },
  { key: 'social', label: 'Habilidades Sociais', icon: <UserOutlined /> },
  { key: 'routine', label: 'Rotina', icon: <ClockCircleOutlined /> },
  { key: 'activities', label: 'Atividades', icon: <StarOutlined /> }
];

const Biblioteca: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState(mockArticles);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchText, setSearchText] = useState('');

  // Função para filtrar artigos
  const getFilteredArticles = () => {
    let filtered = articles;

    // Filtro por tag
    if (activeFilter !== 'all') {
      switch (activeFilter) {
        case 'recent':
          filtered = filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
          break;
        case 'popular':
          filtered = filtered.sort((a, b) => b.likes - a.likes);
          break;
        case 'communication':
          filtered = filtered.filter(article => article.tags.includes('Comunicação') || article.tags.includes('PECs') || article.tags.includes('AAC'));
          break;
        case 'social':
          filtered = filtered.filter(article => article.tags.includes('Social') || article.tags.includes('Habilidades') || article.tags.includes('Interação'));
          break;
        case 'routine':
          filtered = filtered.filter(article => article.tags.includes('Rotina') || article.tags.includes('Organização'));
          break;
        case 'activities':
          filtered = filtered.filter(article => article.tags.includes('Atividades') || article.tags.includes('Sensorial'));
          break;
      }
    }

    // Filtro por busca
    if (searchText) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchText.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchText.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    return filtered;
  };

  // Função para curtir/descurtir artigo
  const handleLike = (articleId: number) => {
    setArticles(prev => prev.map(article => {
      if (article.id === articleId) {
        const newIsLiked = !article.isLiked;
        const newLikes = newIsLiked ? article.likes + 1 : article.likes - 1;
        return { ...article, isLiked: newIsLiked, likes: newLikes };
      }
      return article;
    }));
    message.success('Ação realizada com sucesso!');
  };

  // Função para favoritar/desfavoritar artigo
  const handleFavorite = (articleId: number) => {
    setArticles(prev => prev.map(article => {
      if (article.id === articleId) {
        return { ...article, isFavorited: !article.isFavorited };
      }
      return article;
    }));
    message.success('Ação realizada com sucesso!');
  };

  // Função para navegar para o artigo completo
  const handleArticleClick = (articleId: number) => {
    navigate(`/artigo/${articleId}`);
  };

  const filteredArticles = getFilteredArticles();

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ marginBottom: '8px' }}>
          <BookOutlined style={{ marginRight: '12px' }} />
          Biblioteca TEApoio
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Explore artigos, guias e recursos especializados para apoiar pessoas com TEA
        </Text>
      </div>

      {/* Barra de busca */}
      <div style={{ marginBottom: '24px' }}>
        <Search
          placeholder="Buscar artigos, tópicos ou autores..."
          allowClear
          size="large"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: '600px' }}
        />
      </div>

      {/* Filtros por tags */}
      <div style={{ marginBottom: '32px' }}>
        <Space wrap>
          {filterTags.map(filter => (
            <Button
              key={filter.key}
              type={activeFilter === filter.key ? 'primary' : 'default'}
              icon={filter.icon}
              onClick={() => setActiveFilter(filter.key)}
              style={{
                borderRadius: '20px',
                height: 'auto',
                padding: '6px 16px'
              }}
            >
              {filter.label}
            </Button>
          ))}
        </Space>
      </div>

      {/* Feed de artigos */}
      <Row gutter={[24, 24]}>
        {filteredArticles.map(article => (
          <Col xs={24} lg={12} key={article.id}>
            <Card
              hoverable
              style={{ height: '100%', cursor: 'pointer' }}
              cover={
                <div
                  style={{
                    height: '200px',
                    backgroundImage: `url(${article.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '8px 8px 0 0'
                  }}
                  onClick={() => handleArticleClick(article.id)}
                />
              }
              onClick={() => handleArticleClick(article.id)}
            >
              <div style={{ padding: '16px 0' }}>
                {/* Tags */}
                <div style={{ marginBottom: '12px' }}>
                  <Space wrap>
                    <Tag color="blue">{article.category}</Tag>
                    {article.tags.slice(0, 2).map(tag => (
                      <Tag key={tag} color="geekblue">{tag}</Tag>
                    ))}
                  </Space>
                </div>

                {/* Título */}
                <Title level={4} style={{ marginBottom: '8px', marginTop: 0 }}>
                  {article.title}
                </Title>

                {/* Excerpt */}
                <Paragraph
                  ellipsis={{ rows: 3 }}
                  style={{ marginBottom: '16px', color: '#666' }}
                >
                  {article.excerpt}
                </Paragraph>

                {/* Autor */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <Avatar src={article.author.avatar} size="small" style={{ marginRight: '8px' }} />
                  <div>
                    <Text strong style={{ fontSize: '14px' }}>{article.author.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>{article.author.role}</Text>
                  </div>
                </div>

                {/* Estatísticas e ações */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Button
                      type="text"
                      icon={article.isLiked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(article.id);
                      }}
                      style={{ padding: '4px 8px' }}
                    >
                      {article.likes}
                    </Button>
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      style={{ padding: '4px 8px', color: '#666' }}
                    >
                      {article.views}
                    </Button>
                    <Button
                      type="text"
                      icon={<MessageOutlined />}
                      style={{ padding: '4px 8px', color: '#666' }}
                    >
                      {article.comments}
                    </Button>
                  </Space>

                  <Space>
                    <Button
                      type="text"
                      icon={article.isFavorited ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavorite(article.id);
                      }}
                      style={{ padding: '4px 8px' }}
                    />
                    <Button
                      type="text"
                      icon={<ShareAltOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        message.info('Link copiado!');
                      }}
                      style={{ padding: '4px 8px' }}
                    />
                  </Space>
                </div>

                {/* Tempo de leitura e data */}
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    <ClockCircleOutlined style={{ marginRight: '4px' }} />
                    {article.readTime} min de leitura
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {new Date(article.publishedAt).toLocaleDateString('pt-BR')}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Mensagem quando não há resultados */}
      {filteredArticles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <BookOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
          <Title level={4} type="secondary">
            Nenhum artigo encontrado
          </Title>
          <Text type="secondary">
            Tente ajustar os filtros ou fazer uma nova busca
          </Text>
        </div>
      )}
    </div>
  );
};

export default Biblioteca;
