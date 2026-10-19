
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Phone,
  Mail,
  Heart,
  CircleHelp,
} from "lucide-react";
import "./DetalhesInstituicao.css";

const instituicoesDemonstracao = [
  {
    id: "1",
    nome: "Instituição Esperança",
    categoria: "Assistência social",
    descricao:
      "Organização dedicada a apoiar famílias em situação de vulnerabilidade por meio de ações solidárias e distribuição de alimentos.",
    endereco: "Osasco - SP",
    telefone: "Não informado",
    email: "Não informado",
  },
  {
    id: "2",
    nome: "Centro Comunitário Vida",
    categoria: "Apoio comunitário",
    descricao:
      "Centro comunitário que promove iniciativas de apoio às pessoas da comunidade e incentiva a solidariedade.",
    endereco: "Osasco - SP",
    telefone: "Não informado",
    email: "Não informado",
  },
];

export default function DetalhesInstituicao() {
  const { id } = useParams();

  let instituicoesSalvas = [];

  try {
    const dados = JSON.parse(
      localStorage.getItem("harvesthope_instituicoes") || "[]"
    );

    if (Array.isArray(dados)) {
      instituicoesSalvas = dados;
    }
  } catch {
    instituicoesSalvas = [];
  }

  const instituicao =
    instituicoesSalvas.find(
      (item) => String(item.id) === String(id)
    ) ||
    instituicoesDemonstracao.find(
      (item) => String(item.id) === String(id)
    );

  if (!instituicao) {
    return (
      <main className="detalhe-instituicao-page">
        <Link to="/instituicoes" className="di-voltar">
          <ArrowLeft size={18} />
          Voltar às instituições
        </Link>

        <section className="di-card di-vazio">
          <CircleHelp size={42} />
          <h1>Instituição não encontrada</h1>
          <p>Não encontramos uma instituição com esse identificador.</p>
          <Link to="/instituicoes" className="di-botao">
            Ver instituições
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="detalhe-instituicao-page">
      <header className="di-header">
        <Link to="/instituicoes" className="di-voltar">
          <ArrowLeft size={18} />
          Voltar às instituições
        </Link>

        <div className="di-capa">
          <div className="di-capa-icone">
            <Building2 size={38} />
          </div>
          <span>{instituicao.categoria || "Instituição social"}</span>
        </div>
      </header>

      <div className="di-layout">
        <section className="di-card di-principal">
          <h1>{instituicao.nome || instituicao.nomeInstituicao}</h1>

          <p className="di-descricao">
            {instituicao.descricao ||
              "Esta instituição participa da rede de solidariedade do Harvest Hope."}
          </p>

          <div className="di-informacoes">
            <div>
              <MapPin size={20} />
              <div>
                <span>Localização</span>
                <strong>
                  {instituicao.endereco ||
                    instituicao.localizacao ||
                    instituicao.local ||
                    "Não informada"}
                </strong>
              </div>
            </div>

            <div>
              <Phone size={20} />
              <div>
                <span>Telefone</span>
                <strong>{instituicao.telefone || "Não informado"}</strong>
              </div>
            </div>

            <div>
              <Mail size={20} />
              <div>
                <span>E-mail</span>
                <strong>{instituicao.email || "Não informado"}</strong>
              </div>
            </div>
          </div>

          <Link to="/instituicoes" className="di-botao-secundario">
            Voltar à lista
          </Link>
        </section>

        <aside className="di-card di-solidariedade">
          <div className="di-solidariedade-icone">
            <Heart size={25} />
          </div>

          <h2>Faça parte dessa corrente</h2>

          <p>
            Conheça as doações disponíveis e ajude a fortalecer
            iniciativas de solidariedade.
          </p>

          <Link to="/doacoes" className="di-botao">
            Explorar doações
          </Link>
        </aside>
      </div>
    </main>
  );
}
