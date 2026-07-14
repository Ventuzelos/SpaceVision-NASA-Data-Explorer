import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import Container from "../../components/common/Container/Container";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import ErrorState from "../../components/common/ErrorState/ErrorState";
import Icon from "../../components/common/Icon/Icon";
import useAuth from "../../hooks/useAuth";

import {
  deleteMessage,
  getFavoritesStats,
  getMessagesStats,
  getUsersCount,
  markMessageAsRead,
} from "../../services/adminService";

import "./Admin.css";

function formatDate(value) {
  return new Date(value).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCount(value) {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return "0";
  }
  return new Intl.NumberFormat("pt-PT").format(value);
}


function Admin() {
  const {
    user,
    isAdmin,
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [usersCount, setUsersCount] = useState(null);
  const [messagesStats, setMessagesStats] = useState({
    total: 0,
    unread: 0,
    messages: [],
  });
  const [favoritesStats, setFavoritesStats] = useState({
    total: 0,
    byCategory: [],
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;

    loadDashboard();
  }, [isAuthenticated, isAdmin]);

  async function loadDashboard() {
    try {
      setIsLoading(true);
      setError("");

      const [users, favorites, messages] = await Promise.all([
        getUsersCount(),
        getFavoritesStats(),
        getMessagesStats(),
      ]);

      setUsersCount(users);
      setFavoritesStats(favorites);
      setMessagesStats(messages);


    } catch (err) {
      console.error(
        "Erro ao carregar o painel de administração:",
        err
      );
      setError(
        "Não foi possível carregar os dados do painel de administração."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMarkAsRead(messageId) {
    try {
      await markMessageAsRead(messageId);

      setMessagesStats((currentStats) => ({
        ...currentStats,
        unread: Math.max(currentStats.unread - 1, 0),
        messages: currentStats.messages.map((message) =>
          message.id === messageId
            ? { ...message, is_read: true }
            : message
        ),
      }));
    } catch (err) {
      console.error("Erro ao marcar mensagem como lida:", err);
      setError("Não foi possível atualizar a mensagem.");
    }
  }

  async function handleDeleteMessage(messageId) {
    const confirmed = window.confirm(
      "Tens a certeza de que queres eliminar esta mensagem?"
    );

    if (!confirmed) return;

    try {
      await deleteMessage(messageId);

      setMessagesStats((currentStats) => {
        const deletedMessage = currentStats.messages.find(
          (message) => message.id === messageId
        );

        return {
          total: Math.max(currentStats.total - 1, 0),
          unread:
            deletedMessage && !deletedMessage.is_read
              ? Math.max(currentStats.unread - 1, 0)
              : currentStats.unread,
          messages: currentStats.messages.filter(
            (message) => message.id !== messageId
          ),
        };
      });
    } catch (err) {
      console.error("Erro ao eliminar mensagem:", err);
      setError("Não foi possível eliminar a mensagem.");
    }
  }

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


          <h1>Painel de administração</h1>

          <p className="admin-page__subtitle">
            Bem-vinda, {user?.name}!
          </p>
          <p className="admin-page__subtitle">
            Aqui tens um resumo da
            atividade da plataforma.
          </p>
        </header>

        {isLoading && (
          <p className="admin-page__empty">A carregar dados...</p>
        )}

        {!isLoading && error && (
          <ErrorState message={error} onRetry={loadDashboard} />
        )}

        {!isLoading && !error && (
          <>
            <section
              className="admin-stats"
              aria-label="Estatísticas gerais"
            >
              <article className="admin-stats__card">
                <span>
                  <Icon name="Users" size={16} /> Utilizadores
                  registados
                </span>

                <strong>{formatCount(usersCount)}</strong>

                {usersCount === null && (
                  <small className="admin-stats__hint">
                    Endpoint de utilizadores ainda não disponível
                    no backend.
                  </small>
                )}
              </article>

              <article className="admin-stats__card">
                <span>
                  <Icon name="Mail" size={16} /> Mensagens de
                  contacto
                </span>

                <strong>
                  {formatCount(messagesStats.total)}
                </strong>
              </article>

              <article className="admin-stats__card">
                <span>
                  <Icon name="Heart" size={16} /> Favoritos
                  guardados
                </span>

                <strong>
                  {formatCount(favoritesStats.total)}
                </strong>
              </article>
            </section>

            <section
              className="admin-section"
              aria-label="Favoritos por categoria"
            >
              <h2 className="admin-page__section-title">
                Favoritos por categoria
              </h2>

              {favoritesStats.total === 0 ? (
                <p className="admin-page__empty">
                  Ainda não existem favoritos guardados.
                </p>
              ) : (
                <ul className="admin-favorite-breakdown">
                  {favoritesStats.byCategory.map((category) => {
                    const percentage = favoritesStats.total
                      ? Math.round(
                        (category.count /
                          favoritesStats.total) *
                        100
                      )
                      : 0;

                    return (
                      <li
                        key={category.value}
                        className="admin-favorite-breakdown__item"
                      >
                        <div className="admin-favorite-breakdown__head">
                          <span>{category.label}</span>
                          <strong>{category.count}</strong>
                        </div>

                        <div className="admin-favorite-breakdown__bar">
                          <div
                            className="admin-favorite-breakdown__bar-fill"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section
              className="admin-section"
              aria-label="Mensagens de contacto"
            >
              <div className="admin-section__header">
                <h2 className="admin-page__section-title">
                  Mensagens de contacto
                </h2>

                <span className="admin-messages__counter">
                  {formatCount(messagesStats.unread)} por ler
                </span>
              </div>

              {messagesStats.messages.length === 0 ? (
                <p className="admin-page__empty">
                  Ainda não foram enviadas mensagens de contacto.
                </p>
              ) : (
                <div className="admin-messages">
                  {messagesStats.messages.map((message) => (
                    <article
                      key={message.id}
                      className={`admin-message-card ${message.is_read
                          ? "admin-message-card--read"
                          : "admin-message-card--unread"
                        }`}
                    >
                      <div className="admin-message-card__head">
                        <div className="admin-message-card__author">
                          <div className="admin-message-card__name-row">
                            <strong>{message.name}</strong>

                            <span
                              className={`admin-message-card__status ${message.is_read
                                  ? "admin-message-card__status--read"
                                  : "admin-message-card__status--unread"
                                }`}
                            >
                              {message.is_read ? "Lida" : "Por ler"}
                            </span>
                          </div>

                          <a href={`mailto:${message.email}`}>
                            {message.email}
                          </a>
                        </div>

                        <time dateTime={message.created_at}>
                          {formatDate(message.created_at)}
                        </time>
                      </div>

                      <div className="admin-message-card__content">
                        <h3>{message.subject}</h3>

                        <p className="admin-message-card__body">
                          {message.message}
                        </p>
                      </div>

                      <div className="admin-message-card__actions">
                        {!message.is_read && (
                          <button
                            type="button"
                            className="admin-message-card__button"
                            onClick={() => handleMarkAsRead(message.id)}
                          >
                            <Icon name="Check" size={16} />
                            Marcar como lida
                          </button>
                        )}

                        <button
                          type="button"
                          className="admin-message-card__button admin-message-card__button--danger"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          <Icon name="Trash2" size={16} />
                          Eliminar
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </Container>
    </main>
  );
}

export default Admin;