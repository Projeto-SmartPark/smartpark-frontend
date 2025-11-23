import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import PrivateRoute from './routes/PrivateRoute';

// Páginas do Gestor
import HomeGestor from './pages/gestor/HomeGestor';

// Páginas do Cliente
import HomeCliente from './pages/cliente/HomeCliente';

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

        {/* Rotas do Cliente */}
        <Route
          path="/cliente/home"
          element={
            <PrivateRoute requiredPerfil="C">
              <HomeCliente />
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
