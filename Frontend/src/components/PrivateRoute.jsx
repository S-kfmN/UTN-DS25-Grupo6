import { Navigate } from 'react-router-dom';
import { usarAuth } from '../context/AuthContext';

export function PrivateRoute({ children, requiredRole = null }) {
  const { estaAutenticado, usuario, cargando } = usarAuth();

  if (cargando) {
    return <p>Verificando autorización...</p>;
  }

  if (!estaAutenticado()) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && usuario.role !== requiredRole) {
    return <p>No tienes permisos para acceder a esta página.</p>;
  }

  return children;
}