import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppSidebar from './components/AppSidebar';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import NotFound from './pages/NotFound/NotFound';
import Login from './pages/Login/Login';
import RegisterPage from './pages/Register/RegisterPage';
import PasswordReset from './pages/PasswordReset/PasswordReset';
import Profile from './pages/Profile/Profile';

import './App.css';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        <Layout style={{ marginTop: 70 }}> {/* Espaço para o navbar fixo */}
          <AppSidebar />
          <Content style={{ marginLeft: 260, padding: '24px', minHeight: 280 }}>
            <Routes>
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="/biblioteca" element={React.createElement(require('./pages/Biblioteca/Biblioteca').default)} />
              <Route path="/atividades" element={React.createElement(require('./pages/Atividades/Atividades').default)} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={React.createElement(require('./pages/Settings/Settings').default)} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Content>
        </Layout>
        <Footer />
      </Layout>
    </Router>
  );
};

export default App;