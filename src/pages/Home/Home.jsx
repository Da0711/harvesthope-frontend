
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  Heart,
  UtensilsCrossed,
  Building2,
  Search,
  ClipboardList,
  Plus,
  ArrowRight,
} from "lucide-react";

import "./Home.css";

function Home() {
  const navigate = useNavigate();

  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  } catch {
    usuario = null;
  }

  const nomeUsuario = usuario?.nome?.trim() || "Usuário";

  const atalhos = [
    {
      titulo: "Explorar doações",
      descricao: "Encontre alimentos disponíveis e descubra oportunidades para ajudar.",
      icone: Search,
      destino: "/doacoes",
      acao: "Explorar doações",
    },
    {
      titulo: "Cadastrar doação",
      descricao: "Compartilhe alimentos e ajude a transformar a vida de outras pessoas.",
      icone: Plus,
      destino: "/cadastro-doacao",
      acao: "Cadastrar alimento",
    },
    {
      titulo: "Minhas solicitações",
      descricao: "Acompanhe seus pedidos e organize suas próximas retiradas.",
      icone: ClipboardList,
      destino: "/solicitacoes",
      acao: "Ver solicitações",
    },
  ];

  const doacoes = [
    {
      nome: "Doações disponíveis",
      valor: "Encontre alimentos para compartilhar",
      icone: Heart,
      destino: "/doacoes",
    },
    {
      nome: "Instituições parceiras",
      valor: "Conheça nossa rede solidária",
      icone: Building2,
      destino: "/instituicoes",
    },
  ];

  return (
    <main className="home-page">
      <section className="home-content">
        <div className="home-welcome">
          <p className="home-eyebrow">
            <Heart size={15} />
            Solidariedade que alimenta
          </p>

          <h1>Olá, {nomeUsuario}!</h1>

          <p>
            Cada alimento compartilhado é uma oportunidade de
            transformar vidas. Vamos fazer a diferença hoje?
          </p>

          <span className="home-nota">
            <Leaf size={14} />
            Pequenas atitudes podem gerar grandes transformações.
          </span>
        </div>

        <section
          className="home-cards"
          aria-label="Acessos rápidos"
        >
          {atalhos.map((item) => {
            const Icone = item.icone;

            return (
              <article className="home-card" key={item.titulo}>
                <Icone
                  className="home-card-icone"
                  size={23}
                />

                <h2>{item.titulo}</h2>

                <p>{item.descricao}</p>

                <button
                  type="button"
                  onClick={() => navigate(item.destino)}
                >
                  {item.acao}
                  <ArrowRight size={15} />
                </button>
              </article>
            );
          })}
        </section>

        <section
          className="home-resumos"
          aria-label="Explore a plataforma"
        >
          {doacoes.map((item) => {
            const Icone = item.icone;

            return (
              <button
                type="button"
                className="home-resumo"
                key={item.nome}
                onClick={() => navigate(item.destino)}
              >
                <span>{item.nome}</span>

                <strong>{item.valor}</strong>

                <Icone size={19} />
              </button>
            );
          })}
        </section>

        <section className="home-secao">
          <div className="home-secao-titulo">
            <div>
              <h2>Conheça o Harvest Hope</h2>

              <p>
                Conectando pessoas por meio da doação de alimentos.
              </p>
            </div>

            <button
              type="button"
              className="home-link"
              onClick={() => navigate("/sobre")}
            >
              Saiba mais
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="home-sobre-card">
            <div className="home-sobre-icone">
              <UtensilsCrossed size={27} />
            </div>

            <div>
              <h3>Alimentos conectam pessoas</h3>

              <p>
                Explore doações, conheça instituições e acompanhe
                suas solicitações em um só lugar. O Harvest Hope
                aproxima quem pode doar de quem precisa receber.
              </p>

              <button
                type="button"
                onClick={() => navigate("/sobre")}
              >
                Conhecer o projeto
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Home;
