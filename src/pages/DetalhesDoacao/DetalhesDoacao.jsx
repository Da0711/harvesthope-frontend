
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Package, CalendarDays } from "lucide-react";
import api from "../../services/api";
import "./DetalhesDoacao.css";

function formatarData(data) {
  if (!data) return "Não informada";

  const partes = String(data).split("-");

  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  return data;
}

export default function DetalhesDoacao() {
  const { id } = useParams();
  const [doacao, setDoacao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDoacao() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await api.get(`/api/v1/doacoes/${id}`);
        setDoacao(resposta.data);
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
        setErro("Não foi possível carregar os detalhes desta doação.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDoacao();
  }, [id]);

  if (carregando) {
    return (
      <main className="detalhes-container">
        <p>Carregando detalhes da doação...</p>
      </main>
    );
  }

  if (erro || !doacao) {
    return (
      <main className="detalhes-container">
        <h1>Doação não encontrada</h1>
        <p>{erro || "Não encontramos esta doação."}</p>
        <Link to="/doacoes" className="detalhes-voltar">
          <ArrowLeft size={17} /> Voltar para doações
        </Link>
      </main>
    );
  }

  return (
    <main className="detalhes-container">
      <header className="detalhes-header">
        <Link to="/doacoes" className="detalhes-voltar">
          <ArrowLeft size={17} />
          Voltar para explorar doações
        </Link>

        <h1>Detalhes da doação</h1>
        <p>Confira os alimentos e as informações compartilhadas pelo doador.</p>
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
              <Package size={64} />
              <span>Foto do alimento não informada</span>
            </div>
          )}
        </div>

        <div className="detalhes-informacoes">
          <span className="detalhes-status">
            {doacao.status || "Status não informado"}
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
                  {doacao.quantidade ?? "Não informada"}{" "}
                  {doacao.unidade || ""}
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
            <h3>{doacao.doador?.nome || "Doador não informado"}</h3>
            <p>
              {doacao.doador?.tipoUsuario || "Informações do doador"}
            </p>
          </div>

          <div className="detalhes-retirada">
            <h3>
              <MapPin size={18} /> Local de retirada
            </h3>
            <p>{doacao.localRetirada || "Local não informado"}</p>
          </div>

          <div className="detalhes-aviso">
            A validade e a descrição são informações fornecidas pelo doador.
            Confira as condições dos alimentos antes de combinar a retirada.
          </div>

          <button
            type="button"
            className="detalhes-botao-solicitar"
            onClick={() => {
              alert(
                "A solicitação de doação ainda será implementada. Nenhuma solicitação foi enviada."
              );
            }}
            disabled={
              (doacao.status || "").toLowerCase() !== "disponível"
            }
          >
            Solicitar doação
          </button>
        </div>
      </section>
    </main>
  );
}
