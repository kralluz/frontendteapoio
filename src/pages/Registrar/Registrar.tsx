import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Registrar: React.FC = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
            setError('Preencha todos os campos.');
            return;
        }
        
        if (form.password !== form.confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }
        
        setIsLoading(true);
        
        try {
            await register({
                name: form.name,
                email: form.email,
                password: form.password
            });
            navigate('/biblioteca');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao criar conta.');
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '2rem'
            }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Crie sua Conta</h1>
                <p style={{ fontSize: '1.2rem', marginTop: '1rem', textAlign: 'center' }}>
                    Acesse um mundo de apoio e recursos.
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
                    <h2 style={{ color: '#333', marginBottom: 0, textAlign: 'center', fontSize: '1.8rem' }}>Cadastro</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome"
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
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirme a senha"
                        value={form.confirmPassword}
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
                            background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                        {isLoading ? 'Cadastrando...' : 'Cadastrar'}
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

export default Registrar;
