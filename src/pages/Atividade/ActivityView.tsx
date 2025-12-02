import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

/**
 * Placeholder component for ActivityView.
 * The purpose of this component is unclear as AtividadePage.tsx already provides a detailed view of an activity.
 * This file was created to resolve a "missing file" bug.
 */
const ActivityView: React.FC = () => {
  return (
    <Card>
      <Title level={2}>Activity View</Title>
      <Text>This is a placeholder for the ActivityView component.</Text>
    </Card>
  );
};

export default ActivityView;
