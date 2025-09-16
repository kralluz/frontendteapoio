import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard/Dashboard';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import NotFound from './pages/NotFound/NotFound';
import Login from './pages/Login/Login';
import RegisterPage from './pages/Register/RegisterPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        {/* Saudação só no Dashboard/feed */}
        <Navbar
          greeting={window.location.pathname === '/' || window.location.pathname === '/dashboard' ? (
            <>
              <span className="navbar-greeting-title">Bem-vindo, João!</span>
              <br />
              <span className="navbar-greeting-sub">Seu hub de recursos e atividades para apoio ao TEA.</span>
            </>
          ) : undefined}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/biblioteca" element={React.createElement(require('./pages/Biblioteca/Biblioteca').default)} />
            <Route path="/atividades" element={React.createElement(require('./pages/Atividades/Atividades').default)} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;