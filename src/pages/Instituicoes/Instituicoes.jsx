import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Instituicoes.css";

function Instituicoes() {
  const [instituicoes, setInstituicoes] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarInstituicoes() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await api.get("/api/v1/instituicoes");
        setInstituicoes(resposta.data);
      } catch (error) {
        console.error("Erro ao carregar instituições:", error);
        setErro(
          "Não foi possível carregar as instituições. Tente novamente."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarInstituicoes();
  }, []);

  const termo = pesquisa.toLowerCase();

  const instituicoesFiltradas = instituicoes.filter((instituicao) => {
    return (
      instituicao.nome?.toLowerCase().includes(termo) ||
      instituicao.localizacao?.toLowerCase().includes(termo) ||
      instituicao.descricao?.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="instituicoes-container">
      <header className="instituicoes-header">
        <h1>Instituições</h1>
        <p>
          Consulte as instituições cadastradas e encontre informações
          de contato, localização e descrição de cada organização.
        </p>
      </header>

      <div className="pesquisa-container">
        <input
          type="text"
          placeholder="Pesquisar por nome, localização ou descrição..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          aria-label="Pesquisar instituição"
        />
      </div>

      {carregando ? (
        <div className="sem-resultados">
          <p>Carregando instituições...</p>
        </div>
      ) : erro ? (
        <div className="sem-resultados" role="alert">
          <h3>Não foi possível carregar</h3>
          <p>{erro}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      ) : instituicoesFiltradas.length === 0 ? (
        <div className="sem-resultados">
          <h3>Nenhuma instituição encontrada</h3>
          <p>
            Tente utilizar outros termos na pesquisa para localizar
            uma instituição.
          </p>
        </div>
      ) : (
        <div className="instituicoes-grid">
          {instituicoesFiltradas.map((instituicao) => (
            <article
              className="instituicao-card"
              key={instituicao.id}
            >
              <div className="card-topo">
                <h2>{instituicao.nome}</h2>
              </div>

              <div className="card-conteudo">
                <p>
                  <strong>Descrição:</strong>{" "}
                  {instituicao.descricao || "Não informada"}
                </p>

                <p>
                  <strong>Localização:</strong>{" "}
                  {instituicao.localizacao || "Não informada"}
                </p>

                <p>
                  <strong>E-mail:</strong>{" "}
                  {instituicao.email || "Não informado"}
                </p>

                <p>
                  <strong>Telefone:</strong>{" "}
                  {instituicao.telefone || "Não informado"}
                </p>

                <p>
                  <strong>CNPJ:</strong>{" "}
                  {instituicao.cnpj || "Não informado"}
                </p>
              </div>

              {instituicao.site && (
                <div className="card-acoes">
                  <a
                    className="site-button"
                    href={instituicao.site}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visitar site
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Instituicoes;