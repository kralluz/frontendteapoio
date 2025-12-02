import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Row, Col, Tag, Space, Typography,
  message, Spin, Segmented, Avatar
} from 'antd';
import {
  HeartOutlined, HeartFilled, StarOutlined, StarFilled,
  UserOutlined, TeamOutlined,
  BulbOutlined, PlayCircleOutlined, ExperimentOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { activityService, Activity } from '../../services/activityService';
import { likeService, favoriteService } from '../../services/interactionService';

const { Title, Text, Paragraph } = Typography;

const filterOptions = [
  { label: 'Todas', value: 'all', icon: <ExperimentOutlined /> },
  { label: 'Sensoriais', value: 'Sensorial', icon: <BulbOutlined /> },
  { label: 'Cognitivas', value: 'Cognitiva', icon: <PlayCircleOutlined /> },
  { label: 'Socioemocionais', value: 'Socioemocional', icon: <TeamOutlined /> },
  { label: 'Comunicação', value: 'Comunicação', icon: <UserOutlined /> },
  { label: 'Motoras', value: 'Motora', icon: <PlayCircleOutlined /> }
];

const Atividades: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | number>('all');
  const [likedActivities, setLikedActivities] = useState<Set<string>>(new Set());
  const [favoritedActivities, setFavoritedActivities] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadActivities();
    loadUserInteractions();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activityService.getAll();
      setActivities(data);
    } catch (error: any) {
      message.error('Erro ao carregar atividades');
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
      
      setLikedActivities(new Set(myLikes.filter(l => l.activityId).map(l => l.activityId!)));
      setFavoritedActivities(new Set(myFavorites.filter(f => f.activityId).map(f => f.activityId!)));
    } catch (error) {
      // Usuário não autenticado - ignora
      console.log('Erro ao carregar interações:', error);
    }
  };

  const getFilteredActivities = () => {
    let filtered = [...activities];

    if (activeFilter !== 'all') {
      filtered = filtered.filter(activity => activity.category === activeFilter);
    }

    return filtered;
  };

  const handleFavorite = async (e: React.MouseEvent, activityId: string) => {
    e.stopPropagation();
    try {
      const result = await favoriteService.toggle({ activityId });
      
      // Atualizar estado de favoritos
      setFavoritedActivities(prev => {
        const newSet = new Set(prev);
        if (result.favorited) {
          newSet.add(activityId);
        } else {
          newSet.delete(activityId);
        }
        return newSet;
      });
      
      message.success(result.message);
    } catch (error: any) {
      message.error('Erro ao atualizar favorito');
    }
  };

  const handleLike = async (e: React.MouseEvent, activityId: string) => {
    e.stopPropagation();
    try {
      const result = await likeService.toggle({ activityId });
      
      // Atualizar estado de curtidas
      setLikedActivities(prev => {
        const newSet = new Set(prev);
        if (result.liked) {
          newSet.add(activityId);
        } else {
          newSet.delete(activityId);
        }
        return newSet;
      });
      
      // Atualização otimista - atualiza apenas a atividade específica
      setActivities(prevActivities => 
        prevActivities.map(activity => 
          activity.id === activityId 
            ? { 
                ...activity, 
                _count: { 
                  comments: activity._count?.comments || 0,
                  favorites: activity._count?.favorites || 0,
                  likes: result.liked 
                    ? (activity._count?.likes || 0) + 1 
                    : (activity._count?.likes || 1) - 1 
                }
              }
            : activity
        )
      );
      
      message.success(result.message);
    } catch (error: any) {
      message.error('Erro ao curtir');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'green';
      case 'Médio': return 'orange';
      case 'Avançado': return 'red';
      default: return 'default';
    }
  };

  const filteredActivities = getFilteredActivities();

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
          <ExperimentOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          Banco de Atividades
        </Title>
        <Paragraph type="secondary" style={{ fontSize: '16px', marginBottom: '24px' }}>
          Descubra atividades práticas e divertidas para desenvolver habilidades e superar desafios com seu filho.
        </Paragraph>
        <Segmented
          options={filterOptions}
          value={activeFilter}
          onChange={setActiveFilter}
          size="large"
          block
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        />
      </div>

      {/* Activities Grid */}
      <Row gutter={[24, 24]}>
        {filteredActivities.map(activity => (
          <Col xs={24} sm={12} lg={8} key={activity.id}>
            <Card
              hoverable
              style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '8px', overflow: 'hidden' }}
              cover={
                <img
                  alt={activity.title}
                  src={activity.image || `https://via.placeholder.com/400x200?text=${activity.category}`}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              }
              actions={[
                <Space onClick={(e) => handleLike(e, activity.id)}>
                  {likedActivities.has(activity.id) ? 
                    <HeartFilled style={{ color: '#ff4d4f' }} /> : 
                    <HeartOutlined />}
                  {activity._count?.likes || 0}
                </Space>,
                <Space><ClockCircleOutlined /> {activity.duration} min</Space>,
                <Space onClick={(e) => handleFavorite(e, activity.id)}>
                  {favoritedActivities.has(activity.id) ? 
                    <StarFilled style={{ color: '#faad14' }} /> : 
                    <StarOutlined />}
                  Favoritar
                </Space>,
              ]}
              onClick={() => navigate(`/atividade/${activity.id}`)}
            >
              <Card.Meta
                title={<Title level={5} ellipsis={{ rows: 2 }}>{activity.title}</Title>}
                description={
                  <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                    {activity.description}
                  </Paragraph>
                }
              />
              <div style={{ marginTop: '16px', flex: '1' }}>
                <Tag color="blue">{activity.category}</Tag>
                <Tag color={getDifficultyColor(activity.difficulty)}>{activity.difficulty}</Tag>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                <Space>
                  <Avatar src={activity.author?.avatar} icon={<UserOutlined />} size="small" />
                  <Text type="secondary">{activity.author?.name}</Text>
                </Space>
                <Text type="secondary" style={{ float: 'right', fontSize: '12px' }}>
                  {activity.ageRange}
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredActivities.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <ExperimentOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
          <Title level={4} type="secondary">Nenhuma atividade encontrada</Title>
          <Paragraph type="secondary">Tente ajustar os filtros ou fazer uma nova busca.</Paragraph>
        </div>
      )}
    </div>
  );
};

export default Atividades;