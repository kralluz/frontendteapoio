import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Upload, Switch, message, Card, Space, Typography, Row, Col, Alert, InputNumber } from 'antd';
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined, InfoCircleOutlined, FileImageOutlined, FileTextOutlined } from '@ant-design/icons';
import { articleService } from '../../services/articleService';
import api from '../../services/api';
import './ArticleForm.css';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const ArticleForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      loadArticle();
    }
  }, [id]);

  const loadArticle = async () => {
    try {
      const article = await articleService.getById(id!);

      form.setFieldsValue({
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        category: article.category,
        readTime: article.readTime,
        published: article.published,
      });

      if (article.image) {
        setImageUrl(article.image);
      }
    } catch (error) {
      message.error('Erro ao carregar artigo');
      navigate('/professional/artigos');
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
      const response = await api.post('/upload/article', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setImageUrl(response.data.url);
      message.success('Imagem enviada com sucesso!');
      return false; // Prevent default upload behavior
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
        await articleService.update(id!, data);
        message.success('Artigo atualizado com sucesso');
      } else {
        await articleService.create(data);
        message.success('Artigo criado com sucesso');
      }
      navigate('/professional/artigos');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao salvar artigo');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Diagnóstico',
    'Tratamento',
    'Educação',
    'Comportamento',
    'Desenvolvimento',
    'Família',
    'Direitos',
    'Pesquisas',
    'Dicas',
    'Outros'
  ];

  return (
    <div className="article-form-page">
      {/* Header */}
      <div className="article-form-header">
        <Space align="start">
          <Button 
            className="article-form-back-btn"
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/professional/artigos')}
            size="large"
          />
          <div>
            <Title level={2} className="article-form-title">
              {isEditing ? 'Editar Artigo' : 'Novo Artigo'}
            </Title>
            <div className="article-form-subtitle">
              {isEditing ? 'Atualize as informações do seu artigo' : 'Compartilhe seu conhecimento com a comunidade'}
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
          readTime: 5,
        }}
      >
        {/* Informações Básicas */}
        <Card 
          className="article-form-card"
          title={
            <Space>
              <FileTextOutlined style={{ color: '#1890ff' }} />
              <span className="article-form-card-title">Informações Básicas</span>
            </Space>
          }
        >
          <Form.Item
            name="title"
            label="Título"
            rules={[{ required: true, message: 'Insira um título atrativo' }]}
            tooltip="Escolha um título chamativo e descritivo"
          >
            <Input 
              placeholder="Ex: Como identificar sinais de autismo em crianças" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="Resumo"
            tooltip="Um resumo que aparecerá nos cards de prévia"
          >
            <TextArea 
              rows={3} 
              placeholder="Escreva um resumo envolvente que incentive a leitura..." 
              showCount
              maxLength={200}
              size="large"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={16}>
              <Form.Item
                name="category"
                label="Categoria"
                rules={[{ required: true, message: 'Selecione uma categoria' }]}
              >
                <Select placeholder="Escolha a categoria" size="large">
                  {categories.map(cat => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="readTime"
                label="Tempo de Leitura"
                rules={[{ required: true, message: 'Insira' }]}
                tooltip="Tempo estimado em minutos"
              >
                <InputNumber
                  min={1}
                  placeholder="5"
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Imagem de Capa */}
        <Card 
          className="article-form-card"
          title={
            <Space>
              <FileImageOutlined style={{ color: '#52c41a' }} />
              <span className="article-form-card-title">Imagem de Capa</span>
            </Space>
          }
        >
          <Alert
            message="Dica"
            description="Use imagens de alta qualidade (máx 5MB). Formatos: JPG, PNG, GIF ou WebP"
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
            <div className="article-form-image-preview">
              <img 
                src={imageUrl} 
                alt="Preview"
              />
              <div className="article-form-image-info">
                <span className="article-form-image-success">✓ Imagem carregada</span>
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

        {/* Conteúdo */}
        <Card 
          className="article-form-card"
          title={
            <Space>
              <FileTextOutlined style={{ color: '#722ed1' }} />
              <span className="article-form-card-title">Conteúdo do Artigo</span>
            </Space>
          }
        >
          <Alert
            message="Markdown Suportado"
            description="Use # para títulos, ** para negrito, * para itálico, - para listas, etc."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            style={{ marginBottom: '16px' }}
          />
          
          <Form.Item
            name="content"
            rules={[{ required: true, message: 'Insira o conteúdo do artigo' }]}
          >
            <TextArea 
              rows={20} 
              placeholder="# Título Principal\n\n## Introdução\n\nEscreva aqui o conteúdo do seu artigo...\n\n### Subtítulo\n\n- Ponto importante 1\n- Ponto importante 2\n\n**Texto em negrito** e *texto em itálico*" 
              style={{ 
                fontFamily: 'monospace', 
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            />
          </Form.Item>
        </Card>

        {/* Publicação */}
        <Card className="article-form-card">
          <div className="article-form-publish-section">
            <div className="article-form-publish-info">
              <div className="article-form-publish-title">Status de Publicação</div>
              <div className="article-form-publish-desc">
                Artigos em rascunho só são visíveis para você
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
        <Card className="article-form-card">
          <div className="article-form-actions">
            <Button 
              onClick={() => navigate('/professional/artigos')}
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
              style={{ minWidth: '140px' }}
            >
              {isEditing ? 'Atualizar Artigo' : 'Publicar Artigo'}
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
};

export default ArticleForm;
