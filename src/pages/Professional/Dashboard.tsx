import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Button, Space } from 'antd';
import { FileTextOutlined, ThunderboltOutlined, HeartOutlined, MessageOutlined, PlusOutlined } from '@ant-design/icons';
import { articleService } from '../../services/articleService';
import { activityService } from '../../services/activityService';
import './Dashboard.css';

const ProfessionalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalActivities: 0,
    totalLikes: 0,
    totalComments: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [articles, activities] = await Promise.all([
        articleService.getMyArticles(),
        activityService.getMyActivities(),
      ]);

      const totalLikes = articles.reduce((sum: number, a: any) => sum + a._count.likes, 0) +
                        activities.reduce((sum: number, a: any) => sum + a._count.likes, 0);

      const totalComments = articles.reduce((sum: number, a: any) => sum + a._count.comments, 0) +
                           activities.reduce((sum: number, a: any) => sum + a._count.comments, 0);

      setStats({
        totalArticles: articles.length,
        totalActivities: activities.length,
        totalLikes,
        totalComments,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  return (
    <div className="professional-dashboard">
      <h1 className="professional-dashboard-title">
        Painel do Profissional
      </h1>

      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Artigos Publicados"
              value={stats.totalArticles}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Atividades Criadas"
              value={stats.totalActivities}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total de Curtidas"
              value={stats.totalLikes}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Comentários"
              value={stats.totalComments}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title="Gerenciar Artigos"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/professional/artigos/novo')}
              >
                Novo
              </Button>
            }
          >
            <p className="professional-dashboard-description">
              Crie e gerencie seus artigos educacionais sobre autismo.
            </p>
            <Button
              type="link"
              onClick={() => navigate('/professional/artigos')}
            >
              Ver todos os artigos →
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="Gerenciar Atividades"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/professional/atividades/novo')}
              >
                Nova
              </Button>
            }
          >
            <p className="professional-dashboard-description">
              Crie e gerencie atividades terapêuticas para crianças autistas.
            </p>
            <Button
              type="link"
              onClick={() => navigate('/professional/atividades')}
            >
              Ver todas as atividades →
            </Button>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '24px' }} title="Ações Rápidas">
        <Space size="middle" wrap>
          <Button
            type="primary"
            size="large"
            icon={<FileTextOutlined />}
            onClick={() => navigate('/professional/artigos/novo')}
          >
            Criar Artigo
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<ThunderboltOutlined />}
            onClick={() => navigate('/professional/atividades/novo')}
          >
            Criar Atividade
          </Button>
          <Button
            size="large"
            onClick={() => navigate('/professional/artigos')}
          >
            Meus Artigos
          </Button>
          <Button
            size="large"
            onClick={() => navigate('/professional/atividades')}
          >
            Minhas Atividades
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default ProfessionalDashboard;
