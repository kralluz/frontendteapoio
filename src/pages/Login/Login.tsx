import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(form);
      // Redirecionar baseado no tipo de usuário
      if (response?.role === 'PROFESSIONAL') {
        navigate('/professional/dashboard');
      } else {
        navigate('/biblioteca');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email ou senha incorretos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      flexDirection: window.innerWidth <= 768 ? 'column' : 'row'
    }}>
      <div style={{
        flex: window.innerWidth <= 768 ? 'none' : 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: window.innerWidth <= 768 ? '2rem 1rem' : '2rem',
        minHeight: window.innerWidth <= 768 ? '200px' : 'auto'
      }}>
        <h1 style={{
          fontSize: window.innerWidth <= 480 ? '2rem' : window.innerWidth <= 768 ? '2.5rem' : '3rem',
          fontWeight: 'bold',
          margin: 0
        }}>
          TeApoio
        </h1>
        <p style={{
          fontSize: window.innerWidth <= 480 ? '0.95rem' : window.innerWidth <= 768 ? '1rem' : '1.2rem',
          marginTop: '1rem',
          textAlign: 'center',
          maxWidth: '90%'
        }}>
          Apoio e recursos para a comunidade autista.
        </p>
      </div>
      <div style={{
        flex: window.innerWidth <= 768 ? 'none' : 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: window.innerWidth <= 768 ? '2rem 1rem' : '2rem'
      }}>
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: window.innerWidth <= 480 ? '1.5rem' : window.innerWidth <= 768 ? '2rem' : '2.5rem',
            width: '100%',
            maxWidth: window.innerWidth <= 480 ? '100%' : 400,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          <h2 style={{
            color: '#333',
            marginBottom: 0,
            textAlign: 'center',
            fontSize: window.innerWidth <= 480 ? '1.5rem' : '1.8rem'
          }}>
            Login
          </h2>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              padding: window.innerWidth <= 480 ? '10px' : '12px',
              border: error ? '1px solid #d32f2f' : '1px solid #ddd',
              borderRadius: 4,
              fontSize: window.innerWidth <= 480 ? '0.95rem' : '1rem',
              width: '100%',
              boxSizing: 'border-box'
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
              padding: window.innerWidth <= 480 ? '10px' : '12px',
              border: error ? '1px solid #d32f2f' : '1px solid #ddd',
              borderRadius: 4,
              fontSize: window.innerWidth <= 480 ? '0.95rem' : '1rem',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
          {error && (
            <div style={{
              color: '#d32f2f',
              textAlign: 'center',
              fontSize: window.innerWidth <= 480 ? '0.9rem' : '1rem'
            }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: window.innerWidth <= 480 ? '12px' : '14px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: window.innerWidth <= 480 ? '1rem' : '1.1rem',
              transition: 'opacity 0.2s',
              width: '100%'
            }}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
          <div style={{
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: window.innerWidth <= 480 ? '0.9rem' : '1rem'
          }}>
            <Link
              to="/register"
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'block',
                marginBottom: '0.75rem'
              }}
            >
              Não tem uma conta? Cadastre-se
            </Link>
            <Link
              to="/register/professional"
              style={{
                color: '#764ba2',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'block'
              }}
            >
              É um profissional da saúde? Cadastre-se aqui
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;