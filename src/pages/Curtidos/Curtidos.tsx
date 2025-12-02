import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Tag, Space, Avatar, message } from 'antd';
import { HeartFilled, HeartOutlined, StarOutlined, StarFilled, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { likeService, favoriteService, Like } from '../../services/interactionService';

const { Title, Text, Paragraph } = Typography;

const Curtidos: React.FC = () => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState<Like[]>([]);
  const [favoritedItems, setFavoritedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadLikes();
    loadFavorites();
  }, []);

  const loadLikes = async () => {
    try {
      const data = await likeService.getMyLikes();
      setLikes(data);
    } catch (error) {
      message.error('Erro ao carregar curtidos');
      console.error(error);
    }
  };

  const loadFavorites = async () => {
    try {
      const myFavorites = await favoriteService.getMyFavorites();
      const favoriteIds = new Set<string>();
      myFavorites.forEach(fav => {
        if (fav.articleId) favoriteIds.add(fav.articleId);
        if (fav.activityId) favoriteIds.add(fav.activityId);
      });
      setFavoritedItems(favoriteIds);
    } catch (error) {
      console.log('Erro ao carregar favoritos:', error);
    }
  };

  const handleUnlike = async (e: React.MouseEvent, like: Like) => {
    e.stopPropagation();
    try {
      await likeService.toggle({
        ...(like.articleId && { articleId: like.articleId }),
        ...(like.activityId && { activityId: like.activityId })
      });
      message.success('Curtida removida');
      loadLikes();
    } catch (error) {
      message.error('Erro ao remover curtida');
    }
  };

  const handleFavorite = async (e: React.MouseEvent, like: Like) => {
    e.stopPropagation();
    try {
      const result = await favoriteService.toggle({
        ...(like.articleId && { articleId: like.articleId }),
        ...(like.activityId && { activityId: like.activityId })
      });
      
      const itemId = like.articleId || like.activityId;
      if (itemId) {
        setFavoritedItems(prev => {
          const newSet = new Set(prev);
          if (result.favorited) {
            newSet.add(itemId);
          } else {
            newSet.delete(itemId);
          }
          return newSet;
        });
      }
      
      message.success(result.message);
    } catch (error) {
      message.error('Erro ao atualizar favorito');
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #f0f0f0' }}>
        <Title level={2} style={{ marginBottom: '8px' }}>
          <HeartFilled style={{ marginRight: '12px', color: '#ff4d4f' }} />
          Meus Curtidos
        </Title>
        <Paragraph type="secondary" style={{ fontSize: '16px', marginBottom: 0 }}>
          {likes.length} {likes.length === 1 ? 'item curtido' : 'itens curtidos'}
        </Paragraph>
      </div>

      {likes.length > 0 ? (
        <Row gutter={[24, 24]}>
          {likes.map((like) => {
            const content = like.article || like.activity;
            const isArticle = !!like.article;
            const itemId = like.articleId || like.activityId || '';

            if (!content) return null;

            return (
              <Col xs={24} sm={12} lg={8} key={like.id}>
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
                    <Space onClick={(e) => handleUnlike(e, like)}>
                      <HeartFilled style={{ color: '#ff4d4f' }} /> 
                      {content._count?.likes || 0}
                    </Space>,
                    <Space onClick={(e) => handleFavorite(e, like)}>
                      {favoritedItems.has(itemId) ? 
                        <StarFilled style={{ color: '#faad14' }} /> : 
                        <StarOutlined />}
                      Favoritar
                    </Space>,
                  ]}
                  onClick={() => navigate(isArticle ? `/artigo/${content.id}` : `/atividade/${content.id}`)}
                >
                  <Card.Meta
                    title={<Title level={5} ellipsis={{ rows: 2 }}>{content.title}</Title>}
                    description={
                      <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                        {isArticle ? (like.article?.excerpt || like.article?.content.substring(0, 100)) : like.activity?.description}
                      </Paragraph>
                    }
                  />
                  <div style={{ marginTop: '16px', flex: '1' }}>
                    <Tag color={isArticle ? 'blue' : 'green'}>
                      {isArticle ? (like.article?.category || 'Artigo') : (like.activity?.category || 'Atividade')}
                    </Tag>
                    {!isArticle && like.activity?.difficulty && (
                      <Tag color={like.activity.difficulty === 'Fácil' ? 'green' : like.activity.difficulty === 'Médio' ? 'orange' : 'red'}>
                        {like.activity.difficulty}
                      </Tag>
                    )}
                  </div>
                  <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                    <Space>
                      <Avatar src={content.author?.avatar} icon={<UserOutlined />} size="small" />
                      <Text type="secondary">{content.author?.name}</Text>
                    </Space>
                    {isArticle && like.article?.readTime && (
                      <Text type="secondary" style={{ float: 'right', fontSize: '12px' }}>
                        <ClockCircleOutlined style={{ marginRight: '6px' }} />
                        {like.article.readTime} min
                      </Text>
                    )}
                    {!isArticle && like.activity?.duration && (
                      <Text type="secondary" style={{ float: 'right', fontSize: '12px' }}>
                        <ClockCircleOutlined style={{ marginRight: '6px' }} />
                        {like.activity.duration} min
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
          <HeartOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
          <Title level={4} type="secondary">Nenhum item curtido</Title>
          <Paragraph type="secondary">Comece curtindo artigos e atividades que você gosta!</Paragraph>
        </div>
      )}
    </div>
  );
};

export default Curtidos;