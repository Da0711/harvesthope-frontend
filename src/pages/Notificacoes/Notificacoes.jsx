
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  ClipboardList,
  Package,
  Info,
  Trash2,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";
import "./Notificacoes.css";

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState([]);

  // Avisa os outros componentes que as notificações mudaram.
  function avisarAtualizacao() {
    window.dispatchEvent(
      new Event("notificacoes:atualizadas")
    );
  }

  const carregarNotificacoes = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await api.get("/api/v1/notificacoes");

      const lista = Array.isArray(resposta.data)
        ? resposta.data
        : [];

      setNotificacoes(lista);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);

      if (error.response?.status === 401) {
        setErro(
          "Sua sessão expirou ou você não está autenticado. Entre novamente no sistema."
        );
      } else if (error.response?.status === 403) {
        setErro(
          "Você não tem permissão para consultar as notificações."
        );
      } else {
        setErro(
          "Não foi possível carregar as notificações. Verifique se o servidor está funcionando."
        );
      }
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarNotificacoes();
  }, [carregarNotificacoes]);

  const naoLidas = notificacoes.filter(
    (item) => !item.lida
  ).length;

  function formatarData(data) {
    if (!data) return "Data não informada";

    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) {
      return "Data não informada";
    }

    return dataFormatada.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function executarAcao(chave, acao) {
    if (processando.includes(chave)) return;

    setProcessando((anteriores) => [...anteriores, chave]);
    setErro("");

    try {
      await acao();

      // Recarrega a lista após concluir a operação.
      await carregarNotificacoes();

      // Atualiza o contador do sino.
      avisarAtualizacao();
    } catch (error) {
      console.error("Erro ao executar ação:", error);

      if (error.response?.status === 401) {
        setErro(
          "Sua sessão expirou. Entre novamente no sistema."
        );
      } else if (error.response?.status === 404) {
        setErro(
          "A notificação não foi encontrada. Atualize a lista e tente novamente."
        );
      } else {
        setErro(
          error.response?.data?.mensagem ||
            "Não foi possível concluir a operação. Tente novamente."
        );
      }
    } finally {
      setProcessando((anteriores) =>
        anteriores.filter((item) => item !== chave)
      );
    }
  }

  function marcarComoLida(id) {
    return executarAcao(`lida-${id}`, () =>
      api.patch(`/api/v1/notificacoes/${id}/lida`)
    );
  }

  function marcarTodasComoLidas() {
    const pendentes = notificacoes.filter(
      (item) => !item.lida
    );

    return executarAcao("todas-lidas", async () => {
      for (const item of pendentes) {
        await api.patch(
          `/api/v1/notificacoes/${item.id}/lida`
        );
      }
    });
  }

  function removerNotificacao(id) {
    if (!window.confirm("Deseja excluir esta notificação?")) {
      return;
    }

    return executarAcao(`excluir-${id}`, () =>
      api.delete(`/api/v1/notificacoes/${id}`)
    );
  }

  function limparNotificacoes() {
    if (
      !window.confirm(
        "Deseja excluir todas as suas notificações? Essa ação não pode ser desfeita."
      )
    ) {
      return;
    }

    return executarAcao("excluir-todas", () =>
      api.delete("/api/v1/notificacoes")
    );
  }

  function iconeNotificacao(tipo) {
    switch (tipo?.toUpperCase()) {
      case "SOLICITACAO":
        return <ClipboardList size={21} />;

      case "DOACAO":
        return <Package size={21} />;

      default:
        return <Info size={21} />;
    }
  }

  return (
    <main className="notificacoes-page">
      <header className="notificacoes-header">
        <Link to="/home" className="notificacoes-voltar">
          <ArrowLeft size={18} />
          Voltar ao início
        </Link>

        <div className="notificacoes-titulo">
          <div className="notificacoes-icone-principal">
            <Bell size={26} />
          </div>

          <div>
            <h1>Notificações</h1>
            <p>
              Acompanhe as novidades e atualizações do Harvest Hope.
            </p>
          </div>
        </div>
      </header>

      <section className="notificacoes-conteudo">
        <div className="notificacoes-acoes">
          <div>
            <h2>Suas notificações</h2>
            <p>
              {naoLidas === 0
                ? "Você não tem notificações não lidas."
                : `Você tem ${naoLidas} notificação(ões) não lida(s).`}
            </p>
          </div>

          <div className="notificacoes-botoes">
            {naoLidas > 0 && (
              <button
                type="button"
                className="notificacoes-botao-secundario"
                onClick={marcarTodasComoLidas}
                disabled={processando.includes("todas-lidas")}
              >
                <CheckCheck size={17} />
                Marcar todas como lidas
              </button>
            )}

            {notificacoes.length > 0 && (
              <button
                type="button"
                className="notificacoes-botao-excluir"
                onClick={limparNotificacoes}
                disabled={processando.includes("excluir-todas")}
              >
                <Trash2 size={17} />
                Limpar
              </button>
            )}

            <button
              type="button"
              className="notificacoes-botao-secundario"
              onClick={carregarNotificacoes}
              disabled={carregando}
              title="Atualizar notificações"
            >
              <RefreshCw size={16} />
              Atualizar
            </button>
          </div>
        </div>

        {erro && (
          <div role="alert" className="notificacoes-erro">
            <p>{erro}</p>

            <button
              type="button"
              className="notificacoes-botao-secundario"
              onClick={carregarNotificacoes}
              disabled={carregando}
            >
              <RefreshCw size={16} />
              Tentar novamente
            </button>
          </div>
        )}

        {carregando ? (
          <div className="notificacoes-vazio" role="status">
            <LoaderCircle
              className="notificacoes-carregando-icone"
              size={34}
            />
            <h3>Carregando notificações...</h3>
            <p>
              Aguarde enquanto buscamos suas atualizações.
            </p>
          </div>
        ) : notificacoes.length === 0 ? (
          <div className="notificacoes-vazio">
            <div className="notificacoes-icone-vazio">
              <Bell size={34} />
            </div>

            <h3>Nenhuma notificação por enquanto</h3>

            <p>
              Quando houver atualizações sobre suas doações e
              solicitações, elas aparecerão aqui.
            </p>

            <Link
              to="/solicitacoes"
              className="notificacoes-botao-principal"
            >
              Ver minhas solicitações
            </Link>
          </div>
        ) : (
          <div className="notificacoes-lista">
            {notificacoes.map((item) => (
              <article
                key={item.id}
                className={`notificacao-item ${
                  item.lida
                    ? "notificacao-lida"
                    : "notificacao-nao-lida"
                }`}
              >
                <div className="notificacao-icone">
                  {iconeNotificacao(item.tipo)}
                </div>

                <div className="notificacao-texto">
                  <div className="notificacao-titulo-linha">
                    <h3>{item.titulo || "Notificação"}</h3>

                    {!item.lida && (
                      <span
                        className="notificacao-ponto"
                        aria-label="Notificação não lida"
                      />
                    )}
                  </div>

                  <p>{item.mensagem || ""}</p>

                  <span className="notificacao-data">
                    {formatarData(item.dataCriacao)}
                  </span>

                  {item.solicitacaoId && (
                    <Link
                      to="/solicitacoes"
                      className="notificacao-link"
                    >
                      Ver solicitações
                    </Link>
                  )}
                </div>

                <div className="notificacao-acoes">
                  {!item.lida && (
                    <button
                      type="button"
                      onClick={() => marcarComoLida(item.id)}
                      disabled={processando.includes(
                        `lida-${item.id}`
                      )}
                      aria-label="Marcar notificação como lida"
                      title="Marcar como lida"
                    >
                      <CheckCheck size={18} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removerNotificacao(item.id)}
                    disabled={processando.includes(
                      `excluir-${item.id}`
                    )}
                    aria-label="Excluir notificação"
                    title="Excluir notificação"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
