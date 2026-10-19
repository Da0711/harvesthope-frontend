
import {
  Mail,
  Lock,
  Leaf,
  UserPlus,
  ArrowRight,
  Heart,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import foodDonation from "../../assets/images/food-donation.jpg";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    clearErrors("password");

    try {
      const response = await api.post("/api/auth/signin", {
        email: data.email.trim(),
        senha: data.password,
      });

      localStorage.setItem(
        "usuario",
        JSON.stringify(response.data)
      );

      navigate("/home");
    } catch (error) {
      console.error("Erro no login:", error);

      if (error.response?.status === 401) {
        setError("password", {
          type: "manual",
          message: "E-mail ou senha incorretos.",
        });
      } else {
        setError("password", {
          type: "manual",
          message: "Não foi possível conectar ao servidor.",
        });
      }
    }
  };

  return (
    <main className="login-page">
      <section
        className="login-showcase"
        style={{ backgroundImage: `url(${foodDonation})` }}
        aria-label="Conheça o Harvest Hope"
      >
        <div className="showcase-overlay" />

        <div className="showcase-content">
          <Link to="/" className="showcase-logo">
            <span className="showcase-logo-icon">
              <Leaf size={29} strokeWidth={1.7} />
            </span>

            <h1>
              Harvest<span>Hope</span>
            </h1>
          </Link>

          <span className="showcase-label">
            SOLIDARIEDADE EM CADA REFEIÇÃO
          </span>

          <p className="showcase-description">
            Conectando alimentos
            <br />
            a novos recomeços.
          </p>

          <div className="showcase-line" />

          <div className="showcase-benefits">
            <div className="benefit">
              <Leaf size={19} />
              <span>Menos desperdício de alimentos</span>
            </div>

            <div className="benefit">
              <UserPlus size={19} />
              <span>Mais pessoas alcançadas</span>
            </div>

            <div className="benefit">
              <Heart size={19} />
              <span>Um futuro mais solidário</span>
            </div>
          </div>

          <div className="showcase-message">
            <span className="showcase-message-icon">
              <Heart size={21} />
            </span>

            <p>
              Cada doação importa.
              <br />
              Cada gesto pode transformar uma vida.
            </p>
          </div>
        </div>

        <span className="showcase-caption">
          Harvest Hope · Compartilhar faz a diferença
        </span>
      </section>

      <section className="login-form-section">
        <div className="login-form-container">
          <Link to="/" className="login-logo">
            <span className="login-logo-icon">
              <Leaf size={25} strokeWidth={1.8} />
            </span>

            <span className="login-logo-text">
              Harvest<span>Hope</span>
            </span>
          </Link>

          <div className="login-header">
            <span className="login-eyebrow">
              SUA JORNADA COMEÇA AQUI
            </span>

            <h2>Boas-vindas!</h2>

            <p>
              Entre na sua conta para continuar
              <br className="login-desktop-break" />
              fazendo a diferença.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="login-field">
              <label htmlFor="login-email">E-mail</label>

              <div
                className={`modern-input ${
                  errors.email ? "input-error" : ""
                }`}
              >
                <Mail size={19} aria-hidden="true" />

                <input
                  id="login-email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "login-email-error" : undefined
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
                  id="login-email-error"
                  className="error-message"
                  role="alert"
                >
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="login-password">Senha</label>

                <Link
                  to="/recuperar-senha"
                  className="forgot-password-inline"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <div
                className={`modern-input ${
                  errors.password ? "input-error" : ""
                }`}
              >
                <Lock size={19} aria-hidden="true" />

                <input
                  id="login-password"
                  type="password"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password
                      ? "login-password-error"
                      : undefined
                  }
                  {...register("password", {
                    required: "Campo obrigatório.",
                    minLength: {
                      value: 6,
                      message:
                        "A senha deve ter pelo menos 6 caracteres.",
                    },
                  })}
                />
              </div>

              {errors.password && (
                <span
                  id="login-password-error"
                  className="error-message"
                  role="alert"
                >
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              <span>
                {isSubmitting ? "Entrando..." : "Entrar na plataforma"}
              </span>

              <ArrowRight size={19} />
            </button>
          </form>

          <div className="login-divider">
            <span />
            <p>ou</p>
            <span />
          </div>

          <Link to="/cadastro" className="secondary-button">
            <UserPlus size={19} />
            <span>Criar uma conta</span>
          </Link>

          <p className="login-footer">
            Ao entrar, você ajuda a construir uma rede mais solidária.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
