
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  LayoutDashboard,
  Users,
  Building2,
  Package,
  ClipboardList,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import "./Administracao.css";

const indicadores = [
  {
    titulo: "Usuários cadastrados",
    valor: "—",
    icone: Users,
  },
  {
    titulo: "Instituições",
    valor: "—",
    icone: Building2,
  },
  {
    titulo: "Doações cadastradas",
    valor: "—",
    icone: Package,
  },
  {
    titulo: "Solicitações",
    valor: "—",
    icone: ClipboardList,
  },
];

const atalhos = [
  {
    titulo: "Usuários",
    descricao: "Acompanhe os usuários da plataforma.",
    icone: Users,
    link: "/perfil",
  },
  {
    titulo: "Instituições",
    descricao: "Consulte as instituições cadastradas.",
    icone: Building2,
    link: "/instituicoes",
  },
  {
    titulo: "Doações",
    descricao: "Consulte as doações disponíveis.",
    icone: Package,
    link: "/doacoes",
  },
  {
    titulo: "Solicitações",
    descricao: "Acompanhe as solicitações realizadas.",
    icone: ClipboardList,
    link: "/solicitacoes",
  },
];

export default function Administracao() {
  return (
    <main className="administracao-page">
      <header className="administracao-header">
        <Link to="/home" className="administracao-voltar">
          <ArrowLeft size={18} />
          Voltar ao início
        </Link>

        <div className="administracao-titulo">
          <div className="administracao-icone-principal">
            <LayoutDashboard size={27} />
          </div>

          <div>
            <h1>Painel administrativo</h1>
            <p>
              Visão geral e acesso às áreas do Harvest Hope.
            </p>
          </div>
        </div>
      </header>

      <section className="administracao-boas-vindas">
        <div>
          <span className="administracao-etiqueta">
            <ShieldCheck size={15} />
            Administração
          </span>

          <h2>Visão geral da plataforma</h2>

          <p>
            Acesse as principais áreas para acompanhar as
            atividades da plataforma.
          </p>
        </div>

        <TrendingUp size={38} />
      </section>

      <section className="administracao-indicadores">
        {indicadores.map((item) => {
          const Icone = item.icone;

          return (
            <article
              className="administracao-indicador"
              key={item.titulo}
            >
              <div className="administracao-indicador-icone">
                <Icone size={23} />
              </div>

              <div>
                <span>{item.titulo}</span>
                <strong>{item.valor}</strong>
              </div>
            </article>
          );
        })}
      </section>

      <section className="administracao-secao">
        <div className="administracao-secao-titulo">
          <h2>Acesso rápido</h2>
          <p>Selecione uma área para consultar.</p>
        </div>

        <div className="administracao-atalhos">
          {atalhos.map((item) => {
            const Icone = item.icone;

            return (
              <Link
                to={item.link}
                className="administracao-atalho"
                key={item.titulo}
              >
                <div className="administracao-atalho-icone">
                  <Icone size={23} />
                </div>

                <div>
                  <h3>{item.titulo}</h3>
                  <p>{item.descricao}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <p className="administracao-aviso">
        Os indicadores serão conectados aos dados reais quando
        a integração administrativa estiver implementada.
      </p>
    </main>
  );
}
