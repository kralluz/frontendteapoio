import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Tag, Space, Avatar, message, Spin } from 'antd';
import { StarFilled, StarOutlined, HeartOutlined, HeartFilled, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { favoriteService, likeService, Favorite } from '../../services/interactionService';

const { Title, Text, Paragraph } = Typography;

const Favoritos: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFavorites();
    loadLikes();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await favoriteService.getMyFavorites();
      setFavorites(data);
    } catch (error) {
      message.error('Erro ao carregar favoritos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadLikes = async () => {
    try {
      const myLikes = await likeService.getMyLikes();
      const likedIds = new Set<string>();
      myLikes.forEach(like => {
        if (like.articleId) likedIds.add(like.articleId);
        if (like.activityId) likedIds.add(like.activityId);
      });
      setLikedItems(likedIds);
    } catch (error) {
      console.log('Erro ao carregar curtidas:', error);
    }
  };

  const handleUnfavorite = async (e: React.MouseEvent, favorite: Favorite) => {
    e.stopPropagation();
    try {
      await favoriteService.toggle({
        ...(favorite.articleId && { articleId: favorite.articleId }),
        ...(favorite.activityId && { activityId: favorite.activityId })
      });
      message.success('Removido dos favoritos');
      loadFavorites();
    } catch (error) {
      message.error('Erro ao remover favorito');
    }
  };

  const handleLike = async (e: React.MouseEvent, favorite: Favorite) => {
    e.stopPropagation();
    try {
      const result = await likeService.toggle({
        ...(favorite.articleId && { articleId: favorite.articleId }),
        ...(favorite.activityId && { activityId: favorite.activityId })
      });
      
      const itemId = favorite.articleId || favorite.activityId;
      if (itemId) {
        setLikedItems(prev => {
          const newSet = new Set(prev);
          if (result.liked) {
            newSet.add(itemId);
          } else {
            newSet.delete(itemId);
          }
          return newSet;
        });
      }
      
      message.success(result.message);
    } catch (error) {
      message.error('Erro ao curtir');
    }
  };

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
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #f0f0f0' }}>
        <Title level={2} style={{ marginBottom: '8px' }}>
          <StarFilled style={{ marginRight: '12px', color: '#faad14' }} />
          Meus Favoritos
        </Title>
        <Paragraph type="secondary" style={{ fontSize: '16px', marginBottom: 0 }}>
          {favorites.length} {favorites.length === 1 ? 'item favoritado' : 'itens favoritados'}
        </Paragraph>
      </div>

      {favorites.length > 0 ? (
        <Row gutter={[24, 24]}>
          {favorites.map((favorite) => {
            const content = favorite.article || favorite.activity;
            const isArticle = !!favorite.article;
            const itemId = favorite.articleId || favorite.activityId || '';

            if (!content) return null;

            return (
              <Col xs={24} sm={12} lg={8} key={favorite.id}>
                <Card
                  hoverable
                  style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '8px', overflow: 'hidden' }}
                  cover={
                    <img
                      alt={content.title}
                      src={content.image || `https://via.placeholder.com/400x200?text=${isArticle ? 'Artigo' : 'Atividade'}`}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    <Space onClick={(e) => handleLike(e, favorite)}>
                      {likedItems.has(itemId) ? 
                        <HeartFilled style={{ color: '#ff4d4f' }} /> : 
                        <HeartOutlined />}
                      {content._count?.likes || 0}
                    </Space>,
                    <Space onClick={(e) => handleUnfavorite(e, favorite)}>
                      <StarFilled style={{ color: '#faad14' }} /> 
                      Favoritar
                    </Space>,
                  ]}
                  onClick={() => navigate(isArticle ? `/artigo/${content.id}` : `/atividade/${content.id}`)}
                >
                  <Card.Meta
                    title={<Title level={5} ellipsis={{ rows: 2 }}>{content.title}</Title>}
                    description={
                      <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                        {isArticle ? (favorite.article?.excerpt || favorite.article?.content.substring(0, 100)) : favorite.activity?.description}
                      </Paragraph>
                    }
                  />
                  <div style={{ marginTop: '16px', flex: '1' }}>
                    <Tag color={isArticle ? 'blue' : 'green'}>
                      {isArticle ? (favorite.article?.category || 'Artigo') : (favorite.activity?.category || 'Atividade')}
                    </Tag>
                    {!isArticle && favorite.activity?.difficulty && (
                      <Tag color={favorite.activity.difficulty === 'Fácil' ? 'green' : favorite.activity.difficulty === 'Médio' ? 'orange' : 'red'}>
                        {favorite.activity.difficulty}
                      </Tag>
                    )}
                  </div>
                  <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                    <Space>
                      <Avatar src={content.author?.avatar} icon={<UserOutlined />} size="small" />
                      <Text type="secondary">{content.author?.name}</Text>
                    </Space>
                    {isArticle && favorite.article?.readTime && (
                      <Text type="secondary" style={{ float: 'right', fontSize: '12px' }}>
                        <ClockCircleOutlined style={{ marginRight: '6px' }} />
                        {favorite.article.readTime} min
                      </Text>
                    )}
                    {!isArticle && favorite.activity?.duration && (
                      <Text type="secondary" style={{ float: 'right', fontSize: '12px' }}>
                        <ClockCircleOutlined style={{ marginRight: '6px' }} />
                        {favorite.activity.duration} min
                      </Text>
                    )}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <StarOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
          <Title level={4} type="secondary">Nenhum item favoritado</Title>
          <Paragraph type="secondary">Comece favoritando artigos e atividades para acesso rápido!</Paragraph>
        </div>
      )}
    </div>
  );
};

export default Favoritos;