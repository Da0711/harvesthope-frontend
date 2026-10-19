
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  Save,
} from "lucide-react";
import "./CadastroInstituicao.css";

export default function CadastroInstituicao() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    nome: "",
    categoria: "",
    descricao: "",
    endereco: "",
    telefone: "",
    email: "",
  });

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

  function cadastrarInstituicao(event) {
    event.preventDefault();

    if (
      !formulario.nome.trim() ||
      !formulario.categoria ||
      !formulario.endereco.trim() ||
      !formulario.email.trim()
    ) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const dados = JSON.parse(
        localStorage.getItem("harvesthope_instituicoes") || "[]"
      );

      const instituicoes = Array.isArray(dados) ? dados : [];

      const novaInstituicao = {
        ...formulario,
        id: `inst-${Date.now()}`,
        criadaEm: new Date().toLocaleDateString("pt-BR"),
      };

      localStorage.setItem(
        "harvesthope_instituicoes",
        JSON.stringify([...instituicoes, novaInstituicao])
      );

      setSucesso("Instituição cadastrada com sucesso!");

      setTimeout(() => {
        navigate("/instituicoes");
      }, 800);
    } catch {
      setErro("Não foi possível salvar a instituição neste navegador.");
    }
  }

  return (
    <main className="cadastro-instituicao-page">
      <header className="ci-header">
        <Link to="/instituicoes" className="ci-voltar">
          <ArrowLeft size={18} />
          Voltar às instituições
        </Link>

        <div className="ci-titulo">
          <div className="ci-icone-principal">
            <Building2 size={26} />
          </div>

          <div>
            <h1>Cadastrar instituição</h1>
            <p>
              Preencha os dados para adicionar uma instituição ao Harvest Hope.
            </p>
          </div>
        </div>
      </header>

      <section className="ci-card">
        <form onSubmit={cadastrarInstituicao}>
          <h2>Informações da instituição</h2>
          <p className="ci-descricao">
            Os campos marcados com * são obrigatórios.
          </p>

          {erro && (
            <div className="ci-mensagem ci-erro" role="alert">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="ci-mensagem ci-sucesso" role="status">
              {sucesso}
            </div>
          )}

          <div className="ci-campo">
            <label htmlFor="nome">Nome da instituição *</label>
            <div className="ci-input-icone">
              <Building2 size={18} />
              <input
                id="nome"
                name="nome"
                value={formulario.nome}
                onChange={atualizarCampo}
                placeholder="Ex.: Instituição Esperança"
                maxLength={120}
                required
              />
            </div>
          </div>

          <div className="ci-campo">
            <label htmlFor="categoria">Categoria *</label>
            <select
              id="categoria"
              name="categoria"
              value={formulario.categoria}
              onChange={atualizarCampo}
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="Assistência social">Assistência social</option>
              <option value="Apoio comunitário">Apoio comunitário</option>
              <option value="Abrigo">Abrigo</option>
              <option value="ONG">ONG</option>
              <option value="Outra">Outra</option>
            </select>
          </div>

          <div className="ci-campo">
            <label htmlFor="descricao">Descrição</label>
            <div className="ci-input-icone ci-textarea-icone">
              <FileText size={18} />
              <textarea
                id="descricao"
                name="descricao"
                value={formulario.descricao}
                onChange={atualizarCampo}
                placeholder="Conte um pouco sobre a instituição"
                rows={4}
                maxLength={1000}
              />
            </div>
          </div>

          <div className="ci-campo">
            <label htmlFor="endereco">Endereço ou localização *</label>
            <div className="ci-input-icone">
              <MapPin size={18} />
              <input
                id="endereco"
                name="endereco"
                value={formulario.endereco}
                onChange={atualizarCampo}
                placeholder="Cidade, estado ou endereço"
                maxLength={200}
                required
              />
            </div>
          </div>

          <div className="ci-duas-colunas">
            <div className="ci-campo">
              <label htmlFor="telefone">Telefone</label>
              <div className="ci-input-icone">
                <Phone size={18} />
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  value={formulario.telefone}
                  onChange={atualizarCampo}
                  placeholder="(11) 99999-9999"
                  maxLength={25}
                />
              </div>
            </div>

            <div className="ci-campo">
              <label htmlFor="email">E-mail *</label>
              <div className="ci-input-icone">
                <Mail size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formulario.email}
                  onChange={atualizarCampo}
                  placeholder="contato@instituicao.org"
                  maxLength={150}
                  required
                />
              </div>
            </div>
          </div>

          <div className="ci-acoes">
            <Link
              to="/instituicoes"
              className="ci-botao ci-botao-secundario"
            >
              Cancelar
            </Link>

            <button type="submit" className="ci-botao ci-botao-principal">
              <Save size={18} />
              Cadastrar instituição
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
