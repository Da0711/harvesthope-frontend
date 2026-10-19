import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  ShieldCheck,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";
import "./RecuperarSenha.css";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");

  function enviar(event) {
    event.preventDefault();

    setMensagem(
      "Formulário validado. O envio de e-mail será integrado posteriormente."
    );
  }

  return (
    <main className="recuperar-page">
      <div className="recuperar-decoracao recuperar-decoracao-um" aria-hidden="true" />
      <div className="recuperar-decoracao recuperar-decoracao-dois" aria-hidden="true" />

      <section className="recuperar-layout">
        <header className="recuperar-introducao">
          <Link to="/" className="recuperar-voltar">
            <ArrowLeft size={17} />
            Voltar para o login
          </Link>

          <div className="recuperar-simbolo" aria-hidden="true">
            <LockKeyhole size={27} />
          </div>

          <span className="recuperar-etiqueta">
            <ShieldCheck size={15} />
            Acesso seguro
          </span>

          <h1>Vamos recuperar seu acesso.</h1>
          <p>
            Às vezes, todos precisamos de uma ajudinha. Informe seu e-mail
            cadastrado para iniciar a recuperação da senha.
          </p>

          <div className="recuperar-nota">
            <span className="recuperar-nota-icone">
              <Mail size={19} />
            </span>
            <span>
              <strong>Confira seu e-mail</strong>
              <small>
                Quando a recuperação estiver integrada, as instruções chegarão
                à sua caixa de entrada.
              </small>
            </span>
          </div>
        </header>

        <section className="recuperar-card">
          <div className="recuperar-card-topo">
            <div className="recuperar-card-icone">
              <Mail size={22} />
            </div>
            <span className="recuperar-passo">RECUPERAÇÃO DE CONTA</span>
          </div>

          <h2>Recuperar senha</h2>
          <p className="recuperar-descricao">
            Digite o e-mail associado à sua conta para continuar.
          </p>

          <form onSubmit={enviar}>
            <div className="recuperar-campo">
              <label htmlFor="email-recuperar">E-mail cadastrado</label>

              <div className="recuperar-input-wrap">
                <Mail size={18} aria-hidden="true" />
                <input
                  id="email-recuperar"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setMensagem("");
                  }}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <button type="submit" className="recuperar-botao">
              Enviar instruções
              <ArrowRight size={18} />
            </button>
          </form>

          {mensagem && (
            <div className="recuperar-mensagem" role="status">
              <CheckCircle2 size={19} />
              <p>{mensagem}</p>
            </div>
          )}

          <div className="recuperar-divisor">
            <span />
            <small>Precisa de outra opção?</small>
            <span />
          </div>

          <Link to="/" className="recuperar-link-login">
            <ArrowLeft size={16} />
            Voltar para o login
          </Link>

          <p className="recuperar-rodape">
            Harvest Hope <span>·</span> Cuidar também é compartilhar.
          </p>
        </section>
      </section>
    </main>
  );
}
