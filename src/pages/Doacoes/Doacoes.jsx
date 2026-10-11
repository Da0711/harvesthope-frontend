
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  X,
  PackagePlus,
  MapPin,
  Pencil,
  Eye,
} from "lucide-react";
import api from "../../services/api";
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

function obterUsuario() {
  try {
    return JSON.parse(localStorage.getItem("usuario")) || null;
  } catch {
    return null;
  }
}

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

  if (
    partes.length === 3 &&
    partes[0].length === 4 &&
    partes[1].length === 2 &&
    partes[2].length === 2
  ) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  return data;
}

function Doacoes() {
  const navigate = useNavigate();

  const [doacoes, setDoacoes] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState({ ...formularioInicial });
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("sucesso");
  const [doacaoEditando, setDoacaoEditando] = useState(null);

  const usuario = obterUsuario();

  async function carregarDoacoes() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await api.get("/api/v1/doacoes");
      setDoacoes(resposta.data);
    } catch (error) {
      console.error("Erro ao carregar doações:", error);
      setErro("Não foi possível carregar as doações. Verifique o backend.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDoacoes();
  }, []);

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function mostrarMensagem(texto, tipo = "sucesso") {
    setMensagem(texto);
    setTipoMensagem(tipo);
  }

  function abrirCadastro() {
    setDoacaoEditando(null);
    setFormulario({ ...formularioInicial });
    setMensagem("");
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function abrirEdicao(doacao) {
    if (
      !usuario?.id ||
      Number(doacao.doador?.id) !== Number(usuario.id)
    ) {
      mostrarMensagem("Você só pode editar suas próprias doações.", "erro");
      return;
    }

    setDoacaoEditando(doacao);

    setFormulario({
      nomeAlimento: doacao.nomeAlimento || "",
      quantidade: doacao.quantidade ?? "",
      unidade: doacao.unidade || "kg",
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

  async function salvarDoacao(event) {
    event.preventDefault();
    setMensagem("");

    const usuarioAtual = obterUsuario();

    if (!usuarioAtual?.id) {
      mostrarMensagem("Faça login novamente para continuar.", "erro");
      return;
    }

    if (
      doacaoEditando &&
      Number(doacaoEditando.doador?.id) !== Number(usuarioAtual.id)
    ) {
      mostrarMensagem("Você não pode editar esta doação.", "erro");
      return;
    }

    const quantidade = Number(formulario.quantidade);

    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      mostrarMensagem("Informe uma quantidade maior que zero.", "erro");
      return;
    }

    if (
      formulario.dataValidade &&
      formulario.dataValidade < dataLocalISO()
    ) {
      mostrarMensagem("A data de validade não pode estar no passado.", "erro");
      return;
    }

    if (!formulario.localRetirada.trim()) {
      mostrarMensagem("Informe o local de retirada.", "erro");
      return;
    }

    if (!formulario.nomeAlimento.trim()) {
      mostrarMensagem("Informe o nome do alimento.", "erro");
      return;
    }

    try {
      setSalvando(true);

      const dadosDoacao = {
        nomeAlimento: formulario.nomeAlimento.trim(),
        quantidade,
        unidade: formulario.unidade,
        dataValidade: formulario.dataValidade || null,
        descricao: formulario.descricao.trim(),
        foto: formulario.foto.trim(),
        localRetirada: formulario.localRetirada.trim(),
        status: doacaoEditando?.status || "Disponível",
      };

      if (doacaoEditando) {
        await api.put(
          `/api/v1/doacoes/${doacaoEditando.id}`,
          dadosDoacao,
          {
            headers: {
              "X-Usuario-Id": usuarioAtual.id,
            },
          }
        );

        mostrarMensagem("Doação atualizada com sucesso!");
      } else {
        await api.post("/api/v1/doacoes", {
          ...dadosDoacao,
          doador: {
            id: usuarioAtual.id,
          },
        });

        mostrarMensagem("Doação cadastrada com sucesso!");
      }

      setFormulario({ ...formularioInicial });
      setDoacaoEditando(null);
      setMostrarFormulario(false);

      await carregarDoacoes();
    } catch (error) {
      console.error("Erro ao salvar doação:", error);

      const status = error.response?.status;
      let textoErro =
        error.response?.data?.detail ||
        error.response?.data?.message;

      if (status === 403) {
        textoErro = "Você não tem permissão para editar esta doação.";
      } else if (status === 404) {
        textoErro = "Doação ou usuário não encontrado.";
      }

      mostrarMensagem(
        textoErro || "Não foi possível salvar a doação. Tente novamente.",
        "erro"
      );
    } finally {
      setSalvando(false);
    }
  }

  const termo = pesquisa.trim().toLowerCase();

  const doacoesFiltradas = doacoes.filter((doacao) =>
    [
      doacao.nomeAlimento,
      doacao.descricao,
      doacao.status,
      doacao.doador?.nome,
      doacao.localRetirada,
    ].some((valor) =>
      String(valor ?? "").toLowerCase().includes(termo)
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
          {mostrarFormulario ? "Fechar formulário" : "Cadastrar doação"}
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
            <h2>{doacaoEditando ? "Editar doação" : "Nova doação"}</h2>
          </div>

          <form className="doacoes-formulario" onSubmit={salvarDoacao}>
            <div className="doacoes-campo">
              <label htmlFor="nomeAlimento">Nome do alimento *</label>
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
              <label htmlFor="unidade">Unidade de medida *</label>
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
              <label htmlFor="dataValidade">Data de validade</label>
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
              <label htmlFor="localRetirada">Local de retirada *</label>
              <input
                id="localRetirada"
                name="localRetirada"
                value={formulario.localRetirada}
                onChange={atualizarCampo}
                placeholder="Ex.: Barueri - SP"
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
                disabled={salvando}
              >
                {salvando
                  ? "Salvando..."
                  : doacaoEditando
                    ? "Salvar alterações"
                    : "Publicar doação"}
              </button>

              {doacaoEditando && (
                <button
                  type="button"
                  className="doacoes-botao-cancelar"
                  onClick={fecharFormulario}
                  disabled={salvando}
                >
                  Cancelar edição
                </button>
              )}
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

      {carregando ? (
        <div className="doacoes-mensagem">
          <p>Carregando doações...</p>
        </div>
      ) : erro ? (
        <div className="doacoes-mensagem" role="alert">
          <h2>Ops! Ocorreu um problema.</h2>
          <p>{erro}</p>
          <button type="button" onClick={carregarDoacoes}>
            Tentar novamente
          </button>
        </div>
      ) : doacoesFiltradas.length === 0 ? (
        <div className="doacoes-mensagem">
          <h2>Nenhuma doação encontrada</h2>
          <p>
            {doacoes.length === 0
              ? "Ainda não existem doações cadastradas."
              : "Tente pesquisar usando outros termos."}
          </p>
        </div>
      ) : (
        <section className="doacoes-grid" aria-label="Lista de doações">
          {doacoesFiltradas.map((doacao) => {
            const minhaDoacao =
              usuario?.id != null &&
              Number(doacao.doador?.id) === Number(usuario.id);

            return (
              <article className="doacao-card" key={doacao.id}>
                {doacao.foto && (
                  <img
                    className="doacao-foto"
                    src={doacao.foto}
                    alt={doacao.nomeAlimento || "Alimento doado"}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <div className="doacao-card-conteudo">
                  <div className="doacao-card-topo">
                    <h2>{doacao.nomeAlimento || "Alimento sem nome"}</h2>

                    {doacao.status && (
                      <span className="doacao-status">
                        {doacao.status}
                      </span>
                    )}
                  </div>

                  <p>
                    <strong>Doador:</strong>{" "}
                    {doacao.doador?.nome || "Doador não informado"}
                  </p>

                  <p>
                    <strong>Quantidade:</strong>{" "}
                    {doacao.quantidade ?? "Não informada"}{" "}
                    {doacao.unidade || ""}
                  </p>

                  <p>
                    <strong>Validade:</strong>{" "}
                    {formatarData(doacao.dataValidade)}
                  </p>

                  <p>
                    <MapPin
                      size={16}
                      style={{
                        display: "inline",
                        verticalAlign: "middle",
                        marginRight: 4,
                      }}
                    />
                    <strong>Local de retirada:</strong>{" "}
                    {doacao.localRetirada || "Não informado"}
                  </p>

                  <p className="doacao-descricao">
                    <strong>Descrição:</strong>{" "}
                    {doacao.descricao || "Sem descrição informada."}
                  </p>

                  <div className="doacao-acoes">
                    <button
                      type="button"
                      className="doacoes-botao-editar"
                      onClick={() => navigate(`/doacoes/${doacao.id}`)}
                    >
                      <Eye size={16} />
                      Ver detalhes
                    </button>

                    {minhaDoacao && (
                      <button
                        type="button"
                        className="doacoes-botao-editar"
                        onClick={() => abrirEdicao(doacao)}
                      >
                        <Pencil size={16} />
                        Editar
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default Doacoes;
