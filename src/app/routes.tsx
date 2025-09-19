import React from 'react';
import { Routes, Route } from 'react-router-dom';
import About from '../pages/About/About';
import Contact from '../pages/Contact/Contact';
import NotFound from '../pages/NotFound/NotFound';
import Login from '../pages/Login/Login';
import RegisterPage from '../pages/Registrar/Registrar';
import Perfil from '../pages/Perfil/Perfil';
import Configuracoes from '../pages/Configuracoes/Configuracoes';
import Favoritos from '../pages/Favoritos/Favoritos';
import Curtidos from '../pages/Curtidos/Curtidos';
import Biblioteca from '../pages/Biblioteca/Biblioteca';
import ArticlePage from '../pages/Article/Article';
import AtividadePage from '../pages/Atividade/Atividade';
import PerfilAutista from '../pages/PerfilAutista/PerfilAutista';
import PerfilAutistaDetalhes from '../pages/PerfilAutista/PerfilAutistaDetalhes';
import Feed from '../pages/Feed/Feed';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Biblioteca />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/configuracoes" element={<Configuracoes />} />
      <Route path="/favoritos" element={<Favoritos />} />
      <Route path="/curtidos" element={<Curtidos />} />
      <Route path="/biblioteca" element={<Biblioteca />} />
      <Route path="/artigo/:id" element={<ArticlePage />} />
      <Route path="/atividade/:id" element={<AtividadePage />} />
      <Route path="/perfil-autista" element={<PerfilAutista />} />
      <Route path="/perfil-autista/:id" element={<PerfilAutistaDetalhes />} />
      <Route path="/atividades" element={React.createElement(require('../pages/Atividades/Atividades').default)} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;