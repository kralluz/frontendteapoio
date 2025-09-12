import React from 'react';

interface TeamMember {
  name: string;
  role: string;
  description: string;
}

const About: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "João Silva",
      role: "Frontend Developer",
      description: "Especialista em React e TypeScript com 5 anos de experiência."
    },
    {
      name: "Maria Santos",
      role: "UI/UX Designer",
      description: "Designer apaixonada por criar experiências de usuário incríveis."
    },
    {
      name: "Pedro Costa",
      role: "Full Stack Developer",
      description: "Desenvolvedor versátil com experiência em Node.js e React."
    }
  ];

  return (
    <div className="page">
      <h1>Sobre Nós</h1>
      <p>
        Somos uma equipe dedicada a criar soluções web modernas e eficientes.
        Utilizamos as melhores práticas e tecnologias mais recentes para
        entregar produtos de qualidade.
      </p>
      
      <h2>Nossa Missão</h2>
      <p>
        Transformar ideias em realidade através de código limpo, design
        intuitivo e tecnologias inovadoras. Acreditamos que a tecnologia
        deve ser acessível e útil para todos.
      </p>
      
      <h2>Nossa Equipe</h2>
      <div className="features">
        {teamMembers.map((member: TeamMember, index: number) => (
          <div key={index} className="feature">
            <h3>{member.name}</h3>
            <h4 style={{ color: '#667eea', marginBottom: '10px' }}>{member.role}</h4>
            <p>{member.description}</p>
          </div>
        ))}
      </div>
      
      <h2>Tecnologias que Utilizamos</h2>
      <ul>
        <li>React 18 com TypeScript</li>
        <li>React Router DOM</li>
        <li>CSS3 e Flexbox/Grid</li>
        <li>Node.js e Express</li>
        <li>MongoDB e PostgreSQL</li>
        <li>Git e GitHub</li>
      </ul>
    </div>
  );
};

export default About;