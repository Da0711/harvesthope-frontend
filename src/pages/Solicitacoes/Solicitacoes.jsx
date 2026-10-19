
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  Clock3,
  ChevronRight,
  ChevronDown,
  Check,
  Package,
  MapPin,
  CalendarDays,
  Trash2,
  Search,
  AlertCircle,
} from "lucide-react";

import { carregarDoacoes } from "../../data/doacoes";
import "./Solicitacoes.css";

const CHAVE_SOLICITACOES = "harvesthope_solicitacoes";

function carregarSolicitacoes() {
  try {
    const dados = JSON.parse(
      localStorage.getItem(CHAVE_SOLICITACOES) || "[]"
    );

    return Array.isArray(dados) ? dados : [];
  } catch (erro) {
    console.error("Erro ao carregar solicitações:", erro);
    return [];
  }
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

function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}


function SeletorStatus({ valor, onChange }) {
  const [aberto, setAberto] = useState(false);
  const opcoes = [
    { valor: "todos", texto: "Todos os status", cor: "todos" },
    { valor: "Pendente", texto: "Pendente", cor: "pendente" },
    { valor: "Em análise", texto: "Em análise", cor: "analise" },
    { valor: "Aprovada", texto: "Aprovada", cor: "aprovada" },
    { valor: "Aceita", texto: "Aceita", cor: "aceita" },
    { valor: "Concluída", texto: "Concluída", cor: "concluida" },
  ];
  const selecionada = opcoes.find((opcao) => opcao.valor === valor) || opcoes[0];

  function selecionar(opcao) {
    onChange(opcao.valor);
    setAberto(false);
  }

  return (
    <div className={`seletor-status ${aberto ? "esta-aberto" : ""}`}>
      <button
        type="button"
        className={`seletor-status-botao status-${selecionada.cor}`}
        aria-label="Filtrar por status"
        aria-expanded={aberto}
        aria-haspopup="listbox"
        onClick={() => setAberto((anterior) => !anterior)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setAberto(false);
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setAberto(true);
          }
        }}
      >
        <span className="seletor-status-texto">
          <span className="seletor-status-ponto" />
          {selecionada.texto}
        </span>
        <ChevronDown size={17} className="seletor-status-seta" />
      </button>

      {aberto && (
        <>
          <button
            type="button"
            className="seletor-status-fechar"
            aria-label="Fechar opções de status"
            onClick={() => setAberto(false)}
          />
          <div className="seletor-status-opcoes" role="listbox" aria-label="Opções de status">
            {opcoes.map((opcao, index) => (
              <button
                type="button"
                role="option"
                aria-selected={valor === opcao.valor}
                key={opcao.valor}
                className={`seletor-status-opcao status-${opcao.cor} ${
                  valor === opcao.valor ? "selecionada" : ""
                }`}
                style={{ "--atraso": `${index * 35}ms` }}
                onClick={() => selecionar(opcao)}
              >
                <span className="seletor-status-ponto" />
                <span>{opcao.texto}</span>
                {valor === opcao.valor && (
                  <Check size={16} className="seletor-status-check" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Solicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState(
    carregarSolicitacoes
  );

  const [pesquisa, setPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  // Busca os dados mais recentes das doações.
  const doacoes = carregarDoacoes();

  function obterDoacaoAtual(item) {
    if (item.doacaoId == null) return null;

    return (
      doacoes.find(
        (doacao) =>
          String(doacao.id) === String(item.doacaoId)
      ) || null
    );
  }

  function obterNomeDoacao(item) {
    const doacao = obterDoacaoAtual(item);

    return (
      doacao?.nomeAlimento ||
      item.nomeAlimento ||
      item.doacaoNome ||
      item.nome ||
      "Doação solicitada"
    );
  }

  function obterQuantidade(item) {
    const doacao = obterDoacaoAtual(item);

    const quantidade = doacao
      ? doacao.quantidade
      : item.quantidade;

    const unidade = doacao
      ? doacao.unidade
      : item.unidade;

    if (quantidade == null || quantidade === "") {
      return "Não informada";
    }

    return `${quantidade}${unidade ? ` ${unidade}` : ""}`;
  }

  function obterDoador(item) {
    const doacao = obterDoacaoAtual(item);

    const doadorAtual = doacao?.doador;

    if (typeof doadorAtual === "string" && doadorAtual) {
      return doadorAtual;
    }

    if (doadorAtual && typeof doadorAtual === "object") {
      return doadorAtual.nome || item.doador || "Não informado";
    }

    return item.doador || "Não informado";
  }

  function obterLocal(item) {
    const doacao = obterDoacaoAtual(item);

    return (
      doacao?.localRetirada ||
      item.localRetirada ||
      "Local não informado"
    );
  }

  function cancelarSolicitacao(id) {
    const confirmar = window.confirm(
      "Tem certeza de que deseja cancelar esta solicitação? " +
        "Essa ação removerá o pedido da sua lista."
    );

    if (!confirmar) return;

    const atualizadas = solicitacoes.filter(
      (item) => String(item.id) !== String(id)
    );

    try {
      localStorage.setItem(
        CHAVE_SOLICITACOES,
        JSON.stringify(atualizadas)
      );

      setSolicitacoes(atualizadas);
    } catch (erro) {
      console.error("Erro ao cancelar solicitação:", erro);

      window.alert(
        "Não foi possível cancelar a solicitação. Tente novamente."
      );
    }
  }

  const solicitacoesFiltradas = solicitacoes.filter((item) => {
    const nome = obterNomeDoacao(item);
    const doador = obterDoador(item);
    const status = item.status || "Pendente";

    const correspondePesquisa = normalizarTexto(
      `${nome} ${doador}`
    ).includes(normalizarTexto(pesquisa));

    const correspondeStatus =
      filtroStatus === "todos" ||
      normalizarTexto(status) === normalizarTexto(filtroStatus);

    return correspondePesquisa && correspondeStatus;
  });

  return (
    <main className="solicitacoes-page">
      <div className="solicitacoes-container">
        <header className="solicitacoes-header">
          <Link to="/home" className="solicitacoes-voltar">
            <ArrowLeft size={17} />
            Voltar ao início
          </Link>

          <div className="solicitacoes-titulo">
            <div className="solicitacoes-icone">
              <ClipboardList size={25} />
            </div>

            <div>
              <h1>Minhas solicitações</h1>
              <p>
                Acompanhe seus pedidos e as próximas etapas da retirada.
              </p>
            </div>
          </div>

          <div className="solicitacoes-resumo">
            <span>Total de solicitações</span>
            <strong>{solicitacoes.length}</strong>
          </div>
        </header>

        <section className="solicitacoes-filtros">
          <label className="solicitacoes-pesquisa">
            <Search size={18} />

            <input
              type="search"
              value={pesquisa}
              onChange={(event) => setPesquisa(event.target.value)}
              placeholder="Pesquisar alimento ou doador..."
              aria-label="Pesquisar solicitações"
            />
          </label>

          <SeletorStatus
            valor={filtroStatus}
            onChange={setFiltroStatus}
          />
        </section>

        <div className="solicitacoes-aviso">
          <AlertCircle size={17} />
          <p>
            Confira as informações da doação antes de combinar
            a retirada. Os registros desta versão são demonstrativos.
          </p>
        </div>

        <section className="solicitacoes-lista">
          {solicitacoesFiltradas.length === 0 ? (
            <div className="solicitacoes-vazio">
              <div className="solicitacoes-vazio-icone">
                <Package size={35} />
              </div>

              <h2>
                {solicitacoes.length === 0
                  ? "Nenhuma solicitação ainda"
                  : "Nenhuma solicitação encontrada"}
              </h2>

              <p>
                {solicitacoes.length === 0
                  ? "Quando você solicitar uma doação, ela aparecerá aqui para acompanhar o andamento."
                  : "Tente alterar a pesquisa ou selecionar outro status."}
              </p>

              {solicitacoes.length === 0 && (
                <Link
                  to="/doacoes"
                  className="solicitacoes-botao-explorar"
                >
                  Explorar doações
                </Link>
              )}
            </div>
          ) : (
            solicitacoesFiltradas.map((item, index) => (
              <article
                className="solicitacao-item"
                key={item.id ?? index}
              >
                <div className="solicitacao-item-icone">
                  <Package size={25} />
                </div>

                <div className="solicitacao-item-conteudo">
                  <div className="solicitacao-item-cabecalho">
                    <h2>{obterNomeDoacao(item)}</h2>

                    <span
                      className={`solicitacao-status status-${normalizarTexto(
                        item.status || "Pendente"
                      ).replace(/\s+/g, "-")}`}
                    >
                      {item.status || "Pendente"}
                    </span>
                  </div>

                  <p className="solicitacao-doador">
                    <strong>Doador:</strong> {obterDoador(item)}
                  </p>

                  <p className="solicitacao-dado">
                    <Package size={15} />
                    <span>
                      <strong>Quantidade:</strong>{" "}
                      {obterQuantidade(item)}
                    </span>
                  </p>

                  <p className="solicitacao-dado">
                    <MapPin size={15} />
                    <span>
                      <strong>Retirada:</strong> {obterLocal(item)}
                    </span>
                  </p>

                  <p className="solicitacao-dado">
                    <CalendarDays size={15} />
                    <span>
                      <strong>Solicitada em:</strong>{" "}
                      {formatarData(item.data || item.criadaEm)}
                    </span>
                  </p>

                  <span className="solicitacao-identificador">
                    Pedido #{item.id}
                  </span>
                </div>

                <div className="solicitacao-item-acoes">
                  {item.id != null ? (
                    <Link
                      to={`/solicitacoes/${item.id}`}
                      className="solicitacao-ver-detalhes"
                    >
                      Ver detalhes
                      <ChevronRight size={17} />
                    </Link>
                  ) : (
                    <span className="solicitacao-sem-id">
                      Detalhes indisponíveis
                    </span>
                  )}

                  <button
                    type="button"
                    className="solicitacao-cancelar"
                    onClick={() => cancelarSolicitacao(item.id)}
                    disabled={item.id == null}
                  >
                    <Trash2 size={15} />
                    Cancelar solicitação
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        {solicitacoesFiltradas.length > 0 && (
          <p className="solicitacoes-rodape">
            Exibindo {solicitacoesFiltradas.length} de{" "}
            {solicitacoes.length} solicitações
          </p>
        )}
      </div>
    </main>
  );
}