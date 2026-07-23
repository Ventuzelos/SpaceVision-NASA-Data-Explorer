import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Navigate } from "react-router-dom";

import Container from "../../components/common/Container/Container";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import ErrorState from "../../components/common/ErrorState/ErrorState";
import Icon from "../../components/common/Icon/Icon";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import useAuth from "../../hooks/useAuth";

import {
  deleteMessage,
  getFavoritesStats,
  getMessagesStats,
  getUsersStats,
  markMessageAsRead,
} from "../../services/adminService";

import "./Admin.css";

const MESSAGES_PER_PAGE = 10;
const SEARCH_DELAY = 400;

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
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
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
  const [isMessagesLoading, setIsMessagesLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [messagesError, setMessagesError] = useState("");

  const [usersStats, setUsersStats] = useState({
    total: null,
    newLastMonth: 0,
  });

  const [messagesStats, setMessagesStats] = useState({
    total: 0,
    unread: 0,
    filteredTotal: 0,
    messages: [],
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: MESSAGES_PER_PAGE,
      from: null,
      to: null,
      total: 0,
    },
    filters: {
      search: "",
      status: "all",
    },
  });

  const [favoritesStats, setFavoritesStats] = useState({
    total: 0,
    byCategory: [],
    topSaved: [],
  });

  const [messageSearch, setMessageSearch] = useState("");
  const [messageStatusFilter, setMessageStatusFilter] =
    useState("all");
  const [messageSort, setMessageSort] = useState("newest");
  const [messagePage, setMessagePage] = useState(1);

  const sortedMessages = useMemo(() => {
    return [...messagesStats.messages].sort(
      (first, second) => {
        const firstDate = new Date(
          first.created_at
        ).getTime();

        const secondDate = new Date(
          second.created_at
        ).getTime();

        return messageSort === "oldest"
          ? firstDate - secondDate
          : secondDate - firstDate;
      }
    );
  }, [messagesStats.messages, messageSort]);

  const loadDashboardStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const [users, favorites] = await Promise.all([
        getUsersStats(),
        getFavoritesStats(),
      ]);

      setUsersStats(users);
      setFavoritesStats(favorites);
    } catch (requestError) {
      console.error(
        "Erro ao carregar o painel de administração:",
        requestError
      );

      setError(
        "Não foi possível carregar os dados do painel de administração."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async () => {
    try {
      setIsMessagesLoading(true);
      setMessagesError("");

      const messages = await getMessagesStats({
        page: messagePage,
        search: messageSearch,
        status: messageStatusFilter,
        perPage: MESSAGES_PER_PAGE,
      });

      setMessagesStats(messages);
    } catch (requestError) {
      console.error(
        "Erro ao carregar as mensagens:",
        requestError
      );

      setMessagesError(
        "Não foi possível carregar as mensagens de contacto."
      );
    } finally {
      setIsMessagesLoading(false);
    }
  }, [
    messagePage,
    messageSearch,
    messageStatusFilter,
  ]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      loadDashboardStats();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    isAuthenticated,
    isAdmin,
    loadDashboardStats,
  ]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      loadMessages();
    }, SEARCH_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    isAuthenticated,
    isAdmin,
    loadMessages,
  ]);

  function handleSearchChange(event) {
    setMessageSearch(event.target.value);
    setMessagePage(1);
  }

  function handleStatusChange(status) {
    setMessageStatusFilter(status);
    setMessagePage(1);
  }

  function handlePreviousPage() {
    setMessagePage((currentPage) =>
      Math.max(currentPage - 1, 1)
    );
  }

  function handleNextPage() {
    setMessagePage((currentPage) =>
      Math.min(
        currentPage + 1,
        messagesStats.pagination.lastPage
      )
    );
  }

  function handlePageChange(page) {
    setMessagePage(page);
  }

  async function handleMarkAsRead(messageId) {
    try {
      await markMessageAsRead(messageId);

      setMessagesStats((currentStats) => ({
        ...currentStats,
        unread: Math.max(
          currentStats.unread - 1,
          0
        ),
        messages: currentStats.messages.map(
          (message) =>
            message.id === messageId
              ? {
                ...message,
                is_read: true,
              }
              : message
        ),
      }));
    } catch (requestError) {
      console.error(
        "Erro ao marcar mensagem como lida:",
        requestError
      );

      setMessagesError(
        "Não foi possível atualizar a mensagem."
      );
    }
  }

  async function handleDeleteMessage(messageId) {
    const confirmed = window.confirm(
      "Tens a certeza de que queres eliminar esta mensagem?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMessage(messageId);

      const isOnlyMessageOnPage =
        messagesStats.messages.length === 1;

      if (isOnlyMessageOnPage && messagePage > 1) {
        setMessagePage((currentPage) =>
          Math.max(currentPage - 1, 1)
        );

        return;
      }

      await loadMessages();
    } catch (requestError) {
      console.error(
        "Erro ao eliminar mensagem:",
        requestError
      );

      setMessagesError(
        "Não foi possível eliminar a mensagem."
      );
    }
  }

  if (isAuthLoading) {
    return (
      <main className="admin-page">
        <Container>
          <p
            className="admin-page__empty"
            role="status"
          >
            A carregar painel...
          </p>
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

  const totalReadMessages = Math.max(
    messagesStats.total - messagesStats.unread,
    0
  );

  const visiblePages = Array.from(
    {
      length: messagesStats.pagination.lastPage,
    },
    (_, index) => index + 1
  ).filter((page) => {
    const currentPage =
      messagesStats.pagination.currentPage;

    return (
      page === 1 ||
      page === messagesStats.pagination.lastPage ||
      Math.abs(page - currentPage) <= 1
    );
  });

  return (
    <>
      <PageMeta
        title="Administração — SpaceVision"
        description="Gere utilizadores, favoritos e mensagens recebidas através do painel de administração do SpaceVision."
      />

      <main className="admin-page">
        <Container>
          <Breadcrumb title="Administração" />

          <header className="admin-page__header">
            <h1>Painel de administração</h1>

            <p className="admin-page__subtitle">
              Bem-vinda, {user?.name}!
            </p>

            <p className="admin-page__subtitle">
              Aqui tens um resumo da atividade da
              plataforma.
            </p>
          </header>

          {isLoading && (
            <p
              className="admin-page__empty"
              role="status"
              aria-live="polite"
            >
              A carregar dados...
            </p>
          )}

          {!isLoading && error && (
            <ErrorState
              message={error}
              onRetry={loadDashboardStats}
            />
          )}

          {!isLoading && !error && (
            <>
              <section
                className="admin-stats"
                aria-labelledby="admin-stats-title"
              >
                <h2
                  id="admin-stats-title"
                  className="sr-only"
                >
                  Estatísticas gerais
                </h2>

                <article className="admin-stats__card">
                  <span className="admin-stats__label">
                    <Icon
                      name="Users"
                      size={16}
                      aria-hidden="true"
                    />
                    Utilizadores registados
                  </span>

                  <strong>
                    {formatCount(usersStats.total)}
                  </strong>

                  {usersStats.total === null ? (
                    <small className="admin-stats__hint">
                      Endpoint de utilizadores ainda não
                      disponível no backend.
                    </small>
                  ) : (
                    <small className="admin-stats__hint">
                      {formatCount(
                        usersStats.newLastMonth
                      )}{" "}
                      novos no último mês
                    </small>
                  )}
                </article>

                <article className="admin-stats__card">
                  <span className="admin-stats__label">
                    <Icon
                      name="Mail"
                      size={16}
                      aria-hidden="true"
                    />
                    Mensagens de contacto
                  </span>

                  <strong>
                    {formatCount(
                      messagesStats.total
                    )}
                  </strong>
                </article>

                <article className="admin-stats__card">
                  <span className="admin-stats__label">
                    <Icon
                      name="Heart"
                      size={16}
                      aria-hidden="true"
                    />
                    Favoritos guardados
                  </span>

                  <strong>
                    {formatCount(
                      favoritesStats.total
                    )}
                  </strong>
                </article>
              </section>

              <section
                className="admin-section"
                aria-labelledby="favorites-category-title"
              >
                <h2
                  id="favorites-category-title"
                  className="admin-page__section-title"
                >
                  Favoritos por categoria
                </h2>

                {favoritesStats.total === 0 ? (
                  <p className="admin-page__empty">
                    Ainda não existem favoritos
                    guardados.
                  </p>
                ) : (
                  <ul className="admin-favorite-breakdown">
                    {favoritesStats.byCategory.map(
                      (category) => {
                        const percentage =
                          favoritesStats.total
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
                              <span>
                                {category.label}
                              </span>

                              <strong>
                                {category.count}
                              </strong>
                            </div>

                            <div
                              className="admin-favorite-breakdown__bar"
                              role="progressbar"
                              aria-label={`${category.label}: ${category.count} favoritos`}
                              aria-valuemin="0"
                              aria-valuemax={
                                favoritesStats.total
                              }
                              aria-valuenow={
                                category.count
                              }
                            >
                              <div
                                className="admin-favorite-breakdown__bar-fill"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </li>
                        );
                      }
                    )}
                  </ul>
                )}
              </section>

              <section
                className="admin-section"
                aria-labelledby="top-saved-title"
              >
                <h2
                  id="top-saved-title"
                  className="admin-page__section-title"
                >
                  Conteúdos mais guardados
                </h2>

                {favoritesStats.topSaved.length === 0 ? (
                  <p className="admin-page__empty">
                    Ainda não há dados suficientes para
                    destacar conteúdos.
                  </p>
                ) : (
                  <ul className="admin-favorite-breakdown">
                    {favoritesStats.topSaved.map(
                      (item) => (
                        <li
                          key={`${item.nasaType}-${item.nasaId}`}
                          className="admin-favorite-breakdown__item"
                        >
                          <div className="admin-favorite-breakdown__head">
                            <span>
                              {item.title}{" "}
                              <small>
                                (
                                {item.nasaType?.toUpperCase()}
                                )
                              </small>
                            </span>

                            <strong>
                              {item.saves}
                            </strong>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </section>

              <section
                className="admin-section"
                aria-labelledby="contact-messages-title"
              >
                <div className="admin-section__header">
                  <h2
                    id="contact-messages-title"
                    className="admin-page__section-title"
                  >
                    Mensagens de contacto
                  </h2>

                  <span className="admin-messages__counter">
                    {formatCount(
                      messagesStats.unread
                    )}{" "}
                    por ler
                  </span>
                </div>

                <div
                  className="admin-message-filters"
                  aria-label="Filtros das mensagens"
                >
                  <div className="admin-message-filters__search">
                    <Icon
                      name="Search"
                      size={17}
                      aria-hidden="true"
                    />

                    <input
                      type="search"
                      value={messageSearch}
                      onChange={handleSearchChange}
                      placeholder="Pesquisar por nome, email, assunto ou mensagem..."
                      aria-label="Pesquisar mensagens"
                    />
                  </div>

                  <div
                    className="admin-message-filters__tabs"
                    role="group"
                    aria-label="Filtrar mensagens por estado"
                  >
                    <button
                      type="button"
                      className={
                        messageStatusFilter === "all"
                          ? "admin-message-filter-tab admin-message-filter-tab--active"
                          : "admin-message-filter-tab"
                      }
                      onClick={() =>
                        handleStatusChange("all")
                      }
                      aria-pressed={
                        messageStatusFilter === "all"
                      }
                    >
                      Todas
                      <span aria-hidden="true">
                        {messagesStats.total}
                      </span>
                    </button>

                    <button
                      type="button"
                      className={
                        messageStatusFilter ===
                          "unread"
                          ? "admin-message-filter-tab admin-message-filter-tab--active"
                          : "admin-message-filter-tab"
                      }
                      onClick={() =>
                        handleStatusChange("unread")
                      }
                      aria-pressed={
                        messageStatusFilter ===
                        "unread"
                      }
                    >
                      Por ler
                      <span aria-hidden="true">
                        {messagesStats.unread}
                      </span>
                    </button>

                    <button
                      type="button"
                      className={
                        messageStatusFilter === "read"
                          ? "admin-message-filter-tab admin-message-filter-tab--active"
                          : "admin-message-filter-tab"
                      }
                      onClick={() =>
                        handleStatusChange("read")
                      }
                      aria-pressed={
                        messageStatusFilter === "read"
                      }
                    >
                      Lidas
                      <span aria-hidden="true">
                        {totalReadMessages}
                      </span>
                    </button>
                  </div>

                  <label className="admin-message-filters__sort">
                    <span>Ordenar</span>

                    <select
                      value={messageSort}
                      onChange={(event) =>
                        setMessageSort(
                          event.target.value
                        )
                      }
                    >
                      <option value="newest">
                        Mais recentes
                      </option>

                      <option value="oldest">
                        Mais antigas
                      </option>
                    </select>
                  </label>
                </div>

                {isMessagesLoading && (
                  <p
                    className="admin-page__empty"
                    role="status"
                    aria-live="polite"
                  >
                    A carregar mensagens...
                  </p>
                )}

                {!isMessagesLoading &&
                  messagesError && (
                    <ErrorState
                      message={messagesError}
                      onRetry={loadMessages}
                    />
                  )}

                {!isMessagesLoading &&
                  !messagesError &&
                  sortedMessages.length === 0 && (
                    <p className="admin-page__empty">
                      {messagesStats.total === 0
                        ? "Ainda não foram enviadas mensagens de contacto."
                        : "Não foram encontradas mensagens com estes filtros."}
                    </p>
                  )}

                {!isMessagesLoading &&
                  !messagesError &&
                  sortedMessages.length > 0 && (
                    <>
                      <p className="admin-messages__results">
                        A mostrar{" "}
                        {messagesStats.pagination.from}–
                        {messagesStats.pagination.to} de{" "}
                        {formatCount(
                          messagesStats.filteredTotal
                        )}{" "}
                        mensagens
                      </p>

                      <div
                        className="admin-messages"
                        aria-live="polite"
                      >
                        {sortedMessages.map(
                          (message) => (
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
                                    <strong>
                                      {message.name}
                                    </strong>

                                    <span
                                      className={`admin-message-card__status ${message.is_read
                                        ? "admin-message-card__status--read"
                                        : "admin-message-card__status--unread"
                                        }`}
                                    >
                                      {message.is_read
                                        ? "Lida"
                                        : "Por ler"}
                                    </span>
                                  </div>

                                  <a
                                    href={`mailto:${message.email}`}
                                  >
                                    {message.email}
                                  </a>
                                </div>

                                <time
                                  dateTime={
                                    message.created_at
                                  }
                                >
                                  {formatDate(
                                    message.created_at
                                  )}
                                </time>
                              </div>

                              <div className="admin-message-card__content">
                                <h3>
                                  {message.subject}
                                </h3>

                                <p className="admin-message-card__body">
                                  {message.message}
                                </p>
                              </div>

                              <div className="admin-message-card__actions">
                                {!message.is_read && (
                                  <button
                                    type="button"
                                    className="admin-message-card__button"
                                    onClick={() =>
                                      handleMarkAsRead(
                                        message.id
                                      )
                                    }
                                  >
                                    <Icon
                                      name="Check"
                                      size={16}
                                      aria-hidden="true"
                                    />
                                    Marcar como lida
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className="admin-message-card__button admin-message-card__button--danger"
                                  onClick={() =>
                                    handleDeleteMessage(
                                      message.id
                                    )
                                  }
                                >
                                  <Icon
                                    name="Trash2"
                                    size={16}
                                    aria-hidden="true"
                                  />
                                  Eliminar
                                </button>
                              </div>
                            </article>
                          )
                        )}
                      </div>

                      {messagesStats.pagination.lastPage >
                        1 && (
                          <nav
                            className="admin-pagination"
                            aria-label="Paginação das mensagens"
                          >
                            <button
                              type="button"
                              className="admin-pagination__button"
                              onClick={handlePreviousPage}
                              disabled={
                                messagesStats.pagination
                                  .currentPage === 1
                              }
                            >
                              <Icon
                                name="ChevronLeft"
                                size={17}
                                aria-hidden="true"
                              />
                              Anterior
                            </button>

                            <div className="admin-pagination__pages">
                              {visiblePages.map(
                                (page, index) => {
                                  const previousPage =
                                    visiblePages[
                                    index - 1
                                    ];

                                  const showEllipsis =
                                    previousPage &&
                                    page -
                                    previousPage >
                                    1;

                                  return (
                                    <span
                                      key={page}
                                      className="admin-pagination__page-wrapper"
                                    >
                                      {showEllipsis && (
                                        <span
                                          className="admin-pagination__ellipsis"
                                          aria-hidden="true"
                                        >
                                          …
                                        </span>
                                      )}

                                      <button
                                        type="button"
                                        className={
                                          page ===
                                            messagesStats
                                              .pagination
                                              .currentPage
                                            ? "admin-pagination__page admin-pagination__page--active"
                                            : "admin-pagination__page"
                                        }
                                        onClick={() =>
                                          handlePageChange(
                                            page
                                          )
                                        }
                                        aria-current={
                                          page ===
                                            messagesStats
                                              .pagination
                                              .currentPage
                                            ? "page"
                                            : undefined
                                        }
                                        aria-label={`Página ${page}`}
                                      >
                                        {page}
                                      </button>
                                    </span>
                                  );
                                }
                              )}
                            </div>

                            <button
                              type="button"
                              className="admin-pagination__button"
                              onClick={handleNextPage}
                              disabled={
                                messagesStats.pagination
                                  .currentPage ===
                                messagesStats.pagination
                                  .lastPage
                              }
                            >
                              Seguinte
                              <Icon
                                name="ChevronRight"
                                size={17}
                                aria-hidden="true"
                              />
                            </button>
                          </nav>
                        )}
                    </>
                  )}
              </section>
            </>
          )}
        </Container>
      </main>
    </>
  );
}

export default Admin;