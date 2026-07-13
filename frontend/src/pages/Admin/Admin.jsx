import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import Container from "../../components/common/Container/Container";
import { getCurrentUser, getRegisteredUsersCount } from "../../services/authService";
import { getContactMessages } from "../../services/messagesService";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";

import "./Admin.css";

function Admin() {
  const [user] = useState(getCurrentUser());
  const [usersCount, setUsersCount] = useState(0);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    setUsersCount(getRegisteredUsersCount());
    setMessages(getContactMessages());
  }, [user]);

  // Página só acessível a administradores autenticados.
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="admin-page">
      <Container>
        <Breadcrumb title="Administração" />
        <header className="admin-page__header">
          <p className="admin-page__label">Área reservada</p>
          <h1>Painel de administração</h1>
          <p className="admin-page__subtitle">
            Bem-vindo(a), {user.name}. Aqui tens uma visão geral da plataforma.
          </p>
        </header>

        <div className="admin-stats">
          <div className="admin-stats__card">
            <span>Contas registadas</span>
            <strong>{usersCount}</strong>
          </div>

          <div className="admin-stats__card">
            <span>Mensagens recebidas</span>
            <strong>{messages.length}</strong>
          </div>
        </div>

        <div className="admin-page__messages">
          <h2 className="admin-page__section-title">
            Mensagens da página "Sobre nós"
          </h2>

          {messages.length === 0 ? (
            <p className="admin-page__empty">
              Ainda não foi recebida nenhuma mensagem.
            </p>
          ) : (
            <div className="admin-messages">
              {messages.map((msg) => (
                <article key={msg.id} className="admin-message-card">
                  <div className="admin-message-card__head">
                    <div className="admin-message-card__author">
                      <strong>{msg.name}</strong>
                      <span>{msg.email}</span>
                    </div>
                    <time dateTime={msg.createdAt}>
                      {new Date(msg.createdAt).toLocaleString("pt-PT", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </time>
                  </div>
                  <p className="admin-message-card__body">{msg.message}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default Admin;
