import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Tag, Space, Typography,
  message, Spin, Segmented, Avatar} from 'antd';
import {
  StarOutlined,
  StarFilled,
  BookOutlined,
  ClockCircleOutlined,
  FireOutlined,
  UserOutlined,
  HeartOutlined,
  HeartFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { articleService, Article } from '../../services/articleService';
import { likeService, favoriteService } from '../../services/interactionService';

const { Title, Text, Paragraph } = Typography;

const filterOptions = [
  { label: 'Todos', value: 'all', icon: <BookOutlined /> },
  { label: 'Recentes', value: 'recent', icon: <ClockCircleOutlined /> },
  { label: 'Populares', value: 'popular', icon: <FireOutlined /> },
];

const Biblioteca: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | number>('all');
  const [likedArticles, setLikedArticles] = useState<Set<string>>(new Set());
  const [favoritedArticles, setFavoritedArticles] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadArticles();
    loadUserInteractions();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await articleService.getAll();
      setArticles(data);
    } catch (error: any) {
      message.error('Erro ao carregar artigos: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const loadUserInteractions = async () => {
    try {
      const [myLikes, myFavorites] = await Promise.all([
        likeService.getMyLikes(),
        favoriteService.getMyFavorites()
      ]);
      
      setLikedArticles(new Set(myLikes.filter(l => l.articleId).map(l => l.articleId!)));
      setFavoritedArticles(new Set(myFavorites.filter(f => f.articleId).map(f => f.articleId!)));
    } catch (error) {
      // Usuário não autenticado - ignora
      console.log('Erro ao carregar interações:', error);
    }
  };

  const getFilteredArticles = () => {
    let filtered = [...articles];

    if (activeFilter === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (activeFilter === 'popular') {
      filtered.sort((a, b) => (b._count?.likes || 0) - (a._count?.likes || 0));
    }

    return filtered;
  };

  const handleFavorite = async (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    try {
      const result = await favoriteService.toggle({ articleId });
      
      // Atualizar estado de favoritos
      setFavoritedArticles(prev => {
        const newSet = new Set(prev);
        if (result.favorited) {
          newSet.add(articleId);
        } else {
          newSet.delete(articleId);
        }
        return newSet;
      });
      
      message.success(result.message);
    } catch (error: any) {
      message.error('Erro ao atualizar favorito');
    }
  };

  const handleLike = async (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    try {
      const result = await likeService.toggle({ articleId });
      
      // Atualizar estado de curtidas
      setLikedArticles(prev => {
        const newSet = new Set(prev);
        if (result.liked) {
          newSet.add(articleId);
        } else {
          newSet.delete(articleId);
        }
        return newSet;
      });
      
      // Atualização otimista - atualiza apenas o artigo específico
      setArticles(prevArticles => 
        prevArticles.map(article => 
          article.id === articleId 
            ? { 
                ...article, 
                _count: { 
                  comments: article._count?.comments || 0,
                  favorites: article._count?.favorites || 0,
                  likes: result.liked 
                    ? (article._count?.likes || 0) + 1 
                    : (article._count?.likes || 1) - 1 
                }
              }
            : article
        )
      );
      
      message.success(result.message);
    } catch (error: any) {
      message.error('Erro ao curtir');
    }
  };

  const filteredArticles = getFilteredArticles();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ 
        background: '#fff', 
        padding: window.innerWidth <= 768 ? '16px' : '24px', 
        borderRadius: window.innerWidth <= 768 ? '0' : '8px', 
        marginBottom: window.innerWidth <= 768 ? '16px' : '24px', 
        border: window.innerWidth <= 768 ? 'none' : '1px solid #f0f0f0', 
        marginLeft: window.innerWidth <= 768 ? '-16px' : '0', 
        marginRight: window.innerWidth <= 768 ? '-16px' : '0'
      }}>
        <Title level={2} style={{ marginBottom: '8px', fontSize: window.innerWidth <= 768 ? '24px' : '30px' }}>
          <BookOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          Biblioteca
        </Title>
        <Paragraph type="secondary" style={{ fontSize: window.innerWidth <= 768 ? '14px' : '16px', marginBottom: window.innerWidth <= 768 ? '16px' : '24px' }}>
          Explore artigos, guias e recursos especializados para apoiar pessoas com TEA.
        </Paragraph>
        <div style={{ overflowX: 'auto', margin: window.innerWidth <= 768 ? '0 -16px' : '0', padding: window.innerWidth <= 768 ? '0 16px' : '0' }}>
          <Segmented
            options={filterOptions}
            value={activeFilter}
            onChange={setActiveFilter}
            size={window.innerWidth <= 768 ? 'middle' : 'large'}
            block={window.innerWidth > 768}
            style={{ 
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              minWidth: window.innerWidth <= 768 ? 'max-content' : 'auto'
            }}
          />
        </div>
      </div>

      {/* Articles Grid */}
      <Row gutter={[24, 24]}>
        {filteredArticles.map(article => (
          <Col xs={24} sm={12} lg={8} key={article.id}>
            <Card
              hoverable
              style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '8px', overflow: 'hidden' }}
              cover={
                <img
                  alt={article.title}
                  src={article.image || `https://via.placeholder.com/400x200?text=${article.category}`}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              }
              actions={[
                <Space onClick={(e) => handleLike(e, article.id)}>
                  {likedArticles.has(article.id) ? 
                    <HeartFilled style={{ color: '#ff4d4f' }} /> : 
                    <HeartOutlined />}
                  {article._count?.likes || 0}
                </Space>,
                <Space onClick={(e) => handleFavorite(e, article.id)}>
                  {favoritedArticles.has(article.id) ? 
                    <StarFilled style={{ color: '#faad14' }} /> : 
                    <StarOutlined />}
                  Favoritar
                </Space>,
              ]}
              onClick={() => navigate(`/artigo/${article.id}`)}
            >
              <Card.Meta
                title={<Title level={5} ellipsis={{ rows: 2 }}>{article.title}</Title>}
                description={
                  <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                    {article.excerpt || article.content.substring(0, 100)}
                  </Paragraph>
                }
              />
              <div style={{ marginTop: '16px', flex: '1' }}>
                <Tag color="blue">{article.category}</Tag>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                <Space>
                  <Avatar src={article.author.avatar} icon={<UserOutlined />} size="small" />
                  <Text type="secondary">{article.author.name}</Text>
                </Space>
                <Text type="secondary" style={{ float: 'right', fontSize: '12px' }}>
                  <ClockCircleOutlined style={{ marginRight: '6px' }} />
                  {article.readTime} min
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredArticles.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <BookOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
          <Title level={4} type="secondary">Nenhum artigo encontrado</Title>
          <Paragraph type="secondary">Tente ajustar os filtros ou fazer uma nova busca.</Paragraph>
        </div>
      )}
    </div>
  );
};

export default Biblioteca;