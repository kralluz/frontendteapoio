import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

interface FormValues {
  email?: string;
  code?: string;
  password?: string;
  confirmPassword?: string;
}

const PasswordReset: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'code' | 'newPassword'>('email');

  const onFinish = async () => {
    setLoading(true);
    try {
      if (step === 'email') {
        // Simular envio de código
        await new Promise(resolve => setTimeout(resolve, 1000));
        message.success('Código de recuperação enviado para seu email!');
        setStep('code');
      } else if (step === 'code') {
        // Simular verificação de código
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStep('newPassword');
      } else {
        // Simular alteração de senha
        await new Promise(resolve => setTimeout(resolve, 1000));
        message.success('Senha alterada com sucesso!');
        // Redirecionar para login
      }
    } catch (error) {
      message.error('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card 
        className="w-full max-w-md"
        style={{
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
          borderRadius: '12px',
          border: 'none'
        }}
      >
        <div className="text-center mb-8">
          <h2 
            className="text-3xl font-bold mb-2"
            style={{ 
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Recuperação de Senha
          </h2>
          <p className="text-gray-600">
            {step === 'email' && 'Digite seu email para receber o código de recuperação'}
            {step === 'code' && 'Digite o código recebido no seu email'}
            {step === 'newPassword' && 'Digite sua nova senha'}
          </p>
        </div>

        <Form
          form={form}
          name="password-reset"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          {step === 'email' && (
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Por favor, digite seu email' },
                { type: 'email', message: 'Digite um email válido' }
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#667eea' }} />}
                placeholder="Digite seu email"
                size="large"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          )}

          {step === 'code' && (
            <Form.Item
              name="code"
              rules={[{ required: true, message: 'Por favor, digite o código recebido' }]}
            >
              <Input
                placeholder="Digite o código de 6 dígitos"
                size="large"
                style={{ borderRadius: '8px' }}
                maxLength={6}
              />
            </Form.Item>
          )}

          {step === 'newPassword' && (
            <>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Por favor, digite sua nova senha' },
                  { min: 6, message: 'A senha deve ter no mínimo 6 caracteres' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#667eea' }} />}
                  placeholder="Nova senha"
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Por favor, confirme sua senha' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('As senhas não coincidem'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#667eea' }} />}
                  placeholder="Confirme a nova senha"
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
              style={{
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                height: '44px',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            >
              {step === 'email' && 'Enviar Código'}
              {step === 'code' && 'Verificar Código'}
              {step === 'newPassword' && 'Alterar Senha'}
            </Button>
          </Form.Item>

          <div className="text-center">
            <Link 
              to="/login"
              className="text-sm font-medium hover:text-[#764ba2] transition-colors"
              style={{ color: '#667eea' }}
            >
              Voltar para o login
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default PasswordReset;