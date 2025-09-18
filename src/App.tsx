import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Feed from './pages/Feed/Feed';
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
        {/* Navbar sem saudação personalizada */}
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/biblioteca" element={React.createElement(require('./pages/Biblioteca/Biblioteca').default)} />
            <Route path="/atividades" element={React.createElement(require('./pages/Atividades/Atividades').default)} />
            <Route path="/settings" element={React.createElement(require('./pages/Settings/Settings').default)} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;