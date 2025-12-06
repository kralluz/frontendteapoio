import React, { useState, useEffect } from 'react';
import {
  Button, Tag, Space, Typography,
  message, Spin, Avatar
} from 'antd';
import {
  HeartOutlined, HeartFilled, StarOutlined, StarFilled,
  EyeOutlined, ShareAltOutlined, ArrowLeftOutlined,
  ClockCircleOutlined, UserOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { articleService } from '../../services/articleService';
import { likeService, favoriteService } from '../../services/interactionService';
import './Article.css';

const { Title, Text, Paragraph } = Typography;

const ArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    loadArticle();
  }, [id]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadArticle = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await articleService.getById(id);
      setArticle(data);
      
      // Verificar se o usuário curtiu/favoritou
      try {
        const [myLikes, myFavorites] = await Promise.all([
          likeService.getMyLikes(),
          favoriteService.getMyFavorites()
        ]);
        
        setIsLiked(myLikes.some(like => like.articleId === id));
        setIsFavorited(myFavorites.some(fav => fav.articleId === id));
      } catch (error) {
        // Usuário não autenticado ou erro ao buscar - ignora
        console.log('Erro ao verificar interações:', error);
      }
    } catch (error: any) {
      message.error('Erro ao carregar artigo');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!article) return;
    
    try {
      const response = await likeService.toggle({ articleId: article.id });
      setIsLiked(response.liked);
      
      // Atualizar contador localmente
      setArticle({
        ...article,
        _count: {
          ...article._count,
          likes: article._count.likes + (response.liked ? 1 : -1)
        }
      });
      
      message.success(response.message);
    } catch (error) {
      message.error('Erro ao atualizar curtida');
    }
  };

  const handleFavorite = async () => {
    if (!article) return;
    
    try {
      const response = await favoriteService.toggle({ articleId: article.id });
      setIsFavorited(response.favorited);
      
      // Atualizar contador localmente
      setArticle({
        ...article,
        _count: {
          ...article._count,
          favorites: article._count.favorites + (response.favorited ? 1 : -1)
        }
      });
      
      message.success(response.message);
    } catch (error) {
      message.error('Erro ao atualizar favorito');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Link copiado para a área de transferência!');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>Artigo não encontrado</Title>
        <Button onClick={() => navigate('/biblioteca')}>Voltar para Biblioteca</Button>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #fafbfc 0%, #ffffff 100%)', 
      minHeight: '100vh', 
      padding: '0'
    }}>
      {/* Header com gradiente e imagem com parallax */}
      <div className="article-header" style={{ 
        position: 'relative',
        width: '100%',
        height: article.image ? '500px' : (isMobile ? '350px' : '400px'),
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '48px 0 64px 0'
      }}>
        {/* Background com parallax */}
        <div className="article-parallax-bg" style={{
          position: 'absolute',
          top: '-50px',
          left: 0,
          right: 0,
          height: 'calc(100% + 100px)',
          background: article.image 
            ? `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%), url(${article.image})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${scrollY * 0.3}px)`,
          willChange: 'transform'
        }} />
        {/* Botões flutuantes mobile */}
        {isMobile && (
          <div className="mobile-floating-actions" style={{
            position: 'fixed',
            top: '80px',
            right: '16px',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <Button
              shape="circle"
              size="small"
              icon={isLiked ? 
                <HeartFilled style={{ fontSize: '14px', color: '#ff4d4f' }} /> : 
                <HeartOutlined style={{ fontSize: '14px' }} />}
              onClick={handleLike}
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                backdropFilter: 'blur(10px)',
                width: '40px',
                height: '40px'
              }}
            />
            <Button
              shape="circle"
              size="small"
              icon={isFavorited ? 
                <StarFilled style={{ fontSize: '14px', color: '#faad14' }} /> : 
                <StarOutlined style={{ fontSize: '14px' }} />}
              onClick={handleFavorite}
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                backdropFilter: 'blur(10px)',
                width: '40px',
                height: '40px'
              }}
            />
            <Button
              shape="circle"
              size="small"
              icon={<ShareAltOutlined style={{ fontSize: '14px' }} />}
              onClick={handleShare}
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                backdropFilter: 'blur(10px)',
                width: '40px',
                height: '40px'
              }}
            />
          </div>
        )}

        {/* Botão voltar flutuante */}
        <div className="article-back-btn" style={{ 
          position: 'absolute', 
          top: isMobile ? '16px' : '24px', 
          left: isMobile ? '16px' : '24px',
          zIndex: 2
        }}>
          <Button
            shape="circle"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/biblioteca')}
            style={{ 
              background: 'rgba(255,255,255,0.95)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(10px)',
              width: isMobile ? '44px' : '48px',
              height: isMobile ? '44px' : '48px',
              minWidth: isMobile ? '44px' : '48px',
              minHeight: isMobile ? '44px' : '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s',
              padding: 0
            }}
            className="article-action-btn"
          />
        </div>

        {/* Conteúdo do header centralizado */}
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: isMobile ? '0 16px' : '0 32px',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Categoria */}
          <Tag style={{ 
            borderRadius: '20px',
            border: 'none',
            background: 'rgba(255,255,255,0.25)',
            color: '#fff',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            backdropFilter: 'blur(10px)',
            marginBottom: '20px'
          }}>
            {article.category}
          </Tag>

          {/* Título */}
          <Title 
            level={1} 
            style={{ 
              color: '#fff',
              fontSize: '48px', 
              lineHeight: '1.2',
              fontWeight: 700,
              marginBottom: '20px',
              textShadow: '0 2px 24px rgba(0,0,0,0.3)',
              letterSpacing: '-0.5px'
            }}
          >
            {article.title}
          </Title>

          {/* Meta info */}
          <Space size="large" style={{ color: 'rgba(255,255,255,0.95)' }}>
            <Text style={{ color: 'inherit', fontSize: '15px' }}>
              <ClockCircleOutlined style={{ marginRight: '8px' }} />
              {article.readTime} min
            </Text>
            <Text style={{ color: 'inherit', fontSize: '15px' }}>
              <EyeOutlined style={{ marginRight: '8px' }} />
              {article._count?.views || 0} visualizações
            </Text>
          </Space>
        </div>
      </div>

      {/* Container de conteúdo com sobreposição */}
      <div className="article-content-wrapper" style={{ 
        maxWidth: '1000px', 
        margin: '-40px auto 0', 
        padding: isMobile ? '0 0 60px 0' : '0 32px 80px', 
        position: 'relative' 
      }}>
        {/* Card de autor */}
        <div className="article-author-card" style={{ 
          background: '#fff',
          borderRadius: isMobile ? '0' : '16px',
          padding: isMobile ? '16px 16px' : '24px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)',
          marginBottom: isMobile ? '16px' : '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Autor */}
          <Space
            size={16}
            onClick={(e) => {
              e.stopPropagation();
              if (article.author?.id) {
                navigate(`/perfil/${article.author.id}`);
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <Avatar
              src={article.author?.avatar}
              icon={<UserOutlined />}
              size={56}
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '3px solid #fff'
              }}
            />
            <div>
              <Text strong style={{ display: 'block', fontSize: '16px', color: '#262626' }}>
                {article.author?.name || 'Autor'}
              </Text>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                {new Date(article.createdAt).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </Text>
            </div>
          </Space>

          {/* Ações - ocultar em mobile */}
          {!isMobile && (
          <Space size={8}>
            <Button
              type="text"
              size="large"
              icon={isLiked ? 
                <HeartFilled style={{ fontSize: '20px' }} /> : 
                <HeartOutlined style={{ fontSize: '20px' }} />
              }
              onClick={handleLike}
              className="article-action-btn"
              style={{ 
                color: isLiked ? '#ff4d4f' : '#8c8c8c',
                height: '44px',
                borderRadius: '12px',
                padding: '0 16px',
                transition: 'all 0.3s',
                fontWeight: 500
              }}
            >
              {article._count?.likes || 0}
            </Button>

            <Button
              type={isFavorited ? 'default' : 'text'}
              size="large"
              icon={isFavorited ? 
                <StarFilled style={{ fontSize: '20px' }} /> : 
                <StarOutlined style={{ fontSize: '20px' }} />
              }
              onClick={handleFavorite}
              className="article-action-btn"
              style={{ 
                color: isFavorited ? '#faad14' : '#8c8c8c',
                height: '44px',
                borderRadius: '12px',
                padding: '0 16px',
                borderColor: isFavorited ? '#ffd666' : 'transparent',
                background: isFavorited ? '#fffbf0' : 'transparent',
                transition: 'all 0.3s',
                fontWeight: 500
              }}
            >
              {isFavorited ? 'Salvo' : 'Salvar'}
            </Button>

            <Button
              type="text"
              size="large"
              icon={<ShareAltOutlined style={{ fontSize: '20px' }} />}
              onClick={handleShare}
              className="article-action-btn"
              style={{ 
                color: '#8c8c8c',
                height: '44px',
                borderRadius: '12px',
                padding: '0 16px',
                transition: 'all 0.3s',
                fontWeight: 500
              }}
            >
              Compartilhar
            </Button>
          </Space>
          )}
        </div>

        {/* Conteúdo do Artigo */}
        <div className="article-content-body article-content" style={{ 
          background: '#fff',
          borderRadius: isMobile ? '0' : '16px',
          padding: isMobile ? '32px 16px' : '56px 48px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)',
          lineHeight: '1.8', 
          fontSize: '18px', 
          color: '#1a1a1a'
        }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <Title level={2} style={{ 
                  marginTop: '56px', 
                  marginBottom: '24px', 
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#1a1a1a',
                  letterSpacing: '-0.5px',
                  lineHeight: '1.3'
                }}>
                  {children}
                </Title>
              ),
              h2: ({ children }) => (
                <Title level={3} style={{ 
                  marginTop: '48px', 
                  marginBottom: '20px', 
                  fontSize: '30px',
                  fontWeight: 700,
                  color: '#1a1a1a',
                  letterSpacing: '-0.3px',
                  lineHeight: '1.3'
                }}>
                  {children}
                </Title>
              ),
              h3: ({ children }) => (
                <Title level={4} style={{ 
                  marginTop: '40px', 
                  marginBottom: '16px', 
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#262626',
                  letterSpacing: '-0.2px'
                }}>
                  {children}
                </Title>
              ),
              h4: ({ children }) => (
                <Title level={5} style={{ 
                  marginTop: '32px', 
                  marginBottom: '12px', 
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#262626'
                }}>
                  {children}
                </Title>
              ),
              p: ({ children }) => (
                <Paragraph style={{ 
                  marginBottom: '24px', 
                  fontSize: '18px', 
                  lineHeight: '1.8',
                  color: '#3a3a3a',
                  fontWeight: 400,
                  textAlign: 'justify'
                }}>
                  {children}
                </Paragraph>
              ),
              ul: ({ children }) => (
                <ul style={{ 
                  marginLeft: '0', 
                  marginBottom: '24px',
                  paddingLeft: '28px',
                  listStyleType: 'none'
                }}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol style={{ 
                  marginLeft: '0', 
                  marginBottom: '24px',
                  paddingLeft: '28px',
                  counterReset: 'item'
                }}>
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li style={{ 
                  marginBottom: '12px', 
                  lineHeight: '1.8',
                  paddingLeft: '8px',
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '-24px',
                    color: '#667eea',
                    fontWeight: 600
                  }}>•</span>
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong style={{ 
                  fontWeight: 600,
                  color: '#1a1a1a'
                }}>
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em style={{ 
                  fontStyle: 'italic',
                  color: '#595959'
                }}>
                  {children}
                </em>
              ),
              blockquote: ({ children }) => (
                <div style={{
                  borderLeft: '4px solid #667eea',
                  paddingLeft: '24px',
                  margin: '32px 0',
                  fontStyle: 'italic',
                  color: '#595959',
                  backgroundColor: '#f8f9ff',
                  padding: '24px 24px 24px 32px',
                  borderRadius: '8px',
                  fontSize: '17px',
                  lineHeight: '1.8'
                }}>
                  {children}
                </div>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                return isInline ? (
                  <code style={{
                    backgroundColor: '#f6f7f9',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontFamily: "'Fira Code', 'Consolas', monospace",
                    color: '#667eea',
                    fontWeight: 500,
                    border: '1px solid #e8e9ed'
                  }}>
                    {children}
                  </code>
                ) : (
                  <pre style={{
                    backgroundColor: '#1e1e1e',
                    padding: '24px',
                    borderRadius: '12px',
                    overflow: 'auto',
                    fontSize: '15px',
                    lineHeight: '1.6',
                    margin: '32px 0',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                  }}>
                    <code style={{ color: '#d4d4d4' }}>{children}</code>
                  </pre>
                );
              },
              hr: () => (
                <div style={{
                  borderTop: '2px solid #f0f0f0',
                  margin: '48px auto',
                  width: '60px'
                }} />
              ),
              a: ({ children, href }) => (
                <a 
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    borderBottom: '1px solid #667eea',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                >
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <div style={{
                  margin: '40px 0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <img 
                    src={src} 
                    alt={alt} 
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block'
                    }}
                  />
                </div>
              )
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;