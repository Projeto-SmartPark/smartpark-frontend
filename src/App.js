import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import PrivateRoute from './routes/PrivateRoute';

// Páginas do Gestor
import HomeGestor from './pages/gestor/HomeGestor';
import Estacionamentos from './pages/gestor/Estacionamentos';
import Vagas from './pages/gestor/Vagas';

// Páginas do Cliente
import HomeCliente from './pages/cliente/HomeCliente';
import EstacionamentosCliente from './pages/cliente/Estacionamentos';
import VagasCliente from './pages/cliente/VagasCliente';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas do Gestor */}
        <Route
          path="/gestor/home"
          element={
            <PrivateRoute requiredPerfil="G">
              <HomeGestor />
            </PrivateRoute>
          }
        />
        <Route
          path="/gestor/estacionamentos"
          element={
            <PrivateRoute requiredPerfil="G">
              <Estacionamentos />
            </PrivateRoute>
          }
        />
        <Route
          path="/gestor/vagas/:estacionamentoId"
          element={
            <PrivateRoute requiredPerfil="G">
              <Vagas />
            </PrivateRoute>
          }
        />

        {/* Rotas do Cliente */}
        <Route
          path="/cliente/home"
          element={
            <PrivateRoute requiredPerfil="C">
              <HomeCliente />
            </PrivateRoute>
          }
        />
        <Route
          path="/cliente/estacionamentos"
          element={
            <PrivateRoute requiredPerfil="C">
              <EstacionamentosCliente />
            </PrivateRoute>
          }
        />
        <Route
          path="/cliente/vagas/:estacionamentoId"
          element={
            <PrivateRoute requiredPerfil="C">
              <VagasCliente />
            </PrivateRoute>
          }
        />

        {/* Rota padrão */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
