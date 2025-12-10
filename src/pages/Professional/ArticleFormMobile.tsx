import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Upload, Switch, message, InputNumber } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, CameraOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { articleService } from '../../services/articleService';
import api from '../../services/api';

const { TextArea } = Input;
const { Option } = Select;

const ArticleFormMobile: React.FC = () => {
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
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error('A imagem deve ter no máximo 5MB');
      return false;
    }

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
      message.success('Imagem enviada!');
      return false;
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      message.error(error.response?.data?.message || 'Erro ao enviar imagem');
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const data = {
      ...values,
      ...(imageUrl && { image: imageUrl }),
    };

    try {
      if (isEditing) {
        await articleService.update(id!, data);
        message.success('Artigo atualizado!');
      } else {
        await articleService.create(data);
        message.success('Artigo criado!');
      }
      navigate('/professional/artigos');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao salvar');
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      paddingBottom: '80px'
    }}>
      {/* Header fixo */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/professional/artigos')}
          style={{ padding: '4px 8px' }}
        />
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
            {isEditing ? 'Editar Artigo' : 'Novo Artigo'}
          </h2>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          published: true,
          readTime: 5,
        }}
        style={{ padding: '16px' }}
      >
        {/* Título */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
          <Form.Item
            name="title"
            label={<span style={{ fontSize: '14px', fontWeight: 600 }}>Título</span>}
            rules={[{ required: true, message: 'Insira um título' }]}
            style={{ marginBottom: 0 }}
          >
            <Input
              placeholder="Ex: Como identificar sinais de autismo..."
              size="large"
              style={{ fontSize: '15px' }}
            />
          </Form.Item>
        </div>

        {/* Resumo */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
          <Form.Item
            name="excerpt"
            label={<span style={{ fontSize: '14px', fontWeight: 600 }}>Resumo</span>}
            style={{ marginBottom: 0 }}
          >
            <TextArea
              rows={3}
              placeholder="Breve descrição do artigo..."
              showCount
              maxLength={200}
              style={{ fontSize: '15px' }}
            />
          </Form.Item>
        </div>

        {/* Categoria e Tempo */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
          <Form.Item
            name="category"
            label={<span style={{ fontSize: '14px', fontWeight: 600 }}>Categoria</span>}
            rules={[{ required: true, message: 'Selecione' }]}
          >
            <Select placeholder="Escolha a categoria" size="large">
              {categories.map(cat => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="readTime"
            label={<span style={{ fontSize: '14px', fontWeight: 600 }}>Tempo de Leitura (min)</span>}
            rules={[{ required: true, message: 'Insira' }]}
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              min={1}
              placeholder="5"
              style={{ width: '100%' }}
              size="large"
            />
          </Form.Item>
        </div>

        {/* Imagem */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
            Imagem de Capa
          </div>

          {imageUrl ? (
            <div>
              <div style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '12px'
              }}>
                <img
                  src={imageUrl}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  color: '#fff',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircleOutlined /> Carregada
                </div>
              </div>
              <Button
                danger
                block
                onClick={() => setImageUrl('')}
                size="large"
              >
                Remover Imagem
              </Button>
            </div>
          ) : (
            <Upload
              beforeUpload={handleImageUpload}
              maxCount={1}
              showUploadList={false}
              accept="image/*"
            >
              <Button
                icon={<CameraOutlined />}
                loading={uploading}
                size="large"
                block
                style={{
                  height: '120px',
                  border: '2px dashed #d9d9d9',
                  backgroundColor: '#fafafa',
                  fontSize: '15px'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  {uploading ? 'Enviando...' : (
                    <>
                      <CameraOutlined style={{ fontSize: '32px', color: '#999' }} />
                      <span>Adicionar Imagem</span>
                      <span style={{ fontSize: '12px', color: '#999' }}>Máx 5MB</span>
                    </>
                  )}
                </div>
              </Button>
            </Upload>
          )}
        </div>

        {/* Conteúdo */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
            Conteúdo
          </div>
          <div style={{
            fontSize: '12px',
            color: '#666',
            marginBottom: '12px',
            padding: '8px',
            backgroundColor: '#f0f7ff',
            borderRadius: '4px',
            borderLeft: '3px solid #1890ff'
          }}>
            💡 Use # para títulos, ** para negrito, * para itálico
          </div>

          <Form.Item
            name="content"
            rules={[{ required: true, message: 'Insira o conteúdo' }]}
            style={{ marginBottom: 0 }}
          >
            <TextArea
              rows={15}
              placeholder="# Título Principal&#10;&#10;## Introdução&#10;&#10;Escreva seu artigo aqui...&#10;&#10;- Ponto 1&#10;- Ponto 2"
              style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            />
          </Form.Item>
        </div>

        {/* Status */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>Publicar</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Rascunhos ficam privados
            </div>
          </div>
          <Form.Item
            name="published"
            valuePropName="checked"
            style={{ margin: 0 }}
          >
            <Switch
              checkedChildren="Sim"
              unCheckedChildren="Não"
            />
          </Form.Item>
        </div>
      </Form>

      {/* Botões fixos no rodapé */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTop: '1px solid #e0e0e0',
        padding: '12px 16px',
        display: 'flex',
        gap: '12px',
        zIndex: 100
      }}>
        <Button
          onClick={() => navigate('/professional/artigos')}
          size="large"
          style={{ flex: 1 }}
        >
          Cancelar
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          onClick={() => form.submit()}
          icon={<SaveOutlined />}
          size="large"
          style={{ flex: 2 }}
        >
          {isEditing ? 'Atualizar' : 'Publicar'}
        </Button>
      </div>
    </div>
  );
};

export default ArticleFormMobile;
