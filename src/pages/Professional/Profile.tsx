import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Avatar,
  Row,
  Col,
  Typography,
  Spin,
  message,
  Tag,
  Divider,
  Tabs,
  List,
  Empty
} from 'antd';
import {
  UserOutlined,
  BookOutlined,
  ExperimentOutlined,
  EyeOutlined,
  LikeOutlined,
  CommentOutlined,
  StarOutlined
} from '@ant-design/icons';
import { userService } from '../../services/userService';
import { Article } from '../../services/articleService';
import { Activity } from '../../services/activityService';
import { User } from '../../services/authService';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ProfessionalProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await userService.getById(id);
        setProfile(data);
      } catch (error) {
        message.error('Erro ao carregar o perfil do usuário.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!id) return;
      try {
        setLoadingArticles(true);
        const data = await userService.getUserArticles(id);
        setArticles(data);
      } catch (error) {
        message.error('Erro ao carregar artigos do usuário.');
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchArticles();
  }, [id]);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!id) return;
      try {
        setLoadingActivities(true);
        const data = await userService.getUserActivities(id);
        setActivities(data);
      } catch (error) {
        message.error('Erro ao carregar atividades do usuário.');
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchActivities();
  }, [id]);

  const handleArticleClick = (articleId: string) => {
    navigate(`/artigo/${articleId}`);
  };

  const handleActivityClick = (activityId: string) => {
    navigate(`/atividade/${activityId}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Perfil não encontrado.</div>;
  }

  const getRoleLabel = (role: string) => {
    const roles: { [key: string]: { label: string; color: string } } = {
      PROFESSIONAL: { label: 'Profissional', color: 'blue' },
      ADMIN: { label: 'Administrador', color: 'red' },
      MODERATOR: { label: 'Moderador', color: 'orange' },
      USER: { label: 'Usuário', color: 'green' },
    };
    return roles[role] || { label: role, color: 'default' };
  };

  const roleInfo = getRoleLabel(profile.role);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <Avatar
              size={150}
              src={profile.avatar}
              icon={<UserOutlined />}
              style={{ border: '4px solid #1890ff' }}
            />
            <Title level={3} style={{ marginTop: '16px', marginBottom: '8px' }}>
              {profile.name}
            </Title>
            <Tag color={roleInfo.color} style={{ fontSize: '14px', padding: '4px 12px', marginBottom: '8px' }}>
              {roleInfo.label}
            </Tag>
            {profile.specialty && (
              <div style={{ marginTop: '8px' }}>
                <Text type="secondary">{profile.specialty}</Text>
              </div>
            )}

            <Divider />

            <Row gutter={[16, 16]} style={{ textAlign: 'center' }}>
              <Col span={12}>
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    {profile._count?.articles || 0}
                  </Title>
                  <Text type="secondary">Artigos</Text>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    {profile._count?.activities || 0}
                  </Title>
                  <Text type="secondary">Atividades</Text>
                </div>
              </Col>
            </Row>
          </Col>

          <Col xs={24} md={16}>
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                    <BookOutlined />
                    Artigos ({articles.length})
                  </span>
                }
                key="1"
              >
                {loadingArticles ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin />
                  </div>
                ) : articles.length > 0 ? (
                  <List
                    itemLayout="vertical"
                    dataSource={articles}
                    renderItem={(article) => (
                      <List.Item
                        key={article.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleArticleClick(article.id)}
                        extra={
                          article.image && (
                            <img
                              width={200}
                              alt={article.title}
                              src={article.image}
                              style={{ borderRadius: '8px', objectFit: 'cover' }}
                            />
                          )
                        }
                        actions={[
                          <span key="category">
                            <Tag color="blue">{article.category}</Tag>
                          </span>,
                          <span key="readTime">
                            <EyeOutlined /> {article.readTime} min
                          </span>,
                          <span key="likes">
                            <LikeOutlined /> {article._count?.likes || 0}
                          </span>,
                          <span key="comments">
                            <CommentOutlined /> {article._count?.comments || 0}
                          </span>,
                          <span key="favorites">
                            <StarOutlined /> {article._count?.favorites || 0}
                          </span>,
                        ]}
                      >
                        <List.Item.Meta
                          title={
                            <Text strong style={{ fontSize: '16px' }}>
                              {article.title}
                            </Text>
                          }
                          description={
                            <Paragraph
                              ellipsis={{ rows: 2 }}
                              style={{ marginBottom: 0 }}
                            >
                              {article.excerpt || article.content}
                            </Paragraph>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty
                    description="Nenhum artigo publicado ainda"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <ExperimentOutlined />
                    Atividades ({activities.length})
                  </span>
                }
                key="2"
              >
                {loadingActivities ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin />
                  </div>
                ) : activities.length > 0 ? (
                  <List
                    itemLayout="vertical"
                    dataSource={activities}
                    renderItem={(activity) => (
                      <List.Item
                        key={activity.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleActivityClick(activity.id)}
                        extra={
                          activity.image && (
                            <img
                              width={200}
                              alt={activity.title}
                              src={activity.image}
                              style={{ borderRadius: '8px', objectFit: 'cover' }}
                            />
                          )
                        }
                        actions={[
                          <span key="category">
                            <Tag color="green">{activity.category}</Tag>
                          </span>,
                          <span key="difficulty">
                            <Tag color="orange">{activity.difficulty}</Tag>
                          </span>,
                          <span key="ageRange">
                            {activity.ageRange}
                          </span>,
                          <span key="duration">
                            {activity.duration} min
                          </span>,
                          <span key="likes">
                            <LikeOutlined /> {activity._count?.likes || 0}
                          </span>,
                          <span key="comments">
                            <CommentOutlined /> {activity._count?.comments || 0}
                          </span>,
                          <span key="favorites">
                            <StarOutlined /> {activity._count?.favorites || 0}
                          </span>,
                        ]}
                      >
                        <List.Item.Meta
                          title={
                            <Text strong style={{ fontSize: '16px' }}>
                              {activity.title}
                            </Text>
                          }
                          description={
                            <Paragraph
                              ellipsis={{ rows: 2 }}
                              style={{ marginBottom: 0 }}
                            >
                              {activity.description}
                            </Paragraph>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty
                    description="Nenhuma atividade publicada ainda"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProfessionalProfile;
