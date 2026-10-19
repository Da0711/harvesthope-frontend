import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Mail,
  ShieldCheck,
  Save,
  CheckCircle2,
  HeartHandshake,
  ClipboardList,
  CircleUserRound,
} from "lucide-react";
import "./Perfil.css";

export default function Perfil() {
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario")) || {
        nome: "",
        email: "",
      };
    } catch {
      return { nome: "", email: "" };
    }
  });

  const [mensagem, setMensagem] = useState("");

  function salvar(event) {
    event.preventDefault();

    const atualizado = {
      ...usuario,
      nome: usuario.nome.trim(),
      email: usuario.email.trim(),
    };

    localStorage.setItem("usuario", JSON.stringify(atualizado));
    setUsuario(atualizado);
    setMensagem("Dados salvos neste navegador!");
  }

  const nomeExibicao = usuario.nome?.trim() || "Seu nome";
  const iniciais = nomeExibicao
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");

  return (
    <main className="perfil-page">
      <div className="perfil-decoracao perfil-decoracao-um" aria-hidden="true" />
      <div className="perfil-decoracao perfil-decoracao-dois" aria-hidden="true" />

      <div className="perfil-container">
        <Link to="/home" className="perfil-voltar">
          <ArrowLeft size={17} />
          Voltar ao início
        </Link>

        <header className="perfil-cabecalho">
          <div className="perfil-avatar" aria-hidden="true">
            {iniciais || <CircleUserRound size={36} />}
          </div>

          <div className="perfil-cabecalho-texto">
            <span className="perfil-etiqueta">
              <ShieldCheck size={15} />
              SUA CONTA
            </span>
            <h1>Meu perfil</h1>
            <p>Consulte e atualize seus dados pessoais.</p>
          </div>
        </header>

        <section className="perfil-card">
          <div className="perfil-card-topo">
            <div className="perfil-card-icone">
              <UserRound size={21} />
            </div>
            <div>
              <h2>Informações pessoais</h2>
              <p>Mantenha seus dados atualizados.</p>
            </div>
          </div>

          <form onSubmit={salvar}>
            <div className="perfil-campo">
              <label htmlFor="perfil-nome">Nome completo</label>
              <div className="perfil-input-wrap">
                <UserRound size={18} aria-hidden="true" />
                <input
                  id="perfil-nome"
                  type="text"
                  autoComplete="name"
                  value={usuario.nome || ""}
                  onChange={(event) => {
                    setUsuario({ ...usuario, nome: event.target.value });
                    setMensagem("");
                  }}
                  placeholder="Digite seu nome completo"
                  maxLength={120}
                  required
                />
              </div>
            </div>

            <div className="perfil-campo">
              <label htmlFor="perfil-email">E-mail</label>
              <div className="perfil-input-wrap">
                <Mail size={18} aria-hidden="true" />
                <input
                  id="perfil-email"
                  type="email"
                  autoComplete="email"
                  value={usuario.email || ""}
                  onChange={(event) => {
                    setUsuario({ ...usuario, email: event.target.value });
                    setMensagem("");
                  }}
                  placeholder="seu@email.com"
                  maxLength={180}
                  required
                />
              </div>
            </div>

            <div className="perfil-nota">
              <ShieldCheck size={18} />
              <p>
                Seus dados são salvos localmente neste navegador. A integração
                com o servidor pode ser feita posteriormente.
              </p>
            </div>

            {mensagem && (
              <div className="perfil-mensagem" role="status">
                <CheckCircle2 size={19} />
                <span>{mensagem}</span>
              </div>
            )}

            <div className="perfil-acoes">
              <button type="submit" className="perfil-botao">
                <Save size={17} />
                Salvar alterações
              </button>
            </div>
          </form>
        </section>

        <section className="perfil-atalhos">
          <div className="perfil-atalhos-titulo">
            <h2>Seus atalhos</h2>
            <p>Acesse rapidamente as áreas do Harvest Hope.</p>
          </div>

          <div className="perfil-atalhos-grid">
            <Link to="/doacoes" className="perfil-atalho">
              <span className="perfil-atalho-icone">
                <HeartHandshake size={21} />
              </span>
              <span className="perfil-atalho-texto">
                <strong>Doações</strong>
                <small>Explore alimentos disponíveis</small>
              </span>
              <span className="perfil-atalho-seta">↗</span>
            </Link>

            <Link to="/solicitacoes" className="perfil-atalho">
              <span className="perfil-atalho-icone">
                <ClipboardList size={21} />
              </span>
              <span className="perfil-atalho-texto">
                <strong>Solicitações</strong>
                <small>Acompanhe seus pedidos</small>
              </span>
              <span className="perfil-atalho-seta">↗</span>
            </Link>
          </div>
        </section>

        <p className="perfil-rodape">
          Harvest Hope <span>·</span> Cuidar também é compartilhar.
        </p>
      </div>
    </main>
  );
}
