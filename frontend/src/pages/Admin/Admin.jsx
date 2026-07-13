import { Navigate } from "react-router-dom";

import Container from "../../components/common/Container/Container";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import useAuth from "../../hooks/useAuth";

import "./Admin.css";

function Admin() {
  const {
    user,
    isAdmin,
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  if (isAuthLoading) {
    return (
      <main className="admin-page">
        <Container>
          <p>A carregar painel...</p>
        </Container>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="admin-page">
      <Container>
        <Breadcrumb title="Administração" />

        <header className="admin-page__header">
          <p className="admin-page__label">
            Administração
          </p>

          <h1>Painel de administração</h1>

          <p>Bem-vinda, {user?.name}.</p>
        </header>

        <section className="admin-grid">
          <article className="admin-card">
            <h2>Utilizadores</h2>

            <p>
              A contagem de utilizadores será ligada ao backend.
            </p>
          </article>

          <article className="admin-card">
            <h2>Mensagens</h2>

            <p>
              As mensagens de contacto serão ligadas ao backend.
            </p>
          </article>

          <article className="admin-card">
            <h2>Favoritos</h2>

            <p>
              As estatísticas de favoritos serão ligadas ao backend.
            </p>
          </article>
        </section>
      </Container>
    </main>
  );
}

export default Admin;