import { useNavigate } from "react-router-dom";
import {
  Leaf,
  Heart,
  UtensilsCrossed,
  Building2,
} from "lucide-react";

import "./Home.css";

function Home() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const navigate = useNavigate();

  return (
    <main className="home-page">
      <header className="home-header">
        <div className="home-logo">
          <Leaf size={32} />
          <span>
            Harvest<span>Hope</span>
          </span>
        </div>

        <div className="home-user">
          Olá, <strong>{usuario?.nome || "Usuário"}</strong>
        </div>
      </header>

      <section className="home-content">
        <div className="home-welcome">
          <h1>Bem-vindo ao Harvest Hope!</h1>

          <p>
            Juntos podemos transformar alimentos em novos recomeços.
          </p>
        </div>

        <div className="home-cards">
          <div className="home-card">
            <div className="home-card-icon">
              <Heart size={28} />
            </div>

            <h2>Doações</h2>

            <p>
              Encontre e acompanhe doações de alimentos.
            </p>

            <button onClick={() => navigate("/doacoes")}>
              Ver doações
            </button>
          </div>

          <div className="home-card">
            <div className="home-card-icon">
              <Building2 size={28} />
            </div>

            <h2>Instituições</h2>

            <p>
              Conheça instituições que recebem doações.
            </p>

            <button onClick={() => navigate("/instituicoes")}>
              Ver instituições
            </button>
          </div>

          <div className="home-card">
            <div className="home-card-icon">
              <UtensilsCrossed size={28} />
            </div>

            <h2>Nova doação</h2>

            <p>
              Ajude a combater o desperdício de alimentos.
            </p>

            <button onClick={() => navigate("/doacoes/nova")}>
              Fazer doação
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;