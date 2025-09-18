import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Avatar, Row, Col, Button, Tag, Space, Typography, Divider,
  Alert
} from 'antd';
import {
  UserOutlined, TeamOutlined, HeartOutlined,
  CalendarOutlined, TrophyOutlined,
  ArrowLeftOutlined, MedicineBoxOutlined, BulbOutlined,
  MessageOutlined, SoundOutlined, EyeOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// Importar dados compartilhados
import { childrenProfiles } from '../../data/childrenProfiles';

const PerfilAutistaDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const child = childrenProfiles.find(c => c.id === parseInt(id || '0'));

  if (!child) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Alert
          message="Perfil não encontrado"
          description="O perfil do autista que você está procurando não existe."
          type="error"
          showIcon
        />
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/perfil-autista')}
          style={{ marginTop: '16px' }}
        >
          Voltar para Perfis
        </Button>
      </div>
    );
  }

  const getDifficultyColor = (level: string) => {
    if (level.includes('Nível 1')) return 'green';
    if (level.includes('Nível 2')) return 'orange';
    if (level.includes('Nível 3')) return 'red';
    return 'default';
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '24px' }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/perfil-autista')}
          style={{ padding: 0, fontSize: '16px' }}
        >
          Voltar para Perfis dos Autistas
        </Button>
      </div>

      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={24} align="middle">
          <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
            <Avatar
              size={150}
              src={child.avatar}
              icon={<UserOutlined />}
              style={{
                border: '6px solid #667eea',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                marginBottom: '16px'
              }}
            />
            <Tag
              color={getDifficultyColor(child.supportLevel)}
              style={{ fontSize: '14px', padding: '4px 12px' }}
            >
              {child.supportLevel}
            </Tag>
          </Col>
          <Col xs={24} sm={16}>
            <Title level={1} style={{ marginBottom: '8px' }}>{child.name}</Title>
            <Text style={{ fontSize: '18px', color: '#666' }}>{child.age} anos</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '16px' }}>
              <CalendarOutlined style={{ marginRight: '8px' }} />
              Nascido em {new Date(child.birthDate).toLocaleDateString('pt-BR')}
            </Text>
            <Divider />
            <Paragraph style={{ fontSize: '16px', color: '#666' }}>
              {child.diagnosis}
            </Paragraph>
            <Text type="secondary">
              Diagnosticado em {new Date(child.diagnosisDate).toLocaleDateString('pt-BR')}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Estatísticas */}

      <Row gutter={24}>
        {/* Informações Detalhadas */}
        <Col xs={24} lg={12}>
          {/* Interesses */}
          <Card title="Interesses" style={{ marginBottom: '24px' }}>
            <Space wrap size="middle">
              {child.interests.map((interest, index) => (
                <Tag key={index} color="blue" style={{ fontSize: '14px', padding: '6px 12px' }}>
                  <HeartOutlined style={{ marginRight: '6px' }} />
                  {interest}
                </Tag>
              ))}
            </Space>
          </Card>

          {/* Pontos Fortes */}
          <Card title="Pontos Fortes" style={{ marginBottom: '24px' }}>
            <Space wrap size="middle">
              {child.strengths.map((strength, index) => (
                <Tag key={index} color="green" style={{ fontSize: '14px', padding: '6px 12px' }}>
                  <TrophyOutlined style={{ marginRight: '6px' }} />
                  {strength}
                </Tag>
              ))}
            </Space>
          </Card>

          {/* Desafios */}
          <Card title="Desafios" style={{ marginBottom: '24px' }}>
            <Space wrap size="middle">
              {child.challenges.map((challenge, index) => (
                <Tag key={index} color="orange" style={{ fontSize: '14px', padding: '6px 12px' }}>
                  {challenge}
                </Tag>
              ))}
            </Space>
          </Card>

          {/* Comunicação */}
          <Card title="Comunicação" style={{ marginBottom: '24px' }}>
            <Paragraph style={{ fontSize: '16px' }}>
              <MessageOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              {child.communication}
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          {/* Terapias */}
          <Card title="Terapias" style={{ marginBottom: '24px' }}>
            <Space wrap size="middle">
              {child.therapies.map((therapy, index) => (
                <Tag key={index} color="purple" style={{ fontSize: '14px', padding: '6px 12px' }}>
                  <MedicineBoxOutlined style={{ marginRight: '6px' }} />
                  {therapy}
                </Tag>
              ))}
            </Space>
          </Card>

          {/* Medicações */}
          <Card title="Medicações" style={{ marginBottom: '24px' }}>
            {child.medications.length > 0 ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                {child.medications.map((medication, index) => (
                  <Tag key={index} color="red" style={{ fontSize: '14px', padding: '6px 12px' }}>
                    <MedicineBoxOutlined style={{ marginRight: '6px' }} />
                    {medication}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type="secondary">Nenhuma medicação cadastrada</Text>
            )}
          </Card>

          {/* Preferências Sensoriais */}
          <Card title="Preferências Sensoriais" style={{ marginBottom: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <SoundOutlined style={{ marginRight: '8px', color: '#fa8c16' }} />
                <Text strong>Som:</Text> {child.sensoryPreferences.sound}
              </div>
              <div>
                <BulbOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                <Text strong>Toque:</Text> {child.sensoryPreferences.touch}
              </div>
              <div>
                <EyeOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                <Text strong>Luz:</Text> {child.sensoryPreferences.light}
              </div>
              <div>
                <TeamOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
                <Text strong>Movimento:</Text> {child.sensoryPreferences.movement}
              </div>
            </Space>
          </Card>

          {/* Rotinas */}
          <Card title="Rotinas e Estruturas" style={{ marginBottom: '24px' }}>
            <Space wrap size="middle">
              {child.routines.map((routine, index) => (
                <Tag key={index} color="cyan" style={{ fontSize: '14px', padding: '6px 12px' }}>
                  {routine}
                </Tag>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PerfilAutistaDetalhes;