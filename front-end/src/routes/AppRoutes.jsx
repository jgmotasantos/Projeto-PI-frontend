import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Telas públicas
import TelaLogin from "../pages/Login";
import TelaCadastro from "../pages/Cadastro";

// Telas internas
import TelaInicial from "../pages/Inicial";
import TelaEmpresa from "../pages/Empresa";
import TelaCliente from "../pages/Cliente";
import TelaNegocio from "../pages/Negocio";
import TelaEditais from "../pages/Editais";
import DetalhesEmpresa from "../pages/Empresa/DetalhesEmpresa";
import DetalhesNegocio from "../pages/Negocio/DetalhesNegocio";
import DetalhesContato from "../pages/Cliente/DetalhesContato";


// Layout padrão
import Layout from "../components/Layout";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<TelaLogin />} />
        <Route path="/signup" element={<TelaCadastro />} />

        {/* Rotas internas com layout padrão */}
        <Route element={<Layout />}>
          <Route path="/" element={<TelaInicial />} />
          <Route path="/empresas" element={<TelaEmpresa />} />
          <Route path="/empresas/:id" element={<DetalhesEmpresa />} />
          <Route path="/clientes" element={<TelaCliente />} />
          <Route path="/negocios" element={<TelaNegocio />} />
          <Route path="/editais" element={<TelaEditais />} />
          <Route path="/negocios/:id" element={<DetalhesNegocio />} />
          <Route path="/contatos/:id" element={<DetalhesContato />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
