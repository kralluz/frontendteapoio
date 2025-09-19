import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Row, Col, Button, Tag, Space, Typography,
  Input, message, Tooltip, Divider, Avatar
} from 'antd';
import { gradientSelectionButtonStyle } from '../../styles/SelectionButtonStyles';
import {
  HeartOutlined, HeartFilled, StarOutlined, StarFilled,
  ClockCircleOutlined, UserOutlined, TeamOutlined,
  BulbOutlined, PlayCircleOutlined, ExperimentOutlined,
  FilterOutlined, SearchOutlined, CalendarOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

// Dados mock das atividades
const mockActivities = [
  {
    id: 1,
    title: 'Caixa de Texturas Sensoriais',
    description: 'Crie uma caixa com diferentes materiais (algodão, lixa, seda, areia) para estimular a percepção tátil e desenvolver o foco. Ajuda no processamento sensorial e na autorregulação.',
    category: 'Sensorial',
    ageRange: '3-7 anos',
    duration: '20-30 min',
    difficulty: 'Fácil',
    materials: ['Caixa plástica', 'Tecidos diversos', 'Objetos texturizados'],
    objectives: ['Desenvolvimento sensorial', 'Foco e atenção', 'Autorregulação'],
    likes: 245,
    favorites: 89,
    isLiked: false,
    isFavorited: false,
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?auto=format&fit=crop&w=400&q=80',
    tags: ['Sensorial', 'Casa', 'Fácil'],
    author: {
      name: 'Dra. Maria Santos',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      role: 'Terapeuta Ocupacional'
    },
    publishedAt: '2024-01-20',
    views: 1250
  },
  {
    id: 2,
    title: 'Sequências Visuais do Dia a Dia',
    description: 'Use imagens ou desenhos para criar sequências visuais das rotinas diárias. Ajuda na compreensão de processos sequenciais e reduz ansiedade.',
    category: 'Cognitiva',
    ageRange: '4-10 anos',
    duration: '15-25 min',
    difficulty: 'Médio',
    materials: ['Papel', 'Canetas coloridas', 'Imagens impressas', 'Fita adesiva'],
    objectives: ['Compreensão sequencial', 'Redução de ansiedade', 'Independência'],
    likes: 189,
    favorites: 67,
    isLiked: false,
    isFavorited: true,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80',
    tags: ['Rotina', 'Visual', 'Sequencial'],
    author: {
      name: 'João Silva',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'Educador Especial'
    },
    publishedAt: '2024-01-18',
    views: 890
  },
  {
    id: 3,
    title: 'Jogo das Emoções Expressivas',
    description: 'Crie cartões com diferentes expressões faciais e ajude seu filho a identificar e nomear emoções. Desenvolve a inteligência emocional e comunicação.',
    category: 'Socioemocional',
    ageRange: '5-12 anos',
    duration: '25-35 min',
    difficulty: 'Médio',
    materials: ['Papel cartão', 'Canetas', 'Espelho', 'Imagens de emoções'],
    objectives: ['Reconhecimento emocional', 'Comunicação', 'Empatia'],
    likes: 312,
    favorites: 124,
    isLiked: true,
    isFavorited: false,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80',
    tags: ['Emoções', 'Comunicação', 'Social'],
    author: {
      name: 'Ana Costa',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      role: 'Psicóloga Infantil'
    },
    publishedAt: '2024-01-15',
    views: 1450
  },
  {
    id: 4,
    title: 'Atividade de Classificação por Cores',
    description: 'Use objetos de diferentes cores para trabalhar classificação e organização. Excelente para desenvolver habilidades cognitivas e de foco.',
    category: 'Cognitiva',
    ageRange: '3-8 anos',
    duration: '15-20 min',
    difficulty: 'Fácil',
    materials: ['Objetos coloridos', 'Caixas ou recipientes', 'Cartões de cores'],
    objectives: ['Classificação', 'Organização', 'Foco visual'],
    likes: 156,
    favorites: 45,
    isLiked: false,
    isFavorited: false,
    image: 'https://images.unsplash.com/photo-1558877385-1199c1af4e8e?auto=format&fit=crop&w=400&q=80',
    tags: ['Cores', 'Classificação', 'Casa'],
    author: {
      name: 'Pedro Oliveira',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      role: 'Professor de Educação Especial'
    },
    publishedAt: '2024-01-12',
    views: 720
  },
  {
    id: 5,
    title: 'Comunicação com PECS',
    description: 'Introduza o sistema de comunicação por troca de imagens. Comece com itens preferidos e expanda para necessidades básicas.',
    category: 'Comunicação',
    ageRange: '2-8 anos',
    duration: '30-45 min',
    difficulty: 'Avançado',
    materials: ['Imagens PECS', 'Prancheta', 'Fita velcro', 'Reforços'],
    objectives: ['Comunicação funcional', 'Independência', 'Expressão'],
    likes: 278,
    favorites: 156,
    isLiked: true,
    isFavorited: true,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80',
    tags: ['PECS', 'Comunicação', 'Independência'],
    author: {
      name: 'Carla Mendes',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      role: 'Fonoaudióloga'
    },
    publishedAt: '2024-01-10',
    views: 1100
  },
  {
    id: 6,
    title: 'Atividade de Imitação Motora',
    description: 'Jogos de imitação de movimentos e ações. Desenvolve coordenação motora, atenção e habilidades sociais através da imitação.',
    category: 'Motora',
    ageRange: '2-6 anos',
    duration: '20-30 min',
    difficulty: 'Fácil',
    materials: ['Espaço livre', 'Objetos para imitar', 'Música (opcional)'],
    objectives: ['Coordenação motora', 'Imitação', 'Habilidades sociais'],
    likes: 203,
    favorites: 78,
    isLiked: false,
    isFavorited: false,
    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=400&q=80',
    tags: ['Motora', 'Imitação', 'Social'],
    author: {
      name: 'Lucas Ferreira',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      role: 'Fisioterapeuta'
    },
    publishedAt: '2024-01-08',
    views: 650
  }
];

// Filtros disponíveis
const filterOptions = [
  { key: 'all', label: 'Todas', icon: <ExperimentOutlined />, color: 'default' },
  { key: 'sensorial', label: 'Sensoriais', icon: <BulbOutlined />, color: 'orange' },
  { key: 'cognitiva', label: 'Cognitivas', icon: <PlayCircleOutlined />, color: 'blue' },
  { key: 'social', label: 'Socioemocionais', icon: <TeamOutlined />, color: 'green' },
  { key: 'communication', label: 'Comunicação', icon: <UserOutlined />, color: 'purple' },
  { key: 'motora', label: 'Motoras', icon: <PlayCircleOutlined />, color: 'red' }
];

const Atividades: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState(mockActivities);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchText, setSearchText] = useState('');

  // Função para filtrar atividades
  const getFilteredActivities = () => {
    let filtered = activities;

    // Filtro por categoria
    if (activeFilter !== 'all') {
      const categoryMap: { [key: string]: string } = {
        'sensorial': 'Sensorial',
        'cognitiva': 'Cognitiva',
        'social': 'Socioemocional',
        'communication': 'Comunicação',
        'motora': 'Motora'
      };

      filtered = filtered.filter(activity =>
        activity.category && categoryMap[activeFilter] && activity.category.toLowerCase() === categoryMap[activeFilter]!.toLowerCase()
      );
    }

    // Filtro por busca
    if (searchText) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchText.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchText.toLowerCase()) ||
        activity.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    return filtered;
  };

  // Função para curtir/descurtir atividade
  const handleLike = (activityId: number) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        const newIsLiked = !activity.isLiked;
        const newLikes = newIsLiked ? activity.likes + 1 : activity.likes - 1;
        return { ...activity, isLiked: newIsLiked, likes: newLikes };
      }
      return activity;
    }));
    message.success('Ação realizada com sucesso!');
  };

  // Função para favoritar/desfavoritar atividade
  const handleFavorite = (activityId: number) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        return { ...activity, isFavorited: !activity.isFavorited };
      }
      return activity;
    }));
    message.success('Ação realizada com sucesso!');
  };

  const filteredActivities = getFilteredActivities();

  // Função para navegar para a página de detalhes da atividade
  const handleActivityClick = (activityId: number) => {
    navigate(`/atividade/${activityId}`);
  };

  // Função para obter cor baseada na dificuldade
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'green';
      case 'Médio': return 'orange';
      case 'Avançado': return 'red';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Title level={1} style={{ marginBottom: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🧩 Banco de Atividades
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Descubra atividades práticas e divertidas para desenvolver habilidades e superar desafios com seu filho
        </Paragraph>
      </div>

      {/* Barra de busca */}
      <div style={{ marginBottom: '24px', maxWidth: '500px', margin: '0 auto 32px' }}>
        <Search
          placeholder="Buscar atividades, materiais ou objetivos..."
          allowClear
          size="large"
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ borderRadius: '50px' }}
        />
      </div>

      {/* Filtros */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <Text strong style={{ fontSize: '16px', color: '#666' }}>
            <FilterOutlined style={{ marginRight: '8px' }} />
            Filtrar por categoria:
          </Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {filterOptions.map(filter => (
            <Button
              key={filter.key}
              {...gradientSelectionButtonStyle(activeFilter === filter.key)}
              icon={filter.icon}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid de atividades - Layout diferente da biblioteca */}
      <Row gutter={[24, 24]}>
        {filteredActivities.map(activity => (
          <Col xs={24} key={activity.id}>
            <Card
              hoverable
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                marginBottom: '16px'
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Row gutter={24}>
                {/* Imagem da atividade */}
                <Col xs={24} md={8}>
                  <div
                    style={{
                      height: '200px',
                      backgroundImage: `url(${activity.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '12px',
                      position: 'relative',
                      marginBottom: '16px'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(255,255,255,0.9)',
                      borderRadius: '20px',
                      padding: '4px 12px'
                    }}>
                      <Tag color={getDifficultyColor(activity.difficulty)} style={{ margin: 0 }}>
                        {activity.difficulty}
                      </Tag>
                    </div>
                  </div>
                </Col>

                {/* Conteúdo da atividade */}
                <Col xs={24} md={16}>
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Header com título e categoria */}
                    <div style={{ marginBottom: '16px' }}>
                      <Space wrap style={{ marginBottom: '12px' }}>
                        <Tag color="blue">{activity.category}</Tag>
                        <Tag color="cyan">{activity.ageRange}</Tag>
                      </Space>
                      <Title level={3} style={{ marginBottom: '8px', marginTop: 0 }}>
                        {activity.title}
                      </Title>
                    </div>

                    {/* Descrição */}
                    <Paragraph
                      style={{ marginBottom: '16px', color: '#666', flex: 1 }}
                    >
                      {activity.description}
                    </Paragraph>

                    {/* Informações do autor e data */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Avatar src={activity.author?.avatar} size="small" style={{ marginRight: '8px' }} />
                      <div>
                        <Text strong style={{ fontSize: '14px' }}>{activity.author?.name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>{activity.author?.role}</Text>
                      </div>
                      <Divider type="vertical" style={{ margin: '0 16px' }} />
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <CalendarOutlined style={{ marginRight: '4px' }} />
                          {activity.publishedAt ? new Date(activity.publishedAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                        </Text>
                      </div>
                    </div>

                    {/* Detalhes da atividade */}
                    <div style={{ marginBottom: '16px' }}>
                      <Row gutter={16}>
                        <Col span={8}>
                          <div style={{ textAlign: 'center', padding: '8px', background: '#f5f5f5', borderRadius: '8px' }}>
                            <ClockCircleOutlined style={{ fontSize: '16px', color: '#1890ff', marginBottom: '4px' }} />
                            <br />
                            <Text strong style={{ fontSize: '12px' }}>Duração</Text>
                            <br />
                            <Text style={{ fontSize: '12px', color: '#666' }}>{activity.duration}</Text>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div style={{ textAlign: 'center', padding: '8px', background: '#f5f5f5', borderRadius: '8px' }}>
                            <BulbOutlined style={{ fontSize: '16px', color: '#52c41a', marginBottom: '4px' }} />
                            <br />
                            <Text strong style={{ fontSize: '12px' }}>Materiais</Text>
                            <br />
                            <Text style={{ fontSize: '12px', color: '#666' }}>{activity.materials.length} itens</Text>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div style={{ textAlign: 'center', padding: '8px', background: '#f5f5f5', borderRadius: '8px' }}>
                            <TeamOutlined style={{ fontSize: '16px', color: '#fa8c16', marginBottom: '4px' }} />
                            <br />
                            <Text strong style={{ fontSize: '12px' }}>Objetivos</Text>
                            <br />
                            <Text style={{ fontSize: '12px', color: '#666' }}>{activity.objectives.length} metas</Text>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {/* Ações */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <Tooltip title={activity.isLiked ? "Remover curtida" : "Curtir atividade"}>
                          <Button
                            type="text"
                            icon={activity.isLiked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                            onClick={() => handleLike(activity.id)}
                            style={{ fontSize: '16px' }}
                          >
                            {activity.likes}
                          </Button>
                        </Tooltip>
                        <Tooltip title={activity.isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
                          <Button
                            type="text"
                            icon={activity.isFavorited ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
                            onClick={() => handleFavorite(activity.id)}
                            style={{ fontSize: '16px' }}
                          >
                            {activity.favorites}
                          </Button>
                        </Tooltip>
                        <Button
                          type="text"
                          icon={<UserOutlined />}
                          style={{ fontSize: '16px', color: '#666' }}
                        >
                          {activity.views}
                        </Button>
                      </Space>

                      <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => handleActivityClick(activity.id)}>
                        Experimentar Atividade
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Mensagem quando não há resultados */}
      {filteredActivities.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <ExperimentOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '24px' }} />
          <Title level={3} style={{ color: '#666', marginBottom: '8px' }}>
            Nenhuma atividade encontrada
          </Title>
          <Text style={{ fontSize: '16px', color: '#888' }}>
            Tente ajustar os filtros ou fazer uma nova busca
          </Text>
        </div>
      )}
    </div>
  );
};

export default Atividades;
