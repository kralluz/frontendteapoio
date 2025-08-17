import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SobrePage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <h1>Sobre o TEApoio</h1>
        <p>
          O TEApoio é um projeto criado para auxiliar pais e cuidadores primários
          de autistas, funcionando como uma biblioteca de informações úteis.
        </p>
      </main>
      <Footer />
    </>
  );
};

export default SobrePage;
