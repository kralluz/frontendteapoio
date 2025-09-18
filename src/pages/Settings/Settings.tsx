import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="page">
      <h1>Configurações</h1>
      <p>Aqui você pode ajustar suas preferências e configurações da conta.</p>
      {/* Adicione opções de configuração conforme necessário */}
      <ul style={{ marginTop: 24, textAlign: 'left', maxWidth: 400 }}>
        <li>Alterar senha</li>
        <li>Notificações</li>
        <li>Privacidade</li>
        <li>Idioma</li>
      </ul>
    </div>
  );
};

export default Settings;