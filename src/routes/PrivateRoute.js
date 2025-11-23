import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

function PrivateRoute({ children, requiredPerfil }) {
  const isAuthenticated = authService.isAuthenticated();
  const usuario = authService.getUsuario();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se há um perfil requerido e o usuário não tem esse perfil, redireciona
  if (requiredPerfil && usuario?.perfil !== requiredPerfil) {
    // Redireciona para a home correta baseado no perfil do usuário
    const homePath = usuario?.perfil === 'G' ? '/gestor/home' : '/cliente/home';
    return <Navigate to={homePath} replace />;
  }

  return children;
}

export default PrivateRoute;
