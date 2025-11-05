import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Upload, Switch, message, Card, Space, InputNumber } from 'antd';
import { UploadOutlined, SaveOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { TextArea } = Input;
const { Option } = Select;

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
      const response = await api.get(`/activities/${id}`);
      const activity = response.data;

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
        await api.put(`/activities/${id}`, data);
        message.success('Atividade atualizada com sucesso');
      } else {
        await api.post('/activities', data);
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
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card title={isEditing ? 'Editar Atividade' : 'Nova Atividade'}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            published: false,
            duration: 30,
            materials: [''],
            steps: [''],
          }}
        >
          <Form.Item
            name="title"
            label="Título"
            rules={[{ required: true, message: 'Por favor, insira o título' }]}
          >
            <Input size="large" placeholder="Título da atividade" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descrição Breve"
            rules={[{ required: true, message: 'Por favor, insira a descrição' }]}
          >
            <TextArea rows={2} placeholder="Breve descrição da atividade" />
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="category"
              label="Categoria"
              rules={[{ required: true, message: 'Selecione a categoria' }]}
              style={{ width: '200px' }}
            >
              <Select size="large" placeholder="Categoria">
                {categories.map(cat => (
                  <Option key={cat} value={cat}>{cat}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="difficulty"
              label="Dificuldade"
              rules={[{ required: true, message: 'Selecione a dificuldade' }]}
              style={{ width: '150px' }}
            >
              <Select size="large" placeholder="Dificuldade">
                {difficulties.map(diff => (
                  <Option key={diff} value={diff}>{diff}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="ageRange"
              label="Faixa Etária"
              rules={[{ required: true, message: 'Selecione a faixa etária' }]}
              style={{ width: '200px' }}
            >
              <Select size="large" placeholder="Idade">
                {ageRanges.map(age => (
                  <Option key={age} value={age}>{age}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="duration"
              label="Duração (minutos)"
              rules={[{ required: true, message: 'Insira a duração' }]}
              style={{ width: '150px' }}
            >
              <InputNumber size="large" min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Form.Item label="Imagem">
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

          <Form.Item label="Materiais Necessários">
            <Form.List name="materials">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...field}
                        rules={[{ required: true, message: 'Insira o material' }]}
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <Input placeholder={`Material ${index + 1}`} size="large" />
                      </Form.Item>
                      {fields.length > 1 && (
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      )}
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Adicionar Material
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item label="Passos da Atividade">
            <Form.List name="steps">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <span style={{ fontWeight: 'bold' }}>{index + 1}.</span>
                      <Form.Item
                        {...field}
                        rules={[{ required: true, message: 'Insira o passo' }]}
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <TextArea placeholder={`Passo ${index + 1}`} rows={2} />
                      </Form.Item>
                      {fields.length > 1 && (
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      )}
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Adicionar Passo
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item
            name="content"
            label="Conteúdo Adicional"
            rules={[{ required: true, message: 'Insira o conteúdo' }]}
          >
            <TextArea rows={10} placeholder="Informações adicionais sobre a atividade (Markdown)" />
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
                {isEditing ? 'Atualizar' : 'Criar'} Atividade
              </Button>
              <Button size="large" onClick={() => navigate('/professional/atividades')}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ActivityForm;
