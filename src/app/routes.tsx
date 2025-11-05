import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from '../pages/About/About';
import Contact from '../pages/Contact/Contact';
import NotFound from '../pages/NotFound/NotFound';
import Login from '../pages/Login/Login';
import RegisterPage from '../pages/Registrar/Registrar';
import ProfessionalRegister from '../pages/Registrar/ProfessionalRegister';
import Perfil from '../pages/Perfil/Perfil';
import Configuracoes from '../pages/Configuracoes/Configuracoes';
import Favoritos from '../pages/Favoritos/Favoritos';
import Curtidos from '../pages/Curtidos/Curtidos';
import Biblioteca from '../pages/Biblioteca/Biblioteca';
import ArticlePage from '../pages/Article/Article';
import AtividadePage from '../pages/Atividade/Atividade';
import PerfilAutista from '../pages/PerfilAutista/PerfilAutista';
import PerfilAutistaDetalhes from '../pages/PerfilAutista/PerfilAutistaDetalhes';
import ProtectedRoute from '../components/ProtectedRoute';
// Professional pages
import ProfessionalDashboard from '../pages/Professional/Dashboard';
import MyArticles from '../pages/Professional/MyArticles';
import ArticleForm from '../pages/Professional/ArticleForm';
import MyActivities from '../pages/Professional/MyActivities';
import ActivityForm from '../pages/Professional/ActivityForm';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/professional" element={<ProfessionalRegister />} />
      <Route path="/" element={<ProtectedRoute><Biblioteca /></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
      <Route path="/favoritos" element={<ProtectedRoute><Favoritos /></ProtectedRoute>} />
      <Route path="/curtidos" element={<ProtectedRoute><Curtidos /></ProtectedRoute>} />
      <Route path="/biblioteca" element={<ProtectedRoute><Biblioteca /></ProtectedRoute>} />
      <Route path="/artigo/:id" element={<ProtectedRoute><ArticlePage /></ProtectedRoute>} />
      <Route path="/atividade/:id" element={<ProtectedRoute><AtividadePage /></ProtectedRoute>} />
      <Route path="/perfil-autista" element={<ProtectedRoute><PerfilAutista /></ProtectedRoute>} />
      <Route path="/perfil-autista/:id" element={<ProtectedRoute><PerfilAutistaDetalhes /></ProtectedRoute>} />
      <Route path="/atividades" element={<ProtectedRoute>{React.createElement(require('../pages/Atividades/Atividades').default)}</ProtectedRoute>} />
      {/* Professional routes */}
      <Route path="/professional/dashboard" element={<ProtectedRoute><ProfessionalDashboard /></ProtectedRoute>} />
      <Route path="/professional/artigos" element={<ProtectedRoute><MyArticles /></ProtectedRoute>} />
      <Route path="/professional/artigos/novo" element={<ProtectedRoute><ArticleForm /></ProtectedRoute>} />
      <Route path="/professional/artigos/editar/:id" element={<ProtectedRoute><ArticleForm /></ProtectedRoute>} />
      <Route path="/professional/atividades" element={<ProtectedRoute><MyActivities /></ProtectedRoute>} />
      <Route path="/professional/atividades/novo" element={<ProtectedRoute><ActivityForm /></ProtectedRoute>} />
      <Route path="/professional/atividades/editar/:id" element={<ProtectedRoute><ActivityForm /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
