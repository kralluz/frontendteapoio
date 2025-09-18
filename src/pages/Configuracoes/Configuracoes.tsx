import React, { useState } from 'react';
import {
  Card, Button, Modal, Form, Input, Avatar, List, Space, Typography,
  Divider, Popconfirm, message, Tabs, Tag, Row, Col, Switch, Select
} from 'antd';
import {
  LockOutlined, DeleteOutlined, LogoutOutlined,
  HeartOutlined, BookOutlined, SettingOutlined, BellOutlined,
  EditOutlined, MailOutlined, MessageOutlined, BulbOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

// Dados mock para posts salvos e curtidos
const mockSavedPosts = [
  {
    id: 1,
    title: 'Atividade Sensorial: Caixa de Texturas',
    description: 'Exercício divertido para trabalhar percepção tátil e foco.',
    type: 'activity',
    savedDate: '2 dias atrás',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 2,
    title: 'Como estimular a comunicação em crianças TEA',
    description: 'Dicas práticas para promover o desenvolvimento da fala.',
    type: 'article',
    savedDate: '5 dias atrás',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 3,
    title: 'Jogo de Sequências Visuais',
    description: 'Atividade para estimular percepção visual e raciocínio lógico.',
    type: 'activity',
    savedDate: '1 semana atrás',
    image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=300&q=80'
  }
];

const mockLikedPosts = [
  {
    id: 4,
    title: 'Estratégias para rotina escolar',
    description: 'Como adaptar o ambiente escolar para crianças com TEA.',
    type: 'article',
    likedDate: '3 dias atrás',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 5,
    title: 'Atividade de Recorte e Colagem',
    description: 'Estimule a coordenação motora fina com recortes.',
    type: 'activity',
    likedDate: '6 dias atrás',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
  }
];

const Configuracoes: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Estados para modais
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);

  // Estados para formulários
  const [passwordForm] = Form.useForm();
  const [profileForm] = Form.useForm();

  // Dados do usuário (mock)
  const [userData, setUserData] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '+55 11 99999-9999',
    bio: 'Pai dedicado e apaixonado por ajudar crianças com TEA.'
  });

  // Configurações
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkTheme: false
  });

  // Handlers
  const handlePasswordChange = async (values: any) => {
    try {
      // Simular mudança de senha
      console.log('Mudando senha:', values);
      message.success('Senha alterada com sucesso!');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error('Erro ao alterar senha');
    }
  };

  const handleProfileUpdate = async (values: any) => {
    try {
      // Simular atualização do perfil
      setUserData(prev => ({ ...prev, ...values }));
      message.success('Perfil atualizado com sucesso!');
      setProfileModalVisible(false);
    } catch (error) {
      message.error('Erro ao atualizar perfil');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Simular exclusão da conta
      message.success('Conta excluída com sucesso!');
      logout();
      navigate('/login');
    } catch (error) {
      message.error('Erro ao excluir conta');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    message.success('Logout realizado com sucesso!');
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    message.success('Configuração atualizada!');
  };

  const handleSendFeedback = async (values: any) => {
    try {
      // Simular envio de feedback
      console.log('Enviando feedback:', values);
      message.success('Feedback enviado com sucesso! Obrigado pela sua contribuição.');
      setFeedbackModalVisible(false);
    } catch (error) {
      message.error('Erro ao enviar feedback');
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        <SettingOutlined /> Configurações
      </Title>

      <Row gutter={24}>
        {/* Perfil e Conta */}
        <Col xs={24} lg={12}>
          <Card title="Perfil e Conta" style={{ marginBottom: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Avatar size={64} src="https://randomuser.me/api/portraits/men/32.jpg" style={{ marginRight: '16px' }} />
                <div>
                  <Title level={4} style={{ margin: 0 }}>{userData.name}</Title>
                  <Text type="secondary">{userData.email}</Text>
                </div>
              </div>

              <Space wrap>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setProfileModalVisible(true)}
                >
                  Editar Perfil
                </Button>
                <Button
                  icon={<LockOutlined />}
                  onClick={() => setPasswordModalVisible(true)}
                >
                  Alterar Senha
                </Button>
              </Space>
            </Space>
          </Card>

          {/* Configurações Gerais */}
          <Card title="Configurações Gerais" style={{ marginBottom: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <BellOutlined style={{ marginRight: '8px' }} />
                  <Text>Notificações</Text>
                </div>
                <Switch
                  checked={settings.notifications}
                  onChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <MailOutlined style={{ marginRight: '8px' }} />
                  <Text>Atualizações por Email</Text>
                </div>
                <Switch
                  checked={settings.emailUpdates}
                  onChange={(checked) => handleSettingChange('emailUpdates', checked)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <BulbOutlined style={{ marginRight: '8px' }} />
                  <Text>Tema Escuro</Text>
                </div>
                <Switch
                  checked={settings.darkTheme}
                  onChange={(checked) => handleSettingChange('darkTheme', checked)}
                />
              </div>

              <Divider />

              <Button
                type="default"
                icon={<MessageOutlined />}
                onClick={() => setFeedbackModalVisible(true)}
                block
              >
                Enviar Feedback
              </Button>
            </Space>
          </Card>

          {/* Ações da Conta */}
          <Card title="Ações da Conta">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="default"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                block
              >
                Fazer Logout
              </Button>

              <Divider />

              <Popconfirm
                title="Tem certeza que deseja excluir sua conta?"
                description="Esta ação não pode ser desfeita. Todos os seus dados serão perdidos."
                onConfirm={() => setDeleteAccountModalVisible(true)}
                okText="Sim, excluir"
                cancelText="Cancelar"
                okButtonProps={{ danger: true }}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  block
                >
                  Excluir Conta
                </Button>
              </Popconfirm>
            </Space>
          </Card>
        </Col>

        {/* Posts Salvos e Curtidos */}
        <Col xs={24} lg={12}>
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <BookOutlined />
                  Salvos ({mockSavedPosts.length})
                </span>
              }
              key="1"
            >
              <List
                dataSource={mockSavedPosts}
                renderItem={(item) => (
                  <List.Item
                    style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px', marginBottom: '12px' }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          shape="square"
                          size={64}
                          src={item.image}
                          icon={<BookOutlined />}
                        />
                      }
                      title={
                        <div>
                          <Text strong>{item.title}</Text>
                          <Tag
                            color={item.type === 'activity' ? 'green' : 'blue'}
                            style={{ marginLeft: '8px' }}
                          >
                            {item.type === 'activity' ? 'Atividade' : 'Artigo'}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <Paragraph ellipsis={{ rows: 2 }} style={{ margin: '8px 0' }}>
                            {item.description}
                          </Paragraph>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Salvo {item.savedDate}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <HeartOutlined />
                  Curtidos ({mockLikedPosts.length})
                </span>
              }
              key="2"
            >
              <List
                dataSource={mockLikedPosts}
                renderItem={(item) => (
                  <List.Item
                    style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px', marginBottom: '12px' }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          shape="square"
                          size={64}
                          src={item.image}
                          icon={<HeartOutlined />}
                        />
                      }
                      title={
                        <div>
                          <Text strong>{item.title}</Text>
                          <Tag
                            color={item.type === 'activity' ? 'green' : 'blue'}
                            style={{ marginLeft: '8px' }}
                          >
                            {item.type === 'activity' ? 'Atividade' : 'Artigo'}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <Paragraph ellipsis={{ rows: 2 }} style={{ margin: '8px 0' }}>
                            {item.description}
                          </Paragraph>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Curtido {item.likedDate}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </TabPane>
          </Tabs>
        </Col>
      </Row>

      {/* Modal Enviar Feedback */}
      <Modal
        title="Enviar Feedback"
        open={feedbackModalVisible}
        onCancel={() => setFeedbackModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSendFeedback}>
          <Form.Item
            name="subject"
            label="Assunto"
            rules={[{ required: true, message: 'Digite o assunto do feedback' }]}
          >
            <Input placeholder="Ex: Sugestão de melhoria, Bug encontrado..." />
          </Form.Item>

          <Form.Item
            name="message"
            label="Mensagem"
            rules={[
              { required: true, message: 'Digite sua mensagem' },
              { min: 10, message: 'A mensagem deve ter pelo menos 10 caracteres' }
            ]}
          >
            <TextArea
              placeholder="Descreva seu feedback, sugestão ou problema encontrado..."
              rows={6}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Categoria"
            rules={[{ required: true, message: 'Selecione uma categoria' }]}
          >
            <Select placeholder="Selecione a categoria do feedback">
              <Option value="bug">🐛 Reportar Bug</Option>
              <Option value="feature">💡 Sugestão de Funcionalidade</Option>
              <Option value="improvement">🔧 Sugestão de Melhoria</Option>
              <Option value="other">📝 Outro</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setFeedbackModalVisible(false)}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                Enviar Feedback
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Alterar Senha */}
      <Modal
        title="Alterar Senha"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="currentPassword"
            label="Senha Atual"
            rules={[{ required: true, message: 'Digite sua senha atual' }]}
          >
            <Input.Password placeholder="Digite sua senha atual" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Nova Senha"
            rules={[
              { required: true, message: 'Digite sua nova senha' },
              { min: 6, message: 'A senha deve ter pelo menos 6 caracteres' }
            ]}
          >
            <Input.Password placeholder="Digite sua nova senha" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmar Nova Senha"
            rules={[
              { required: true, message: 'Confirme sua nova senha' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('As senhas não coincidem'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirme sua nova senha" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setPasswordModalVisible(false);
                passwordForm.resetFields();
              }}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                Alterar Senha
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Editar Perfil */}
      <Modal
        title="Editar Perfil"
        open={profileModalVisible}
        onCancel={() => {
          setProfileModalVisible(false);
          profileForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileUpdate}
          initialValues={userData}
        >
          <Form.Item
            name="name"
            label="Nome Completo"
            rules={[{ required: true, message: 'Digite seu nome' }]}
          >
            <Input placeholder="Digite seu nome completo" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Digite seu email' },
              { type: 'email', message: 'Digite um email válido' }
            ]}
          >
            <Input placeholder="Digite seu email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefone"
            rules={[{ required: true, message: 'Digite seu telefone' }]}
          >
            <Input placeholder="Digite seu telefone" />
          </Form.Item>

          <Form.Item
            name="bio"
            label="Bio"
            rules={[{ max: 200, message: 'A bio deve ter no máximo 200 caracteres' }]}
          >
            <Input.TextArea
              placeholder="Conte um pouco sobre você..."
              rows={4}
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setProfileModalVisible(false);
                profileForm.resetFields();
              }}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                Salvar Alterações
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Confirmar Exclusão */}
      <Modal
        title="Confirmar Exclusão da Conta"
        open={deleteAccountModalVisible}
        onCancel={() => setDeleteAccountModalVisible(false)}
        onOk={handleDeleteAccount}
        okText="Sim, excluir conta"
        cancelText="Cancelar"
        okButtonProps={{ danger: true }}
      >
        <div style={{ textAlign: 'center' }}>
          <DeleteOutlined style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '16px' }} />
          <Title level={4}>Esta ação é irreversível!</Title>
          <Paragraph>
            Ao excluir sua conta, todos os seus dados, posts salvos, histórico de atividades
            e conquistas serão permanentemente removidos do sistema.
          </Paragraph>
          <Paragraph type="danger">
            Digite "EXCLUIR" para confirmar:
          </Paragraph>
          <Input placeholder="Digite EXCLUIR" />
        </div>
      </Modal>
    </div>
  );
};

export default Configuracoes;