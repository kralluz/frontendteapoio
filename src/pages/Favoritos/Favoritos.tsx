import React, { useState, useEffect } from 'react';
import { Typography, Card, Empty, List, Spin, Tag, Button, message } from 'antd';
import { StarOutlined, StarFilled, FileTextOutlined, ThunderboltOutlined, HeartOutlined, MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { favoriteService, Favorite } from '../../services/interactionService';

const { Title, Text } = Typography;

const Favoritos: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
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

  const handleUnfavorite = async (favorite: Favorite) => {
    try {
      await favoriteService.toggle({
        articleId: favorite.articleId,
        activityId: favorite.activityId
      });
      message.success('Removido dos favoritos');
      loadFavorites(); // Recarregar lista
    } catch (error) {
      message.error('Erro ao remover favorito');
    }
  };

  const handleView = (favorite: Favorite) => {
    if (favorite.article) {
      navigate(`/artigo/${favorite.article.id}`);
    } else if (favorite.activity) {
      navigate(`/atividade/${favorite.activity.id}`);
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
    <div>
      <Title level={2}>
        <StarFilled style={{ marginRight: 8, color: '#fadb14' }} />
        Meus Favoritos
      </Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        {favorites.length} {favorites.length === 1 ? 'item favoritado' : 'itens favoritados'}
      </Text>

      {favorites.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
          dataSource={favorites}
          renderItem={(favorite) => {
            const content = favorite.article || favorite.activity;
            const isArticle = !!favorite.article;

            if (!content) return null;

            return (
              <List.Item>
                <Card
                  hoverable
                  style={{ height: '100%' }}
                  cover={
                    content.image ? (
                      <img
                        alt={content.title}
                        src={content.image}
                        style={{ height: 200, objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        height: 200,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isArticle ? (
                          <FileTextOutlined style={{ fontSize: 48, color: 'white' }} />
                        ) : (
                          <ThunderboltOutlined style={{ fontSize: 48, color: 'white' }} />
                        )}
                      </div>
                    )
                  }
                  actions={[
                    <Button
                      type="text"
                      icon={<StarFilled style={{ color: '#fadb14' }} />}
                      onClick={() => handleUnfavorite(favorite)}
                    >
                      Desfavoritar
                    </Button>,
                    <Button
                      type="primary"
                      onClick={() => handleView(favorite)}
                    >
                      Ver {isArticle ? 'Artigo' : 'Atividade'}
                    </Button>
                  ]}
                >
                  <Card.Meta
                    title={
                      <div>
                        <Tag color={isArticle ? 'blue' : 'green'}>
                          {isArticle ? 'Artigo' : 'Atividade'}
                        </Tag>
                        <div style={{ marginTop: 8 }}>{content.title}</div>
                      </div>
                    }
                    description={
                      <div>
                        {isArticle && favorite.article?.excerpt && (
                          <Text type="secondary" ellipsis={{ rows: 2 }}>
                            {favorite.article.excerpt}
                          </Text>
                        )}
                        {!isArticle && favorite.activity?.description && (
                          <Text type="secondary" ellipsis={{ rows: 2 }}>
                            {favorite.activity.description}
                          </Text>
                        )}
                        <div style={{ marginTop: 12 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            por {content.author?.name || 'Autor'}
                          </Text>
                          {content._count && (
                            <div style={{ marginTop: 8 }}>
                              <HeartOutlined /> {content._count.likes || 0} {' '}
                              <MessageOutlined /> {content._count.comments || 0}
                            </div>
                          )}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </List.Item>
            );
          }}
        />
      ) : (
        <Empty
          description="Você ainda não tem favoritos"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => navigate('/biblioteca')}>
            Explorar Biblioteca
          </Button>
        </Empty>
      )}
    </div>
  );
};

export default Favoritos;