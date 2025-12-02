import React, { useState, useEffect } from 'react';
import {
  Card, Avatar, Row, Col, Button, Tag, Space, Typography,
  Modal, Form, Input, Select, message, Spin, Divider, DatePicker, Checkbox
} from 'antd';
import {
  UserOutlined, EditOutlined, PlusOutlined, TeamOutlined, MailOutlined
} from '@ant-design/icons';
import { autismProfileService, AutismProfile } from '../../services/autismProfileService';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const supportLevels = [
  'Nível 1',
  'Nível 2',
  'Nível 3'
];

// Mock data - replace with actual data from your backend if available
const therapyOptions = ['Terapia Ocupacional', 'Fonoaudiologia', 'Psicoterapia', 'Psicomotricidade', 'Musicoterapia', 'Equoterapia'];
const sensoryOptions = ['Hipersensibilidade a sons', 'Hipersensibilidade a luzes', 'Hipersensibilidade a texturas', 'Hipossensibilidade a dor', 'Busca por estímulo vestibular'];


const Perfil: React.FC = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<AutismProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProfile, setEditingProfile] = useState<AutismProfile | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      loadProfiles();
    }
  }, [user]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const data = await autismProfileService.getAll();
      setProfiles(data);
    } catch (error) {
      message.error('Erro ao carregar perfis de autistas.');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (profile?: AutismProfile) => {
    setEditingProfile(profile || null);
    if (profile) {
      // O DatePicker do antd normalmente recebe um objeto dayjs/moment. Para evitar a dependência
      // aqui apenas definimos valores nativos de Date quando possível — o DatePicker aceita objetos
      // que implementem toDate(), mas caso contrário deixamos nulo (usuário pode reescolher).
      form.setFieldsValue({
        ...profile,
        birthDate: profile.birthDate ? new Date(profile.birthDate) : null,
        diagnosisDate: profile.diagnosisDate ? new Date(profile.diagnosisDate) : null,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProfile(null);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    let age;
    if (values.birthDate) {
      const birthDateNative = (values.birthDate && typeof values.birthDate.toDate === 'function')
        ? values.birthDate.toDate()
        : new Date(values.birthDate);

      const now = new Date();
      const diff = now.getTime() - birthDateNative.getTime();
      age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.2425));
    }

    const profileData = {
      ...values,
      birthDate: values.birthDate ? (typeof values.birthDate.toDate === 'function' ? values.birthDate.toDate().toISOString() : new Date(values.birthDate).toISOString()) : null,
      diagnosisDate: values.diagnosisDate ? (typeof values.diagnosisDate.toDate === 'function' ? values.diagnosisDate.toDate().toISOString() : new Date(values.diagnosisDate).toISOString()) : null,
      age: age,
    };

    try {
      if (editingProfile) {
        await autismProfileService.update(editingProfile.id, profileData);
        message.success('Perfil atualizado com sucesso!');
      } else {
        await autismProfileService.create(profileData);
        message.success('Perfil criado com sucesso!');
      }
      setIsModalVisible(false);
      setEditingProfile(null);
      form.resetFields();
      loadProfiles();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao salvar perfil.');
    }
  };

  const deleteProfile = async (profileId: string) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja deletar este perfil?',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: async () => {
        try {
          await autismProfileService.delete(profileId);
          message.success('Perfil removido com sucesso!');
          loadProfiles();
        } catch (error) {
          message.error('Erro ao deletar perfil.');
        }
      }
    });
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
      {/* Header do Perfil do Usuário */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={24} align="middle">
          <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              style={{ border: '4px solid #f0f0f0', marginBottom: '16px' }}
            />
          </Col>
          <Col xs={24} sm={16}>
            <Title level={2} style={{ marginBottom: '8px' }}>
              {user?.name}
            </Title>
            <Space direction="vertical" size="small">
              <Text><MailOutlined /> {user?.email}</Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Perfis dos Filhos */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><TeamOutlined /> Perfis de Autistas</span>
            {profiles.length > 0 && (
              <Button type="dashed" icon={<PlusOutlined />} onClick={() => showModal()}>
                Adicionar Perfil
              </Button>
            )}
          </div>
        }
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={[16, 16]}>
          {profiles.map((profile: AutismProfile) => (
            <Col xs={24} sm={12} lg={8} key={profile.id}>
              <Card
                hoverable
                style={{ height: '100%' }}
                cover={
                  <div style={{ padding: '16px', textAlign: 'center' }}>
                    <Avatar
                      size={80}
                      icon={<UserOutlined />}
                      style={{ border: '3px solid #f0f0f0' }}
                    />
                  </div>
                }
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => showModal(profile)}
                  >
                    Editar
                  </Button>,
                  <Button
                    type="text"
                    danger
                    onClick={() => deleteProfile(profile.id)}
                  >
                    Remover
                  </Button>
                ]}
              >
                <Card.Meta
                  title={
                    <div>
                      <Title level={4} style={{ marginBottom: '4px' }}>{profile.name}</Title>
                      <Text type="secondary">{profile.age} anos</Text>
                    </div>
                  }
                  description={
                    <div>
                      {profile.level && <Tag color="blue" style={{ marginBottom: '8px' }}>
                        {profile.level}
                      </Tag>}
                      <Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{ fontSize: '12px', marginBottom: '8px' }}
                      >
                        {profile.diagnosis}
                      </Paragraph>
                      {profile.interests && profile.interests.length > 0 && (
                        <div>
                          <Text strong style={{ fontSize: '12px' }}>Interesses: </Text>
                          <Text style={{ fontSize: '12px' }}>
                            {profile.interests.slice(0, 2).join(', ')}
                            {profile.interests.length > 2 && '...'}
                          </Text>
                        </div>
                      )}
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {profiles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <TeamOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <Title level={4} type="secondary">
              Nenhum perfil de autista cadastrado
            </Title>
            <Paragraph type="secondary">
              Adicione um perfil para receber recomendações personalizadas de atividades e conteúdos.
            </Paragraph>
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => showModal()}>
              Criar Primeiro Perfil
            </Button>
          </div>
        )}
      </Card>

      {/* Modal para criar/editar perfil */}
      <Modal
        title={editingProfile ? "Editar Perfil de Autista" : "Criar Perfil de Autista"}
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
            therapies: []
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
              >
                <DatePicker
                  placeholder="Selecione a data"
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
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
              >
                <Input placeholder="Ex: Transtorno do Espectro Autista" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="level"
                label="Nível de Suporte"
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
                {editingProfile ? 'Atualizar Perfil' : 'Criar Perfil'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Perfil;