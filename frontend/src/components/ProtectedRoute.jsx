import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

import "./ProtectedRoute.css";

function ProtectedRoute({
  adminOnly = false,
}) {
  const {
    isAuthenticated,
    isAuthLoading,
    isAdmin,
    authError,
    retryAuthentication,
  } = useAuth();

  const location = useLocation();

  if (isAuthLoading) {
    return (
      <main
        className="protected-route-loading"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="protected-route-loading__spinner" />

        <p>A carregar sessão...</p>
      </main>
    );
  }

  if (authError) {
    return (
      <main className="server-error-page">
        <section
          className="server-error-card"
          role="alert"
          aria-labelledby="server-error-title"
        >
          <div
            className="server-error-icon"
            aria-hidden="true"
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z" />
            </svg>
          </div>

          <p className="server-error-eyebrow">
            Ligação interrompida
          </p>

          <h1
            id="server-error-title"
            className="server-error-title"
          >
            Não foi possível ligar ao servidor
          </h1>

          <p className="server-error-description">
            {authError}
          </p>

          <p className="server-error-help">
            Verifica a ligação ou aguarda alguns
            instantes antes de tentares novamente.
          </p>

          <button
            type="button"
            className="server-error-button"
            onClick={retryAuthentication}
          >
            Tentar novamente
          </button>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (adminOnly && !isAdmin) {
    return (
      <Navigate
        to="/nao-autorizado"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;