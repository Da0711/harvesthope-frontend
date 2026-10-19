
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Cabecalho from "./components/Layout/Cabecalho.jsx";

// Autenticação
import Login from "./pages/Login/Login.jsx";
import Cadastro from "./pages/Cadastro/Cadastro.jsx";
import RecuperarSenha from "./pages/RecuperarSenha/RecuperarSenha.jsx";

// Páginas principais
import Home from "./pages/Home/Home.jsx";
import Sobre from "./pages/Sobre/Sobre.jsx";

// Instituições
import Instituicoes from "./pages/Instituicoes/Instituicoes.jsx";
import DetalhesInstituicao from "./pages/DetalhesInstituicao/DetalhesInstituicao.jsx";
import CadastroInstituicao from "./pages/CadastroInstituicao/CadastroInstituicao.jsx";

// Doações
import Doacoes from "./pages/Doacoes/Doacoes.jsx";
import DetalhesDoacao from "./pages/DetalhesDoacao/DetalhesDoacao.jsx";
import CadastroDoacao from "./pages/CadastroDoacao/CadastroDoacao.jsx";
import EditarDoacao from "./pages/EditarDoacao/EditarDoacao.jsx";

// Perfil
import Perfil from "./pages/Perfil/PerfilNova.jsx";

// Solicitações
import Solicitacoes from "./pages/Solicitacoes/Solicitacoes.jsx";
import DetalhesSolicitacao from "./pages/DetalhesSolicitacao/DetalhesSolicitacao.jsx";

// Histórico e notificações
import HistoricoDoacoes from "./pages/HistoricoDoacoes/HistoricoDoacoes.jsx";
import Notificacoes from "./pages/Notificacoes/Notificacoes.jsx";

// Administração
import Administracao from "./pages/Administracao/Administracao.jsx";
import GerenciarUsuarios from "./pages/GerenciarUsuarios/GerenciarUsuarios.jsx";

function LayoutPrincipal() {
  return (
    <>
      <Cabecalho />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Autenticação sem cabeçalho principal */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        {/* Páginas com cabeçalho compartilhado */}
        <Route element={<LayoutPrincipal />}>
          <Route path="/home" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />

          <Route path="/instituicoes" element={<Instituicoes />} />
          <Route
            path="/instituicoes/:id"
            element={<DetalhesInstituicao />}
          />
          <Route
            path="/cadastro-instituicao"
            element={<CadastroInstituicao />}
          />

          <Route path="/doacoes" element={<Doacoes />} />
          <Route path="/doacoes/:id" element={<DetalhesDoacao />} />
          <Route
            path="/doacoes/:id/editar"
            element={<EditarDoacao />}
          />
          <Route path="/cadastro-doacao" element={<CadastroDoacao />} />

          <Route path="/perfil" element={<Perfil />} />

          <Route path="/solicitacoes" element={<Solicitacoes />} />
          <Route
            path="/solicitacoes/:id"
            element={<DetalhesSolicitacao />}
          />

          <Route
            path="/historico-doacoes"
            element={<HistoricoDoacoes />}
          />
          <Route path="/notificacoes" element={<Notificacoes />} />

          <Route path="/administracao" element={<Administracao />} />
          <Route
            path="/gerenciar-usuarios"
            element={<GerenciarUsuarios />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
