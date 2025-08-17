import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <h1>Bem-vindo ao TEApoio</h1>
        <p>Um guia de informações e dicas para pais e cuidadores de autistas.</p>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
