import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Row, Col, Button, Tag, Space, Typography, Divider,
  Avatar, message, Breadcrumb, Spin, Alert
} from 'antd';
import {
  HeartOutlined, HeartFilled, StarOutlined, StarFilled,
  ClockCircleOutlined,
  BulbOutlined, ExperimentOutlined,
  ArrowLeftOutlined, ShareAltOutlined,
  CheckCircleOutlined, BookOutlined, TrophyOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { activityService } from '../../services/activityService';
import { likeService, favoriteService } from '../../services/interactionService';

const { Title, Text, Paragraph } = Typography;

const AtividadePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    loadActivity();
  }, [id]);

  const loadActivity = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await activityService.getById(id);
      setActivity(data);
      
      // Verificar se o usuário curtiu/favoritou
      try {
        const [myLikes, myFavorites] = await Promise.all([
          likeService.getMyLikes(),
          favoriteService.getMyFavorites()
        ]);
        
        setIsLiked(myLikes.some(like => like.activityId === id));
        setIsFavorited(myFavorites.some(fav => fav.activityId === id));
      } catch (error) {
        // Usuário não autenticado ou erro ao buscar - ignora
        console.log('Erro ao verificar interações:', error);
      }
    } catch (error: any) {
      message.error('Erro ao carregar atividade');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!activity) return;
    
    try {
      const response = await likeService.toggle({ activityId: activity.id });
      setIsLiked(response.liked);
      
      // Atualizar contador localmente
      setActivity({
        ...activity,
        _count: {
          ...activity._count,
          likes: activity._count.likes + (response.liked ? 1 : -1)
        }
      });
      
      message.success(response.message);
    } catch (error) {
      message.error('Erro ao atualizar curtida');
    }
  };

  const handleFavorite = async () => {
    if (!activity) return;
    
    try {
      const response = await favoriteService.toggle({ activityId: activity.id });
      setIsFavorited(response.favorited);
      
      // Atualizar contador localmente
      setActivity({
        ...activity,
        _count: {
          ...activity._count,
          favorites: activity._count.favorites + (response.favorited ? 1 : -1)
        }
      });
      
      message.success(response.message);
    } catch (error) {
      message.error('Erro ao atualizar favorito');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Link copiado para a área de transferência!');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'green';
      case 'Médio': return 'orange';
      case 'Avançado': return 'red';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Alert
          message="Atividade não encontrada"
          description="A atividade que você está procurando não existe ou foi removida."
          type="error"
          showIcon
        />
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/atividades')}
          style={{ marginTop: '16px' }}
        >
          Voltar para Atividades
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: '24px' }}>
        <Breadcrumb.Item>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/atividades')}
            style={{ padding: 0 }}
          >
            Banco de Atividades
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{activity.title}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={8}>
            <div
              style={{
                height: '300px',
                backgroundImage: `url(${activity.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '16px',
                position: 'relative',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255,255,255,0.9)',
                borderRadius: '20px',
                padding: '6px 12px'
              }}>
                <Tag color={getDifficultyColor(activity.difficulty)} style={{ margin: 0 }}>
                  {activity.difficulty}
                </Tag>
              </div>
            </div>
          </Col>

          <Col xs={24} lg={16}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Tags e categoria */}
              <div style={{ marginBottom: '16px' }}>
                <Space wrap>
                  <Tag color="blue">{activity.category}</Tag>
                  <Tag color="cyan">{activity.ageRange}</Tag>
                  {activity.tags && activity.tags.map((tag: string) => (
                    <Tag key={tag} color="geekblue">{tag}</Tag>
                  ))}
                </Space>
              </div>

              {/* Título */}
              <Title level={1} style={{ marginBottom: '16px', marginTop: 0 }}>
                {activity.title}
              </Title>

              {/* Descrição */}
              <Paragraph style={{ fontSize: '18px', color: '#666', marginBottom: '24px', flex: 1 }}>
                {activity.description}
              </Paragraph>

              {/* Informações do autor e data */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <Avatar src={activity.author?.avatar} size="large" style={{ marginRight: '12px' }} />
                <div>
                  <Text strong style={{ fontSize: '16px' }}>{activity.author?.name}</Text>
                  <br />
                  <Text type="secondary">{activity.author?.role}</Text>
                </div>
                <Divider type="vertical" style={{ margin: '0 24px', height: '40px' }} />
                <div>
                  <Text type="secondary">Publicado em {new Date(activity.publishedAt || activity.createdAt).toLocaleDateString('pt-BR')}</Text>
                </div>
              </div>

              {/* Botões de ação */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button
                  size="large"
                  icon={isLiked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                  onClick={handleLike}
                >
                  {activity._count?.likes || 0}
                </Button>
                <Button
                  size="large"
                  icon={isFavorited ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
                  onClick={handleFavorite}
                >
                  {activity._count?.favorites || 0}
                </Button>
                <Button
                  size="large"
                  icon={<ShareAltOutlined />}
                  onClick={handleShare}
                >
                  Compartilhar
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Conteúdo detalhado */}
      <Row gutter={[32, 24]}>
        <Col xs={24} lg={16}>
          {/* Conteúdo principal */}
          <Card style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '16px', lineHeight: '1.8' }}>
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <Title level={2} style={{ marginBottom: '16px' }}>{children}</Title>,
                  h2: ({ children }) => <Title level={3} style={{ marginBottom: '12px', marginTop: '24px' }}>{children}</Title>,
                  h3: ({ children }) => <Title level={4} style={{ marginBottom: '8px', marginTop: '20px' }}>{children}</Title>,
                  p: ({ children }) => <Paragraph style={{ marginBottom: '16px' }}>{children}</Paragraph>,
                  ul: ({ children }) => <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>{children}</ul>,
                  ol: ({ children }) => <ol style={{ marginBottom: '16px', paddingLeft: '20px' }}>{children}</ol>,
                  li: ({ children }) => <li style={{ marginBottom: '8px' }}>{children}</li>,
                  strong: ({ children }) => <Text strong>{children}</Text>,
                  em: ({ children }) => <Text italic>{children}</Text>,
                }}
              >
                {activity.content}
              </ReactMarkdown>
            </div>
          </Card>

          {/* Passos da atividade */}
          {activity.steps && (
            <Card title="Como Realizar" style={{ marginBottom: '24px' }}>
              {activity.steps.map((step: string, index: number) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '12px', marginTop: '4px' }} />
                  <Text style={{ fontSize: '16px' }}>{step}</Text>
                </div>
              ))}
            </Card>
          )}

          {/* Dicas */}
          {activity.tips && (
            <Card title="Dicas para o Sucesso" style={{ marginBottom: '24px' }}>
              {activity.tips.map((tip: string, index: number) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <BulbOutlined style={{ color: '#faad14', marginRight: '12px', marginTop: '4px' }} />
                  <Text style={{ fontSize: '16px' }}>{tip}</Text>
                </div>
              ))}
            </Card>
          )}
        </Col>

        <Col xs={24} lg={8}>
          {/* Informações rápidas */}
          <Card title="Informações Rápidas" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center', padding: '16px', background: '#f0f8ff', borderRadius: '8px' }}>
                <ClockCircleOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                <br />
                <Text strong style={{ fontSize: '16px' }}>Duração</Text>
                <br />
                <Text style={{ fontSize: '14px', color: '#666' }}>{activity.duration}</Text>
              </div>

              <div style={{ textAlign: 'center', padding: '16px', background: '#f6ffed', borderRadius: '8px' }}>
                <ExperimentOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                <br />
                <Text strong style={{ fontSize: '16px' }}>Materiais</Text>
                <br />
                <Text style={{ fontSize: '14px', color: '#666' }}>{activity.materials?.length || 0} itens necessários</Text>
              </div>

              <div style={{ textAlign: 'center', padding: '16px', background: '#fff7e6', borderRadius: '8px' }}>
                <TrophyOutlined style={{ fontSize: '24px', color: '#fa8c16', marginBottom: '8px' }} />
                <br />
                <Text strong style={{ fontSize: '16px' }}>Objetivos</Text>
                <br />
                <Text style={{ fontSize: '14px', color: '#666' }}>{activity.objectives?.length || 0} metas de aprendizado</Text>
              </div>
            </div>
          </Card>

          {/* Materiais necessários */}
          <Card title="Materiais Necessários" style={{ marginBottom: '24px' }}>
            {activity.materials && activity.materials.map((material: string, index: number) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                <Text>{material}</Text>
              </div>
            ))}
            {(!activity.materials || activity.materials.length === 0) && (
              <Text type="secondary">Nenhum material específico necessário</Text>
            )}
          </Card>

          {/* Objetivos */}
          <Card title="Objetivos de Aprendizado">
            {activity.objectives && activity.objectives.map((objective: string, index: number) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                <BookOutlined style={{ color: '#1890ff', marginRight: '8px', marginTop: '2px' }} />
                <Text style={{ fontSize: '14px' }}>{objective}</Text>
              </div>
            ))}
            {(!activity.objectives || activity.objectives.length === 0) && (
              <Text type="secondary">Nenhum objetivo definido</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AtividadePage;