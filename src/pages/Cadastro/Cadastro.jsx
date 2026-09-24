import {
  User,
  Mail,
  Lock,
  Leaf,
  Building2
} from "lucide-react";

import "./Cadastro.css";

function Cadastro() {
  return (
    <div className="cadastro-page">

      <div className="cadastro-container">

        {/* Logo */}
        <div className="cadastro-brand">

          <div className="cadastro-brand-icon">
            <Leaf size={25} strokeWidth={1.8} />
          </div>

          <h1>HarvestHope</h1>

        </div>

        {/* Cabeçalho */}
        <div className="cadastro-header">

          <h2>Crie sua conta</h2>

          <p>
            Preencha seus dados para começar
          </p>

        </div>

        <form>

          {/* Nome */}
          <div className="cadastro-form-group">

            <label htmlFor="nome">
              Nome completo
            </label>

            <div className="cadastro-input-container">

              <User size={18} />

              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Digite seu nome completo"
              />

            </div>

          </div>

          {/* E-mail */}
          <div className="cadastro-form-group">

            <label htmlFor="email">
              E-mail
            </label>

            <div className="cadastro-input-container">

              <Mail size={18} />

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Digite seu e-mail"
              />

            </div>

          </div>

          {/* Senha */}
          <div className="cadastro-form-group">

            <label htmlFor="senha">
              Senha
            </label>

            <div className="cadastro-input-container">

              <Lock size={18} />

              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Digite sua senha"
              />

            </div>

          </div>

          {/* Confirmar senha */}
          <div className="cadastro-form-group">

            <label htmlFor="confirmarSenha">
              Confirmar senha
            </label>

            <div className="cadastro-input-container">

              <Lock size={18} />

              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                placeholder="Digite sua senha novamente"
              />

            </div>

          </div>

          {/* Tipo de usuário */}
          <div className="cadastro-form-group">

            <label htmlFor="tipoUsuario">
              Tipo de usuário
            </label>

            <div className="cadastro-input-container">

              <Building2 size={18} />

              <select
                id="tipoUsuario"
                name="tipoUsuario"
                defaultValue=""
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

          <button
            type="submit"
            className="cadastro-button"
          >
            Criar conta
          </button>

        </form>

        <div className="cadastro-login">

          <span>
            Já possui uma conta?
          </span>

          <a href="/">
            Fazer login
          </a>

        </div>

      </div>

    </div>
  );
}

export default Cadastro;