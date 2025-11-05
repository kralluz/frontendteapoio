import React, { useState, useEffect } from 'react';
import { Typography, Card, Empty, List, Spin, Tag, Button, message } from 'antd';
import { HeartOutlined, HeartFilled, FileTextOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { likeService, Like } from '../../services/interactionService';

const { Title, Text } = Typography;

const Curtidos: React.FC = () => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    setLoading(true);
    try {
      const data = await likeService.getMyLikes();
      setLikes(data);
    } catch (error) {
      message.error('Erro ao carregar curtidos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async (like: Like) => {
    try {
      await likeService.toggle({
        articleId: like.articleId,
        activityId: like.activityId
      });
      message.success('Curtida removida');
      loadLikes(); // Recarregar lista
    } catch (error) {
      message.error('Erro ao remover curtida');
    }
  };

  const handleView = (like: Like) => {
    if (like.article) {
      navigate(`/artigo/${like.article.id}`);
    } else if (like.activity) {
      navigate(`/atividade/${like.activity.id}`);
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
        <HeartFilled style={{ marginRight: 8, color: '#ff4d4f' }} />
        Meus Curtidos
      </Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        {likes.length} {likes.length === 1 ? 'item curtido' : 'itens curtidos'}
      </Text>

      {likes.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
          dataSource={likes}
          renderItem={(like) => {
            const content = like.article || like.activity;
            const isArticle = !!like.article;

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
                      icon={<HeartFilled style={{ color: '#ff4d4f' }} />}
                      onClick={() => handleUnlike(like)}
                    >
                      Descurtir
                    </Button>,
                    <Button
                      type="primary"
                      onClick={() => handleView(like)}
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
                        {isArticle && like.article?.excerpt && (
                          <Text type="secondary" ellipsis={{ rows: 2 }}>
                            {like.article.excerpt}
                          </Text>
                        )}
                        {!isArticle && like.activity?.description && (
                          <Text type="secondary" ellipsis={{ rows: 2 }}>
                            {like.activity.description}
                          </Text>
                        )}
                        <div style={{ marginTop: 12 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            por {content.author?.name || 'Autor'}
                          </Text>
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
          description="Você ainda não curtiu nenhum conteúdo"
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

export default Curtidos;