import React, { useState, useEffect } from 'react';
import {
  Card, Button, Tag, Avatar, Space, Typography,
  Breadcrumb, message, Affix
} from 'antd';
import {
  HeartOutlined, HeartFilled, StarOutlined, StarFilled,
  EyeOutlined, ClockCircleOutlined, ShareAltOutlined,
  MessageOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { Title, Text, Paragraph } = Typography;

// Dados mock dos artigos (mesmos da biblioteca)
const mockArticles = [
  {
    id: 1,
    title: 'Guia Completo para Pais: Primeiros Passos no TEA',
    excerpt: 'Descubra as estratégias essenciais para apoiar seu filho no espectro do autismo...',
    content: `
# Guia Completo para Pais: Primeiros Passos no TEA

## Introdução

Receber o diagnóstico de Transtorno do Espectro Autista (TEA) para seu filho pode ser um momento desafiador, mas também uma oportunidade de crescimento e aprendizado. Este guia foi desenvolvido para oferecer orientações práticas e baseadas em evidências científicas para os primeiros passos após o diagnóstico.

## Entendendo o Diagnóstico

O TEA é um transtorno neurodesenvolvimental caracterizado por diferenças na comunicação, interação social e comportamentos repetitivos ou restritos. É importante entender que cada pessoa com TEA é única, com seus próprios pontos fortes, desafios e necessidades individuais.

### Pontos importantes sobre o diagnóstico:
- **Não é uma doença**: O TEA é uma condição neurológica que faz parte da diversidade neurodesenvolvimental
- **É para toda a vida**: Embora as manifestações possam mudar ao longo do tempo, o TEA é uma condição permanente
- **Não há "cura"**: Mas há muitas intervenções eficazes que podem melhorar a qualidade de vida

## Primeiras Ações Após o Diagnóstico

### 1. Procure Informações Confiáveis
- Consulte profissionais especializados em TEA
- Busque literatura atualizada e baseada em evidências
- Evite fontes não científicas ou métodos não comprovados

### 2. Construa uma Rede de Apoio
- Conecte-se com outras famílias
- Participe de grupos de apoio
- Busque orientação profissional

### 3. Avalie as Necessidades Individuais
- Observe os pontos fortes e desafios do seu filho
- Identifique áreas que precisam de mais suporte
- Desenvolva um plano personalizado

## Intervenções Recomendadas

### Comunicação
- **Análise do Comportamento Aplicada (ABA)**: Método baseado em evidências para ensinar habilidades
- **Comunicação Alternativa**: PECS, sinais, dispositivos AAC
- **Terapia da Fala**: Para desenvolvimento da comunicação verbal

### Habilidades Sociais
- **Ensino Estruturado**: Programas como TEACCH
- **Treino de Habilidades Sociais**: Grupos focados em interação social
- **Atividades em Grupo**: Esportes adaptados, clubes de interesse

### Comportamentos e Rotinas
- **Análise Funcional do Comportamento**: Para entender e modificar comportamentos desafiadores
- **Rotinas Visuais**: Para promover previsibilidade e reduzir ansiedade
- **Técnicas de Autorregulação**: Estratégias para lidar com emoções

## Cuidados com a Saúde

### Avaliações Médicas
- Exame audiológico completo
- Avaliação oftalmológica
- Exames para condições associadas (epilepsia, problemas gastrointestinais)

### Sono e Alimentação
- Estabeleça rotinas consistentes de sono
- Avalie padrões alimentares e possíveis restrições
- Considere avaliação nutricional se necessário

## Apoio Educacional

### Escolha da Escola
- Busque escolas com experiência em TEA
- Considere programas de inclusão ou especializados
- Avalie o suporte disponível

### Plano Educacional Individualizado (PEI)
- Trabalhe com a escola para desenvolver um PEI
- Inclua objetivos realistas e mensuráveis
- Monitore o progresso regularmente

## Cuidando de Você Mesmo

### Saúde Mental dos Pais
- Busque apoio psicológico se necessário
- Cuide da sua saúde física e mental
- Mantenha equilíbrio entre cuidar do filho e cuidar de si

### Relacionamentos Familiares
- Mantenha comunicação aberta com o cônjuge
- Inclua irmãos no processo
- Fortaleça os laços familiares

## Conclusão

Os primeiros passos após o diagnóstico são fundamentais para estabelecer uma base sólida de apoio ao seu filho. Lembre-se de que cada família encontra seu próprio caminho, e o que funciona para uma pode não funcionar para outra.

**Recursos importantes:**
- Busque acompanhamento profissional regular
- Mantenha-se informado sobre avanços científicos
- Celebre cada progresso, por menor que seja
- Construa uma rede de apoio sólida

Lembre-se: você não está sozinho nessa jornada. Há muitos recursos, profissionais e comunidades disponíveis para apoiá-lo.

---

*Este artigo é informativo e não substitui orientação médica profissional. Consulte sempre especialistas qualificados para decisões sobre saúde e educação.*
    `,
    author: {
      name: 'Dra. Maria Santos',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      role: 'Especialista em TEA'
    },
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    tags: ['Diagnóstico', 'Pais', 'Intervenção Precoce'],
    likes: 245,
    views: 1250,
    comments: 23,
    isLiked: false,
    isFavorited: false,
    publishedAt: '2024-01-15',
    readTime: 8,
    category: 'Guia para Pais'
  },
  {
    id: 2,
    title: 'Comunicação Alternativa e Aumentativa: Recursos Práticos',
    excerpt: 'Explore diferentes sistemas de comunicação para pessoas com TEA...',
    content: `
# Comunicação Alternativa e Aumentativa: Recursos Práticos

## O que é CAA?

A Comunicação Alternativa e Aumentativa (CAA) engloba todas as formas de comunicação que não dependem da fala verbal tradicional. Para pessoas com TEA, a CAA pode ser uma ferramenta essencial para expressão, compreensão e interação social.

## Por que a CAA é importante?

Muitas pessoas com TEA têm dificuldades na comunicação verbal, seja por atraso no desenvolvimento da fala, ecolalia, mutismo seletivo ou outras razões. A CAA oferece alternativas eficazes para:

- Expressar necessidades básicas
- Participar de conversas
- Aprender conceitos acadêmicos
- Desenvolver habilidades sociais
- Reduzir frustração e comportamentos desafiadores

## Tipos de Sistemas CAA

### 1. Sistemas sem Tecnologia
- **PECs (Picture Exchange Communication System)**: Troca de imagens por itens desejados
- **Sistema de Comunicação por Troca de Figuras**: Similar ao PECS, mas mais avançado
- **Linguagem de Sinais**: Libras ou sinais específicos
- **Comunicação por Gestos**: Gestos naturais ou convencionais

### 2. Sistemas com Baixa Tecnologia
- **Pranchas de Comunicação**: Imagens organizadas por categoria
- **Livros de Comunicação**: Sequências de imagens para contar histórias
- **Cartões de Escolha**: Para decisões simples (sim/não, opções limitadas)

### 3. Sistemas com Alta Tecnologia
- **Aplicativos de Comunicação**: Proloquo2Go, TouchChat
- **Dispositivos Dedicados**: Tobii Dynavox, Saltillo
- **Tablets e Celulares**: Com apps especializados

## Implementando CAA

### Avaliação Inicial
- Avalie as habilidades comunicativas atuais
- Identifique necessidades e objetivos
- Considere preferências e motivações da pessoa

### Escolha do Sistema
- Comece simples e vá progredindo
- Considere o ambiente (casa, escola, comunidade)
- Pense na portabilidade e praticidade

### Treinamento
- Ensine o uso do sistema de forma consistente
- Modele o uso em situações naturais
- Reforce tentativas de comunicação
- Celebre sucessos

## Estratégias de Sucesso

### Ambiente Rico em Comunicação
- Disponibilize o sistema CAA em todos os ambientes
- Use o sistema para todas as interações
- Incentive a comunicação espontânea

### Modelagem
- Demonstre o uso do sistema
- Use frases completas
- Expanda a comunicação da pessoa

### Motivação
- Use interesses da pessoa para motivar
- Reforce tentativas de comunicação
- Faça do aprendizado uma experiência positiva

## Considerações Importantes

### Individualização
- Cada pessoa responde de forma diferente
- O que funciona para um pode não funcionar para outro
- Seja flexível e ajuste conforme necessário

### Transição para Fala
- A CAA não impede o desenvolvimento da fala
- Muitos usuários de CAA desenvolvem fala verbal
- A CAA pode facilitar a transição

### Suporte Contínuo
- Forneça treinamento regular
- Monitore o progresso
- Atualize o sistema conforme necessário

## Recursos e Apoio

### Profissionais
- Terapeuta da Fala especializado em CAA
- Analista do Comportamento
- Educador Especial

### Materiais
- Livros sobre CAA
- Cursos online
- Grupos de apoio

### Tecnologia
- Apps gratuitos para começar
- Dispositivos acessíveis
- Suporte técnico

## Conclusão

A Comunicação Alternativa e Aumentativa é uma ferramenta poderosa que pode transformar a vida de pessoas com TEA. Com o sistema certo e suporte adequado, indivíduos com TEA podem se comunicar efetivamente, participar mais plenamente da sociedade e alcançar seu pleno potencial.

---

*Consulte profissionais especializados para escolher e implementar o sistema CAA mais adequado às necessidades individuais.*
    `,
    author: {
      name: 'João Silva',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'Terapeuta da Fala'
    },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    tags: ['Comunicação', 'PECs', 'AAC'],
    likes: 189,
    views: 890,
    comments: 15,
    isLiked: false,
    isFavorited: true,
    publishedAt: '2024-01-12',
    readTime: 12,
    category: 'Comunicação'
  }
];

const ArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    // Simular busca do artigo por ID
    const foundArticle = mockArticles.find(a => a.id === parseInt(id || '0'));
    if (foundArticle) {
      setArticle(foundArticle);
      setIsLiked(foundArticle.isLiked);
      setIsFavorited(foundArticle.isFavorited);
      setLikesCount(foundArticle.likes);
    }
  }, [id]);

  const handleLike = () => {
    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;
    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);
    message.success(newIsLiked ? 'Artigo curtido!' : 'Curtida removida!');
  };

  const handleFavorite = () => {
    const newIsFavorited = !isFavorited;
    setIsFavorited(newIsFavorited);
    message.success(newIsFavorited ? 'Adicionado aos favoritos!' : 'Removido dos favoritos!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Link copiado para a área de transferência!');
  };

  if (!article) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>Artigo não encontrado</Title>
        <Button onClick={() => navigate('/biblioteca')}>Voltar para Biblioteca</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: '24px' }}>
        <Breadcrumb.Item>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/biblioteca')}
            style={{ padding: 0 }}
          >
            Biblioteca
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{article.category}</Breadcrumb.Item>
        <Breadcrumb.Item>{article.title}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Header do Artigo */}
      <Card style={{ marginBottom: '24px' }}>
        {/* Imagem do artigo */}
        {article.image && (
          <div
            style={{
              height: '300px',
              backgroundImage: `url(${article.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px',
              marginBottom: '24px'
            }}
          />
        )}

        {/* Tags */}
        <div style={{ marginBottom: '16px' }}>
          <Space wrap>
            <Tag color="blue">{article.category}</Tag>
            {article.tags.map((tag: string) => (
              <Tag key={tag} color="geekblue">{tag}</Tag>
            ))}
          </Space>
        </div>

        {/* Título */}
        <Title level={1} style={{ marginBottom: '16px' }}>
          {article.title}
        </Title>

        {/* Excerpt */}
        <Paragraph style={{ fontSize: '18px', color: '#666', marginBottom: '24px' }}>
          {article.excerpt}
        </Paragraph>

        {/* Informações do autor e artigo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={article.author.avatar} size={48} style={{ marginRight: '12px' }} />
            <div>
              <Text strong style={{ fontSize: '16px' }}>{article.author.name}</Text>
              <br />
              <Text type="secondary">{article.author.role}</Text>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              <ClockCircleOutlined style={{ marginRight: '4px' }} />
              {article.readTime} min de leitura
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '14px' }}>
              {new Date(article.publishedAt).toLocaleDateString('pt-BR')}
            </Text>
          </div>
        </div>

        {/* Estatísticas e ações */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button
              type="text"
              icon={isLiked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
              onClick={handleLike}
              style={{ fontSize: '16px' }}
            >
              {likesCount}
            </Button>
            <Button
              type="text"
              icon={<EyeOutlined />}
              style={{ fontSize: '16px', color: '#666' }}
            >
              {article.views}
            </Button>
            <Button
              type="text"
              icon={<MessageOutlined />}
              style={{ fontSize: '16px', color: '#666' }}
            >
              {article.comments}
            </Button>
          </Space>

          <Space>
            <Button
              type="text"
              icon={isFavorited ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
              onClick={handleFavorite}
              style={{ fontSize: '16px' }}
            />
            <Button
              type="text"
              icon={<ShareAltOutlined />}
              onClick={handleShare}
              style={{ fontSize: '16px' }}
            />
          </Space>
        </div>
      </Card>

      {/* Conteúdo do Artigo */}
      <Card>
        <div style={{ lineHeight: '1.8', fontSize: '16px', color: '#333' }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <Title level={1} style={{ marginTop: '32px', marginBottom: '16px', fontSize: '28px' }}>
                  {children}
                </Title>
              ),
              h2: ({ children }) => (
                <Title level={2} style={{ marginTop: '28px', marginBottom: '12px', fontSize: '24px' }}>
                  {children}
                </Title>
              ),
              h3: ({ children }) => (
                <Title level={3} style={{ marginTop: '24px', marginBottom: '8px', fontSize: '20px' }}>
                  {children}
                </Title>
              ),
              h4: ({ children }) => (
                <Title level={4} style={{ marginTop: '20px', marginBottom: '8px', fontSize: '18px' }}>
                  {children}
                </Title>
              ),
              p: ({ children }) => (
                <Paragraph style={{ marginBottom: '16px', fontSize: '16px', lineHeight: '1.8' }}>
                  {children}
                </Paragraph>
              ),
              ul: ({ children }) => (
                <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol style={{ marginLeft: '20px', marginBottom: '16px' }}>
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li style={{ marginBottom: '8px', lineHeight: '1.6' }}>
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <Text strong style={{ fontWeight: 'bold' }}>
                  {children}
                </Text>
              ),
              em: ({ children }) => (
                <Text italic>
                  {children}
                </Text>
              ),
              blockquote: ({ children }) => (
                <div style={{
                  borderLeft: '4px solid #667eea',
                  paddingLeft: '16px',
                  margin: '20px 0',
                  fontStyle: 'italic',
                  color: '#666',
                  backgroundColor: '#f8f9fa',
                  padding: '16px',
                  borderRadius: '4px'
                }}>
                  {children}
                </div>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                return isInline ? (
                  <code style={{
                    backgroundColor: '#f1f3f4',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                  }}>
                    {children}
                  </code>
                ) : (
                  <pre style={{
                    backgroundColor: '#f8f9fa',
                    padding: '16px',
                    borderRadius: '6px',
                    overflow: 'auto',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    margin: '16px 0'
                  }}>
                    <code>{children}</code>
                  </pre>
                );
              },
              hr: () => (
                <div style={{
                  borderTop: '1px solid #e8e8e8',
                  margin: '32px 0',
                  height: '1px'
                }} />
              )
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </Card>

      {/* Ações flutuantes (affix) */}
      <Affix offsetBottom={20} style={{ position: 'absolute', right: '20px' }}>
        <Card size="small" style={{ width: '60px' }}>
          <Space direction="vertical" align="center">
            <Button
              type="text"
              icon={isLiked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
              onClick={handleLike}
              size="small"
            />
            <Button
              type="text"
              icon={isFavorited ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
              onClick={handleFavorite}
              size="small"
            />
            <Button
              type="text"
              icon={<ShareAltOutlined />}
              onClick={handleShare}
              size="small"
            />
          </Space>
        </Card>
      </Affix>
    </div>
  );
};

export default ArticlePage;