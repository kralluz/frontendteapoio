import { CSSProperties } from 'react';

export const gradientButtonStyle: CSSProperties = {
  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
  border: 'none',
  borderRadius: '8px',
  color: 'white',
  height: '40px',
  padding: '0 20px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'opacity 0.2s ease',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const gradientButtonHoverStyle: CSSProperties = {
  ...gradientButtonStyle,
  opacity: 0.9,
};