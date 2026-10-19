
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Search,
  UserRound,
  ShieldCheck,
  Mail,
  Filter,
} from "lucide-react";
import "./GerenciarUsuarios.css";

export default function GerenciarUsuarios() {
  const [pesquisa, setPesquisa] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  let usuarioLogado = null;

  try {
    usuarioLogado = JSON.parse(
      localStorage.getItem("usuario") || "null"
    );
  } catch {
    usuarioLogado = null;
  }

  const usuarios = useMemo(() => {
    const lista = [];

    if (usuarioLogado && typeof usuarioLogado === "object") {
      lista.push({
        id: usuarioLogado.id || "usuario-logado",
        nome: usuarioLogado.nome || "Usuário atual",
        email: usuarioLogado.email || "E-mail não informado",
        tipo: usuarioLogado.tipoUsuario || usuarioLogado.tipo || "Usuário",
      });
    }

    return lista;
  }, []);

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const termo = pesquisa.toLowerCase();

    const correspondePesquisa =
      String(usuario.nome).toLowerCase().includes(termo) ||
      String(usuario.email).toLowerCase().includes(termo);

    const tipo = String(usuario.tipo).toLowerCase();

    const correspondeTipo =
      filtroTipo === "todos" ||
      (filtroTipo === "admin" &&
        (tipo.includes("admin") || tipo.includes("administrador"))) ||
      (filtroTipo === "usuario" &&
        !tipo.includes("admin") &&
        !tipo.includes("administrador"));

    return correspondePesquisa && correspondeTipo;
  });

  return (
    <main className="gerenciar-usuarios-page">
      <header className="gu-header">
        <Link to="/administracao" className="gu-voltar">
          <ArrowLeft size={18} />
          Voltar ao painel administrativo
        </Link>

        <div className="gu-titulo">
          <div className="gu-icone-principal">
            <Users size={26} />
          </div>

          <div>
            <h1>Gerenciar usuários</h1>
            <p>Consulte os usuários disponíveis nesta sessão.</p>
          </div>
        </div>
      </header>

      <section className="gu-resumo">
        <div className="gu-resumo-icone">
          <UserRound size={24} />
        </div>

        <div>
          <span>Usuários disponíveis localmente</span>
          <strong>{usuarios.length}</strong>
        </div>
      </section>

      <section className="gu-conteudo">
        <div className="gu-conteudo-cabecalho">
          <div>
            <h2>Usuários cadastrados</h2>
            <p>Pesquise por nome ou e-mail.</p>
          </div>
        </div>

        <div className="gu-filtros">
          <div className="gu-pesquisa">
            <Search size={19} />

            <input
              type="search"
              placeholder="Buscar usuário..."
              value={pesquisa}
              onChange={(event) => setPesquisa(event.target.value)}
            />
          </div>

          <div className="gu-filtro-tipo">
            <Filter size={18} />

            <select
              value={filtroTipo}
              onChange={(event) => setFiltroTipo(event.target.value)}
              aria-label="Filtrar por tipo de usuário"
            >
              <option value="todos">Todos os tipos</option>
              <option value="admin">Administradores</option>
              <option value="usuario">Demais usuários</option>
            </select>
          </div>
        </div>

        {usuariosFiltrados.length === 0 ? (
          <div className="gu-vazio">
            <Users size={40} />

            <h3>
              {usuarios.length === 0
                ? "Nenhum usuário disponível"
                : "Nenhum resultado encontrado"}
            </h3>

            <p>
              {usuarios.length === 0
                ? "Os dados dos usuários ainda não estão conectados a uma fonte administrativa."
                : "Tente pesquisar por outro nome, e-mail ou tipo."}
            </p>
          </div>
        ) : (
          <div className="gu-tabela-scroll">
            <table className="gu-tabela">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>E-mail</th>
                  <th>Tipo</th>
                </tr>
              </thead>

              <tbody>
                {usuariosFiltrados.map((usuario, index) => (
                  <tr key={usuario.id || index}>
                    <td>
                      <div className="gu-usuario">
                        <div className="gu-avatar">
                          <UserRound size={19} />
                        </div>

                        <strong>{usuario.nome}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="gu-email">
                        <Mail size={15} />
                        {usuario.email}
                      </span>
                    </td>

                    <td>
                      <span className="gu-tipo">
                        <ShieldCheck size={15} />
                        {usuario.tipo}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="gu-aviso">
        Esta tela ainda não consulta a API nem permite editar ou excluir
        usuários.
      </p>
    </main>
  );
}
