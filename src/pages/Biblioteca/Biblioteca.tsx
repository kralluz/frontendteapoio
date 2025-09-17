import React from 'react';
import { Card, Row, Col, Input } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import './Biblioteca.css';

// Simulação de dados de conteúdos
const conteudos = [
  {
    id: 1,
    titulo: 'Guia para Pais: Primeiros Passos no TEA',
    descricao: 'Orientações iniciais para famílias que receberam o diagnóstico.',
    autor: 'Maria Santos',
    visualizacoes: 320,
  },
  {
    id: 2,
    titulo: 'Comunicação Alternativa e Aumentativa',
    descricao: 'Recursos e estratégias para apoiar a comunicação.',
    autor: 'João Silva',
    visualizacoes: 210,
  },
  {
    id: 3,
    titulo: 'Rotina Visual: Como Montar',
    descricao: 'Passo a passo para criar rotinas visuais eficazes.',
    autor: 'Pedro Costa',
    visualizacoes: 150,
  },
];

const Biblioteca: React.FC = () => {
  return (
    <div className="page biblioteca-page">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Biblioteca de Conteúdos</h1>
      <p className="text-gray-600 mb-8">Explore materiais, artigos e guias para apoiar o desenvolvimento e inclusão de pessoas com TEA.</p>
      <Input.Search
        placeholder="Buscar conteúdo..."
        allowClear
        className="biblioteca-search mb-8"
        size="large"
        onSearch={() => {/* implementar busca futura */}}
      />
      <Row gutter={[24, 24]}>
        {conteudos.map(conteudo => (
          <Col xs={24} sm={12} md={8} key={conteudo.id}>
            <Card
              className="feature-card border-0 shadow-sm hover:shadow-lg transition-shadow"
              title={<span className="flex items-center gap-2 text-lg font-bold text-indigo-700"><BookOutlined /> {conteudo.titulo}</span>}
            >
              <p className="text-gray-600 mb-2">{conteudo.descricao}</p>
              <span className="text-xs text-gray-400">Autor: {conteudo.autor}</span><br />
              <span className="text-xs text-gray-400">{conteudo.visualizacoes} visualizações</span>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Biblioteca;
