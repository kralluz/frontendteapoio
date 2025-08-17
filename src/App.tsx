import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import HomePage from "./pages/HomePage.tsx";
import DicasPage from "./pages/DicasPage.tsx";
import SobrePage from "./pages/SobrePages.tsx";

const App: React.FC = () => {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Início</Link></li>
          <li><Link to="/dicas">Dicas</Link></li>
          <li><Link to="/sobre">Sobre</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dicas" element={<DicasPage />} />
        <Route path="/sobre" element={<SobrePage />} />
      </Routes>
    </div>
  );
};

export default App;
