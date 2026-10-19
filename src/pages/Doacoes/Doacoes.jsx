
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  X,
  PackagePlus,
  MapPin,
  Pencil,
  Eye,
  CalendarDays,
  Search,
  Utensils,
  Trash2,
} from "lucide-react";

import { carregarDoacoes, salvarDoacoes } from "../../data/doacoes";

import "./Doacoes.css";

const formularioInicial = {
  nomeAlimento: "",
  quantidade: "",
  unidade: "kg",
  dataValidade: "",
  descricao: "",
  foto: "",
  localRetirada: "",
};


function dataLocalISO() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function formatarData(data) {
  if (!data) return "Não informada";

  const partes = String(data).split("-");

  if (partes.length === 3 && partes[0].length === 4) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  return data;
}

function Doacoes() {
  const navigate = useNavigate();
  const [doacoes, setDoacoes] = useState(() => carregarDoacoes());

  useEffect(() => {
    salvarDoacoes(doacoes);
  }, [doacoes]);
  const [pesquisa, setPesquisa] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState({
    ...formularioInicial,
  });
  const [doacaoEditando, setDoacaoEditando] = useState(null);
  const [doacaoExpandida, setDoacaoExpandida] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("sucesso");

  function mostrarMensagem(texto, tipo = "sucesso") {
    setMensagem(texto);
    setTipoMensagem(tipo);
  }

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function abrirCadastro() {
    setDoacaoEditando(null);
    setFormulario({ ...formularioInicial });
    setMensagem("");
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function abrirEdicao(doacao) {
    setDoacaoEditando(doacao);

    setFormulario({
      nomeAlimento: doacao.nomeAlimento,
      quantidade: String(doacao.quantidade),
      unidade: doacao.unidade,
      dataValidade: doacao.dataValidade || "",
      descricao: doacao.descricao || "",
      foto: doacao.foto || "",
      localRetirada: doacao.localRetirada || "",
    });

    setMensagem("");
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function fecharFormulario() {
    setMostrarFormulario(false);
    setDoacaoEditando(null);
    setFormulario({ ...formularioInicial });
  }

  function salvarDoacao(event) {
    event.preventDefault();
    setMensagem("");

    const quantidade = Number(formulario.quantidade);

    if (!formulario.nomeAlimento.trim()) {
      mostrarMensagem("Informe o nome do alimento.", "erro");
      return;
    }

    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      mostrarMensagem(
        "Informe uma quantidade maior que zero.",
        "erro"
      );
      return;
    }

    if (
      formulario.dataValidade &&
      formulario.dataValidade < dataLocalISO()
    ) {
      mostrarMensagem(
        "A data de validade não pode estar no passado.",
        "erro"
      );
      return;
    }

    if (!formulario.localRetirada.trim()) {
      mostrarMensagem("Informe o local de retirada.", "erro");
      return;
    }

    const dadosDoacao = {
      nomeAlimento: formulario.nomeAlimento.trim(),
      quantidade,
      unidade: formulario.unidade,
      dataValidade: formulario.dataValidade,
      descricao: formulario.descricao.trim(),
      foto: formulario.foto.trim(),
      localRetirada: formulario.localRetirada.trim(),
      status: doacaoEditando?.status || "Disponível",
      doador: doacaoEditando?.doador || "Doador demonstrativo",
    };

    if (doacaoEditando) {
      setDoacoes((anteriores) =>
        anteriores.map((doacao) =>
          doacao.id === doacaoEditando.id
            ? { ...doacao, ...dadosDoacao }
            : doacao
        )
      );

      mostrarMensagem("Doação atualizada na demonstração!");
    } else {
      setDoacoes((anteriores) => [
        {
          id: Date.now(),
          ...dadosDoacao,
        },
        ...anteriores,
      ]);

      mostrarMensagem("Doação adicionada à demonstração!");
    }

    setMostrarFormulario(false);
    setDoacaoEditando(null);
    setFormulario({ ...formularioInicial });
  }

  function removerDoacao(doacao) {
    const confirmar = window.confirm(
      `Deseja realmente remover a doação de "${doacao.nomeAlimento}"?`
    );

    if (!confirmar) return;

    setDoacoes((anteriores) =>
      anteriores.filter((item) => item.id !== doacao.id)
    );

    if (doacaoExpandida === doacao.id) {
      setDoacaoExpandida(null);
    }

    if (doacaoEditando?.id === doacao.id) {
      fecharFormulario();
    }

    mostrarMensagem(
      `A doação "${doacao.nomeAlimento}" foi removida da demonstração.`
    );
  }

  const termo = pesquisa.trim().toLocaleLowerCase("pt-BR");

  const doacoesFiltradas = doacoes.filter((doacao) =>
    [
      doacao.nomeAlimento,
      doacao.descricao,
      doacao.status,
      doacao.doador,
      doacao.localRetirada,
    ].some((valor) =>
      String(valor ?? "")
        .toLocaleLowerCase("pt-BR")
        .includes(termo)
    )
  );

  return (
    <main className="doacoes-container">
      <header className="doacoes-header">
        <div>
          <h1>Doações de alimentos</h1>
          <p>
            Confira os alimentos cadastrados e encontre oportunidades
            para ajudar quem precisa.
          </p>
        </div>

        <button
          type="button"
          className="doacoes-botao-nova"
          onClick={() => {
            if (mostrarFormulario) {
              fecharFormulario();
            } else {
              abrirCadastro();
            }
          }}
        >
          {mostrarFormulario ? <X size={19} /> : <Plus size={19} />}
          {mostrarFormulario
            ? "Fechar formulário"
            : "Cadastrar doação"}
        </button>
      </header>

      {mensagem && (
        <div
          className="doacoes-feedback"
          data-tipo={tipoMensagem}
          role={tipoMensagem === "erro" ? "alert" : "status"}
        >
          {mensagem}
        </div>
      )}

      {mostrarFormulario && (
        <section className="doacoes-formulario-container">
          <div className="doacoes-formulario-titulo">
            <PackagePlus size={24} />
            <h2>
              {doacaoEditando ? "Editar doação" : "Nova doação"}
            </h2>
          </div>

          <form
            className="doacoes-formulario"
            onSubmit={salvarDoacao}
          >
            <div className="doacoes-campo">
              <label htmlFor="nomeAlimento">
                Nome do alimento *
              </label>
              <input
                id="nomeAlimento"
                name="nomeAlimento"
                value={formulario.nomeAlimento}
                onChange={atualizarCampo}
                placeholder="Ex.: Arroz"
                maxLength={150}
                required
              />
            </div>

            <div className="doacoes-campo">
              <label htmlFor="quantidade">Quantidade *</label>
              <input
                id="quantidade"
                name="quantidade"
                type="number"
                min="0.01"
                step="any"
                value={formulario.quantidade}
                onChange={atualizarCampo}
                placeholder="Ex.: 10"
                required
              />
            </div>

            <div className="doacoes-campo">
              <label htmlFor="unidade">
                Unidade de medida *
              </label>
              <select
                id="unidade"
                name="unidade"
                value={formulario.unidade}
                onChange={atualizarCampo}
                required
              >
                <option value="kg">Quilogramas (kg)</option>
                <option value="g">Gramas (g)</option>
                <option value="L">Litros (L)</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="unidades">Unidades</option>
                <option value="pacotes">Pacotes</option>
                <option value="caixas">Caixas</option>
              </select>
            </div>

            <div className="doacoes-campo">
              <label htmlFor="dataValidade">
                Data de validade
              </label>
              <input
                id="dataValidade"
                name="dataValidade"
                type="date"
                value={formulario.dataValidade}
                onChange={atualizarCampo}
                min={dataLocalISO()}
              />
            </div>

            <div className="doacoes-campo doacoes-campo-largo">
              <label htmlFor="localRetirada">
                Local de retirada *
              </label>
              <input
                id="localRetirada"
                name="localRetirada"
                value={formulario.localRetirada}
                onChange={atualizarCampo}
                placeholder="Ex.: Osasco - SP"
                maxLength={255}
                required
              />
            </div>

            <div className="doacoes-campo doacoes-campo-largo">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formulario.descricao}
                onChange={atualizarCampo}
                placeholder="Descreva os alimentos e suas condições."
                rows={4}
                maxLength={1000}
              />
            </div>

            <div className="doacoes-campo doacoes-campo-largo">
              <label htmlFor="foto">URL da foto (opcional)</label>
              <input
                id="foto"
                name="foto"
                type="url"
                value={formulario.foto}
                onChange={atualizarCampo}
                placeholder="https://exemplo.com/alimento.jpg"
              />
            </div>

            <p className="doacoes-campos-obrigatorios">
              * Campos obrigatórios
            </p>

            <div className="doacoes-acoes-formulario">
              <button
                type="submit"
                className="doacoes-botao-salvar"
              >
                {doacaoEditando
                  ? "Salvar alterações"
                  : "Publicar doação"}
              </button>

              <button
                type="button"
                className="doacoes-botao-cancelar"
                onClick={fecharFormulario}
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="doacoes-pesquisa">
        <input
          type="search"
          placeholder="Pesquisar por alimento, descrição, doador, local ou status..."
          value={pesquisa}
          onChange={(event) => setPesquisa(event.target.value)}
          aria-label="Pesquisar doações"
        />
      </div>

      <div className="doacoes-resumo">
        <span>
          <strong>{doacoesFiltradas.length}</strong>{" "}
          {doacoesFiltradas.length === 1
            ? "doação encontrada"
            : "doações encontradas"}
        </span>

        <span>Alimentos que podem transformar vidas</span>
      </div>

      {doacoesFiltradas.length === 0 ? (
        <section className="doacoes-mensagem">
          <Search size={32} />
          <h2>Nenhuma doação encontrada</h2>
          <p>
            Tente pesquisar por outro alimento ou localização.
          </p>
          <button
            type="button"
            onClick={() => setPesquisa("")}
          >
            Limpar pesquisa
          </button>
        </section>
      ) : (
        <section
          className="doacoes-grid"
          aria-label="Lista de doações"
        >
          {doacoesFiltradas.map((doacao) => (
            <article className="doacao-card" key={doacao.id}>
              {doacao.foto && (
                <img
                  className="doacao-foto"
                  src={doacao.foto}
                  alt={doacao.nomeAlimento}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              )}

              <div className="doacao-card-conteudo">
                <div className="doacao-card-topo">
                  <div className="doacao-icone">
                    <Utensils size={25} />
                  </div>

                  <h2>{doacao.nomeAlimento}</h2>

                  <span className="doacao-status">
                    {doacao.status}
                  </span>
                </div>

                <p>
                  <strong>Doador:</strong> {doacao.doador}
                </p>

                <p>
                  <strong>Quantidade:</strong>{" "}
                  {doacao.quantidade} {doacao.unidade}
                </p>

                <p>
                  <CalendarDays
                    size={16}
                    className="doacao-icone-texto"
                  />
                  <strong> Validade:</strong>{" "}
                  {formatarData(doacao.dataValidade)}
                </p>

                <p>
                  <MapPin
                    size={16}
                    className="doacao-icone-texto"
                  />
                  <strong> Local de retirada:</strong>{" "}
                  {doacao.localRetirada}
                </p>

                {doacaoExpandida === doacao.id && (
                  <div className="doacao-detalhes">
                    <p>
                      <strong>Descrição:</strong>{" "}
                      {doacao.descricao ||
                        "Sem descrição informada."}
                    </p>

                    <p>
                      <strong>Observação:</strong> Doação
                      demonstrativa. Combine a retirada com o
                      responsável antes de se deslocar.
                    </p>
                  </div>
                )}

                <div className="doacao-acoes">
                  <button
                    type="button"
                    className="doacoes-botao-editar"
                    onClick={() => navigate(`/doacoes/${doacao.id}`)}
                  >
                    <Eye size={16} />
                    Ver detalhes
                  </button>

                  <button
                    type="button"
                    className="doacoes-botao-editar"
                    onClick={() => abrirEdicao(doacao)}
                  >
                    <Pencil size={16} />
                    Editar
                  </button>

                  <button
                    type="button"
                    className="doacoes-botao-remover"
                    onClick={() => removerDoacao(doacao)}
                  >
                    <Trash2 size={16} />
                    Remover
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <p className="doacoes-aviso">
        Os dados exibidos são fictícios e servem apenas para a
        demonstração visual do Harvest Hope.
      </p>
    </main>
  );
}

export default Doacoes;
