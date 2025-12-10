import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Space, Modal, message, Tag, Typography, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, TrophyOutlined, HeartOutlined, MessageOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { activityService, Activity } from '../../services/activityService';
import './MyActivities.css';

const { Title, Text, Paragraph } = Typography;

const MyActivities: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await activityService.getMyActivities();
      setActivities(data);
    } catch (error) {
      message.error('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja deletar esta atividade?',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: async () => {
        try {
          await activityService.delete(id);
          message.success('Atividade deletada com sucesso');
          loadActivities();
        } catch (error) {
          message.error('Erro ao deletar atividade');
        }
      }
    });
  };

  const difficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'Fácil': 'green',
      'Médio': 'orange',
      'Difícil': 'red',
    };
    return colors[difficulty] || 'default';
  };

  if (loading) {
    return (
      <div className="my-activities-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="my-activities-page">
      {/* Page Header */}
      <div className="my-activities-header">
        <div className="my-activities-header-content">
          <div>
            <Title level={2} className="my-activities-title">
              <TrophyOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
              Minhas Atividades
            </Title>
            <Paragraph type="secondary" className="my-activities-count">
              {activities.length} {activities.length === 1 ? 'atividade criada' : 'atividades criadas'}
            </Paragraph>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/professional/atividades/novo')}
            size="large"
          >
            Nova Atividade
          </Button>
        </div>
      </div>

      {activities.length > 0 ? (
        <Row gutter={[24, 24]}>
          {activities.map((activity) => (
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
                  <Space onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/atividade/${activity.id}`);
                  }}>
                    <EyeOutlined />
                    Ver
                  </Space>,
                  <Space onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/professional/atividades/editar/${activity.id}`);
                  }}>
                    <EditOutlined />
                    Editar
                  </Space>,
                  <Space onClick={(e) => handleDelete(e, activity.id)}>
                    <DeleteOutlined style={{ color: '#ff4d4f' }} />
                    Deletar
                  </Space>,
                ]}
                onClick={() => navigate(`/atividade/${activity.id}`)}
              >
                <Card.Meta
                  title={
                    <div>
                      <Title level={5} ellipsis={{ rows: 2 }} style={{ marginBottom: '8px' }}>
                        {activity.title}
                      </Title>
                    </div>
                  }
                  description={
                    <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                      {activity.description}
                    </Paragraph>
                  }
                />
                <div style={{ marginTop: '16px', flex: '1' }}>
                  <Space wrap>
                    <Tag color="blue">{activity.category}</Tag>
                    <Tag color={difficultyColor(activity.difficulty)}>{activity.difficulty}</Tag>
                    <Tag color={activity.published ? 'green' : 'orange'}>
                      {activity.published ? 'Publicado' : 'Rascunho'}
                    </Tag>
                  </Space>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                  <Space split={<span style={{ color: '#d9d9d9' }}>|</span>}>
                    <Space size={4}>
                      <HeartOutlined style={{ color: '#ff4d4f' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>{activity._count?.likes || 0}</Text>
                    </Space>
                    <Space size={4}>
                      <MessageOutlined style={{ color: '#1890ff' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>{activity._count?.comments || 0}</Text>
                    </Space>
                    <Space size={4}>
                      <ClockCircleOutlined />
                      <Text type="secondary" style={{ fontSize: '12px' }}>{activity.duration} min</Text>
                    </Space>
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="my-activities-empty">
          <TrophyOutlined className="my-activities-empty-icon" />
          <Title level={4} type="secondary">Nenhuma atividade criada</Title>
          <Paragraph type="secondary">Comece criando sua primeira atividade!</Paragraph>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/professional/atividades/novo')}
            size="large"
          >
            Criar Primeira Atividade
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyActivities;
