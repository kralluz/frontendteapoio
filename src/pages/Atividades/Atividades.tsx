import React from 'react';
import { Row, Col, Input, Tag } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import './Atividades.css';

// Simulação de dados de atividades
const atividades = [
  {
    id: 1,
    titulo: 'Caixa de Texturas',
    descricao: 'Atividade sensorial para estimular percepção tátil e foco.',
    tipo: 'Sensorial',
    faixaEtaria: '3-7 anos',
    curtidas: 120,
  },
  {
    id: 2,
    titulo: 'Sequência de Imagens',
    descricao: 'Ajuda na compreensão de rotinas e organização do tempo.',
    tipo: 'Cognitiva',
    faixaEtaria: '5-10 anos',
    curtidas: 85,
  },
  {
    id: 3,
    titulo: 'Jogo das Emoções',
    descricao: 'Trabalha reconhecimento e expressão de emoções.',
    tipo: 'Socioemocional',
    faixaEtaria: '6-12 anos',
    curtidas: 102,
  },
];

const Atividades: React.FC = () => {
  return (
    <div className="page atividades-page">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Banco de Atividades</h1>
      <p className="text-gray-600 mb-8">Encontre atividades práticas para aplicar no dia a dia, promovendo desenvolvimento e inclusão.</p>
      <Input.Search
        placeholder="Buscar atividade..."
        allowClear
        className="atividades-search mb-8"
        size="large"
        onSearch={() => {/* implementar busca futura */}}
      />
      <Row gutter={[24, 24]}>
        {atividades.map(atividade => (
          <Col xs={24} sm={12} md={8} key={atividade.id}>
            <div className="atividade-card">
              <div className="atividade-card-header">
                <span className="atividade-card-icon"><AppstoreOutlined /></span>
                <span className="atividade-card-title">{atividade.titulo}</span>
                <Tag color="purple" style={{ marginLeft: 'auto' }}>{atividade.tipo}</Tag>
              </div>
              <div className="atividade-card-body">
                <p className="atividade-card-desc">{atividade.descricao}</p>
                <span className="atividade-card-etaria">Faixa etária: {atividade.faixaEtaria}</span>
              </div>
              <div className="atividade-card-footer">
                <button className="atividade-like-btn" title="Curtir">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#764ba2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21s-4.35-3.36-7.07-6.09C2.07 12.05 2 9.13 4.11 7.02c1.78-1.78 4.67-1.78 6.45 0L12 8.46l1.44-1.44c1.78-1.78 4.67-1.78 6.45 0 2.11 2.11 2.04 5.03-.82 7.89C16.35 17.64 12 21 12 21z" />
                  </svg>
                  <span className="atividade-like-count">{atividade.curtidas}</span>
                </button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Atividades;
