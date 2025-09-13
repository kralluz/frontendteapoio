import React from 'react';
import { Card, Button, Layout, Row, Col } from 'antd';
import { UserOutlined, BookOutlined, AppstoreOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './Dashboard.css';

// Simulação de dados de usuário
const userName = 'João';

// Simulação de dados de artigos e atividades
const highlights = [
  {
    id: 1,
    type: 'article',
    title: 'Como estimular a comunicação em crianças TEA',
    description: 'Dicas práticas para promover o desenvolvimento da fala e interação social.',
    stats: '245 visualizações',
  },
  {
    id: 2,
    type: 'activity',
    title: 'Atividade Sensorial: Caixa de Texturas',
    description: 'Exercício divertido para trabalhar percepção tátil e foco.',
    stats: '120 curtidas',
  },
  {
    id: 3,
    type: 'article',
    title: 'Estratégias para rotina escolar',
    description: 'Como adaptar o ambiente escolar para crianças com TEA.',
    stats: '180 visualizações',
  },
];

const Dashboard: React.FC = () => {
  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Layout.Header className="bg-white shadow flex items-center px-6 py-2">
        <span className="text-2xl font-bold text-indigo-600">TEApoio</span>
      </Layout.Header>
      <Layout.Content className="container mx-auto py-8 px-4">
        {/* Saudação */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Bem-vindo, {userName}!</h1>
          <p className="text-gray-500">Seu hub de recursos e atividades para apoio ao TEA.</p>
        </div>
        {/* Botões de destaque */}
        <Row gutter={[24, 24]} className="mb-10" justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card
              className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-r from-indigo-100 to-purple-100"
              title={<span className="flex items-center gap-2 text-lg font-bold text-indigo-700"><BookOutlined /> Biblioteca de Conteúdos</span>}
              actions={[
                <Button type="primary" className="w-full" href="/biblioteca" key="biblioteca">Acessar</Button>,
              ]}
            >
              <p className="text-gray-600">Explore artigos, guias e materiais para apoiar o desenvolvimento.</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-r from-purple-100 to-indigo-100"
              title={<span className="flex items-center gap-2 text-lg font-bold text-purple-700"><AppstoreOutlined /> Banco de Atividades</span>}
              actions={[
                <Button type="primary" className="w-full bg-purple-600" href="/atividades" key="atividades">Acessar</Button>,
              ]}
            >
              <p className="text-gray-600">Encontre atividades práticas para aplicar no dia a dia.</p>
            </Card>
          </Col>
        </Row>
        {/* Destaques */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Destaques</h2>
          <Row gutter={[24, 24]}>
            {highlights.map(item => (
              <Col xs={24} sm={12} md={8} key={item.id}>
                <Card
                  className="feature-card border-0 shadow-sm hover:shadow-lg transition-shadow"
                  title={<span className="flex items-center gap-2 text-lg font-bold text-indigo-700">
                    {item.type === 'article' ? <BookOutlined /> : <AppstoreOutlined />} {item.title}
                  </span>}
                  actions={[
                    <Button type="default" className="w-full" href={`/${item.type}/${item.id}`}>Ver mais</Button>,
                  ]}
                >
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  <span className="text-xs text-gray-400">{item.stats}</span>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default Dashboard;
