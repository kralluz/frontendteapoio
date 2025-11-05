import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Upload, Switch, message, Card, Space } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { TextArea } = Input;
const { Option } = Select;

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
      const response = await api.get(`/articles/${id}`);
      const article = response.data;

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
        await api.put(`/articles/${id}`, data);
        message.success('Artigo atualizado com sucesso');
      } else {
        await api.post('/articles', data);
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
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card title={isEditing ? 'Editar Artigo' : 'Novo Artigo'}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            published: false,
            readTime: 5,
          }}
        >
          <Form.Item
            name="title"
            label="Título"
            rules={[{ required: true, message: 'Por favor, insira o título' }]}
          >
            <Input size="large" placeholder="Título do artigo" />
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="Resumo"
            rules={[{ required: false }]}
          >
            <TextArea rows={2} placeholder="Breve resumo do artigo" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Categoria"
            rules={[{ required: true, message: 'Por favor, selecione a categoria' }]}
          >
            <Select size="large" placeholder="Selecione a categoria">
              {categories.map(cat => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="readTime"
            label="Tempo de Leitura (minutos)"
            rules={[{ required: true, message: 'Por favor, insira o tempo de leitura' }]}
          >
            <Input type="number" size="large" min={1} />
          </Form.Item>

          <Form.Item label="Imagem de Capa">
            <Upload
              beforeUpload={handleImageUpload}
              maxCount={1}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                {uploading ? 'Enviando...' : 'Selecionar Imagem'}
              </Button>
            </Upload>
            {imageUrl && (
              <div style={{ marginTop: '16px' }}>
                <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} />
              </div>
            )}
          </Form.Item>

          <Form.Item
            name="content"
            label="Conteúdo"
            rules={[{ required: true, message: 'Por favor, insira o conteúdo' }]}
          >
            <TextArea rows={15} placeholder="Conteúdo do artigo em Markdown" />
          </Form.Item>

          <Form.Item
            name="published"
            label="Publicar"
            valuePropName="checked"
          >
            <Switch checkedChildren="Publicado" unCheckedChildren="Rascunho" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                size="large"
              >
                {isEditing ? 'Atualizar' : 'Criar'} Artigo
              </Button>
              <Button size="large" onClick={() => navigate('/professional/artigos')}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ArticleForm;
