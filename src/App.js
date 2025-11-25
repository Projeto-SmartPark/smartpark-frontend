import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import PrivateRoute from './routes/PrivateRoute';

// Páginas do Gestor
import HomeGestor from './pages/gestor/HomeGestor';
import Estacionamentos from './pages/gestor/Estacionamentos';
import Vagas from './pages/gestor/Vagas';
import Tarifas from './pages/gestor/Tarifas';
import Acessos from './pages/gestor/Acessos';
import ReservasGestor from './pages/gestor/Reservas';

// Páginas do Cliente
import HomeCliente from './pages/cliente/HomeCliente';
import EstacionamentosCliente from './pages/cliente/Estacionamentos';
import VagasCliente from './pages/cliente/VagasCliente';
import ReservarVaga from './pages/cliente/ReservarVaga';
import Reservas from './pages/cliente/Reservas';
import VeiculosCliente from './pages/cliente/Veiculos';
import AcessosCliente from './pages/cliente/Acessos';

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
        <Route
          path="/gestor/tarifas"
          element={
            <PrivateRoute requiredPerfil="G">
              <Tarifas />
            </PrivateRoute>
          }
        />
        <Route
          path="/gestor/acessos"
          element={
            <PrivateRoute requiredPerfil="G">
              <Acessos />
            </PrivateRoute>
          }
        />
        <Route
          path="/gestor/reservas"
          element={
            <PrivateRoute requiredPerfil="G">
              <ReservasGestor />
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
        <Route
          path="/cliente/reservar/:estacionamentoId/:vagaId"
          element={
            <PrivateRoute requiredPerfil="C">
              <ReservarVaga />
            </PrivateRoute>
          }
        />
        <Route
          path="/cliente/reservas"
          element={
            <PrivateRoute requiredPerfil="C">
              <Reservas />
            </PrivateRoute>
          }
        />
        <Route
          path="/cliente/veiculos"
          element={
            <PrivateRoute requiredPerfil="C">
              <VeiculosCliente />
            </PrivateRoute>
          }
        />
        <Route
          path="/cliente/acessos"
          element={
            <PrivateRoute requiredPerfil="C">
              <AcessosCliente />
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
