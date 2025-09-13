import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (validateForm()) {
      // Aqui você faria a chamada para a API
      console.log('Formulário enviado:', formData);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="page">
      <h1>Entre em Contato</h1>
      <p>
        Tem alguma dúvida ou sugestão? Adoraríamos ouvir de você!
        Preencha o formulário abaixo e entraremos em contato em breve.
      </p>
      
      {isSubmitted && (
        <div style={{
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          color: '#155724',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          Mensagem enviada com sucesso! Entraremos em contato em breve.
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Nome:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: errors.name ? '2px solid #dc3545' : '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
          {errors.name && (
            <span style={{ color: '#dc3545', fontSize: '14px' }}>{errors.name}</span>
          )}
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: errors.email ? '2px solid #dc3545' : '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
          {errors.email && (
            <span style={{ color: '#dc3545', fontSize: '14px' }}>{errors.email}</span>
          )}
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Mensagem:
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: errors.message ? '2px solid #dc3545' : '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '16px',
              resize: 'vertical'
            }}
          />
          {errors.message && (
            <span style={{ color: '#dc3545', fontSize: '14px' }}>{errors.message}</span>
          )}
        </div>
        
        <button
          type="submit"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '12px 30px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Enviar Mensagem
        </button>
      </form>
      
      <div style={{ marginTop: '40px' }}>
        <h2>Outras Formas de Contato</h2>
        <div className="features">
          <div className="feature">
            <h3>📧 Email</h3>
            <p>contato@exemplo.com</p>
          </div>
          
          <div className="feature">
            <h3>📱 Telefone</h3>
            <p>(11) 99999-9999</p>
          </div>
          
          <div className="feature">
            <h3>📍 Localização</h3>
            <p>São Paulo, SP - Brasil</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;