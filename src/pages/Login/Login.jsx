
import {
  Mail,
  Lock,
  Leaf,
  UserPlus,
  ArrowRight,
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
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/api/auth/signin", {
        email: data.email,
        senha: data.password,
      });

      localStorage.setItem("usuario", JSON.stringify(response.data));

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
      >
        <div className="showcase-overlay" />

        <div className="showcase-content">
          <div className="showcase-logo">
            <Leaf size={42} strokeWidth={1.8} />

            <h1>
              Harvest<span>Hope</span>
            </h1>
          </div>

          <p className="showcase-description">
            Conectando alimentos
            <br />
            a novos recomeços.
          </p>

          <div className="showcase-line" />

          <div className="showcase-benefits">
            <div className="benefit">
              <Leaf size={20} />
              <span>Menos desperdício</span>
            </div>

            <div className="benefit">
              <UserPlus size={20} />
              <span>Mais pessoas alcançadas</span>
            </div>

            <div className="benefit">
              <span className="heart-icon">♥</span>
              <span>Um futuro mais sustentável</span>
            </div>
          </div>

          <div className="showcase-message">
            <Leaf size={30} />

            <p>
              Juntos podemos transformar
              <br />
              realidades através da doação
              <br />
              de alimentos.
            </p>
          </div>
        </div>
      </section>

      <section className="login-form-section">
        <div className="login-form-container">
          <div className="login-logo">
            <Leaf size={38} strokeWidth={1.8} />

            <span>
              Harvest<span>Hope</span>
            </span>
          </div>

          <div className="login-header">
            <h2>Bem-vindo(a)!</h2>

            <p>
              Faça login para continuar
              <br />
              na plataforma.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <div
                className={`modern-input ${
                  errors.email ? "input-error" : ""
                }`}
              >
                <Mail size={19} />

                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                  autoComplete="email"
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
                <span className="error-message">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div>
              <div
                className={`modern-input ${
                  errors.password ? "input-error" : ""
                }`}
              >
                <Lock size={19} />

                <input
                  type="password"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Campo obrigatório.",
                    minLength: {
                      value: 6,
                      message: "A senha deve ter pelo menos 6 caracteres.",
                    },
                  })}
                />
              </div>

              {errors.password && (
                <span className="error-message">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="forgot-password">
              <a href="#" onClick={(event) => event.preventDefault()}>
                Esqueceu sua senha?
              </a>
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? "Entrando..." : "Entrar"}</span>
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="login-divider">
            <span />
            <p>ou</p>
            <span />
          </div>

          <Link to="/cadastro" className="secondary-button">
            <UserPlus size={19} />
            <span>Criar conta</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Login;
