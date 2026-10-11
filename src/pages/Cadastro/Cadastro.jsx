import {
  User,
  Mail,
  Lock,
  Leaf,
  Building2,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";

import "./Cadastro.css";

function Cadastro() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const senha = watch("senha");

  const onSubmit = (data) => {
    console.log("Dados do cadastro:", data);
  };

  return (
    <main className="cadastro-page">

      {/* Decorações */}
      <div className="cadastro-decoration cadastro-decoration-top"></div>
      <div className="cadastro-decoration cadastro-decoration-bottom"></div>

      <section className="cadastro-container">

        {/* Logo */}
        <div className="cadastro-logo">

          <div className="cadastro-logo-icon">
            <Leaf size={38} strokeWidth={1.8} />
          </div>

          <span>
            Harvest<span>Hope</span>
          </span>

        </div>


        {/* Cabeçalho */}
        <header className="cadastro-header">

          <h1>Crie sua conta</h1>

          <p>
            Preencha seus dados para começar
            <br />
            a fazer a diferença.
          </p>

        </header>


        {/* Formulário */}
        <form
          className="cadastro-form"
          onSubmit={handleSubmit(onSubmit)}
        >

          {/* =========================
              NOME
          ========================== */}

          <div>

            <div
              className={`cadastro-input ${
                errors.nome ? "cadastro-input-error" : ""
              }`}
            >

              <User size={19} />

              <div className="cadastro-input-content">

                <label htmlFor="nome">
                  Nome completo
                </label>

                <input
                  type="text"
                  id="nome"
                  placeholder="Digite seu nome completo"
                  {...register("nome", {
                    required: "Campo obrigatório*",
                  })}
                />

              </div>

            </div>

            {errors.nome && (
              <span className="cadastro-error-message">
                {errors.nome.message}
              </span>
            )}

          </div>


          {/* =========================
              E-MAIL
          ========================== */}

          <div>

            <div
              className={`cadastro-input ${
                errors.email ? "cadastro-input-error" : ""
              }`}
            >

              <Mail size={19} />

              <div className="cadastro-input-content">

                <label htmlFor="email">
                  E-mail
                </label>

                <input
                  type="email"
                  id="email"
                  placeholder="Digite seu e-mail"
                  {...register("email", {
                    required: "Campo obrigatório*",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Digite um e-mail válido.",
                    },
                  })}
                />

              </div>

            </div>

            {errors.email && (
              <span className="cadastro-error-message">
                {errors.email.message}
              </span>
            )}

          </div>


          {/* =========================
              SENHA
          ========================== */}

          <div>

            <div
              className={`cadastro-input ${
                errors.senha ? "cadastro-input-error" : ""
              }`}
            >

              <Lock size={19} />

              <div className="cadastro-input-content">

                <label htmlFor="senha">
                  Senha
                </label>

                <input
                  type="password"
                  id="senha"
                  placeholder="Digite sua senha"
                  {...register("senha", {
                    required: "Campo obrigatório*",
                    minLength: {
                      value: 6,
                      message:
                        "A senha deve ter pelo menos 6 caracteres.",
                    },
                  })}
                />

              </div>

            </div>

            {errors.senha && (
              <span className="cadastro-error-message">
                {errors.senha.message}
              </span>
            )}

          </div>


          {/* =========================
              CONFIRMAR SENHA
          ========================== */}

          <div>

            <div
              className={`cadastro-input ${
                errors.confirmarSenha
                  ? "cadastro-input-error"
                  : ""
              }`}
            >

              <Lock size={19} />

              <div className="cadastro-input-content">

                <label htmlFor="confirmarSenha">
                  Confirmar senha
                </label>

                <input
                  type="password"
                  id="confirmarSenha"
                  placeholder="Digite sua senha novamente"
                  {...register("confirmarSenha", {
                    required: "Campo obrigatório*",
                    validate: (value) =>
                      value === senha ||
                      "As senhas não coincidem.",
                  })}
                />

              </div>

            </div>

            {errors.confirmarSenha && (
              <span className="cadastro-error-message">
                {errors.confirmarSenha.message}
              </span>
            )}

          </div>


          {/* =========================
              TIPO DE USUÁRIO
          ========================== */}

          <div>

            <div
              className={`cadastro-input ${
                errors.tipoUsuario
                  ? "cadastro-input-error"
                  : ""
              }`}
            >

              <Building2 size={19} />

              <div className="cadastro-input-content">

                <label htmlFor="tipoUsuario">
                  Tipo de usuário
                </label>

                <select
                  id="tipoUsuario"
                  defaultValue=""
                  {...register("tipoUsuario", {
                    required: "Campo obrigatório*",
                  })}
                >

                  <option value="" disabled>
                    Selecione uma opção
                  </option>

                  <option value="doador">
                    Doador
                  </option>

                  <option value="instituicao">
                    Instituição Beneficiária
                  </option>

                </select>

              </div>

            </div>

            {errors.tipoUsuario && (
              <span className="cadastro-error-message">
                {errors.tipoUsuario.message}
              </span>
            )}

          </div>


          {/* =========================
              BOTÃO
          ========================== */}

          <button
            type="submit"
            className="cadastro-button"
          >

            <span>
              Criar conta
            </span>

            <ArrowRight size={20} />

          </button>

        </form>


        {/* Login */}
        <div className="cadastro-login">

          <span>
            Já possui uma conta?
          </span>

          <Link to="/">
            Fazer login
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Cadastro;