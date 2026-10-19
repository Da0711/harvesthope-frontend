import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Mail,
  Phone,
  Building2,
  ExternalLink,
  UsersRound,
  HeartHandshake,
  ArrowUpRight,
  SlidersHorizontal,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
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

function SeletorRegiao({ value, onChange }) {
  const [aberto, setAberto] = useState(false);
  const opcoes = [
    { valor: "todas", rotulo: "Todas as regiões" },
    { valor: "osasco", rotulo: "Osasco" },
    { valor: "são paulo", rotulo: "São Paulo" },
  ];
  const selecionada = opcoes.find((opcao) => opcao.valor === value) || opcoes[0];

  return (
    <div className={`filtro-localizacao ${aberto ? "filtro-localizacao-aberto" : ""}`}>
      <SlidersHorizontal size={18} aria-hidden="true" />
      <span className="filtro-localizacao-label">Região</span>
      <div className="seletor-regiao">
        <button
          type="button"
          className="seletor-regiao-trigger"
          aria-haspopup="listbox"
          aria-expanded={aberto}
          onClick={() => setAberto((estado) => !estado)}
          onKeyDown={(evento) => {
            if (evento.key === "Escape") setAberto(false);
          }}
        >
          <span>{selecionada.rotulo}</span>
          <ChevronDown size={16} className={aberto ? "icone-regiao-virada" : ""} />
        </button>

        {aberto && (
          <>
            <button
              type="button"
              className="seletor-regiao-fechar"
              aria-label="Fechar opções de região"
              onClick={() => setAberto(false)}
            />
            <div className="seletor-regiao-menu" role="listbox" aria-label="Selecionar região">
              {opcoes.map((opcao) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={value === opcao.valor}
                  className={`seletor-regiao-opcao ${value === opcao.valor ? "selecionada" : ""}`}
                  key={opcao.valor}
                  onClick={() => {
                    onChange(opcao.valor);
                    setAberto(false);
                  }}
                >
                  <span>{opcao.rotulo}</span>
                  {value === opcao.valor && <Check size={16} aria-hidden="true" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Instituicoes() {
  const [pesquisa, setPesquisa] = useState("");
  const [localizacao, setLocalizacao] = useState("todas");

  const instituicoesFiltradas = useMemo(() => {
    const termo = pesquisa.trim().toLocaleLowerCase("pt-BR");

    return instituicoesExemplo.filter((instituicao) => {
      const correspondePesquisa = [
        instituicao.nome,
        instituicao.localizacao,
        instituicao.descricao,
        instituicao.email,
      ].some((campo) => campo.toLocaleLowerCase("pt-BR").includes(termo));

      const correspondeLocalizacao =
        localizacao === "todas" ||
        instituicao.localizacao.toLocaleLowerCase("pt-BR").includes(localizacao);

      return correspondePesquisa && correspondeLocalizacao;
    });
  }, [pesquisa, localizacao]);

  const limparFiltros = () => {
    setPesquisa("");
    setLocalizacao("todas");
  };

  return (
    <main className="instituicoes-container">
      <section className="instituicoes-hero">
        <div className="instituicoes-hero-texto">
          <span className="instituicoes-etiqueta">
            <HeartHandshake size={16} aria-hidden="true" />
            NOSSA REDE SOLIDÁRIA
          </span>

          <h1>Juntos, fazemos a <span>diferença.</span></h1>

          <p>
            Conheça as instituições que fazem parte da nossa rede e descubra
            como conectar alimentos a quem mais precisa.
          </p>

          <div className="instituicoes-hero-dados" aria-label="Resumo da rede">
            <div className="hero-dado-icone">
              <Building2 size={20} aria-hidden="true" />
            </div>
            <div>
              <strong>{instituicoesExemplo.length} instituições</strong>
              <span>na rede demonstrativa</span>
            </div>
          </div>
        </div>

        <div className="instituicoes-hero-visual" aria-hidden="true">
          <div className="hero-circulo hero-circulo-externo" />
          <div className="hero-circulo hero-circulo-interno" />
          <div className="hero-visual-cartao">
            <div className="hero-visual-icone">
              <HeartHandshake size={42} strokeWidth={1.6} />
            </div>
            <span>Pequenas ações.</span>
            <strong>Grandes mudanças.</strong>
            <div className="hero-visual-linha">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="hero-selo">
            <UsersRound size={18} />
            <span>Comunidade<br />que acolhe</span>
          </div>
        </div>
      </section>

      <section className="instituicoes-lista-secao">
        <div className="instituicoes-secao-topo">
          <div>
            <span className="instituicoes-overline">CONECTE-SE</span>
            <h2>Encontre uma instituição</h2>
            <p>Pesquise por nome, região ou área de atuação.</p>
          </div>
          <div className="instituicoes-contador">
            <strong>{instituicoesFiltradas.length}</strong>
            <span>{instituicoesFiltradas.length === 1 ? "resultado" : "resultados"}</span>
          </div>
        </div>

        <div className="instituicoes-filtros">
          <div className="pesquisa-container">
            <Search size={20} aria-hidden="true" />
            <input
              type="search"
              placeholder="Nome, localização ou descrição..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              aria-label="Pesquisar instituição por nome, localização ou descrição"
            />
            {pesquisa && (
              <button
                type="button"
                className="limpar-pesquisa"
                onClick={() => setPesquisa("")}
                aria-label="Limpar pesquisa"
                title="Limpar pesquisa"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <SeletorRegiao value={localizacao} onChange={setLocalizacao} />

          {(pesquisa || localizacao !== "todas") && (
            <button type="button" className="limpar-filtros" onClick={limparFiltros}>
              Limpar filtros
            </button>
          )}
        </div>

        {instituicoesFiltradas.length === 0 ? (
          <section className="sem-resultados">
            <div className="sem-resultados-icone"><Search size={28} /></div>
            <h3>Nenhuma instituição encontrada</h3>
            <p>
              Não encontramos resultados para sua busca. Tente outro nome ou
              região.
            </p>
            <button type="button" className="site-button" onClick={limparFiltros}>
              Limpar filtros
            </button>
          </section>
        ) : (
          <section className="instituicoes-grid" aria-label="Lista de instituições">
            {instituicoesFiltradas.map((instituicao) => (
              <article className="instituicao-card" key={instituicao.id}>
                <div className="card-topo">
                  <div className="instituicao-icone">
                    <Building2 size={24} aria-hidden="true" />
                  </div>
                  <div className="card-titulo">
                    <h3>{instituicao.nome}</h3>
                    <span className="card-local-resumo">
                      <MapPin size={14} aria-hidden="true" />
                      {instituicao.localizacao}
                    </span>
                  </div>
                  <span className="card-indicador" title="Cadastro demonstrativo" />
                </div>

                <p className="instituicao-descricao">{instituicao.descricao}</p>

                <div className="instituicao-detalhes">
                  <a href={`mailto:${instituicao.email}`} className="instituicao-informacao">
                    <span className="informacao-icone"><Mail size={16} /></span>
                    <span>{instituicao.email}</span>
                  </a>
                  <a
                    href={`tel:${instituicao.telefone.replace(/[^\d+]/g, "")}`}
                    className="instituicao-informacao"
                  >
                    <span className="informacao-icone"><Phone size={16} /></span>
                    <span>{instituicao.telefone}</span>
                  </a>
                </div>

                <div className="instituicao-rodape">
                  <span className="instituicao-status">
                    <span className="status-ponto" />
                    Dados demonstrativos
                  </span>

                  {instituicao.site ? (
                    <a
                      className="site-button"
                      href={instituicao.site}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visitar site
                      <ExternalLink size={15} aria-hidden="true" />
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="site-indisponivel">Site não informado</span>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

        <p className="instituicoes-aviso">
          <span className="aviso-ponto" />
          Os dados exibidos são fictícios e servem apenas para a demonstração visual do Harvest Hope.
        </p>
      </section>
    </main>
  );
}

export default Instituicoes;
