import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Modal, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import api from '../../services/api';

interface Article {
  id: string;
  title: string;
  category: string;
  published: boolean;
  readTime: number;
  createdAt: string;
  _count: {
    comments: number;
    likes: number;
    favorites: number;
  };
}

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
      const response = await api.get('/articles/my');
      setArticles(response.data);
    } catch (error) {
      message.error('Erro ao carregar artigos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja deletar este artigo?',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: async () => {
        try {
          await api.delete(`/articles/${id}`);
          message.success('Artigo deletado com sucesso');
          loadArticles();
        } catch (error) {
          message.error('Erro ao deletar artigo');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Status',
      dataIndex: 'published',
      key: 'published',
      render: (published: boolean) => (
        <Tag color={published ? 'green' : 'orange'}>
          {published ? 'Publicado' : 'Rascunho'}
        </Tag>
      ),
    },
    {
      title: 'Leitura',
      dataIndex: 'readTime',
      key: 'readTime',
      render: (time: number) => `${time} min`,
    },
    {
      title: 'Curtidas',
      key: 'likes',
      render: (record: Article) => record._count.likes,
    },
    {
      title: 'Comentários',
      key: 'comments',
      render: (record: Article) => record._count.comments,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (record: Article) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/artigo/${record.id}`)}
            size="small"
          >
            Ver
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/professional/artigos/editar/${record.id}`)}
            type="primary"
            size="small"
          >
            Editar
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
            size="small"
          >
            Deletar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Meus Artigos</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/professional/artigos/novo')}
          size="large"
        >
          Novo Artigo
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={articles}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default MyArticles;
