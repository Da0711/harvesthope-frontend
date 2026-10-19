import { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {

  ArrowLeft,

  Package,

  ImagePlus,

  MapPin,

  CalendarDays,

  Save,

  ChevronDown,

  Check,

  Carrot,

  Refrigerator,

  GlassWater,

  Sparkles,

  Wheat,

  Scale,

  Droplets,

  Boxes,

} from "lucide-react";



import {

  carregarDoacoes,

  salvarDoacoes,

} from "../../data/doacoes";



import "./CadastroDoacao.css";



function dataLocalISO() {

  const hoje = new Date();

  const ano = hoje.getFullYear();

  const mes = String(hoje.getMonth() + 1).padStart(2, "0");

  const dia = String(hoje.getDate()).padStart(2, "0");



  return `${ano}-${mes}-${dia}`;

}



const categoriasDoacao = [

  {

    value: "Alimentos não perecíveis",

    label: "Alimentos não perecíveis",

    descricao: "Arroz, feijão, massas e enlatados",

    Icone: Package,

  },

  {

    value: "Frutas e verduras",

    label: "Frutas e verduras",

    descricao: "Alimentos frescos e vegetais",

    Icone: Carrot,

  },

  {

    value: "Alimentos perecíveis",

    label: "Alimentos perecíveis",

    descricao: "Carnes, laticínios e refrigerados",

    Icone: Refrigerator,

  },

  {

    value: "Bebidas",

    label: "Bebidas",

    descricao: "Água, sucos e outras bebidas",

    Icone: GlassWater,

  },

  {

    value: "Higiene",

    label: "Higiene",

    descricao: "Produtos de higiene pessoal",

    Icone: Sparkles,

  },

  {

    value: "Outros",

    label: "Outros",

    descricao: "Outros itens para doação",

    Icone: Wheat,

  },

];



function SeletorCategoria({ valor, onChange }) {

  const [aberto, setAberto] = useState(false);

  const referencia = useRef(null);



  useEffect(() => {

    function fecharAoClicarFora(event) {

      if (

        referencia.current &&

        !referencia.current.contains(event.target)

      ) {

        setAberto(false);

      }

    }



    function fecharComEscape(event) {

      if (event.key === "Escape") {

        setAberto(false);

      }

    }



    document.addEventListener("mousedown", fecharAoClicarFora);

    document.addEventListener("keydown", fecharComEscape);



    return () => {

      document.removeEventListener("mousedown", fecharAoClicarFora);

      document.removeEventListener("keydown", fecharComEscape);

    };

  }, []);



  const selecionada = categoriasDoacao.find(

    (categoria) => categoria.value === valor

  );



  return (

    <div className="cd-categoria" ref={referencia}>

      <button

        type="button"

        className={`cd-categoria-trigger ${aberto ? "ativo" : ""}`}

        aria-haspopup="listbox"

        aria-expanded={aberto}

        onClick={() => setAberto((estado) => !estado)}

      >

        {selecionada ? (

          <>

            <span className="cd-categoria-icone">

              <selecionada.Icone size={17} />

            </span>

            <span className="cd-categoria-valor">

              {selecionada.label}

            </span>

          </>

        ) : (

          <span className="cd-categoria-placeholder">

            <span className="cd-categoria-icone">

              <Package size={17} />

            </span>

            Selecione uma categoria

          </span>

        )}



        <ChevronDown

          size={18}

          className={`cd-categoria-seta ${aberto ? "girada" : ""}`}

        />

      </button>



      {aberto && (

        <div className="cd-categoria-menu" role="listbox">

          <div className="cd-categoria-menu-titulo">

            <span>Categoria da doação</span>

            <span>{categoriasDoacao.length} opções</span>

          </div>



          {categoriasDoacao.map(({ value, label, descricao, Icone }) => {

            const ativa = valor === value;



            return (

              <button

                type="button"

                role="option"

                aria-selected={ativa}

                key={value}

                className={`cd-categoria-opcao ${

                  ativa ? "selecionada" : ""

                }`}

                onClick={() => {

                  onChange(value);

                  setAberto(false);

                }}

              >

                <span className="cd-categoria-icone">

                  <Icone size={18} />

                </span>



                <span className="cd-categoria-textos">

                  <span className="cd-categoria-nome">{label}</span>

                  <span className="cd-categoria-descricao">

                    {descricao}

                  </span>

                </span>



                {ativa && (

                  <span className="cd-categoria-check">

                    <Check size={16} />

                  </span>

                )}

              </button>

            );

          })}

        </div>

      )}

    </div>

  );

}





const unidadesDoacao = [

  { value: "unidades", label: "Unidades", descricao: "Itens individuais", Icone: Package },

  { value: "kg", label: "Kg", descricao: "Quilogramas", Icone: Scale },

  { value: "g", label: "Gramas", descricao: "Peso em gramas", Icone: Scale },

  { value: "L", label: "Litros", descricao: "Volume em litros", Icone: Droplets },

  { value: "ml", label: "Mililitros", descricao: "Volume em mililitros", Icone: GlassWater },

  { value: "pacotes", label: "Pacotes", descricao: "Pacotes fechados", Icone: Boxes },

  { value: "caixas", label: "Caixas", descricao: "Caixas de produtos", Icone: Package },

];



function SeletorUnidade({ valor, onChange }) {

  const [aberto, setAberto] = useState(false);

  const referencia = useRef(null);



  useEffect(() => {

    function fecharAoClicarFora(event) {

      if (referencia.current && !referencia.current.contains(event.target)) {

        setAberto(false);

      }

    }



    function fecharComEscape(event) {

      if (event.key === "Escape") setAberto(false);

    }



    document.addEventListener("mousedown", fecharAoClicarFora);

    document.addEventListener("keydown", fecharComEscape);



    return () => {

      document.removeEventListener("mousedown", fecharAoClicarFora);

      document.removeEventListener("keydown", fecharComEscape);

    };

  }, []);



  const selecionada = unidadesDoacao.find(

    (unidade) => unidade.value === valor

  );



  return (

    <div className="cd-unidade" ref={referencia}>

      <button

        type="button"

        className={`cd-unidade-trigger ${aberto ? "ativo" : ""}`}

        aria-label="Selecionar unidade da quantidade"

        aria-haspopup="listbox"

        aria-expanded={aberto}

        onClick={() => setAberto((estado) => !estado)}

      >

        <span>{selecionada?.label || "Unidades"}</span>

        <ChevronDown

          size={17}

          className={`cd-unidade-seta ${aberto ? "girada" : ""}`}

        />

      </button>



      {aberto && (

        <div className="cd-unidade-menu" role="listbox">

          <div className="cd-unidade-menu-titulo">

            <span>Unidade de medida</span>

            <span>7 opções</span>

          </div>



          {unidadesDoacao.map(({ value, label, descricao, Icone }) => {

            const ativa = valor === value;



            return (

              <button

                key={value}

                type="button"

                role="option"

                aria-selected={ativa}

                className={`cd-unidade-opcao ${ativa ? "selecionada" : ""}`}

                onClick={() => {

                  onChange(value);

                  setAberto(false);

                }}

              >

                <span className="cd-unidade-icone">

                  <Icone size={17} />

                </span>



                <span className="cd-unidade-textos">

                  <span className="cd-unidade-nome">{label}</span>

                  <span className="cd-unidade-descricao">{descricao}</span>

                </span>



                {ativa && (

                  <span className="cd-unidade-check">

                    <Check size={15} />

                  </span>

                )}

              </button>

            );

          })}

        </div>

      )}

    </div>

  );

}



function obterTipoUsuario() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    return String(usuario?.tipoUsuario || usuario?.tipo || usuario?.perfil || "").toUpperCase();
  } catch {
    return "";
  }
}

export default function CadastroDoacao() {

  const navigate = useNavigate();
    const ehDoador = obterTipoUsuario() === "DOADOR";

  useEffect(() => {
    if (!ehDoador) navigate("/doacoes", { replace: true });
  }, [ehDoador, navigate]);



  const [formulario, setFormulario] = useState({

    nomeAlimento: "",

    categoria: "",

    quantidade: "",

    unidade: "unidades",

    descricao: "",

    dataValidade: "",

    localRetirada: "",

  });



  const [foto, setFoto] = useState("");

  const [erro, setErro] = useState("");

  const [sucesso, setSucesso] = useState("");



  function atualizarCampo(event) {

    const { name, value } = event.target;



    setFormulario((anterior) => ({

      ...anterior,

      [name]: value,

    }));



    setErro("");

    setSucesso("");

  }



  function selecionarImagem(event) {

    const arquivo = event.target.files?.[0];



    if (!arquivo) return;



    if (!arquivo.type.startsWith("image/")) {

      setErro("Selecione um arquivo de imagem válido.");

      event.target.value = "";

      return;

    }



    if (arquivo.size > 2 * 1024 * 1024) {

      setErro("A imagem deve ter no máximo 2 MB.");

      event.target.value = "";

      return;

    }



    const leitor = new FileReader();



    leitor.onload = () => {

      setFoto(String(leitor.result || ""));

      setErro("");

    };



    leitor.onerror = () => {

      setErro("Não foi possível carregar a imagem.");

    };



    leitor.readAsDataURL(arquivo);

  }



  function cadastrarDoacao(event) {

    event.preventDefault();

    setErro("");

    setSucesso("");



    const quantidade = Number(formulario.quantidade);



    if (

      !formulario.nomeAlimento.trim() ||

      !formulario.categoria ||

      !formulario.quantidade ||

      !formulario.localRetirada.trim()

    ) {

      setErro("Preencha todos os campos obrigatórios.");

      return;

    }



    if (!Number.isFinite(quantidade) || quantidade <= 0) {

      setErro("A quantidade deve ser maior que zero.");

      return;

    }



    if (

      formulario.dataValidade &&

      formulario.dataValidade < dataLocalISO()

    ) {

      setErro("A validade não pode estar no passado.");

      return;

    }



    try {

      const doacoes = carregarDoacoes();



      const usuario = JSON.parse(

        localStorage.getItem("usuario") || "null"

      );



      const novaDoacao = {

        id: Date.now(),

        nomeAlimento: formulario.nomeAlimento.trim(),

        categoria: formulario.categoria,

        quantidade,

        unidade: formulario.unidade,

        descricao: formulario.descricao.trim(),

        dataValidade: formulario.dataValidade,

        localRetirada: formulario.localRetirada.trim(),

        foto,

        status: "Disponível",

        doador: usuario?.nome || "Doador demonstrativo",

      };



      const salvou = salvarDoacoes([

        novaDoacao,

        ...doacoes,

      ]);



      if (!salvou) {

        setErro(

          "Não foi possível salvar a doação. Verifique o espaço disponível no navegador."

        );

        return;

      }



      setSucesso("Doação cadastrada com sucesso!");



      setTimeout(() => {

        navigate("/doacoes");

      }, 800);

    } catch (erroCadastro) {

      console.error("Erro ao cadastrar doação:", erroCadastro);



      setErro(

        "Não foi possível cadastrar a doação. Tente novamente."

      );

    }

  }



  return (

    <main className="cadastro-doacao-page">

      <header className="cd-header">

        <Link to="/doacoes" className="cd-voltar">

          <ArrowLeft size={18} />

          Voltar às doações

        </Link>



        <div className="cd-titulo">

          <div className="cd-icone-principal">

            <Package size={26} />

          </div>



          <div>

            <h1>Cadastrar doação</h1>

            <p>

              Compartilhe alimentos e outros itens com quem precisa.

            </p>

          </div>

        </div>

      </header>



      <section className="cd-card">

        <form onSubmit={cadastrarDoacao}>

          <h2>Informações da doação</h2>



          <p className="cd-descricao">

            Preencha os dados abaixo. Os campos com * são obrigatórios.

          </p>



          {erro && (

            <div className="cd-mensagem cd-erro" role="alert">

              {erro}

            </div>

          )}



          {sucesso && (

            <div className="cd-mensagem cd-sucesso" role="status">

              {sucesso}

            </div>

          )}



          <div className="cd-campo">

            <label htmlFor="nomeAlimento">Nome da doação *</label>

            <input

              id="nomeAlimento"

              name="nomeAlimento"

              value={formulario.nomeAlimento}

              onChange={atualizarCampo}

              placeholder="Ex.: Cestas básicas"

              maxLength={120}

              required

            />

          </div>



          <div className="cd-duas-colunas">

            <div className="cd-campo">

              <label id="categoria-label">Categoria *</label>

              <SeletorCategoria

                valor={formulario.categoria}

                onChange={(value) => {

                  setFormulario((anterior) => ({

                    ...anterior,

                    categoria: value,

                  }));

                  setErro("");

                  setSucesso("");

                }}

              />

            </div>



            <div className="cd-campo">

              <label htmlFor="quantidade">Quantidade *</label>

              <div className="cd-quantidade">

                <input

                  id="quantidade"

                  name="quantidade"

                  type="number"

                  min="0.01"

                  step="any"

                  value={formulario.quantidade}

                  onChange={atualizarCampo}

                  placeholder="Ex.: 20"

                  required

                />



                <SeletorUnidade

                  valor={formulario.unidade}

                  onChange={(value) => {

                    setFormulario((anterior) => ({

                      ...anterior,

                      unidade: value,

                    }));

                    setErro("");

                    setSucesso("");

                  }}

                />

              </div>

            </div>

          </div>



          <div className="cd-campo">

            <label htmlFor="descricao">Descrição</label>

            <textarea

              id="descricao"

              name="descricao"

              value={formulario.descricao}

              onChange={atualizarCampo}

              placeholder="Descreva os itens, condições e outras informações importantes."

              rows={4}

              maxLength={1000}

            />

          </div>



          <div className="cd-duas-colunas">

            <div className="cd-campo">

              <label htmlFor="dataValidade">Data de validade</label>

              <div className="cd-input-icone">

                <CalendarDays size={18} />

                <input

                  id="dataValidade"

                  name="dataValidade"

                  type="date"

                  min={dataLocalISO()}

                  value={formulario.dataValidade}

                  onChange={atualizarCampo}

                />

              </div>

            </div>



            <div className="cd-campo">

              <label htmlFor="localRetirada">Local de retirada *</label>

              <div className="cd-input-icone">

                <MapPin size={18} />

                <input

                  id="localRetirada"

                  name="localRetirada"

                  value={formulario.localRetirada}

                  onChange={atualizarCampo}

                  placeholder="Cidade ou endereço"

                  maxLength={255}

                  required

                />

              </div>

            </div>

          </div>



          <div className="cd-campo">

            <label htmlFor="foto">Foto da doação</label>



            <label htmlFor="foto" className="cd-upload">

              {foto ? (

                <img

                  src={foto}

                  alt="Prévia da doação"

                  className="cd-imagem-preview"

                />

              ) : (

                <>

                  <ImagePlus size={30} />

                  <strong>Adicionar uma imagem</strong>

                  <span>

                    PNG, JPG ou outro formato de imagem — até 2 MB

                  </span>

                </>

              )}

            </label>



            <input

              id="foto"

              className="cd-input-arquivo"

              type="file"

              accept="image/*"

              onChange={selecionarImagem}

            />



            {foto && (

              <button

                type="button"

                className="cd-remover-imagem"

                onClick={() => setFoto("")}

              >

                Remover imagem

              </button>

            )}

          </div>



          <div className="cd-acoes">

            <Link

              to="/doacoes"

              className="cd-botao cd-botao-secundario"

            >

              Cancelar

            </Link>



            <button

              type="submit"

              className="cd-botao cd-botao-principal"

            >

              <Save size={18} />

              Cadastrar doação

            </button>

          </div>

        </form>

      </section>

    </main>

  );

}
