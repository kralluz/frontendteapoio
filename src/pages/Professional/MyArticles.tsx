import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Space, Modal, message, Tag, Typography, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, BookOutlined, HeartOutlined, MessageOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { articleService, Article } from '../../services/articleService';
import './MyArticles.css';

const { Title, Text, Paragraph } = Typography;

const MyArticles: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await articleService.getMyArticles();
      setArticles(data);
    } catch (error) {
      message.error('Erro ao carregar artigos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja deletar este artigo?',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: async () => {
        try {
          await articleService.delete(id);
          message.success('Artigo deletado com sucesso');
          loadArticles();
        } catch (error) {
          message.error('Erro ao deletar artigo');
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="my-articles-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="my-articles-page">
      {/* Page Header */}
      <div className="my-articles-header">
        <div className="my-articles-header-content">
          <div>
            <Title level={2} className="my-articles-title">
              <BookOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
              Meus Artigos
            </Title>
            <Paragraph type="secondary" className="my-articles-count">
              {articles.length} {articles.length === 1 ? 'artigo publicado' : 'artigos publicados'}
            </Paragraph>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/professional/artigos/novo')}
            size="large"
          >
            Novo Artigo
          </Button>
        </div>
      </div>

      {articles.length > 0 ? (
        <Row gutter={[24, 24]}>
          {articles.map((article) => (
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
                  <Space onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/artigo/${article.id}`);
                  }}>
                    <EyeOutlined />
                    Ver
                  </Space>,
                  <Space onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/professional/artigos/editar/${article.id}`);
                  }}>
                    <EditOutlined />
                    Editar
                  </Space>,
                  <Space onClick={(e) => handleDelete(e, article.id)}>
                    <DeleteOutlined style={{ color: '#ff4d4f' }} />
                    Deletar
                  </Space>,
                ]}
                onClick={() => navigate(`/artigo/${article.id}`)}
              >
                <Card.Meta
                  title={
                    <div>
                      <Title level={5} ellipsis={{ rows: 2 }} style={{ marginBottom: '8px' }}>
                        {article.title}
                      </Title>
                    </div>
                  }
                  description={
                    <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                      {article.excerpt || article.content.substring(0, 100)}
                    </Paragraph>
                  }
                />
                <div style={{ marginTop: '16px', flex: '1' }}>
                  <Space wrap>
                    <Tag color="blue">{article.category}</Tag>
                    <Tag color={article.published ? 'green' : 'orange'}>
                      {article.published ? 'Publicado' : 'Rascunho'}
                    </Tag>
                  </Space>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                  <Space split={<span style={{ color: '#d9d9d9' }}>|</span>}>
                    <Space size={4}>
                      <HeartOutlined style={{ color: '#ff4d4f' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>{article._count?.likes || 0}</Text>
                    </Space>
                    <Space size={4}>
                      <MessageOutlined style={{ color: '#1890ff' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>{article._count?.comments || 0}</Text>
                    </Space>
                    <Space size={4}>
                      <ClockCircleOutlined />
                      <Text type="secondary" style={{ fontSize: '12px' }}>{article.readTime} min</Text>
                    </Space>
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="my-articles-empty">
          <BookOutlined className="my-articles-empty-icon" />
          <Title level={4} type="secondary">Nenhum artigo criado</Title>
          <Paragraph type="secondary">Comece criando seu primeiro artigo!</Paragraph>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/professional/artigos/novo')}
            size="large"
          >
            Criar Primeiro Artigo
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyArticles;
