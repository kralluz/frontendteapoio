import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const ProfessionalRegister: React.FC = () => {
  const { registerProfessional } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    crp: '',
    specialty: ''
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
    
    if (!form.email.trim() || !form.password.trim() || !form.name.trim() || !form.crp.trim() || !form.specialty.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await registerProfessional(form);
      navigate('/biblioteca');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
        color: 'white',
        padding: '2rem'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Cadastro Profissional</h1>
        <p style={{ fontSize: '1.2rem', marginTop: '1rem', textAlign: 'center' }}>
          Junte-se à nossa comunidade de profissionais e ajude a fazer a diferença.
        </p>
      </div>
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '2.5rem',
            width: 400,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          <h2 style={{ color: '#333', marginBottom: 0, textAlign: 'center', fontSize: '1.8rem' }}>Crie sua Conta</h2>
          <input
            type="text"
            name="name"
            placeholder="Nome Completo"
            value={form.name}
            onChange={handleChange}
            required
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: '1rem'
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: '1rem'
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
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: '1rem'
            }}
          />
          <input
            type="text"
            name="crp"
            placeholder="CRP ou CRM"
            value={form.crp}
            onChange={handleChange}
            required
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: '1rem'
            }}
          />
          <input
            type="text"
            name="specialty"
            placeholder="Especialidade"
            value={form.specialty}
            onChange={handleChange}
            required
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: '1rem'
            }}
          />
          {error && (
            <div style={{ color: '#d32f2f', textAlign: 'center' }}>{error}</div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: isLoading ? '#ccc' : 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '14px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '1.1rem',
              transition: 'opacity 0.2s'
            }}
          >
            {isLoading ? 'Criando conta...' : 'Cadastrar'}
          </button>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>
              Já tem uma conta? Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalRegister;
