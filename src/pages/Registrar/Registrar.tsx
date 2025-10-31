import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Registrar = () => {
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
                <h2 style={{ color: '#667eea', marginBottom: 16, textAlign: 'center' }}>Cadastro</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Nome"
                    value={form.name}
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
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirme a senha"
                    value={form.confirmPassword}
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
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        padding: '12px',
                        fontWeight: 'bold',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        marginTop: 8,
                        fontSize: '16px',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={e => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >{isLoading ? 'Cadastrando...' : 'Cadastrar'}</button>
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                    <a href="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>
                        Já tem uma conta? Login
                    </a>
                </div>
            </form>
        </div>
    );
};

export default Registrar;
