import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Upload, Switch, message, Card, Space, InputNumber, Row, Col, Typography, Alert } from 'antd';
import { UploadOutlined, SaveOutlined, PlusOutlined, MinusCircleOutlined, ArrowLeftOutlined, InfoCircleOutlined, TrophyOutlined, FileImageOutlined, OrderedListOutlined, ToolOutlined } from '@ant-design/icons';
import { activityService } from '../../services/activityService';
import api from '../../services/api';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const ActivityForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      loadActivity();
    }
  }, [id]);

  const loadActivity = async () => {
    try {
      const activity = await activityService.getById(id!);

      form.setFieldsValue({
        title: activity.title,
        description: activity.description,
        content: activity.content,
        category: activity.category,
        difficulty: activity.difficulty,
        ageRange: activity.ageRange,
        duration: activity.duration,
        materials: activity.materials,
        steps: activity.steps,
        published: activity.published,
      });

      if (activity.image) {
        setImageUrl(activity.image);
      }
    } catch (error) {
      message.error('Erro ao carregar atividade');
      navigate('/professional/atividades');
    }
  };

  const handleImageUpload = async (file: File) => {
    // Validação de tamanho (máx 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      message.error('A imagem deve ter no máximo 5MB');
      return false;
    }

    // Validação de tipo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      message.error('Formato não suportado. Use JPG, PNG, GIF ou WebP');
      return false;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload/activity', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setImageUrl(response.data.url);
      message.success('Imagem enviada com sucesso!');
      return false;
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      message.error(error.response?.data?.message || 'Erro ao enviar imagem. Tente novamente.');
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const data = {
      ...values,
      image: imageUrl,
    };

    try {
      if (isEditing) {
        await activityService.update(id!, data);
        message.success('Atividade atualizada com sucesso');
      } else {
        await activityService.create(data);
        message.success('Atividade criada com sucesso');
      }
      navigate('/professional/atividades');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao salvar atividade');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Motora',
    'Cognitiva',
    'Social',
    'Comunicação',
    'Sensorial',
    'Artes',
    'Música',
    'Jogos',
    'Outras'
  ];

  const difficulties = ['Fácil', 'Médio', 'Difícil'];
  const ageRanges = ['0-3 anos', '3-6 anos', '6-9 anos', '9-12 anos', '12+ anos', 'Todas as idades'];

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Space align="start" style={{ marginBottom: '16px' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/professional/atividades')}
            size="large"
          />
          <div>
            <Title level={2} style={{ margin: 0 }}>
              {isEditing ? 'Editar Atividade' : 'Nova Atividade'}
            </Title>
            <div style={{ color: '#8c8c8c', fontSize: '14px', marginTop: '4px' }}>
              {isEditing ? 'Atualize as informações da sua atividade' : 'Crie uma atividade educativa para pessoas com TEA'}
            </div>
          </div>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          published: true,
          duration: 30,
          materials: [''],
          steps: [''],
        }}
      >
        {/* Informações Básicas */}
        <Card 
          title={
            <Space>
              <TrophyOutlined style={{ color: '#1890ff' }} />
              <span>Informações Básicas</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Form.Item
            name="title"
            label="Título da Atividade"
            rules={[{ required: true, message: 'Insira um título' }]}
            tooltip="Dê um nome atrativo para sua atividade"
          >
            <Input 
              placeholder="Ex: Pintura com texturas sensoriais" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descrição"
            rules={[{ required: true, message: 'Insira a descrição' }]}
            tooltip="Breve descrição do objetivo da atividade"
          >
            <TextArea 
              rows={3} 
              placeholder="Descreva o que a atividade desenvolve e seus objetivos..." 
              size="large"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="category"
                label="Categoria"
                rules={[{ required: true, message: 'Selecione' }]}
              >
                <Select placeholder="Categoria" size="large">
                  {categories.map(cat => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="difficulty"
                label="Dificuldade"
                rules={[{ required: true, message: 'Selecione' }]}
              >
                <Select placeholder="Dificuldade" size="large">
                  {difficulties.map(diff => (
                    <Option key={diff} value={diff}>{diff}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="duration"
                label="Duração"
                rules={[{ required: true, message: 'Insira' }]}
                tooltip="Tempo estimado em minutos"
              >
                <InputNumber 
                  min={1} 
                  style={{ width: '100%' }} 
                  size="large"
                  suffix="min"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="ageRange"
            label="Faixa Etária"
            rules={[{ required: true, message: 'Selecione' }]}
          >
            <Select placeholder="Para qual idade é recomendada" size="large">
              {ageRanges.map(age => (
                <Option key={age} value={age}>{age}</Option>
              ))}
            </Select>
          </Form.Item>
        </Card>

        {/* Imagem */}
        <Card 
          title={
            <Space>
              <FileImageOutlined style={{ color: '#52c41a' }} />
              <span>Imagem da Atividade</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Alert
            message="Dica"
            description="Use uma imagem ilustrativa da atividade (máx 5MB)"
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            style={{ marginBottom: '16px' }}
          />
          
          <Upload
            beforeUpload={handleImageUpload}
            maxCount={1}
            showUploadList={false}
            accept="image/*"
          >
            <Button 
              icon={<UploadOutlined />} 
              loading={uploading}
              size="large"
              block
              style={{ height: '48px' }}
            >
              {uploading ? 'Enviando...' : imageUrl ? 'Alterar Imagem' : 'Selecionar Imagem'}
            </Button>
          </Upload>
          
          {imageUrl && (
            <div style={{ 
              marginTop: '16px', 
              border: '2px solid #f0f0f0',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <img 
                src={imageUrl} 
                alt="Preview" 
                style={{ 
                  width: '100%', 
                  maxHeight: '300px', 
                  objectFit: 'cover',
                  display: 'block'
                }} 
              />
              <div style={{ 
                padding: '12px', 
                background: '#fafafa',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '12px', color: '#8c8c8c' }}>✓ Imagem carregada</span>
                <Button 
                  type="link" 
                  danger 
                  size="small"
                  onClick={() => setImageUrl('')}
                >
                  Remover
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Materiais */}
        <Card 
          title={
            <Space>
              <ToolOutlined style={{ color: '#fa8c16' }} />
              <span>Materiais Necessários</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Form.Item>
            <Form.List name="materials">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 12, width: '100%' }} align="start">
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        background: '#f0f0f0', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: '#8c8c8c',
                        flexShrink: 0
                      }}>
                        {index + 1}
                      </div>
                      <Form.Item
                        {...field}
                        rules={[{ required: true, message: 'Insira o material' }]}
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <Input placeholder={`Ex: Tinta guache, papel sulfite...`} size="large" />
                      </Form.Item>
                      {fields.length > 1 && (
                        <Button 
                          type="text" 
                          danger 
                          icon={<MinusCircleOutlined />} 
                          onClick={() => remove(field.name)}
                          style={{ flexShrink: 0 }}
                        />
                      )}
                    </Space>
                  ))}
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusOutlined />}
                    size="large"
                    style={{ marginTop: '8px' }}
                  >
                    Adicionar Material
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>
        </Card>

        {/* Passos */}
        <Card 
          title={
            <Space>
              <OrderedListOutlined style={{ color: '#13c2c2' }} />
              <span>Passo a Passo</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Alert
            message="Instruções"
            description="Descreva cada etapa da atividade de forma clara e sequencial"
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            style={{ marginBottom: '16px' }}
          />
          
          <Form.Item>
            <Form.List name="steps">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 16, width: '100%' }} align="start">
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: '#fff',
                        fontSize: '16px',
                        flexShrink: 0
                      }}>
                        {index + 1}
                      </div>
                      <Form.Item
                        {...field}
                        rules={[{ required: true, message: 'Descreva este passo' }]}
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <TextArea 
                          placeholder={`Descreva o passo ${index + 1}...`} 
                          rows={2}
                          size="large"
                        />
                      </Form.Item>
                      {fields.length > 1 && (
                        <Button 
                          type="text" 
                          danger 
                          icon={<MinusCircleOutlined />} 
                          onClick={() => remove(field.name)}
                          style={{ flexShrink: 0 }}
                        />
                      )}
                    </Space>
                  ))}
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusOutlined />}
                    size="large"
                    style={{ marginTop: '8px' }}
                  >
                    Adicionar Passo
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>
        </Card>

        {/* Conteúdo Adicional */}
        <Card 
          title="Informações Complementares"
          style={{ marginBottom: '24px' }}
        >
          <Form.Item
            name="content"
            label="Conteúdo Adicional (Markdown)"
            rules={[{ required: true, message: 'Insira informações adicionais' }]}
            tooltip="Adicione dicas, observações ou informações extras"
          >
            <TextArea 
              rows={10} 
              placeholder="## Dicas\n\n- Dica 1\n- Dica 2\n\n## Variações\n\nDescreva variações possíveis..." 
              style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.6' }} 
            />
          </Form.Item>
        </Card>

        {/* Publicação */}
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '500', marginBottom: '4px' }}>Status de Publicação</div>
              <div style={{ fontSize: '13px', color: '#8c8c8c' }}>
                Atividades em rascunho só são visíveis para você
              </div>
            </div>
            <Form.Item
              name="published"
              valuePropName="checked"
              style={{ margin: 0 }}
            >
              <Switch 
                checkedChildren="Publicado" 
                unCheckedChildren="Rascunho"
                style={{ width: '90px' }}
              />
            </Form.Item>
          </div>
        </Card>

        {/* Botões de Ação */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button 
              onClick={() => navigate('/professional/atividades')}
              size="large"
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
              style={{ minWidth: '160px' }}
            >
              {isEditing ? 'Atualizar Atividade' : 'Publicar Atividade'}
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
};

export default ActivityForm;
