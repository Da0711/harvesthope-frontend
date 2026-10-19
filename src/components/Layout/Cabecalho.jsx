
import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  HandHeart,
  UserRound,
  Bell,
  LogOut,
} from "lucide-react";

import api from "../../services/api";
import "./Cabecalho.css";

export default function Cabecalho() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario") || "null");
    } catch {
      return null;
    }
  });

  const [naoLidas, setNaoLidas] = useState(0);

  const inicial =
    usuario?.nome?.trim()?.charAt(0)?.toUpperCase() || "U";

  // Atualiza os dados do usuário quando o armazenamento muda.
  useEffect(() => {
    function atualizarUsuario() {
      try {
        setUsuario(
          JSON.parse(localStorage.getItem("usuario") || "null")
        );
      } catch {
        setUsuario(null);
      }
    }

    window.addEventListener("storage", atualizarUsuario);

    return () => {
      window.removeEventListener("storage", atualizarUsuario);
    };
  }, []);

  // Consulta as notificações do usuário autenticado.
  const carregarContador = useCallback(async () => {
    const dadosSalvos = localStorage.getItem("usuario");

    if (!dadosSalvos) {
      setNaoLidas(0);
      return;
    }

    try {
      const resposta = await api.get("/api/v1/notificacoes");

      const notificacoes = Array.isArray(resposta.data)
        ? resposta.data
        : [];

      setNaoLidas(
        notificacoes.filter((notificacao) => !notificacao.lida)
          .length
      );
    } catch (error) {
      console.error(
        "Erro ao carregar contador de notificações:",
        error
      );
    }
  }, []);

  useEffect(() => {
    carregarContador();

    window.addEventListener(
      "notificacoes:atualizadas",
      carregarContador
    );

    return () => {
      window.removeEventListener(
        "notificacoes:atualizadas",
        carregarContador
      );
    };
  }, [carregarContador]);

  // Encerra a sessão no frontend.
  function sair() {
    localStorage.removeItem("usuario");

    setUsuario(null);
    setNaoLidas(0);

    window.dispatchEvent(new Event("storage"));

    navigate("/", { replace: true });
  }

  return (
    <header className="hh-cabecalho">
      <Link
        to="/home"
        className="hh-logo"
        aria-label="Harvest Hope - Início"
      >
        <HandHeart size={28} strokeWidth={1.5} />
        <span>Harvest Hope</span>
      </Link>

      <nav
        className="hh-navegacao"
        aria-label="Navegação principal"
      >
        <NavLink to="/home" end>
          Início
        </NavLink>

        <NavLink to="/doacoes">
          Doações
        </NavLink>

        <NavLink to="/instituicoes">
          Instituições
        </NavLink>

        <NavLink to="/sobre">
          Sobre
        </NavLink>

        <NavLink
          to="/notificacoes"
          className="hh-notificacoes"
          aria-label={
            naoLidas > 0
              ? `Notificações, ${naoLidas} não lidas`
              : "Notificações"
          }
          title="Notificações"
        >
          <Bell size={21} strokeWidth={1.8} />

          {naoLidas > 0 && (
            <span className="hh-notificacoes-contador">
              {naoLidas > 99 ? "99+" : naoLidas}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/perfil"
          className="hh-perfil"
          aria-label="Abrir perfil"
          title={usuario?.nome || "Meu perfil"}
        >
          {usuario?.nome ? (
            inicial
          ) : (
            <UserRound size={18} />
          )}
        </NavLink>

        <button
          type="button"
          className="hh-botao-sair"
          onClick={sair}
          title="Encerrar sessão"
        >
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </nav>
    </header>
  );
}
