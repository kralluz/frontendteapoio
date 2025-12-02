import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Avatar, Row, Col, Button, Tag, Space, Typography, Spin, message,
  Modal, Form, Input, Select, DatePicker, Checkbox, Divider
} from 'antd';
import {
  UserOutlined, TeamOutlined, HeartOutlined,
  CalendarOutlined, TrophyOutlined, PlusOutlined
} from '@ant-design/icons';
import { autismProfileService, AutismProfile } from '../../services/autismProfileService';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const supportLevels = [
  'Nível 1',
  'Nível 2',
  'Nível 3'
];

const therapyOptions = ['Terapia Ocupacional', 'Fonoaudiologia', 'Psicoterapia', 'Psicomotricidade', 'Musicoterapia', 'Equoterapia'];
const sensoryOptions = ['Hipersensibilidade a sons', 'Hipersensibilidade a luzes', 'Hipersensibilidade a texturas', 'Hipossensibilidade a dor', 'Busca por estímulo vestibular'];

const PerfilAutista: React.FC = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<AutismProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const data = await autismProfileService.getAll();
      setProfiles(data);
      
      // Se houver apenas 1 perfil cadastrado, redirecionar automaticamente
      if (data.length === 1 && data[0]) {
        navigate(`/perfil-autista/${data[0].id}`, { replace: true });
      }
    } catch (error: any) {
      message.error('Erro ao carregar perfis');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (profileId: string) => {
    navigate(`/perfil-autista/${profileId}`);
  };

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    // Calcular idade a partir da data de nascimento
    let age = 0;
    if (values.birthDate) {
      // O DatePicker pode retornar um objeto (dayjs/moment) com toDate(), ou uma string/Date.
      const birthDateNative = (values.birthDate && typeof values.birthDate.toDate === 'function')
        ? values.birthDate.toDate()
        : new Date(values.birthDate);

      // Calcular anos completos com precisão aproximada
      const now = new Date();
      const diff = now.getTime() - birthDateNative.getTime();
      age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.2425));
    }

    // Validar que a idade foi calculada
    if (!values.birthDate || age <= 0) {
      message.error('Por favor, selecione uma data de nascimento válida.');
      return;
    }

    // Construir notas consolidadas
    const notesArray = [
      values.medications ? `Medicamentos: ${values.medications}` : '',
      values.communication ? `Comunicação: ${values.communication}` : '',
      values.routines && values.routines.length > 0 ? `Rotinas: ${values.routines.join(', ')}` : '',
      values.therapies && values.therapies.length > 0 ? `Terapias: ${values.therapies.join(', ')}` : ''
    ].filter(Boolean);

    // Garantir que todos os campos obrigatórios estejam presentes
    const profileData: any = {
      name: values.name,
      age: age,
      diagnosis: values.diagnosis,
      level: values.level,
      interests: values.interests || [],
      sensitivities: values.sensoryPreferences || [],
      strengths: values.strengths || [],
      challenges: values.challenges || [],
    };

    // Adicionar notes apenas se houver conteúdo
    if (notesArray.length > 0) {
      profileData.notes = notesArray.join('\n\n');
    }

    try {
      await autismProfileService.create(profileData);
      message.success('Perfil criado com sucesso!');
      setIsModalVisible(false);
      form.resetFields();
      loadProfiles();
    } catch (error: any) {
      console.error('Erro ao criar perfil:', error);
      message.error(error.response?.data?.message || 'Erro ao salvar perfil.');
    }
  };

  const getDifficultyColor = (level: string) => {
    if (level.includes('Nível 1')) return 'green';
    if (level.includes('Nível 2')) return 'orange';
    if (level.includes('Nível 3')) return 'red';
    return 'default';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <Title level={1} style={{ marginBottom: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            👨‍👩‍👧‍👦 Perfis dos Autistas
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Gerencie os perfis dos seus filhos para receber recomendações personalizadas de atividades e conteúdos
          </Paragraph>
        </div>
        {profiles.length > 0 && (
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={showModal}>
            Adicionar Perfil
          </Button>
        )}
      </div>

      {/* Perfis dos Filhos */}
      <Row gutter={[24, 24]}>
        {profiles.map(profile => (
          <Col xs={24} lg={12} key={profile.id}>
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
                    src={profile.photo}
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
                    <Tag color={getDifficultyColor(profile.level)} style={{ margin: 0 }}>
                      {profile.level}
                    </Tag>
                  </div>
                </div>
              }
              actions={[
                <Button
                  type="primary"
                  size="large"
                  onClick={() => handleViewProfile(profile.id)}
                  style={{ width: '100%', borderRadius: '8px' }}
                >
                  Ver Perfil Completo
                </Button>
              ]}
            >
              <div style={{ padding: '16px 0' }}>
                {/* Informações Básicas */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <Title level={2} style={{ marginBottom: '4px' }}>{profile.name}</Title>
                  <Text style={{ fontSize: '16px', color: '#666' }}>{profile.age} anos</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    <CalendarOutlined style={{ marginRight: '6px' }} />
                    Cadastrado em {new Date(profile.createdAt).toLocaleDateString('pt-BR')}
                  </Text>
                </div>

                {/* Diagnóstico */}
                <div style={{ marginBottom: '16px' }}>
                  <Text strong style={{ fontSize: '14px', color: '#666' }}>Diagnóstico:</Text>
                  <br />
                  <Text style={{ fontSize: '14px' }}>{profile.diagnosis}</Text>
                </div>

                {/* Interesses */}
                <div style={{ marginBottom: '16px' }}>
                  <Text strong style={{ fontSize: '14px', color: '#666' }}>
                    <HeartOutlined style={{ marginRight: '6px' }} />
                    Interesses:
                  </Text>
                  <div style={{ marginTop: '8px' }}>
                    <Space wrap>
                      {profile.interests.slice(0, 3).map((interest, index) => (
                        <Tag key={index} color="blue">{interest}</Tag>
                      ))}
                      {profile.interests.length > 3 && (
                        <Tag color="blue">+{profile.interests.length - 3} mais</Tag>
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
                      {profile.strengths.slice(0, 2).map((strength, index) => (
                        <Tag key={index} color="green">{strength}</Tag>
                      ))}
                      {profile.strengths.length > 2 && (
                        <Tag color="green">+{profile.strengths.length - 2} mais</Tag>
                      )}
                    </Space>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Mensagem quando não há perfis */}
      {profiles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <TeamOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '24px' }} />
          <Title level={3} style={{ color: '#666', marginBottom: '8px' }}>
            Nenhum perfil cadastrado
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#888', marginBottom: '24px' }}>
            Crie o perfil do seu filho para receber recomendações personalizadas de atividades e conteúdos.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={showModal}
          >
            Criar Primeiro Perfil
          </Button>
        </div>
      )}

      {/* Modal para criar perfil */}
      <Modal
        title="Criar Perfil de Autista"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            sensoryPreferences: [],
            therapies: [],
            interests: [],
            strengths: [],
            challenges: [],
            diagnosis: '',
            level: ''
          }}
        >
          <Divider>Informações Básicas</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Nome Completo"
                rules={[{ required: true, message: 'Por favor, insira o nome!' }]}
              >
                <Input placeholder="Nome do perfil" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="birthDate"
                label="Data de Nascimento"
                rules={[{ required: true, message: 'Por favor, selecione a data de nascimento!' }]}
              >
                <DatePicker
                  placeholder="Selecione a data"
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  disabledDate={(current: any) => {
                    if (!current) return false;
                    // current pode ser dayjs/moment com toDate()
                    const currentDate = typeof current.toDate === 'function' ? current.toDate() : new Date(current);
                    return currentDate > new Date();
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Diagnóstico e Suporte</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="diagnosis"
                label="Diagnóstico"
                rules={[{ required: true, message: 'Por favor, insira o diagnóstico!' }]}
              >
                <Input placeholder="Ex: Transtorno do Espectro Autista" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="level"
                label="Nível de Suporte"
                rules={[{ required: true, message: 'Por favor, selecione o nível!' }]}
              >
                <Select placeholder="Selecione o nível">
                  {supportLevels.map(level => (
                    <Option key={level} value={level}>{level}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="diagnosisDate"
            label="Data do Diagnóstico"
          >
            <DatePicker
              placeholder="Selecione a data"
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Divider>Interesses e Habilidades</Divider>
          <Form.Item
            name="interests"
            label="Interesses"
          >
            <Select
              mode="tags"
              placeholder="Digite os interesses (pressione Enter para adicionar)"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="strengths"
            label="Pontos Fortes / Habilidades"
          >
            <Select
              mode="tags"
              placeholder="Digite as habilidades (pressione Enter para adicionar)"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="challenges"
            label="Desafios / Dificuldades"
          >
            <Select
              mode="tags"
              placeholder="Digite os desafios (pressione Enter para adicionar)"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Divider>Terapias e Tratamentos</Divider>
          <Form.Item
            name="therapies"
            label="Terapias Frequentes"
          >
            <Checkbox.Group>
              <Row>
                {therapyOptions.map(therapy => (
                  <Col xs={24} sm={12} key={therapy}>
                    <Checkbox value={therapy}>{therapy}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            name="medications"
            label="Medicamentos (se aplicável)"
          >
            <Input.TextArea
              placeholder="Liste os medicamentos e dosagens"
              rows={3}
            />
          </Form.Item>

          <Divider>Comunicação e Preferências Sensoriais</Divider>
          <Form.Item
            name="communication"
            label="Estilo de Comunicação"
          >
            <Input.TextArea
              placeholder="Descreva como a pessoa se comunica (verbal, não-verbal, PECs, etc.)"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="sensoryPreferences"
            label="Preferências Sensoriais"
          >
            <Checkbox.Group>
              <Row>
                {sensoryOptions.map(preference => (
                  <Col xs={24} sm={12} key={preference}>
                    <Checkbox value={preference}>{preference}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            name="routines"
            label="Rotinas e Estruturas"
          >
            <Select
              mode="tags"
              placeholder="Digite as rotinas importantes (pressione Enter para adicionar)"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Divider />
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                Criar Perfil
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PerfilAutista;