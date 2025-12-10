import React, { useState, useEffect } from 'react';
import {
  Button, Modal, Form, Input, Avatar, Space, Typography,
  Divider, Popconfirm, message, Switch, Select
} from 'antd';
import {
  LockOutlined, DeleteOutlined, LogoutOutlined,
  SettingOutlined, BellOutlined,
  EditOutlined, MailOutlined, MessageOutlined, BulbOutlined, 
  SafetyOutlined, UserOutlined, WarningOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import './Configuracoes.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Configuracoes: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estados para modais
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);

  // Estados para formulários
  const [passwordForm] = Form.useForm();
  const [profileForm] = Form.useForm();

  // Dados do usuário
  const [userData, setUserData] = useState(user);

  useEffect(() => {
    setUserData(user);
    profileForm.setFieldsValue(user);
  }, [user, profileForm]);

  // Configurações
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkTheme: localStorage.getItem('darkTheme') === 'true' || false
  });

  // Aplicar tema escuro ao carregar a página
  useEffect(() => {
    const isDark = localStorage.getItem('darkTheme') === 'true';
    if (isDark) {
      document.body.classList.add('dark-theme');
    }
  }, []);

  // Handlers
  const handlePasswordChange = async (values: any) => {
    try {
      await userService.changePassword(values);
      message.success('Senha alterada com sucesso!');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao alterar senha');
    }
  };

  const handleProfileUpdate = async (values: any) => {
    try {
      // Remover campos vazios ou nulos antes de enviar
      const cleanedValues = Object.entries(values).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      const updatedUser = await userService.updateMe(cleanedValues);
      setUserData(updatedUser);
      message.success('Perfil atualizado com sucesso!');
      setProfileModalVisible(false);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao atualizar perfil');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // TODO: Implementar a chamada ao serviço de exclusão de conta
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
    
    // Tratamento especial para tema escuro
    if (key === 'darkTheme') {
      if (value) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('darkTheme', 'true');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('darkTheme', 'false');
      }
    }
    
    message.success('Configuração atualizada!');
  };

  const handleSendFeedback = async (values: any) => {
    try {
      // TODO: Implementar a chamada ao serviço de envio de feedback
      console.log('Enviando feedback:', values);
      message.success('Feedback enviado com sucesso! Obrigado pela sua contribuição.');
      setFeedbackModalVisible(false);
    } catch (error) {
      message.error('Erro ao enviar feedback');
    }
  };

  return (
    <div className="settings-container">
      {/* Header com gradiente */}
      <div className="settings-header">
        <div className="settings-header-content">
          <Title className="settings-title">
            <SettingOutlined style={{ marginRight: '16px' }} />
            Configurações
          </Title>
          <Paragraph className="settings-subtitle">
            Gerencie suas preferências, segurança e informações da conta
          </Paragraph>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="settings-content">
        {/* Card de Perfil */}
        <div className="settings-card">
          <div className="settings-card-title">
            <UserOutlined />
            Meu Perfil
          </div>
          
          <div className="profile-section">
            <Avatar 
              size={80} 
              src={userData?.avatar}
              className="profile-avatar"
              style={{ 
                backgroundColor: userData?.avatar ? undefined : '#667eea',
                fontSize: '32px'
              }}
            >
              {!userData?.avatar && userData?.name ? userData.name.charAt(0).toUpperCase() : null}
            </Avatar>
            <div className="profile-info">
              <h3>{userData?.name}</h3>
              <p><MailOutlined style={{ marginRight: '8px' }} />{userData?.email}</p>
            </div>
          </div>

          <Space size="middle" wrap>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setProfileModalVisible(true)}
              className="action-button"
              size="large"
            >
              Editar Perfil
            </Button>
            <Button
              icon={<LockOutlined />}
              onClick={() => setPasswordModalVisible(true)}
              className="action-button"
              size="large"
            >
              Alterar Senha
            </Button>
          </Space>
        </div>

        {/* Card de Preferências */}
        <div className="settings-card">
          <div className="settings-card-title">
            <BellOutlined />
            Preferências
          </div>
          
          <div className="settings-item">
            <div className="settings-item-label">
              <BellOutlined />
              <div>
                <div className="label-text">Notificações Push</div>
                <div className="label-description">Receba notificações sobre novos conteúdos</div>
              </div>
            </div>
            <Switch
              checked={settings.notifications}
              onChange={(checked) => handleSettingChange('notifications', checked)}
              size="default"
            />
          </div>

          <div className="settings-item">
            <div className="settings-item-label">
              <MailOutlined />
              <div>
                <div className="label-text">Atualizações por Email</div>
                <div className="label-description">Receba novidades e dicas semanais</div>
              </div>
            </div>
            <Switch
              checked={settings.emailUpdates}
              onChange={(checked) => handleSettingChange('emailUpdates', checked)}
              size="default"
            />
          </div>

          <div className="settings-item">
            <div className="settings-item-label">
              <BulbOutlined />
              <div>
                <div className="label-text">Tema Escuro</div>
                <div className="label-description">Interface em modo escuro</div>
              </div>
            </div>
            <Switch
              checked={settings.darkTheme}
              onChange={(checked) => handleSettingChange('darkTheme', checked)}
              size="default"
            />
          </div>

          <Divider style={{ margin: '24px 0' }} />

          <Button
            type="default"
            icon={<MessageOutlined />}
            onClick={() => setFeedbackModalVisible(true)}
            className="action-button"
            size="large"
            block
          >
            Enviar Feedback ou Sugestão
          </Button>
        </div>

        {/* Card de Segurança e Sessão */}
        <div className="settings-card">
          <div className="settings-card-title">
            <SafetyOutlined />
            Segurança e Sessão
          </div>
          
          <Button
            type="default"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="action-button"
            size="large"
            block
            style={{ marginBottom: '12px' }}
          >
            Sair da Conta
          </Button>

          <Text type="secondary" style={{ fontSize: '13px', display: 'block', textAlign: 'center' }}>
            Você será desconectado de todos os dispositivos
          </Text>
        </div>

        {/* Card de Zona de Perigo */}
        <div className="settings-card danger-zone">
          <div className="settings-card-title">
            <WarningOutlined />
            Zona de Perigo
          </div>
          
          <Paragraph type="secondary" style={{ marginBottom: '16px' }}>
            A exclusão da conta é permanente e não pode ser desfeita. Todos os seus dados serão perdidos.
          </Paragraph>

          <Popconfirm
            title="Tem certeza que deseja excluir sua conta?"
            description="Esta ação é irreversível. Todos os seus dados serão perdidos permanentemente."
            onConfirm={() => setDeleteAccountModalVisible(true)}
            okText="Sim, excluir"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              className="action-button"
              size="large"
              block
            >
              Excluir Conta Permanentemente
            </Button>
          </Popconfirm>
        </div>
      </div>

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
          autoComplete="off"
        >
          <Form.Item
            name="currentPassword"
            label="Senha Atual"
            rules={[{ required: true, message: 'Digite sua senha atual' }]}
          >
            <Input.Password 
              placeholder="Digite sua senha atual" 
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Nova Senha"
            rules={[
              { required: true, message: 'Digite sua nova senha' },
              { min: 6, message: 'A senha deve ter pelo menos 6 caracteres' }
            ]}
          >
            <Input.Password 
              placeholder="Digite sua nova senha" 
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmar Nova Senha"
            dependencies={['newPassword']}
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
            <Input.Password 
              placeholder="Confirme sua nova senha" 
              autoComplete="new-password"
            />
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
        }}
        footer={null}
        width={600}
      >
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileUpdate}
          initialValues={userData || {}}
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
            <Input placeholder="Digite seu email" disabled />
          </Form.Item>

          <Form.Item
            name="avatar"
            label="URL do Avatar"
            rules={[{ type: 'url', message: 'Digite uma URL válida' }]}
          >
            <Input placeholder="https://example.com/avatar.png" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setProfileModalVisible(false);
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
            Ao excluir sua conta, todos os seus dados serão permanentemente removidos.
          </Paragraph>
        </div>
      </Modal>
    </div>
  );
};

export default Configuracoes;