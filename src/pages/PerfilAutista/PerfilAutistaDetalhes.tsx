import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Avatar, Row, Col, Button, Tag, Space, Typography, Divider,
  Alert, Spin, message, Modal, Form, Input, Select, Checkbox
} from 'antd';
import {
  UserOutlined, HeartOutlined,
  CalendarOutlined, TrophyOutlined,
  ArrowLeftOutlined, SoundOutlined, EditOutlined, DeleteOutlined
} from '@ant-design/icons';
import { autismProfileService, AutismProfile } from '../../services/autismProfileService';
import './PerfilAutista.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const supportLevels = [
  'Nível 1',
  'Nível 2',
  'Nível 3'
];

const therapyOptions = ['Terapia Ocupacional', 'Fonoaudiologia', 'Psicoterapia', 'Psicomotricidade', 'Musicoterapia', 'Equoterapia'];
const sensoryOptions = ['Hipersensibilidade a sons', 'Hipersensibilidade a luzes', 'Hipersensibilidade a texturas', 'Hipossensibilidade a dor', 'Busca por estímulo vestibular'];

const PerfilAutistaDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AutismProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      loadProfile(id);
    }
  }, [id]);

  const loadProfile = async (profileId: string) => {
    try {
      setLoading(true);
      const data = await autismProfileService.getById(profileId);
      setProfile(data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setNotFound(true);
      } else {
        message.error('Erro ao carregar perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = () => {
    if (profile) {
      // Parsear as notas para extrair os campos
      const notes = profile.notes || '';
      const medicationsMatch = notes.match(/Medicamentos: ([^\n]+)/);
      const communicationMatch = notes.match(/Comunicação: ([^\n]+)/);
      const routinesMatch = notes.match(/Rotinas: ([^\n]+)/);
      const therapiesMatch = notes.match(/Terapias: ([^\n]+)/);

      form.setFieldsValue({
        name: profile.name,
        diagnosis: profile.diagnosis,
        level: profile.level,
        interests: profile.interests,
        sensoryPreferences: profile.sensitivities,
        strengths: profile.strengths,
        challenges: profile.challenges,
        medications: medicationsMatch ? medicationsMatch[1] : '',
        communication: communicationMatch ? communicationMatch[1] : '',
        routines: routinesMatch?.[1] ? routinesMatch[1].split(', ') : [],
        therapies: therapiesMatch?.[1] ? therapiesMatch[1].split(', ') : [],
      });
      setIsModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleUpdate = async (values: any) => {
    if (!profile) return;

    // Construir notas consolidadas
    const notesArray = [
      values.medications ? `Medicamentos: ${values.medications}` : '',
      values.communication ? `Comunicação: ${values.communication}` : '',
      values.routines && values.routines.length > 0 ? `Rotinas: ${values.routines.join(', ')}` : '',
      values.therapies && values.therapies.length > 0 ? `Terapias: ${values.therapies.join(', ')}` : ''
    ].filter(Boolean);

    // Manter a idade atual do perfil
    const profileData: any = {
      name: values.name,
      age: profile.age, // Mantém a idade atual
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
      await autismProfileService.update(profile.id, profileData);
      message.success('Perfil atualizado com sucesso!');
      setIsModalVisible(false);
      form.resetFields();
      loadProfile(profile.id);
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      message.error(error.response?.data?.message || 'Erro ao atualizar perfil.');
    }
  };

  const handleDelete = () => {
    if (!profile) return;

    Modal.confirm({
      title: 'Confirmar exclusão',
      content: `Tem certeza que deseja deletar o perfil de ${profile.name}?`,
      okText: 'Sim, deletar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await autismProfileService.delete(profile.id);
          message.success('Perfil deletado com sucesso!');
          navigate('/perfil-autista');
        } catch (error: any) {
          message.error('Erro ao deletar perfil.');
        }
      }
    });
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

  if (!profile || notFound) {
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

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/perfil-autista')}
          style={{ padding: 0, fontSize: '16px' }}
        >
          Voltar para Perfis dos Autistas
        </Button>
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={showEditModal}
          >
            Editar Perfil
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          >
            Excluir
          </Button>
        </Space>
      </div>

      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={24} align="middle">
          <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
            <Avatar
              size={150}
              src={profile.photo}
              icon={<UserOutlined />}
              style={{
                border: '6px solid #667eea',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                marginBottom: '16px'
              }}
            />
            <Tag
              color={getDifficultyColor(profile.level)}
              style={{ fontSize: '14px', padding: '4px 12px' }}
            >
              {profile.level}
            </Tag>
          </Col>
          <Col xs={24} sm={16}>
            <Title level={1} style={{ marginBottom: '8px' }}>{profile.name}</Title>
            <Text style={{ fontSize: '18px', color: '#666' }}>{profile.age} anos</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '16px' }}>
              <CalendarOutlined style={{ marginRight: '8px' }} />
              Cadastrado em {new Date(profile.createdAt).toLocaleDateString('pt-BR')}
            </Text>
            <Divider />
            <Paragraph style={{ fontSize: '16px', color: '#666' }}>
              {profile.diagnosis}
            </Paragraph>
            {profile.notes && (
              <Text type="secondary">
                {profile.notes}
              </Text>
            )}
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
              {profile.interests.map((interest, index) => (
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
              {profile.strengths.map((strength, index) => (
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
              {profile.challenges.map((challenge, index) => (
                <Tag key={index} color="orange" style={{ fontSize: '14px', padding: '6px 12px' }}>
                  {challenge}
                </Tag>
              ))}
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          {/* Sensibilidades */}
          <Card title="Sensibilidades" style={{ marginBottom: '24px' }}>
            <Space wrap size="middle">
              {profile.sensitivities.map((sensitivity, index) => (
                <Tag key={index} color="volcano" style={{ fontSize: '14px', padding: '6px 12px' }}>
                  <SoundOutlined style={{ marginRight: '6px' }} />
                  {sensitivity}
                </Tag>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Modal para editar perfil */}
      <Modal
        title="Editar Perfil de Autista"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Divider>Informações Básicas</Divider>
          <Form.Item
            name="name"
            label="Nome Completo"
            rules={[{ required: true, message: 'Por favor, insira o nome!' }]}
          >
            <Input placeholder="Nome do perfil" />
          </Form.Item>

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
                Atualizar Perfil
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PerfilAutistaDetalhes;