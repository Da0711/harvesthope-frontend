import { Mail, Lock, Leaf } from "lucide-react";
import "./Login.css";

function Login() {
  return (
    <div className="login-page">

      <section className="login-left">
        <div className="login-brand">

          <div className="brand-icon">
            <Leaf size={42} strokeWidth={1.8} />
          </div>

          <h1>HarvestHope</h1>

          <p>
            Conectando alimentos a novos recomeços.
          </p>

        </div>
      </section>

      <section className="login-right">

        <div className="login-container">

          <div className="login-header">
            <h2>Bem-vindo(a)!</h2>

            <p>
              Faça login para continuar
            </p>
          </div>

          <form>

            <div className="form-group">

              <label htmlFor="email">
                E-mail
              </label>

              <div className="input-container">

                <span className="input-icon">
                  <Mail size={19} />
                </span>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Digite seu e-mail"
                />

              </div>

            </div>

            <div className="form-group">

              <label htmlFor="password">
                Senha
              </label>

              <div className="input-container">

                <span className="input-icon">
                  <Lock size={19} />
                </span>

                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Digite sua senha"
                />

              </div>

            </div>

            <div className="forgot-password">
              <a href="#">
                Esqueceu sua senha?
              </a>
            </div>

            <button
              type="submit"
              className="login-button"
            >
              Entrar
            </button>

          </form>

          <div className="login-divider">
            <span>ou</span>
          </div>

          <p className="register-text">
            Ainda não possui uma conta?
          </p>

          <a
            href="/cadastro"
            className="register-button"
          >
            Criar conta
          </a>

        </div>

      </section>

    </div>
  );
}

export default Login;