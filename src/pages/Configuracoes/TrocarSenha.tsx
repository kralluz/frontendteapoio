import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

/**
 * Placeholder component for TrocarSenha.
 * The functionality to change the password has already been implemented as a modal in the Configuracoes.tsx page.
 * This file was created to resolve a "missing file" bug.
 */
const TrocarSenha: React.FC = () => {
  return (
    <Card>
      <Title level={2}>Trocar Senha</Title>
      <Text>This is a placeholder for the TrocarSenha component.</Text>
      <Text>The functionality to change the password is in the Configuracoes page.</Text>
    </Card>
  );
};

export default TrocarSenha;
