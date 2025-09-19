import { CSSProperties } from 'react';
import { ButtonProps } from 'antd';

export const defaultButtonStyle: CSSProperties = {
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  transition: 'all 0.3s ease',
};

export const gradientSelectionButtonStyle = (isSelected: boolean): ButtonProps => ({
  type: isSelected ? 'primary' : 'default',
  style: {
    ...defaultButtonStyle,
    ...(isSelected ? {
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      color: 'white',
    } : {
      color: '#111827',
      borderColor: '#667eea',
    }),
  }
});