import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Row, Col, Button, Tag, Space, Typography, Divider,
  Avatar, message, Breadcrumb, Spin, Alert
} from 'antd';
import {
  HeartOutlined, HeartFilled, StarOutlined, StarFilled,
  ClockCircleOutlined,
  BulbOutlined, PlayCircleOutlined, ExperimentOutlined,
  ArrowLeftOutlined, ShareAltOutlined,
  CheckCircleOutlined, BookOutlined, TrophyOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { activityService } from '../../services/activityService';
import { likeService, favoriteService } from '../../services/interactionService';

const { Title, Text, Paragraph } = Typography;

// Dados mock das atividades (fallback)
const mockActivities = [
  {
    id: 1,
    title: 'Caixa de Texturas Sensoriais',
    description: 'Crie uma caixa com diferentes materiais (algodão, lixa, seda, areia) para estimular a percepção tátil e desenvolver o foco. Ajuda no processamento sensorial e na autorregulação.',
    content: `
# Caixa de Texturas Sensoriais

## Introdução
A caixa de texturas sensoriais é uma atividade fundamental para o desenvolvimento da percepção tátil e processamento sensorial. Esta atividade ajuda crianças com TEA a explorar diferentes sensações de forma segura e controlada.

## Materiais Necessários
- Caixa plástica resistente (tamanho médio)
- Tecidos diversos: algodão, lixa, seda, veludo, lã
- Objetos texturizados: conchas, pedras, folhas secas
- Areia ou sal grosso
- Algodão
- Espuma
- Fita adesiva ou cola para fixar os materiais

## Como Preparar
1. **Organize os materiais**: Separe cada tipo de textura em compartimentos individuais dentro da caixa
2. **Fixe os materiais**: Use fita adesiva ou cola para garantir que as texturas não se misturem
3. **Crie rótulos visuais**: Adicione imagens ou palavras simples para identificar cada textura
4. **Teste a segurança**: Certifique-se de que todos os materiais são seguros para manipulação

## Como Realizar a Atividade
1. **Apresentação**: Mostre a caixa e explique cada textura
2. **Exploração**: Permita que a criança explore cada textura com as mãos
3. **Nomeação**: Ajude a criança a nomear as sensações ("macio", "áspero", "gelado")
4. **Comparação**: Compare diferentes texturas lado a lado

## Dicas para o Sucesso
- Comece com texturas que a criança já conhece
- Observe reações sensoriais e ajuste conforme necessário
- Use a atividade em momentos de calma
- Combine com outras atividades sensoriais

## Benefícios
- Desenvolvimento da percepção tátil
- Melhora no processamento sensorial
- Aumento do foco e atenção
- Desenvolvimento da autorregulação
- Expansão do vocabulário descritivo
    `,
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
    views: 1250,
    steps: [
      'Prepare todos os materiais em uma caixa organizada',
      'Apresente cada textura individualmente',
      'Permita a exploração tátil livre',
      'Ajude a nomear as sensações sentidas',
      'Compare texturas diferentes'
    ],
    tips: [
      'Comece com texturas familiares para a criança',
      'Observe reações sensoriais durante a atividade',
      'Use em momentos de calma e baixo estímulo',
      'Combine com música suave se apropriado'
    ]
  },
  {
    id: 2,
    title: 'Sequências Visuais do Dia a Dia',
    description: 'Use imagens ou desenhos para criar sequências visuais das rotinas diárias. Ajuda na compreensão de processos sequenciais e reduz ansiedade.',
    content: `
# Sequências Visuais do Dia a Dia

## Introdução
As sequências visuais são ferramentas poderosas para ajudar crianças com TEA a compreender e antecipar rotinas diárias. Esta atividade cria previsibilidade e reduz a ansiedade associada a transições.

## Materiais Necessários
- Papel ou cartolina
- Canetas coloridas ou marcadores
- Imagens impressas ou recortadas
- Fita adesiva ou velcro
- Suporte para exibir as sequências

## Como Preparar
1. **Identifique rotinas**: Escolha rotinas diárias importantes
2. **Crie imagens**: Desenhe ou imprima imagens representativas
3. **Organize em sequência**: Coloque as imagens na ordem correta
4. **Fixe o suporte**: Use velcro para permitir rearranjo

## Como Realizar a Atividade
1. **Apresentação**: Mostre a sequência completa
2. **Execução passo a passo**: Siga a rotina conforme as imagens
3. **Verificação**: Marque cada passo concluído
4. **Reforço**: Elogie a conclusão de cada etapa

## Dicas para o Sucesso
- Mantenha sequências simples no início
- Use imagens reais sempre que possível
- Pratique diariamente as mesmas rotinas
- Adapte conforme a criança aprende

## Benefícios
- Redução da ansiedade por transições
- Melhora na compreensão sequencial
- Desenvolvimento da independência
- Aumento da previsibilidade
- Melhora na comunicação sobre rotinas
    `,
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
    views: 890,
    steps: [
      'Identifique uma rotina diária importante',
      'Crie imagens para cada passo da rotina',
      'Organize as imagens em ordem sequencial',
      'Pratique a rotina seguindo as imagens',
      'Reforce cada passo concluído'
    ],
    tips: [
      'Comece com rotinas simples de 3-4 passos',
      'Use imagens reais em vez de desenhos',
      'Pratique a mesma rotina diariamente',
      'Adicione reforços positivos'
    ]
  },
  {
    id: 3,
    title: 'Jogo das Emoções Expressivas',
    description: 'Crie cartões com diferentes expressões faciais e ajude seu filho a identificar e nomear emoções. Desenvolve a inteligência emocional e comunicação.',
    content: `
# Jogo das Emoções Expressivas

## Introdução
Este jogo ajuda no desenvolvimento da inteligência emocional e reconhecimento de expressões faciais. É fundamental para o desenvolvimento de habilidades sociais e comunicação não-verbal.

## Materiais Necessários
- Papel cartão colorido
- Canetas ou marcadores
- Espelho
- Imagens de expressões faciais
- Cola e tesoura

## Como Preparar
1. **Crie os cartões**: Desenhe expressões faciais em cartões
2. **Categorize as emoções**: Agrupe emoções similares
3. **Adicione rótulos**: Escreva o nome da emoção em cada cartão
4. **Crie um baralho**: Organize todos os cartões

## Como Realizar a Atividade
1. **Apresentação**: Mostre cada emoção e nomeie
2. **Imitação**: Peça para imitar a expressão
3. **Identificação**: Mostre expressões e pergunte qual é
4. **Discussão**: Converse sobre quando sentimos cada emoção

## Dicas para o Sucesso
- Use expressões exageradas no início
- Combine com situações da vida real
- Pratique diariamente
- Inclua emoções positivas e negativas

## Benefícios
- Desenvolvimento da inteligência emocional
- Melhora no reconhecimento facial
- Expansão do vocabulário emocional
- Desenvolvimento de empatia
- Melhora na comunicação social
    `,
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
    views: 1450,
    steps: [
      'Prepare cartões com expressões faciais',
      'Apresente cada emoção com seu nome',
      'Pratique imitação das expressões',
      'Jogue identificação de emoções',
      'Discuta situações que causam cada emoção'
    ],
    tips: [
      'Use expressões exageradas para clareza',
      'Relacione com experiências pessoais',
      'Pratique em frente ao espelho',
      'Inclua todas as emoções básicas'
    ]
  }
];

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
    } catch (error: any) {
      message.error('Erro ao carregar atividade');
      // Fallback para dados mock
      const foundActivity = mockActivities.find(a => a.id === parseInt(id || '0'));
      if (foundActivity) {
        setActivity(foundActivity);
        setIsLiked(foundActivity.isLiked);
        setIsFavorited(foundActivity.isFavorited);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!activity) return;
    
    try {
      await likeService.toggle({ activityId: activity.id });
      await loadActivity();
      message.success('Curtida atualizada!');
    } catch (error) {
      message.error('Erro ao atualizar curtida');
    }
  };

  const handleFavorite = async () => {
    if (!activity) return;
    
    try {
      const result = await favoriteService.toggle({ activityId: activity.id });
      message.success(result.message);
      await loadActivity();
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
                  {activity.tags.map((tag: string) => (
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
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  style={{ flex: 1, minWidth: '200px' }}
                >
                  Experimentar Atividade
                </Button>
                <Button
                  size="large"
                  icon={isLiked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                  onClick={handleLike}
                >
                  {activity.likes + (isLiked ? 1 : 0)}
                </Button>
                <Button
                  size="large"
                  icon={isFavorited ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
                  onClick={handleFavorite}
                >
                  {activity.favorites + (isFavorited ? 1 : 0)}
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
                <Text style={{ fontSize: '14px', color: '#666' }}>{activity.materials.length} itens necessários</Text>
              </div>

              <div style={{ textAlign: 'center', padding: '16px', background: '#fff7e6', borderRadius: '8px' }}>
                <TrophyOutlined style={{ fontSize: '24px', color: '#fa8c16', marginBottom: '8px' }} />
                <br />
                <Text strong style={{ fontSize: '16px' }}>Objetivos</Text>
                <br />
                <Text style={{ fontSize: '14px', color: '#666' }}>{activity.objectives.length} metas de aprendizado</Text>
              </div>
            </div>
          </Card>

          {/* Materiais necessários */}
          <Card title="Materiais Necessários" style={{ marginBottom: '24px' }}>
            {activity.materials.map((material: string, index: number) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                <Text>{material}</Text>
              </div>
            ))}
          </Card>

          {/* Objetivos */}
          <Card title="Objetivos de Aprendizado">
            {activity.objectives.map((objective: string, index: number) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                <BookOutlined style={{ color: '#1890ff', marginRight: '8px', marginTop: '2px' }} />
                <Text style={{ fontSize: '14px' }}>{objective}</Text>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AtividadePage;