// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth  from "../hooks/useAuth";

export function ProtectedRoute({ adminOnly = false }) {
  const { isAuthenticated, isAuthLoading, isAdmin } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <div className="loading-screen">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/nao-autorizado" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;