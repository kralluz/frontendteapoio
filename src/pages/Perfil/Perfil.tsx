import React, { useState } from 'react';
import {
  Card, Avatar, Descriptions, Statistic, Row, Col, Button, Tag, Space, Typography,
  Modal, Form, Input, Select, DatePicker, Checkbox, Divider, message
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, BookOutlined,
  HeartOutlined, EditOutlined, PlusOutlined, TeamOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Importar dados compartilhados
import { childrenProfiles as initialChildrenProfiles } from '../../data/childrenProfiles';

// Tipo para o perfil do filho
type ChildProfile = typeof initialChildrenProfiles[0];

// Opções para os formulários
const supportLevels = [
  'Nível 1 (Suporte mínimo)',
  'Nível 2 (Suporte substancial)',
  'Nível 3 (Suporte muito substancial)'
];

const therapyOptions = [
  'Terapia ABA',
  'Terapia Cognitivo-Comportamental',
  'Fonoaudiologia',
  'Terapia Ocupacional',
  'Musicoterapia',
  'Equoterapia',
  'Natação terapêutica',
  'Arteterapia'
];

const sensoryOptions = [
  'Sensível a ruídos altos',
  'Prefere texturas macias',
  'Gosta de iluminação indireta',
  'Evita contato visual intenso',
  'Gosta de movimentos repetitivos',
  'Prefere ambientes calmos',
  'Sensível a cheiros fortes'
];

// Dados mock do usuário
const userProfile = {
  name: 'João Silva',
  email: 'joao.silva@email.com',
  phone: '+55 11 99999-9999',
  birthDate: '15/08/2010',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  bio: 'Pai dedicado e apaixonado por ajudar crianças com TEA. Busco sempre as melhores práticas e atividades para o desenvolvimento do meu filho.',
  joinDate: 'Janeiro 2023',
  location: 'São Paulo, SP',
  interests: ['Atividades Sensoriais', 'Comunicação', 'Rotinas Estruturadas'],
  stats: {
    articlesRead: 23,
    favoriteActivities: 12,
    daysActive: 89
  },
  recentActivities: [
    { title: 'Atividade Sensorial: Caixa de Texturas', date: '2 dias atrás', type: 'activity' },
    { title: 'Como estimular a comunicação', date: '5 dias atrás', type: 'article' },
    { title: 'Jogo de Sequências Visuais', date: '1 semana atrás', type: 'activity' }
  ]
};

const Perfil: React.FC = () => {
  const [children, setChildren] = useState(initialChildrenProfiles);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingChild, setEditingChild] = useState<any>(null);
  const [form] = Form.useForm();

  const showModal = (child?: any) => {
    setEditingChild(child);
    if (child) {
      form.setFieldsValue({
        ...child,
        birthDate: child.birthDate ? new Date(child.birthDate) : null,
        diagnosisDate: child.diagnosisDate ? new Date(child.diagnosisDate) : null,
        therapies: child.therapies || [],
        sensoryPreferences: child.sensoryPreferences ? Object.values(child.sensoryPreferences) : []
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingChild(null);
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    const childData: ChildProfile = {
      ...values,
      id: editingChild ? editingChild.id : Date.now(),
      avatar: editingChild ? editingChild.avatar : 'https://randomuser.me/api/portraits/children/' + Math.floor(Math.random() * 50) + '.jpg',
      birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
      diagnosisDate: values.diagnosisDate ? values.diagnosisDate.format('YYYY-MM-DD') : null,
      sensoryPreferences: values.sensoryPreferences ? {
        sound: values.sensoryPreferences.includes('Sensível a ruídos altos') ? 'Sensível a ruídos altos' : '',
        touch: values.sensoryPreferences.includes('Prefere texturas macias') ? 'Prefere texturas macias' : '',
        light: values.sensoryPreferences.includes('Gosta de iluminação indireta') ? 'Gosta de iluminação indireta' : '',
        movement: values.sensoryPreferences.includes('Gosta de movimentos repetitivos') ? 'Gosta de movimentos repetitivos' : ''
      } : {}
    };

    if (editingChild) {
      setChildren((prev: ChildProfile[]) => prev.map((child: ChildProfile) => child.id === editingChild.id ? childData : child));
      message.success('Perfil atualizado com sucesso!');
    } else {
      setChildren((prev: ChildProfile[]) => [...prev, childData]);
      message.success('Perfil criado com sucesso!');
    }

    setIsModalVisible(false);
    setEditingChild(null);
    form.resetFields();
  };

  const deleteChild = (childId: number) => {
    setChildren((prev: ChildProfile[]) => prev.filter((child: ChildProfile) => child.id !== childId));
    message.success('Perfil removido com sucesso!');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header do Perfil */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={24} align="middle">
          <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
            <Avatar
              size={120}
              src={userProfile.avatar}
              icon={<UserOutlined />}
              style={{ border: '4px solid #667eea', marginBottom: '16px' }}
            />
            <div style={{ marginTop: '16px' }}>
              <Button type="primary" icon={<EditOutlined />}>
                Editar Perfil
              </Button>
            </div>
          </Col>
          <Col xs={24} sm={16}>
            <Title level={2} style={{ marginBottom: '8px' }}>
              {userProfile.name}
            </Title>
            <Paragraph style={{ fontSize: '16px', marginBottom: '16px' }}>
              {userProfile.bio}
            </Paragraph>
            <Space direction="vertical" size="small">
              <Text><MailOutlined /> {userProfile.email}</Text>
              <Text><PhoneOutlined /> {userProfile.phone}</Text>
              <Text><CalendarOutlined /> Membro desde {userProfile.joinDate}</Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Estatísticas */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Artigos Lidos"
              value={userProfile.stats.articlesRead}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#764ba2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Favoritos"
              value={userProfile.stats.favoriteActivities}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#e53e3e' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Dias Ativo"
              value={userProfile.stats.daysActive}
              valueStyle={{ color: '#38a169' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Perfis dos Filhos */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><TeamOutlined /> Perfis dos Filhos</span>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
              Adicionar Filho
            </Button>
          </div>
        }
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={[16, 16]}>
          {children.map((child: ChildProfile) => (
            <Col xs={24} sm={12} lg={8} key={child.id}>
              <Card
                hoverable
                style={{ height: '100%' }}
                cover={
                  <div style={{ padding: '16px', textAlign: 'center' }}>
                    <Avatar
                      size={80}
                      src={child.avatar}
                      icon={<UserOutlined />}
                      style={{ border: '3px solid #667eea' }}
                    />
                  </div>
                }
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => showModal(child)}
                  >
                    Editar
                  </Button>,
                  <Button
                    type="text"
                    danger
                    onClick={() => deleteChild(child.id)}
                  >
                    Remover
                  </Button>
                ]}
              >
                <Card.Meta
                  title={
                    <div>
                      <Title level={4} style={{ marginBottom: '4px' }}>{child.name}</Title>
                      <Text type="secondary">{child.age} anos</Text>
                    </div>
                  }
                  description={
                    <div>
                      <Tag color="blue" style={{ marginBottom: '8px' }}>
                        {child.supportLevel}
                      </Tag>
                      <Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{ fontSize: '12px', marginBottom: '8px' }}
                      >
                        {child.diagnosis}
                      </Paragraph>
                      <div>
                        <Text strong style={{ fontSize: '12px' }}>Interesses: </Text>
                        <Text style={{ fontSize: '12px' }}>
                          {child.interests.slice(0, 2).join(', ')}
                          {child.interests.length > 2 && '...'}
                        </Text>
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {children.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <TeamOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <Title level={4} type="secondary">
              Nenhum perfil de filho cadastrado
            </Title>
            <Paragraph type="secondary">
              Adicione o perfil do seu filho para receber recomendações personalizadas de atividades e conteúdos.
            </Paragraph>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
              Criar Primeiro Perfil
            </Button>
          </div>
        )}
      </Card>

      <Row gutter={24}>
        {/* Informações Detalhadas */}
        <Col xs={24} lg={12}>
          <Card title="Informações Pessoais" style={{ marginBottom: '24px' }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Nome Completo">
                {userProfile.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {userProfile.email}
              </Descriptions.Item>
              <Descriptions.Item label="Telefone">
                {userProfile.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Data de Nascimento">
                {userProfile.birthDate}
              </Descriptions.Item>
              <Descriptions.Item label="Localização">
                {userProfile.location}
              </Descriptions.Item>
              <Descriptions.Item label="Membro desde">
                {userProfile.joinDate}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Interesses */}
          <Card title="Interesses" style={{ marginBottom: '24px' }}>
            <Space wrap>
              {userProfile.interests.map((interest, index) => (
                <Tag key={index} color="blue">
                  {interest}
                </Tag>
              ))}
            </Space>
          </Card>
        </Col>

        {/* Atividades Recentes */}
        <Col xs={24} lg={12}>
          <Card title="Atividades Recentes" style={{ marginBottom: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {userProfile.recentActivities.map((activity, index) => (
                <Card key={index} size="small" hoverable>
                  <Row align="middle">
                    <Col flex="auto">
                      <Text strong>{activity.title}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {activity.date}
                      </Text>
                    </Col>
                    <Col>
                      <Tag color={activity.type === 'activity' ? 'green' : 'blue'}>
                        {activity.type === 'activity' ? 'Atividade' : 'Artigo'}
                      </Tag>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Modal para criar/editar perfil do filho */}
      <Modal
        title={editingChild ? "Editar Perfil do Filho" : "Criar Perfil do Filho"}
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
                <Input placeholder="Nome do filho" />
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
                name="supportLevel"
                label="Nível de Suporte"
                rules={[{ required: true, message: 'Por favor, selecione o nível de suporte!' }]}
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
              placeholder="Descreva como o filho se comunica (verbal, não-verbal, PECs, etc.)"
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
                {editingChild ? 'Atualizar Perfil' : 'Criar Perfil'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Perfil;