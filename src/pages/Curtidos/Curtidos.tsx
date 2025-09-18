import React from 'react';
import { Typography, Card, Empty, List } from 'antd';
import { HeartOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Curtidos: React.FC = () => {
  // Mock data para curtidos
  const curtidos = [
    { id: 1, title: 'Vídeo Educativo de Ciências', description: 'Experimentos divertidos de química' },
    { id: 2, title: 'Música Relaxante', description: 'Músicas para momentos de calma' },
    { id: 3, title: 'Jogo Educativo', description: 'Aprenda brincando' },
  ];

  return (
    <div>
      <Title level={2}>
        <HeartOutlined style={{ marginRight: 8, color: '#ff4d4f' }} />
        Meus Curtidos
      </Title>

      {curtidos.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={curtidos}
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
          description="Você ainda não curtiu nenhum conteúdo"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </div>
  );
};

export default Curtidos;