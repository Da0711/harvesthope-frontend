import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Leaf,
  Building2,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Check,
  HeartHandshake,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import "./Cadastro.css";

const perfis = [
  {
    value: "doador",
    label: "Quero doar alimentos",
    description: "Compartilhe alimentos com quem precisa.",
    Icon: HeartHandshake,
  },
  {
    value: "instituicao",
    label: "Sou uma instituição beneficiária",
    description: "Receba doações para sua comunidade.",
    Icon: Building2,
  },
];

function Cadastro() {
  const navigate = useNavigate();
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("erro");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      tipoUsuario: "",
    },
  });

  const senha = watch("senha");
  const tipoUsuario = watch("tipoUsuario");
  const perfilSelecionado = perfis.find(
    (perfil) => perfil.value === tipoUsuario
  );

  const onSubmit = async (data) => {
    setMensagem("");
    setTipoMensagem("erro");

    try {
      // O cadastro público da API aceita somente usuários do tipo DOADOR.
      if (data.tipoUsuario === "instituicao") {
        setMensagem(
          "O cadastro público está disponível somente para doadores. Para cadastrar uma instituição, entre em contato com a administração da plataforma."
        );
        return;
      }

      const payload = {
        nome: data.nome.trim(),
        email: data.email.trim(),
        senha: data.senha,
        tipoUsuario: "DOADOR",
      };

      await api.post("/api/v1/usuarios", payload);

      // Redireciona para a tela de login após o cadastro bem-sucedido.
      navigate("/", {
        replace: true,
        state: {
          mensagemCadastro:
            "Conta criada com sucesso! Entre com seu e-mail e sua senha.",
          email: data.email.trim(),
        },
      });
    } catch (error) {
      const status = error?.response?.status;
      const mensagemApi =
        error?.response?.data?.mensagem ||
        error?.response?.data?.message ||
        error?.response?.data?.erro;

      if (status === 409 || status === 400) {
        setMensagem(
          mensagemApi ||
            "Não foi possível criar a conta. Verifique se o e-mail já está cadastrado e se os dados estão corretos."
        );
      } else if (status === 403) {
        setMensagem(
          mensagemApi ||
            "Este tipo de usuário não pode ser cadastrado por este formulário."
        );
      } else if (!error?.response) {
        setMensagem(
          "Não foi possível conectar ao servidor. Confira se o backend está em execução e tente novamente."
        );
      } else {
        setMensagem(
          mensagemApi ||
            `Não foi possível criar a conta (erro ${status || "desconhecido"}). Tente novamente.`
        );
      }

      setTipoMensagem("erro");
    }
  };

  function selecionarPerfil(valor) {
    setValue("tipoUsuario", valor, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    clearErrors("tipoUsuario");
    setPerfilAberto(false);
    setMensagem("");
  }

  function validarPerfilAntesDoEnvio(event) {
    if (!tipoUsuario) {
      setError("tipoUsuario", {
        type: "required",
        message: "Selecione uma opção.",
      });
      setPerfilAberto(true);
      event.preventDefault();
      return;
    }

    handleSubmit(onSubmit)(event);
  }

  return (
    <main className="cadastro-page">
      <div
        className="cadastro-decoration cadastro-decoration-top"
        aria-hidden="true"
      />
      <div
        className="cadastro-decoration cadastro-decoration-bottom"
        aria-hidden="true"
      />

      <section className="cadastro-container">
        <Link to="/" className="cadastro-logo">
          <span className="cadastro-logo-icon">
            <Leaf size={26} strokeWidth={1.8} />
          </span>
          <span className="cadastro-logo-text">
            Harvest<span>Hope</span>
          </span>
        </Link>

        <header className="cadastro-header">
          <span className="cadastro-eyebrow">FAÇA PARTE DESSA CORRENTE</span>
          <h1>Crie sua conta</h1>
          <p>
            Juntos podemos transformar alimentos
            <br className="cadastro-desktop-break" />
            em novas oportunidades.
          </p>
        </header>

        <form
          className="cadastro-form"
          onSubmit={validarPerfilAntesDoEnvio}
          noValidate
        >
          <div className="cadastro-field">
            <label htmlFor="nome">Nome completo</label>
            <div
              className={`cadastro-input ${
                errors.nome ? "cadastro-input-error" : ""
              }`}
            >
              <User size={19} aria-hidden="true" />
              <input
                type="text"
                id="nome"
                placeholder="Digite seu nome completo"
                autoComplete="name"
                aria-invalid={Boolean(errors.nome)}
                aria-describedby={
                  errors.nome ? "cadastro-nome-error" : undefined
                }
                {...register("nome", {
                  required: "Campo obrigatório.",
                  minLength: {
                    value: 3,
                    message: "Digite seu nome completo.",
                  },
                })}
              />
            </div>
            {errors.nome && (
              <span
                id="cadastro-nome-error"
                className="cadastro-error-message"
                role="alert"
              >
                {errors.nome.message}
              </span>
            )}
          </div>

          <div className="cadastro-field">
            <label htmlFor="email">E-mail</label>
            <div
              className={`cadastro-input ${
                errors.email ? "cadastro-input-error" : ""
              }`}
            >
              <Mail size={19} aria-hidden="true" />
              <input
                type="email"
                id="email"
                placeholder="voce@exemplo.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "cadastro-email-error" : undefined
                }
                {...register("email", {
                  required: "Campo obrigatório.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Digite um e-mail válido.",
                  },
                })}
              />
            </div>
            {errors.email && (
              <span
                id="cadastro-email-error"
                className="cadastro-error-message"
                role="alert"
              >
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="cadastro-field">
            <label htmlFor="senha">Senha</label>
            <div
              className={`cadastro-input ${
                errors.senha ? "cadastro-input-error" : ""
              }`}
            >
              <Lock size={19} aria-hidden="true" />
              <input
                type="password"
                id="senha"
                placeholder="Crie uma senha"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.senha)}
                aria-describedby={
                  errors.senha ? "cadastro-senha-error" : undefined
                }
                {...register("senha", {
                  required: "Campo obrigatório.",
                  minLength: {
                    value: 6,
                    message: "Use pelo menos 6 caracteres.",
                  },
                })}
              />
            </div>
            {errors.senha && (
              <span
                id="cadastro-senha-error"
                className="cadastro-error-message"
                role="alert"
              >
                {errors.senha.message}
              </span>
            )}
          </div>

          <div className="cadastro-field">
            <label htmlFor="confirmarSenha">Confirmar senha</label>
            <div
              className={`cadastro-input ${
                errors.confirmarSenha ? "cadastro-input-error" : ""
              }`}
            >
              <Lock size={19} aria-hidden="true" />
              <input
                type="password"
                id="confirmarSenha"
                placeholder="Digite a senha novamente"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirmarSenha)}
                aria-describedby={
                  errors.confirmarSenha
                    ? "cadastro-confirmar-error"
                    : undefined
                }
                {...register("confirmarSenha", {
                  required: "Campo obrigatório.",
                  validate: (value) =>
                    value === senha || "As senhas não coincidem.",
                })}
              />
            </div>
            {errors.confirmarSenha && (
              <span
                id="cadastro-confirmar-error"
                className="cadastro-error-message"
                role="alert"
              >
                {errors.confirmarSenha.message}
              </span>
            )}
          </div>

          <div className="cadastro-field">
            <label id="tipoUsuario-label">Como você quer participar?</label>
            <input
              type="hidden"
              {...register("tipoUsuario", {
                required: "Selecione uma opção.",
              })}
            />

            <div
              className={`cadastro-perfil-seletor ${
                errors.tipoUsuario ? "cadastro-input-error" : ""
              }`}
            >
              <button
                type="button"
                className={`cadastro-perfil-trigger ${
                  perfilAberto ? "aberto" : ""
                }`}
                aria-labelledby="tipoUsuario-label"
                aria-haspopup="listbox"
                aria-expanded={perfilAberto}
                aria-invalid={Boolean(errors.tipoUsuario)}
                aria-describedby={
                  errors.tipoUsuario ? "cadastro-tipo-error" : undefined
                }
                onClick={() => setPerfilAberto((aberto) => !aberto)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setPerfilAberto(false);
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setPerfilAberto(true);
                  }
                }}
              >
                {perfilSelecionado ? (
                  <>
                    <span className="cadastro-perfil-trigger-icone">
                      <perfilSelecionado.Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="cadastro-perfil-trigger-texto">
                      {perfilSelecionado.label}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="cadastro-perfil-trigger-icone">
                      <Building2 size={18} aria-hidden="true" />
                    </span>
                    <span className="cadastro-perfil-placeholder">
                      Selecione seu perfil
                    </span>
                  </>
                )}
                <ChevronDown
                  className={`cadastro-perfil-seta ${
                    perfilAberto ? "rotacionada" : ""
                  }`}
                  size={17}
                  aria-hidden="true"
                />
              </button>

              {perfilAberto && (
                <div
                  className="cadastro-perfil-menu"
                  role="listbox"
                  aria-labelledby="tipoUsuario-label"
                >
                  {perfis.map(({ value, label, description, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      role="option"
                      aria-selected={tipoUsuario === value}
                      className={`cadastro-perfil-opcao ${
                        tipoUsuario === value ? "selecionada" : ""
                      }`}
                      onClick={() => selecionarPerfil(value)}
                    >
                      <span className="cadastro-perfil-opcao-icone">
                        <Icon size={19} aria-hidden="true" />
                      </span>
                      <span className="cadastro-perfil-opcao-texto">
                        <strong>{label}</strong>
                        <small>{description}</small>
                      </span>
                      {tipoUsuario === value && (
                        <Check
                          size={18}
                          className="cadastro-perfil-check"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {errors.tipoUsuario && (
              <span
                id="cadastro-tipo-error"
                className="cadastro-error-message"
                role="alert"
              >
                {errors.tipoUsuario.message}
              </span>
            )}
          </div>

          {mensagem && (
            <div
              className={`cadastro-privacy-note ${
                tipoMensagem === "sucesso"
                  ? "cadastro-mensagem-sucesso"
                  : "cadastro-mensagem-erro"
              }`}
              role="alert"
              aria-live="polite"
            >
              <CheckCircle2 size={16} />
              <p>{mensagem}</p>
            </div>
          )}

          <div className="cadastro-privacy-note">
            <CheckCircle2 size={16} />
            <p>Seus dados serão usados para criar seu perfil na plataforma.</p>
          </div>

          <button
            type="submit"
            className="cadastro-button"
            disabled={isSubmitting}
          >
            <span>
              {isSubmitting ? "Criando conta..." : "Criar minha conta"}
            </span>
            <ArrowRight size={19} />
          </button>
        </form>

        <div className="cadastro-login">
          <span>Já possui uma conta?</span>
          <Link to="/">Fazer login</Link>
        </div>

        <p className="cadastro-footer">
          Solidariedade que alimenta. Esperança que transforma.
        </p>
      </section>
    </main>
  );
}

export default Cadastro;
