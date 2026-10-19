import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Package,
  Truck,
  CircleHelp,
} from "lucide-react";

import { buscarDoacaoPorId } from "../../data/doacoes";
import "./DetalhesSolicitacao.css";

const CHAVE_SOLICITACOES = "harvesthope_solicitacoes";

function carregarSolicitacoes() {
  try {
    const dados = JSON.parse(
      localStorage.getItem(CHAVE_SOLICITACOES) || "[]"
    );

    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function normalizarStatus(valor) {
  return String(valor || "Pendente")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatarData(data) {
  if (!data) return "Não informada";

  const valor = String(data);

  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [ano, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  if (valor.includes("T")) {
    const dataConvertida = new Date(valor);

    if (!Number.isNaN(dataConvertida.getTime())) {
      return dataConvertida.toLocaleDateString("pt-BR");
    }
  }

  return valor;
}

export default function DetalhesSolicitacao() {
  const { id } = useParams();

  const solicitacoes = carregarSolicitacoes();

  const solicitacao = solicitacoes.find(
    (item) => String(item.id) === String(id)
  );

  if (!solicitacao) {
    return (
      <main className="detalhe-solicitacao-page">
        <div className="ds-container">
          <Link to="/solicitacoes" className="ds-voltar">
            <ArrowLeft size={18} />
            Voltar às solicitações
          </Link>

          <section className="ds-card ds-nao-encontrada">
            <div className="ds-nao-encontrada-icone">
              <CircleHelp size={42} />
            </div>
            <h1>Solicitação não encontrada</h1>
            <p>
              Não encontramos uma solicitação com esse identificador.
            </p>
            <Link to="/solicitacoes" className="ds-botao">
              Ver solicitações
            </Link>
          </section>
        </div>
      </main>
    );
  }

  // Busca os dados atuais da doação pelo ID original.
  const doacaoAtual =
    solicitacao.doacaoId != null
      ? buscarDoacaoPorId(solicitacao.doacaoId)
      : null;

  // Prioriza os dados atuais e usa os dados salvos como alternativa.
  const nomeAlimentoAtual =
    doacaoAtual?.nomeAlimento ||
    solicitacao.nomeAlimento ||
    solicitacao.doacaoNome ||
    solicitacao.nome ||
    "Doação solicitada";

  const quantidadeAtual =
    doacaoAtual?.quantidade ?? solicitacao.quantidade;

  const unidadeAtual =
    doacaoAtual?.unidade ?? solicitacao.unidade;

  const validadeAtual =
    doacaoAtual?.dataValidade || solicitacao.dataValidade;

  const localAtual =
    doacaoAtual?.localRetirada ||
    solicitacao.localRetirada ||
    "Local não informado";

  const doadorAtual =
    typeof doacaoAtual?.doador === "string"
      ? doacaoAtual.doador
      : doacaoAtual?.doador?.nome ||
        solicitacao.doador ||
        "Não informado";

  const statusOriginal = String(solicitacao.status || "Pendente");
  const status = normalizarStatus(statusOriginal);

  const etapas = [
    {
      titulo: "Solicitação enviada",
      descricao: "A solicitação foi registrada.",
      icone: CheckCircle2,
      concluida: true,
    },
    {
      titulo: "Em análise",
      descricao: "A instituição verifica a solicitação.",
      icone: Clock3,
      concluida: [
        "em analise",
        "aprovada",
        "aceita",
        "concluida",
      ].includes(status),
    },
    {
      titulo: "Aprovada",
      descricao: "A solicitação foi aprovada pela instituição.",
      icone: Package,
      concluida: ["aprovada", "aceita", "concluida"].includes(status),
    },
    {
      titulo: "Concluída",
      descricao: "O processo foi finalizado.",
      icone: Truck,
      concluida: status === "concluida",
    },
  ];

  return (
    <main className="detalhe-solicitacao-page">
      <div className="ds-container">
        <header className="ds-header">
          <Link to="/solicitacoes" className="ds-voltar">
            <ArrowLeft size={18} />
            Voltar às solicitações
          </Link>

          <div className="ds-cabecalho-principal">
            <div className="ds-cabecalho-icone">
              <Package size={27} />
            </div>
            <div className="ds-cabecalho-texto">
              <p className="ds-identificador">
                Solicitação <span>#{solicitacao.id}</span>
              </p>
              <h1>Detalhes da solicitação</h1>
              <p className="ds-subtitulo">
                Acompanhe as informações e o andamento do seu pedido.
              </p>
            </div>
            <span
              className={`ds-status ds-status-${status.replace(/\s+/g, "-")}`}
            >
              <span className="ds-status-ponto" />
              {statusOriginal}
            </span>
          </div>
        </header>

        <div className="ds-layout">
          <section className="ds-card ds-card-informacoes">
            <div className="ds-titulo-card">
              <div className="ds-titulo-icone">
                <Package size={20} />
              </div>
              <div>
                <h2>Informações da solicitação</h2>
                <p>Confira os dados associados ao pedido.</p>
              </div>
            </div>

            <div className="ds-informacoes-lista">
              <div className="ds-informacao ds-informacao-destaque">
                <span>Doação solicitada</span>
                <strong>{nomeAlimentoAtual}</strong>
              </div>

              <div className="ds-informacao">
                <span>Quantidade</span>
                <strong>
                  {quantidadeAtual != null
                    ? `${quantidadeAtual}${unidadeAtual ? ` ${unidadeAtual}` : ""}`
                    : "Não informada"}
                </strong>
              </div>

              <div className="ds-informacao">
                <span>Validade</span>
                <strong>{formatarData(validadeAtual)}</strong>
              </div>

              <div className="ds-informacao">
                <span>Local de retirada</span>
                <strong>{localAtual}</strong>
              </div>

              <div className="ds-informacao">
                <span>Doador</span>
                <strong>{doadorAtual}</strong>
              </div>

              <div className="ds-informacao">
                <span>Instituição</span>
                <strong>{solicitacao.instituicao || "Não informada"}</strong>
              </div>

              <div className="ds-informacao">
                <span>Data da solicitação</span>
                <strong>
                  {formatarData(solicitacao.data || solicitacao.criadaEm)}
                </strong>
              </div>

              <div className="ds-informacao ds-informacao-status">
                <span>Status atual</span>
                <strong className={`ds-status ds-status-${status.replace(/\s+/g, "-")}`}>
                  <span className="ds-status-ponto" />
                  {statusOriginal}
                </strong>
              </div>
            </div>
          </section>

          <section className="ds-card ds-card-acompanhamento">
            <div className="ds-titulo-card">
              <div className="ds-titulo-icone">
                <Clock3 size={20} />
              </div>
              <div>
                <h2>Acompanhamento</h2>
                <p>Etapas do andamento da solicitação.</p>
              </div>
            </div>

            <div className="ds-etapas">
              {etapas.map((etapa, index) => {
                const Icone = etapa.icone;

                return (
                  <div
                    key={etapa.titulo}
                    className={`ds-etapa ${
                      etapa.concluida ? "concluida" : ""
                    }`}
                    style={{ "--ds-atraso": `${index * 100}ms` }}
                  >
                    <div className="ds-etapa-trilho">
                      <div className="ds-etapa-icone">
                        <Icone size={19} />
                      </div>
                    </div>

                    <div className="ds-etapa-texto">
                      <div className="ds-etapa-titulo">
                        <strong>{etapa.titulo}</strong>
                        {etapa.concluida && (
                          <span className="ds-etapa-concluida">
                            <CheckCircle2 size={14} />
                            Concluída
                          </span>
                        )}
                      </div>
                      <p>{etapa.descricao}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="ds-acompanhamento-nota">
              <CircleHelp size={17} />
              <p>
                As etapas são uma representação visual baseada no status
                registrado para esta solicitação.
              </p>
            </div>
          </section>
        </div>

        <div className="ds-aviso">
          <CircleHelp size={17} />
          <p>
            Os dados desta tela são demonstrativos e armazenados localmente
            neste navegador.
          </p>
        </div>
      </div>
    </main>
  );
}
