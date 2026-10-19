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



function obterUsuarioLogado() {

  try {

    return JSON.parse(localStorage.getItem("usuario") || "null");

  } catch {

    return null;

  }

}



function obterTipoUsuario() {

  const usuario = obterUsuarioLogado();



  return String(

    usuario?.tipoUsuario || usuario?.tipo || usuario?.perfil || ""

  ).toUpperCase();

}



function obterIdUsuario(usuario) {

  const id = usuario?.id ?? usuario?.usuarioId ?? usuario?.idUsuario;



  return id == null ? "" : String(id);

}



/*

 * Uma doação só pertence ao usuário quando seu identificador

 * corresponde ao identificador do usuário autenticado.

 *

 * Não usamos o nome do doador como critério de propriedade.

 */

function usuarioEhDono(doacao, usuario) {

  const idUsuario = obterIdUsuario(usuario);



  const idProprietario =

    doacao?.usuarioId ??

    doacao?.doadorId ??

    doacao?.usuario?.id ??

    doacao?.doador?.id;



  if (!idUsuario || idProprietario == null) {

    return false;

  }



  return String(idProprietario) === idUsuario;

}



function Doacoes() {

  const navigate = useNavigate();



  const [usuarioLogado, setUsuarioLogado] = useState(() =>

    obterUsuarioLogado()

  );



  const ehDoador =

    String(

      usuarioLogado?.tipoUsuario ||

        usuarioLogado?.tipo ||

        usuarioLogado?.perfil ||

        ""

    ).toUpperCase() === "DOADOR";



  const [doacoes, setDoacoes] = useState(() => carregarDoacoes());

  const [pesquisa, setPesquisa] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [formulario, setFormulario] = useState({

    ...formularioInicial,

  });

  const [doacaoExpandida, setDoacaoExpandida] = useState(null);

  const [mensagem, setMensagem] = useState("");

  const [tipoMensagem, setTipoMensagem] = useState("sucesso");



  useEffect(() => {

    function atualizarUsuario() {

      setUsuarioLogado(obterUsuarioLogado());

    }



    window.addEventListener("storage", atualizarUsuario);



    return () => {

      window.removeEventListener("storage", atualizarUsuario);

    };

  }, []);



  useEffect(() => {

    salvarDoacoes(doacoes);

  }, [doacoes]);



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



  function handleFotoSelecionada(event) {

    const arquivo = event.target.files?.[0];



    if (!arquivo) return;



    if (!arquivo.type.startsWith("image/")) {

      mostrarMensagem("Selecione um arquivo de imagem.", "erro");

      event.target.value = "";

      return;

    }



    if (arquivo.size > 2 * 1024 * 1024) {

      mostrarMensagem("A imagem deve ter no máximo 2 MB.", "erro");

      event.target.value = "";

      return;

    }



    const leitor = new FileReader();



    leitor.onload = () => {

      setFormulario((anterior) => ({

        ...anterior,

        foto: String(leitor.result),

      }));



      setMensagem("");

    };



    leitor.onerror = () => {

      mostrarMensagem("Não foi possível ler a imagem.", "erro");

    };



    leitor.readAsDataURL(arquivo);

  }



  function abrirCadastro() {

    if (!ehDoador) {

      mostrarMensagem(

        "Somente doadores podem cadastrar doações.",

        "erro"

      );

      return;

    }



    setFormulario({ ...formularioInicial });

    setMensagem("");

    setMostrarFormulario(true);



    window.scrollTo({ top: 0, behavior: "smooth" });

  }



  function fecharFormulario() {

    setMostrarFormulario(false);

    setFormulario({ ...formularioInicial });

  }



  function salvarDoacao(event) {

    event.preventDefault();

    setMensagem("");



    const usuarioAtual = obterUsuarioLogado();

    const tipoAtual = obterTipoUsuario();

    const idUsuario = obterIdUsuario(usuarioAtual);



    if (tipoAtual !== "DOADOR") {

      mostrarMensagem(

        "Somente usuários do tipo doador podem cadastrar doações.",

        "erro"

      );

      return;

    }



    if (!idUsuario) {

      mostrarMensagem(

        "Não foi possível identificar o usuário logado. Entre novamente.",

        "erro"

      );

      return;

    }



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

      id: Date.now(),

      usuarioId: idUsuario,

      nomeAlimento: formulario.nomeAlimento.trim(),

      quantidade,

      unidade: formulario.unidade,

      dataValidade: formulario.dataValidade,

      descricao: formulario.descricao.trim(),

      foto: formulario.foto,

      localRetirada: formulario.localRetirada.trim(),

      status: "Disponível",

      doador: usuarioAtual.nome || "Doador",

    };



    setDoacoes((anteriores) => [dadosDoacao, ...anteriores]);



    mostrarMensagem("Doação cadastrada na demonstração!");

    setMostrarFormulario(false);

    setFormulario({ ...formularioInicial });

  }



  function editarDoacao(doacao) {

    const usuarioAtual = obterUsuarioLogado();



    if (obterTipoUsuario() !== "DOADOR") {

      mostrarMensagem(

        "Somente doadores podem editar doações.",

        "erro"

      );

      return;

    }



    if (!usuarioEhDono(doacao, usuarioAtual)) {

      mostrarMensagem(

        "Você só pode editar as próprias doações.",

        "erro"

      );

      return;

    }



    navigate(`/doacoes/${doacao.id}/editar`);

  }



  function removerDoacao(doacao) {

    const usuarioAtual = obterUsuarioLogado();



    if (obterTipoUsuario() !== "DOADOR") {

      mostrarMensagem(

        "Somente doadores podem excluir doações.",

        "erro"

      );

      return;

    }



    if (!usuarioEhDono(doacao, usuarioAtual)) {

      mostrarMensagem(

        "Você só pode excluir as próprias doações.",

        "erro"

      );

      return;

    }



    const confirmar = window.confirm(

      `Deseja realmente remover a doação de "${doacao.nomeAlimento}"?`

    );



    if (!confirmar) return;



    setDoacoes((anteriores) =>

      anteriores.filter((item) => {

        // Exige que a doação seja a mesma e pertença ao usuário.

        if (String(item.id) !== String(doacao.id)) {

          return true;

        }



        return !usuarioEhDono(item, usuarioAtual);

      })

    );



    if (doacaoExpandida === doacao.id) {

      setDoacaoExpandida(null);

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



        {ehDoador && (

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

            {mostrarFormulario ? (

              <X size={19} />

            ) : (

              <Plus size={19} />

            )}



            {mostrarFormulario

              ? "Fechar formulário"

              : "Cadastrar doação"}

          </button>

        )}

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



      {ehDoador && mostrarFormulario && (

        <section className="doacoes-formulario-container">

          <div className="doacoes-formulario-titulo">

            <PackagePlus size={24} />

            <h2>Nova doação</h2>

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

              <label htmlFor="fotoArquivo">

                Foto do alimento (opcional)

              </label>

              <input

                id="fotoArquivo"

                name="fotoArquivo"

                type="file"

                accept="image/*"

                onChange={handleFotoSelecionada}

              />



              <p className="doacoes-ajuda-foto">

                Selecione uma imagem do computador. Tamanho máximo: 2 MB.

              </p>



              {formulario.foto && (

                <img

                  className="doacoes-foto-preview"

                  src={formulario.foto}

                  alt="Pré-visualização do alimento"

                />

              )}

            </div>



            <p className="doacoes-campos-obrigatorios">

              * Campos obrigatórios

            </p>



            <div className="doacoes-acoes-formulario">

              <button

                type="submit"

                className="doacoes-botao-salvar"

              >

                Publicar doação

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

          {doacoesFiltradas.map((doacao) => {

            const podeGerenciar =

              ehDoador && usuarioEhDono(doacao, usuarioLogado);



            return (

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

                        {doacao.descricao || "Sem descrição informada."}

                      </p>



                      <p>

                        <strong>Observação:</strong> Doação demonstrativa.

                        Combine a retirada com o responsável antes de se

                        deslocar.

                      </p>

                    </div>

                  )}



                  <div className="doacao-acoes">

                    <button

                      type="button"

                      className="doacoes-botao-editar"

                      onClick={() =>

                        setDoacaoExpandida((atual) =>

                          atual === doacao.id ? null : doacao.id

                        )

                      }

                    >

                      <Eye size={16} />

                      {doacaoExpandida === doacao.id

                        ? "Ocultar detalhes"

                        : "Ver detalhes"}

                    </button>



                    {podeGerenciar && (
                      <button
                        type="button"
                        className="doacoes-botao-editar"
                        onClick={() => editarDoacao(doacao)}
                      >
                        <Pencil size={16} />
                        Editar
                      </button>
                    )}

                    {podeGerenciar && (
                      <button
                        type="button"
                        className="doacoes-botao-remover"
                        onClick={() => removerDoacao(doacao)}
                      >
                        <Trash2 size={16} />
                        Remover
                      </button>
                    )}

                  </div>

                </div>

              </article>

            );

          })}

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