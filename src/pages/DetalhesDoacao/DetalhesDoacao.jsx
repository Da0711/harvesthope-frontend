
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Package,
  CalendarDays,
  UserRound,
  Utensils,
} from "lucide-react";

import { buscarDoacaoPorId } from "../../data/doacoes";
import "./DetalhesDoacao.css";

const CHAVE_SOLICITACOES = "harvesthope_solicitacoes";

function formatarData(data) {
  if (!data) return "Não informada";

  const partes = String(data).split("-");

  if (partes.length === 3 && partes[0].length === 4) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  return data;
}

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

export default function DetalhesDoacao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const doacao = buscarDoacaoPorId(id);

  const [solicitacaoEnviada, setSolicitacaoEnviada] = useState(
    () =>
      carregarSolicitacoes().some(
        (item) => String(item.doacaoId) === String(id)
      )
  );

  if (!doacao) {
    return (
      <main className="detalhes-container">
        <header className="detalhes-header">
          <Link to="/doacoes" className="detalhes-voltar">
            <ArrowLeft size={17} />
            Voltar para doações
          </Link>

          <h1>Doação não encontrada</h1>
          <p>
            Não encontramos essa doação. Volte à listagem
            e selecione um alimento.
          </p>
        </header>
      </main>
    );
  }

  const doadorNome =
    typeof doacao.doador === "string"
      ? doacao.doador
      : doacao.doador?.nome || "Doador demonstrativo";

  const doadorTipo =
    typeof doacao.doador === "object" && doacao.doador !== null
      ? doacao.doador.tipoUsuario || "Doador de alimentos"
      : "Doador de alimentos";

  function solicitarDoacao() {
    if (solicitacaoEnviada) {
      navigate("/solicitacoes");
      return;
    }

    if (
      !window.confirm(
        `Deseja solicitar a doação de ${doacao.nomeAlimento}?`
      )
    ) {
      return;
    }

    try {
      const solicitacoes = carregarSolicitacoes();

      const jaExiste = solicitacoes.some(
        (item) => String(item.doacaoId) === String(doacao.id)
      );

      if (jaExiste) {
        setSolicitacaoEnviada(true);
        window.alert("Você já solicitou esta doação.");
        navigate("/solicitacoes");
        return;
      }

      const novaSolicitacao = {
        id: `SOL-${Date.now()}`,
        doacaoId: doacao.id,
        nomeAlimento: doacao.nomeAlimento,
        quantidade: doacao.quantidade,
        unidade: doacao.unidade,
        dataValidade: doacao.dataValidade,
        localRetirada: doacao.localRetirada,
        doador: doadorNome,
        instituicao: "Não informada",
        data: new Date().toLocaleDateString("pt-BR"),
        criadaEm: new Date().toISOString(),
        status: "Pendente",
      };

      const atualizadas = [...solicitacoes, novaSolicitacao];

      localStorage.setItem(
        CHAVE_SOLICITACOES,
        JSON.stringify(atualizadas)
      );

      setSolicitacaoEnviada(true);

      window.alert("Solicitação registrada com sucesso!");

      navigate("/solicitacoes");
    } catch (erro) {
      console.error("Erro ao salvar solicitação:", erro);
      window.alert(
        "Não foi possível salvar a solicitação. Tente novamente."
      );
    }
  }

  return (
    <main className="detalhes-container">
      <header className="detalhes-header">
        <Link to="/doacoes" className="detalhes-voltar">
          <ArrowLeft size={17} />
          Voltar para explorar doações
        </Link>

        <h1>Detalhes da doação</h1>

        <p>
          Confira os alimentos e as informações compartilhadas
          pelo doador.
        </p>
      </header>

      <section className="detalhes-conteudo">
        <div className="detalhes-imagem">
          {doacao.foto ? (
            <img
              src={doacao.foto}
              alt={doacao.nomeAlimento}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="detalhes-imagem-placeholder">
              <Utensils size={64} />
              <span>Foto do alimento não informada</span>
            </div>
          )}
        </div>

        <div className="detalhes-informacoes">
          <span className="detalhes-status">
            {doacao.status || "Disponível"}
          </span>

          <h2>{doacao.nomeAlimento}</h2>

          <p className="detalhes-descricao">
            {doacao.descricao || "Nenhuma descrição foi informada."}
          </p>

          <div className="detalhes-dados">
            <div className="detalhes-dado">
              <Package size={19} />
              <div>
                <strong>Quantidade</strong>
                <span>
                  {doacao.quantidade} {doacao.unidade}
                </span>
              </div>
            </div>

            <div className="detalhes-dado">
              <CalendarDays size={19} />
              <div>
                <strong>Validade informada</strong>
                <span>{formatarData(doacao.dataValidade)}</span>
              </div>
            </div>
          </div>

          <div className="detalhes-doador">
            <h3>
              <UserRound
                size={18}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: 8,
                }}
              />
              {doadorNome}
            </h3>
            <p>{doadorTipo}</p>
          </div>

          <div className="detalhes-retirada">
            <h3>
              <MapPin size={18} />
              Local de retirada
            </h3>
            <p>{doacao.localRetirada || "Local não informado"}</p>
          </div>

          <div className="detalhes-aviso">
            As solicitações são armazenadas localmente neste navegador
            para demonstração. Nenhuma solicitação real é enviada.
          </div>

          {solicitacaoEnviada && (
            <div className="detalhes-aviso" role="status">
              Você já solicitou esta doação.
            </div>
          )}

          <button
            type="button"
            className="detalhes-botao-solicitar"
            onClick={solicitarDoacao}
          >
            {solicitacaoEnviada
              ? "Ver minhas solicitações"
              : "Solicitar doação"}
          </button>
        </div>
      </section>
    </main>
  );
}