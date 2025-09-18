import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Avatar, Row, Col, Button, Tag, Space, Typography
} from 'antd';
import {
  UserOutlined, TeamOutlined, HeartOutlined,
  CalendarOutlined, TrophyOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// Importar dados compartilhados
import { childrenProfiles } from '../../data/childrenProfiles';

const PerfilAutista: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Se houver apenas 1 filho cadastrado, redirecionar automaticamente para a página de detalhes
    if (childrenProfiles.length === 1 && childrenProfiles[0]) {
      navigate(`/perfil-autista/${childrenProfiles[0].id}`, { replace: true });
    }
  }, [navigate]);

  const handleViewProfile = (childId: number) => {
    navigate(`/perfil-autista/${childId}`);
  };

  const getDifficultyColor = (level: string) => {
    if (level.includes('Nível 1')) return 'green';
    if (level.includes('Nível 2')) return 'orange';
    if (level.includes('Nível 3')) return 'red';
    return 'default';
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Title level={1} style={{ marginBottom: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          👨‍👩‍👧‍👦 Perfis dos Autistas
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Gerencie os perfis dos seus filhos para receber recomendações personalizadas de atividades e conteúdos
        </Paragraph>
      </div>

      {/* Perfis dos Filhos */}
      <Row gutter={[24, 24]}>
        {childrenProfiles.map(child => (
          <Col xs={24} lg={12} key={child.id}>
            <Card
              hoverable
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                height: '100%'
              }}
              cover={
                <div
                  style={{
                    height: '200px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <Avatar
                    size={120}
                    src={child.avatar}
                    icon={<UserOutlined />}
                    style={{
                      border: '6px solid white',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: '20px',
                    padding: '4px 12px'
                  }}>
                    <Tag color={getDifficultyColor(child.supportLevel)} style={{ margin: 0 }}>
                      {child.supportLevel.split(' ')[1]}
                    </Tag>
                  </div>
                </div>
              }
              actions={[
                <Button
                  type="primary"
                  size="large"
                  onClick={() => handleViewProfile(child.id)}
                  style={{ width: '100%', borderRadius: '8px' }}
                >
                  Ver Perfil Completo
                </Button>
              ]}
            >
              <div style={{ padding: '16px 0' }}>
                {/* Informações Básicas */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <Title level={2} style={{ marginBottom: '4px' }}>{child.name}</Title>
                  <Text style={{ fontSize: '16px', color: '#666' }}>{child.age} anos</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    <CalendarOutlined style={{ marginRight: '6px' }} />
                    Nascido em {new Date(child.birthDate).toLocaleDateString('pt-BR')}
                  </Text>
                </div>

                {/* Diagnóstico */}
                <div style={{ marginBottom: '16px' }}>
                  <Text strong style={{ fontSize: '14px', color: '#666' }}>Diagnóstico:</Text>
                  <br />
                  <Text style={{ fontSize: '14px' }}>{child.diagnosis}</Text>
                </div>

                {/* Estatísticas */}

                {/* Interesses */}
                <div style={{ marginBottom: '16px' }}>
                  <Text strong style={{ fontSize: '14px', color: '#666' }}>
                    <HeartOutlined style={{ marginRight: '6px' }} />
                    Interesses:
                  </Text>
                  <div style={{ marginTop: '8px' }}>
                    <Space wrap>
                      {child.interests.slice(0, 3).map((interest, index) => (
                        <Tag key={index} color="blue">{interest}</Tag>
                      ))}
                      {child.interests.length > 3 && (
                        <Tag color="blue">+{child.interests.length - 3} mais</Tag>
                      )}
                    </Space>
                  </div>
                </div>

                {/* Pontos Fortes */}
                <div style={{ marginBottom: '16px' }}>
                  <Text strong style={{ fontSize: '14px', color: '#666' }}>
                    <TrophyOutlined style={{ marginRight: '6px' }} />
                    Pontos Fortes:
                  </Text>
                  <div style={{ marginTop: '8px' }}>
                    <Space wrap>
                      {child.strengths.slice(0, 2).map((strength, index) => (
                        <Tag key={index} color="green">{strength}</Tag>
                      ))}
                      {child.strengths.length > 2 && (
                        <Tag color="green">+{child.strengths.length - 2} mais</Tag>
                      )}
                    </Space>
                  </div>
                </div>

                {/* Atividades Recentes */}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Mensagem quando não há perfis */}
      {childrenProfiles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <TeamOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '24px' }} />
          <Title level={3} style={{ color: '#666', marginBottom: '8px' }}>
            Nenhum perfil cadastrado
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#888' }}>
            Adicione o perfil do seu filho na página de Perfil para começar a receber recomendações personalizadas.
          </Paragraph>
        </div>
      )}
    </div>
  );
};

export default PerfilAutista;