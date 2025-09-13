import React, { useState } from 'react';

const Login: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email.trim() || !form.password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    // Simulação de login (substitua por chamada de API real)
    if (form.email === 'admin@email.com' && form.password === '123456') {
      setIsSubmitted(true);
      setForm({ email: '', password: '' });
      setTimeout(() => setIsSubmitted(false), 3000);
    } else {
      setError('Email ou senha inválidos.');
    }
  };

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          padding: 32,
          width: 350,
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}
      >
        <h2 style={{ color: '#667eea', marginBottom: 16, textAlign: 'center' }}>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            padding: '10px',
            border: error ? '2px solid #d32f2f' : '1px solid #667eea',
            borderRadius: 4,
            marginBottom: 8
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
          required
          style={{
            padding: '10px',
            border: error ? '2px solid #d32f2f' : '1px solid #667eea',
            borderRadius: 4,
            marginBottom: 8
          }}
        />
        {error && (
          <div style={{ color: '#d32f2f', marginBottom: 8, textAlign: 'center' }}>{error}</div>
        )}
        {isSubmitted && (
          <div style={{
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            color: '#155724',
            padding: '12px',
            borderRadius: '5px',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Login realizado com sucesso!
          </div>
        )}
        <button
          type="submit"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            padding: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: 8,
            fontSize: '16px',
            transition: 'transform 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >Entrar</button>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <a href="/register" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>
            Não tem uma conta? Cadastre-se
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;