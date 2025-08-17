import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DicasPage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <h1>Dicas e Recursos</h1>
        <p>
          Aqui você encontrará orientações, práticas e materiais de apoio para o
          dia a dia com pessoas autistas.
        </p>
      </main>
      <Footer />
    </>
  );
};

export default DicasPage;
