import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Modal, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import api from '../../services/api';

interface Activity {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  published: boolean;
  duration: number;
  createdAt: string;
  _count: {
    comments: number;
    likes: number;
    favorites: number;
  };
}

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
      const response = await api.get('/activities/my');
      setActivities(response.data);
    } catch (error) {
      message.error('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja deletar esta atividade?',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: async () => {
        try {
          await api.delete(`/activities/${id}`);
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
      title: 'Dificuldade',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty: string) => (
        <Tag color={difficultyColor(difficulty)}>{difficulty}</Tag>
      ),
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
      title: 'Duração',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => `${duration} min`,
    },
    {
      title: 'Curtidas',
      key: 'likes',
      render: (record: Activity) => record._count.likes,
    },
    {
      title: 'Comentários',
      key: 'comments',
      render: (record: Activity) => record._count.comments,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (record: Activity) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/atividade/${record.id}`)}
            size="small"
          >
            Ver
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/professional/atividades/editar/${record.id}`)}
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
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Minhas Atividades</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/professional/atividades/novo')}
          size="large"
        >
          Nova Atividade
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={activities}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default MyActivities;
