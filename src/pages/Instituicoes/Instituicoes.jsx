import { useState } from "react";
import { Search, MapPin, Mail, Phone, Building2, ExternalLink } from "lucide-react";
import "./Instituicoes.css";

const instituicoesExemplo = [
  {
    id: 1,
    nome: "Instituto Esperança",
    descricao:
      "Organização dedicada a apoiar famílias em situação de vulnerabilidade por meio da distribuição de alimentos e assistência social.",
    localizacao: "Centro, Osasco - SP",
    email: "contato@exemplo.com",
    telefone: "(11) 3000-1001",
    cnpj: "00.000.000/0001-01",
    site: "",
  },
  {
    id: 2,
    nome: "Projeto Mesa Solidária",
    descricao:
      "Projeto social que promove a segurança alimentar e incentiva a doação consciente de alimentos.",
    localizacao: "Vila Yara, Osasco - SP",
    email: "mesasolidaria@exemplo.com",
    telefone: "(11) 3000-1002",
    cnpj: "00.000.000/0001-02",
    site: "",
  },
  {
    id: 3,
    nome: "Casa Acolhedora",
    descricao:
      "Instituição fictícia que oferece acolhimento e apoio a pessoas e famílias que precisam de ajuda.",
    localizacao: "Presidente Altino, Osasco - SP",
    email: "contato@exemplo.com",
    telefone: "(11) 3000-1003",
    cnpj: "00.000.000/0001-03",
    site: "",
  },
  {
    id: 4,
    nome: "Rede Alimentar Solidária",
    descricao:
      "Iniciativa de combate ao desperdício que conecta doadores a organizações que distribuem alimentos.",
    localizacao: "Zona Oeste, São Paulo - SP",
    email: "redealimentar@exemplo.com",
    telefone: "(11) 3000-1004",
    cnpj: "00.000.000/0001-04",
    site: "",
  },
  {
    id: 5,
    nome: "Projeto Novo Começo",
    descricao:
      "Projeto social fictício voltado ao apoio comunitário e à arrecadação de alimentos para pessoas necessitadas.",
    localizacao: "Quitaúna, Osasco - SP",
    email: "novocomeco@exemplo.com",
    telefone: "(11) 3000-1005",
    cnpj: "00.000.000/0001-05",
    site: "",
  },
  {
    id: 6,
    nome: "Centro Comunitário União",
    descricao:
      "Espaço comunitário fictício que incentiva a solidariedade e a colaboração entre moradores.",
    localizacao: "Jaguaribe, Osasco - SP",
    email: "uniao@exemplo.com",
    telefone: "(11) 3000-1006",
    cnpj: "00.000.000/0001-06",
    site: "",
  },
];

function Instituicoes() {
  const [pesquisa, setPesquisa] = useState("");

  const termo = pesquisa.trim().toLocaleLowerCase("pt-BR");

  const instituicoesFiltradas = instituicoesExemplo.filter(
    (instituicao) =>
      [
        instituicao.nome,
        instituicao.localizacao,
        instituicao.descricao,
        instituicao.email,
      ].some((campo) =>
        campo.toLocaleLowerCase("pt-BR").includes(termo)
      )
  );

  return (
    <main className="instituicoes-container">
      <header className="instituicoes-header">
        <span className="instituicoes-etiqueta">
          <Building2 size={16} />
          NOSSA REDE SOLIDÁRIA
        </span>

        <h1>Instituições</h1>

        <p>
          Conheça organizações que fazem a diferença e encontre
          informações para conectar sua doação a quem precisa.
        </p>
      </header>

      <div className="pesquisa-container">
        <Search size={21} aria-hidden="true" />

        <input
          type="search"
          placeholder="Pesquisar por nome, localização ou descrição..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          aria-label="Pesquisar instituição"
        />

        {pesquisa && (
          <button
            type="button"
            className="limpar-pesquisa"
            onClick={() => setPesquisa("")}
          >
            Limpar
          </button>
        )}
      </div>

      <div className="instituicoes-resumo">
        <span>
          <strong>{instituicoesFiltradas.length}</strong>{" "}
          {instituicoesFiltradas.length === 1
            ? "instituição encontrada"
            : "instituições encontradas"}
        </span>
        <span className="instituicoes-resumo-detalhe">
          Conexões que transformam vidas
        </span>
      </div>

      {instituicoesFiltradas.length === 0 ? (
        <section className="sem-resultados">
          <Search size={34} />
          <h3>Nenhuma instituição encontrada</h3>
          <p>
            Não encontramos resultados para "{pesquisa}". Tente
            pesquisar por outro nome ou localização.
          </p>
          <button
            type="button"
            className="site-button"
            onClick={() => setPesquisa("")}
          >
            Limpar pesquisa
          </button>
        </section>
      ) : (
        <section
          className="instituicoes-grid"
          aria-label="Lista de instituições"
        >
          {instituicoesFiltradas.map((instituicao) => (
            <article
              className="instituicao-card"
              key={instituicao.id}
            >
              <div className="card-topo">
                <div className="instituicao-icone">
                  <Building2 size={25} />
                </div>

                <h2>{instituicao.nome}</h2>
              </div>

              <div className="card-conteudo">
                <p>{instituicao.descricao}</p>

                <p className="instituicao-informacao">
                  <MapPin size={17} />
                  <span>{instituicao.localizacao}</span>
                </p>

                <p className="instituicao-informacao">
                  <Mail size={17} />
                  <span>{instituicao.email}</span>
                </p>

                <p className="instituicao-informacao">
                  <Phone size={17} />
                  <span>{instituicao.telefone}</span>
                </p>
              </div>

              <div className="instituicao-rodape">
                <span className="instituicao-status">
                  <span className="status-ponto" />
                  Instituição demonstrativa
                </span>

                {instituicao.site && (
                  <div className="card-acoes">
                    <a
                      className="site-button"
                      href={instituicao.site}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visitar site
                      <ExternalLink size={16} />
                    </a>
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      <p className="instituicoes-aviso">
        Os dados exibidos são fictícios e servem apenas para a
        demonstração visual do Harvest Hope.
      </p>
    </main>
  );
}

export default Instituicoes;