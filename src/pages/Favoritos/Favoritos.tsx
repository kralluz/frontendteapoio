import React from 'react';
import { Typography, Card, Empty, List } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Favoritos: React.FC = () => {
  // Mock data para favoritos
  const favoritos = [
    { id: 1, title: 'Atividade de Matemática Básica', description: 'Exercícios de adição e subtração' },
    { id: 2, title: 'História Interativa', description: 'Aprenda sobre a história do Brasil' },
    { id: 3, title: 'Jogo de Memória', description: 'Treine sua memória com cartas' },
  ];

  return (
    <div>
      <Title level={2}>
        <StarOutlined style={{ marginRight: 8 }} />
        Meus Favoritos
      </Title>

      {favoritos.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={favoritos}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={item.title}
                hoverable
                style={{ marginBottom: 16 }}
              >
                <p>{item.description}</p>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty
          description="Você ainda não tem favoritos"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </div>
  );
};

export default Favoritos;