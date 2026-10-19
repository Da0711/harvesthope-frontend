import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import {

  ArrowLeft,

  Package,

  Save,

  CalendarDays,

  MapPin,

  ImagePlus,

  Scale,

  Droplets,

  GlassWater,

  PackageCheck,

  Boxes,

  Wheat,

  ChevronDown,

  Check,

} from "lucide-react";



import { carregarDoacoes, salvarDoacoes } from "../../data/doacoes";

import "./EditarDoacao.css";



function dataLocalISO() {

  const hoje = new Date();



  return `${hoje.getFullYear()}-${String(

    hoje.getMonth() + 1

  ).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;

}



const unidadesMedida = [

  { value: "kg", label: "Quilogramas (kg)", Icone: Scale },

  { value: "g", label: "Gramas (g)", Icone: Scale },

  { value: "L", label: "Litros (L)", Icone: Droplets },

  { value: "ml", label: "Mililitros (ml)", Icone: GlassWater },

  { value: "unidades", label: "Unidades", Icone: PackageCheck },

  { value: "pacotes", label: "Pacotes", Icone: Wheat },

  { value: "caixas", label: "Caixas", Icone: Boxes },

];



function SeletorUnidade({ value, onChange }) {

  const [aberto, setAberto] = useState(false);

  const selecionada =

    unidadesMedida.find((unidade) => unidade.value === value) || unidadesMedida[0];



  return (

    <div className={`ed-seletor-unidade ${aberto ? "aberto" : ""}`}>

      <button

        type="button"

        className="ed-seletor-unidade-botao"

        aria-haspopup="listbox"

        aria-expanded={aberto}

        onClick={() => setAberto((estado) => !estado)}

      >

        <span className="ed-unidade-selecionada">

          <selecionada.Icone size={17} />

          {selecionada.label}

        </span>

        <ChevronDown size={17} className="ed-seletor-seta" />

      </button>



      {aberto && (

        <>

          <button

            type="button"

            className="ed-seletor-fechar"

            aria-label="Fechar opções de unidade"

            onClick={() => setAberto(false)}

          />

          <div className="ed-seletor-unidade-opcoes" role="listbox" aria-label="Unidade de medida">

            {unidadesMedida.map((unidade) => (

              <button

                type="button"

                role="option"

                aria-selected={value === unidade.value}

                className={`ed-seletor-unidade-opcao ${

                  value === unidade.value ? "selecionada" : ""

                }`}

                key={unidade.value}

                onClick={() => {

                  onChange(unidade.value);

                  setAberto(false);

                }}

              >

                <span className="ed-unidade-opcao-conteudo">

                  <span className="ed-unidade-icone">

                    <unidade.Icone size={17} />

                  </span>

                  <span>{unidade.label}</span>

                </span>

                {value === unidade.value && <Check size={16} />}

              </button>

            ))}

          </div>

        </>

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

export default function EditarDoacao() {

  const { id } = useParams();

  const navigate = useNavigate();
    const ehDoador = obterTipoUsuario() === "DOADOR";

  useEffect(() => {
    if (!ehDoador) navigate("/doacoes", { replace: true });
  }, [ehDoador, navigate]);



  const [doacao, setDoacao] = useState(null);

  const [formulario, setFormulario] = useState({

    nomeAlimento: "",

    quantidade: "",

    unidade: "kg",

    dataValidade: "",

    descricao: "",

    foto: "",

    localRetirada: "",

  });



  const [erro, setErro] = useState("");

  const [carregada, setCarregada] = useState(false);



  useEffect(() => {

    const encontrada = carregarDoacoes().find(

      (item) => String(item.id) === String(id)

    );



    if (encontrada) {

      setDoacao(encontrada);



      setFormulario({

        nomeAlimento: encontrada.nomeAlimento || "",

        quantidade: String(encontrada.quantidade ?? ""),

        unidade: encontrada.unidade || "kg",

        dataValidade: encontrada.dataValidade || "",

        descricao: encontrada.descricao || "",

        foto: encontrada.foto || "",

        localRetirada: encontrada.localRetirada || "",

      });

    }



    setCarregada(true);

  }, [id]);



  function atualizarCampo(event) {

    const { name, value } = event.target;



    setFormulario((anterior) => ({

      ...anterior,

      [name]: value,

    }));



    setErro("");

  }



  function selecionarFoto(event) {

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

      setFormulario((anterior) => ({

        ...anterior,

        foto: String(leitor.result || ""),

      }));



      setErro("");

    };



    leitor.onerror = () => {

      setErro("Não foi possível carregar a imagem.");

    };



    leitor.readAsDataURL(arquivo);

  }



  function salvarAlteracoes(event) {

    event.preventDefault();

    setErro("");



    const quantidade = Number(formulario.quantidade);



    if (!formulario.nomeAlimento.trim()) {

      setErro("Informe o nome do alimento.");

      return;

    }



    if (!Number.isFinite(quantidade) || quantidade <= 0) {

      setErro("Informe uma quantidade maior que zero.");

      return;

    }



    if (

      formulario.dataValidade &&

      formulario.dataValidade < dataLocalISO()

    ) {

      setErro("A data de validade não pode estar no passado.");

      return;

    }



    if (!formulario.localRetirada.trim()) {

      setErro("Informe o local de retirada.");

      return;

    }



    const atualizadas = carregarDoacoes().map((item) =>

      String(item.id) === String(id)

        ? {

            ...item,

            nomeAlimento: formulario.nomeAlimento.trim(),

            quantidade,

            unidade: formulario.unidade,

            dataValidade: formulario.dataValidade,

            descricao: formulario.descricao.trim(),

            foto: formulario.foto,

            localRetirada: formulario.localRetirada.trim(),

          }

        : item

    );



    try {

      salvarDoacoes(atualizadas);

      navigate("/doacoes");

    } catch {

      setErro("Não foi possível salvar as alterações.");

    }

  }



  if (!ehDoador) return null;

  if (!carregada) {

    return (

      <main className="editar-doacao-page">

        <p>Carregando doação...</p>

      </main>

    );

  }



  if (!doacao) {

    return (

      <main className="editar-doacao-page">

        <Link to="/doacoes" className="ed-voltar">

          <ArrowLeft size={18} />

          Voltar às doações

        </Link>



        <section className="ed-card ed-vazio">

          <Package size={38} />

          <h1>Doação não encontrada</h1>

          <p>Não encontramos uma doação com esse identificador.</p>

          <Link to="/doacoes" className="ed-botao">

            Ver doações

          </Link>

        </section>

      </main>

    );

  }



  return (

    <main className="editar-doacao-page">

      <header className="ed-header">

        <Link to="/doacoes" className="ed-voltar">

          <ArrowLeft size={18} />

          Voltar às doações

        </Link>



        <div className="ed-titulo">

          <div className="ed-icone">

            <Package size={25} />

          </div>



          <div>

            <h1>Editar doação</h1>

            <p>Atualize as informações do alimento cadastrado.</p>

          </div>

        </div>

      </header>



      <section className="ed-card">

        <h2>Informações da doação</h2>

        <p className="ed-descricao">

          Altere os campos necessários e salve as modificações.

        </p>



        {erro && (

          <div className="ed-erro" role="alert">

            {erro}

          </div>

        )}



        <form onSubmit={salvarAlteracoes}>

          <div className="ed-campo">

            <label htmlFor="nomeAlimento">Nome do alimento *</label>

            <input

              id="nomeAlimento"

              name="nomeAlimento"

              value={formulario.nomeAlimento}

              onChange={atualizarCampo}

              maxLength={150}

              required

            />

          </div>



          <div className="ed-duas-colunas">

            <div className="ed-campo">

              <label htmlFor="quantidade">Quantidade *</label>

              <input

                id="quantidade"

                name="quantidade"

                type="number"

                min="0.01"

                step="any"

                value={formulario.quantidade}

                onChange={atualizarCampo}

                required

              />

            </div>



            <div className="ed-campo">

              <label htmlFor="unidade">Unidade de medida *</label>

              <SeletorUnidade

                value={formulario.unidade}

                onChange={(unidade) =>

                  setFormulario((anterior) => ({ ...anterior, unidade }))

                }

              />

            </div>

          </div>



          <div className="ed-campo">

            <label htmlFor="dataValidade">Data de validade</label>

            <div className="ed-input-icone">

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



          <div className="ed-campo">

            <label htmlFor="localRetirada">Local de retirada *</label>

            <div className="ed-input-icone">

              <MapPin size={18} />

              <input

                id="localRetirada"

                name="localRetirada"

                value={formulario.localRetirada}

                onChange={atualizarCampo}

                maxLength={255}

                required

              />

            </div>

          </div>



          <div className="ed-campo">

            <label htmlFor="descricao">Descrição</label>

            <textarea

              id="descricao"

              name="descricao"

              value={formulario.descricao}

              onChange={atualizarCampo}

              rows={4}

              maxLength={1000}

            />

          </div>



          <div className="ed-campo">

            <label htmlFor="foto">Foto do alimento</label>



            <label htmlFor="foto" className="ed-upload">

              {formulario.foto ? (

                <img src={formulario.foto} alt="Prévia do alimento" />

              ) : (

                <>

                  <ImagePlus size={28} />

                  <strong>Adicionar uma imagem</strong>

                  <span>Imagem de até 2 MB</span>

                </>

              )}

            </label>



            <input

              id="foto"

              className="ed-arquivo"

              type="file"

              accept="image/*"

              onChange={selecionarFoto}

            />



            {formulario.foto && (

              <button

                type="button"

                className="ed-remover-foto"

                onClick={() =>

                  setFormulario((anterior) => ({

                    ...anterior,

                    foto: "",

                  }))

                }

              >

                Remover imagem

              </button>

            )}

          </div>



          <div className="ed-acoes">

            <Link to="/doacoes" className="ed-botao ed-secundario">

              Cancelar

            </Link>



            <button type="submit" className="ed-botao ed-principal">

              <Save size={18} />

              Salvar alterações

            </button>

          </div>

        </form>

      </section>

    </main>

  );

}
