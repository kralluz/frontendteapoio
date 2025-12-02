import React, { useState, useEffect } from 'react';
import {
  Button, Tag, Space, Typography,
  message, Spin
} from 'antd';
import {
  HeartOutlined, HeartFilled, StarOutlined, StarFilled,
  EyeOutlined, ShareAltOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { articleService } from '../../services/articleService';
import { likeService, favoriteService } from '../../services/interactionService';

const { Title, Text, Paragraph } = Typography;

const ArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [id]);

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
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header simples */}
      <div style={{ marginBottom: '24px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/biblioteca')}
          style={{ marginBottom: '16px' }}
        >
          Voltar
        </Button>
      </div>

      {/* Imagem de capa */}
      {article.image && (
        <div
          style={{
            width: '100%',
            height: '400px',
            backgroundImage: `url(${article.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
            marginBottom: '32px'
          }}
        />
      )}

      {/* Título e meta info */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={1} style={{ marginBottom: '16px', fontSize: '36px', lineHeight: '1.3' }}>
          {article.title}
        </Title>
        
        <Space size="middle" style={{ marginBottom: '16px' }}>
          <Tag color="blue">{article.category}</Tag>
          <Text type="secondary">
            <EyeOutlined /> {article._count?.views || 0} visualizações
          </Text>
          <Text type="secondary">{article.readTime} min de leitura</Text>
        </Space>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
          <Button
            type="text"
            icon={isLiked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
            onClick={handleLike}
          >
            {article._count?.likes || 0}
          </Button>

          <Space>
            <Button
              type={isFavorited ? "primary" : "default"}
              icon={isFavorited ? <StarFilled /> : <StarOutlined />}
              onClick={handleFavorite}
            >
              {isFavorited ? 'Favoritado' : 'Favoritar'}
            </Button>
            <Button
              icon={<ShareAltOutlined />}
              onClick={handleShare}
            >
              Compartilhar
            </Button>
          </Space>
        </div>
      </div>

      {/* Conteúdo do Artigo */}
      <div style={{ 
        lineHeight: '1.8', 
        fontSize: '17px', 
        color: '#262626',
        marginBottom: '48px'
      }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <Title level={2} style={{ marginTop: '48px', marginBottom: '24px', fontSize: '32px' }}>
                {children}
              </Title>
            ),
            h2: ({ children }) => (
              <Title level={3} style={{ marginTop: '40px', marginBottom: '20px', fontSize: '28px' }}>
                {children}
              </Title>
            ),
            h3: ({ children }) => (
              <Title level={4} style={{ marginTop: '32px', marginBottom: '16px', fontSize: '24px' }}>
                {children}
              </Title>
            ),
            h4: ({ children }) => (
              <Title level={5} style={{ marginTop: '24px', marginBottom: '12px', fontSize: '20px' }}>
                {children}
              </Title>
            ),
            p: ({ children }) => (
              <Paragraph style={{ marginBottom: '20px', fontSize: '17px', lineHeight: '1.8' }}>
                {children}
              </Paragraph>
            ),
            ul: ({ children }) => (
              <ul style={{ marginLeft: '24px', marginBottom: '20px' }}>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol style={{ marginLeft: '24px', marginBottom: '20px' }}>
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li style={{ marginBottom: '10px', lineHeight: '1.7' }}>
                {children}
              </li>
            ),
            strong: ({ children }) => (
              <strong style={{ fontWeight: 600 }}>
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em>
                {children}
              </em>
            ),
            blockquote: ({ children }) => (
              <div style={{
                borderLeft: '3px solid #1890ff',
                paddingLeft: '20px',
                margin: '24px 0',
                fontStyle: 'italic',
                color: '#595959',
                backgroundColor: '#fafafa',
                padding: '16px 20px',
                borderRadius: '4px'
              }}>
                {children}
              </div>
            ),
            code: ({ children, className }) => {
              const isInline = !className;
              return isInline ? (
                <code style={{
                  backgroundColor: '#f5f5f5',
                  padding: '3px 6px',
                  borderRadius: '3px',
                  fontSize: '15px',
                  fontFamily: 'monospace',
                  color: '#d63384'
                }}>
                  {children}
                </code>
              ) : (
                <pre style={{
                  backgroundColor: '#f5f5f5',
                  padding: '20px',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '15px',
                  lineHeight: '1.5',
                  margin: '24px 0'
                }}>
                  <code>{children}</code>
                </pre>
              );
            },
            hr: () => (
              <div style={{
                borderTop: '1px solid #d9d9d9',
                margin: '40px 0'
              }} />
            )
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ArticlePage;