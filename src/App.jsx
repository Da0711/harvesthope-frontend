
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import Home from "./pages/Home/Home";
import Instituicoes from "./pages/Instituicoes/Instituicoes";
import Doacoes from "./pages/Doacoes/Doacoes";
import DetalhesDoacao from "./pages/DetalhesDoacao/DetalhesDoacao";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/home" element={<Home />} />

        <Route path="/instituicoes" element={<Instituicoes />} />

        <Route path="/doacoes" element={<Doacoes />} />

        <Route
          path="/doacoes/:id"
          element={<DetalhesDoacao />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
