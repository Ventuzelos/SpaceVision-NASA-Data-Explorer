import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useTranslation,
} from "react-i18next";
import {
  Navigate,
} from "react-router";

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

function formatDate(
  value,
  locale
) {
  const parsedDate =
    new Date(value);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "";
  }

  return parsedDate.toLocaleDateString(
    locale,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function formatCount(
  value,
  locale
) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(
      Number(value)
    )
  ) {
    return "0";
  }

  return new Intl.NumberFormat(
    locale
  ).format(value);
}

function Admin() {
  const { t, i18n } =
    useTranslation();

  const {
    user,
    isAdmin,
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  const locale =
    i18n.resolvedLanguage?.startsWith(
      "en"
    )
      ? "en-GB"
      : "pt-PT";

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isMessagesLoading,
    setIsMessagesLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    messagesError,
    setMessagesError,
  ] = useState("");

  const [
    usersStats,
    setUsersStats,
  ] = useState({
    total: null,
    newLastMonth: 0,
  });

  const [
    messagesStats,
    setMessagesStats,
  ] = useState({
    total: 0,
    unread: 0,
    filteredTotal: 0,
    messages: [],
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage:
        MESSAGES_PER_PAGE,
      from: null,
      to: null,
      total: 0,
    },
    filters: {
      search: "",
      status: "all",
    },
  });

  const [
    favoritesStats,
    setFavoritesStats,
  ] = useState({
    total: 0,
    byCategory: [],
    topSaved: [],
  });

  const [
    messageSearch,
    setMessageSearch,
  ] = useState("");

  const [
    messageStatusFilter,
    setMessageStatusFilter,
  ] = useState("all");

  const [
    messageSort,
    setMessageSort,
  ] = useState("newest");

  const [
    messagePage,
    setMessagePage,
  ] = useState(1);

  const sortedMessages =
    useMemo(() => {
      return [
        ...messagesStats.messages,
      ].sort(
        (
          first,
          second
        ) => {
          const firstDate =
            new Date(
              first.created_at
            ).getTime();

          const secondDate =
            new Date(
              second.created_at
            ).getTime();

          return messageSort ===
            "oldest"
            ? firstDate -
                secondDate
            : secondDate -
                firstDate;
        }
      );
    }, [
      messagesStats.messages,
      messageSort,
    ]);

  const loadDashboardStats =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setError("");

        const [
          users,
          favorites,
        ] =
          await Promise.all([
            getUsersStats(),
            getFavoritesStats(),
          ]);

        setUsersStats(users);

        setFavoritesStats(
          favorites
        );
      } catch (requestError) {
        console.error(
          "Erro ao carregar o painel de administração:",
          requestError
        );

        setError(
          t(
            "admin.errors.dashboard"
          )
        );
      } finally {
        setIsLoading(false);
      }
    }, [t]);

  const loadMessages =
    useCallback(async () => {
      try {
        setIsMessagesLoading(
          true
        );

        setMessagesError("");

        const messages =
          await getMessagesStats({
            page:
              messagePage,
            search:
              messageSearch,
            status:
              messageStatusFilter,
            perPage:
              MESSAGES_PER_PAGE,
          });

        setMessagesStats(
          messages
        );
      } catch (requestError) {
        console.error(
          "Erro ao carregar as mensagens:",
          requestError
        );

        setMessagesError(
          t(
            "admin.errors.messages"
          )
        );
      } finally {
        setIsMessagesLoading(
          false
        );
      }
    }, [
      messagePage,
      messageSearch,
      messageStatusFilter,
      t,
    ]);

  useEffect(() => {
    if (
      !isAuthenticated ||
      !isAdmin
    ) {
      return undefined;
    }

    const timeoutId =
      window.setTimeout(
        () => {
          loadDashboardStats();
        },
        0
      );

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [
    isAuthenticated,
    isAdmin,
    loadDashboardStats,
  ]);

  useEffect(() => {
    if (
      !isAuthenticated ||
      !isAdmin
    ) {
      return undefined;
    }

    const timeoutId =
      window.setTimeout(
        () => {
          loadMessages();
        },
        SEARCH_DELAY
      );

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [
    isAuthenticated,
    isAdmin,
    loadMessages,
  ]);

  function handleSearchChange(
    event
  ) {
    setMessageSearch(
      event.target.value
    );

    setMessagePage(1);
  }

  function handleStatusChange(
    status
  ) {
    setMessageStatusFilter(
      status
    );

    setMessagePage(1);
  }

  function handlePreviousPage() {
    setMessagePage(
      (currentPage) =>
        Math.max(
          currentPage - 1,
          1
        )
    );
  }

  function handleNextPage() {
    setMessagePage(
      (currentPage) =>
        Math.min(
          currentPage + 1,
          messagesStats.pagination
            .lastPage
        )
    );
  }

  function handlePageChange(
    page
  ) {
    setMessagePage(page);
  }

  async function handleMarkAsRead(
    messageId
  ) {
    try {
      await markMessageAsRead(
        messageId
      );

      setMessagesStats(
        (currentStats) => ({
          ...currentStats,

          unread:
            Math.max(
              currentStats.unread -
                1,
              0
            ),

          messages:
            currentStats.messages.map(
              (message) =>
                message.id ===
                messageId
                  ? {
                      ...message,
                      is_read:
                        true,
                    }
                  : message
            ),
        })
      );
    } catch (requestError) {
      console.error(
        "Erro ao marcar mensagem como lida:",
        requestError
      );

      setMessagesError(
        t(
          "admin.errors.messageUpdate"
        )
      );
    }
  }

  async function handleDeleteMessage(
    messageId
  ) {
    const confirmed =
      window.confirm(
        t(
          "admin.messages.deleteConfirm"
        )
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMessage(
        messageId
      );

      const isOnlyMessageOnPage =
        messagesStats.messages
          .length === 1;

      if (
        isOnlyMessageOnPage &&
        messagePage > 1
      ) {
        setMessagePage(
          (currentPage) =>
            Math.max(
              currentPage - 1,
              1
            )
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
        t(
          "admin.errors.messageDelete"
        )
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
            {t(
              "admin.loading.panel"
            )}
          </p>
        </Container>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  const totalReadMessages =
    Math.max(
      messagesStats.total -
        messagesStats.unread,
      0
    );

  const visiblePages =
    Array.from(
      {
        length:
          messagesStats
            .pagination
            .lastPage,
      },
      (_, index) =>
        index + 1
    ).filter((page) => {
      const currentPage =
        messagesStats.pagination
          .currentPage;

      return (
        page === 1 ||
        page ===
          messagesStats
            .pagination
            .lastPage ||
        Math.abs(
          page -
            currentPage
        ) <= 1
      );
    });

  return (
    <>
      <PageMeta
        title={t(
          "admin.meta.title"
        )}
        description={t(
          "admin.meta.description"
        )}
      />

      <main className="admin-page">
        <Container>
          <Breadcrumb
            title={t(
              "admin.breadcrumb"
            )}
          />

          <header className="admin-page__header">
            <h1>
              {t(
                "admin.header.title"
              )}
            </h1>

            <p className="admin-page__subtitle">
              {t(
                "admin.header.welcome",
                {
                  name:
                    user?.name,
                }
              )}
            </p>

            <p className="admin-page__subtitle">
              {t(
                "admin.header.description"
              )}
            </p>
          </header>

          {isLoading && (
            <p
              className="admin-page__empty"
              role="status"
              aria-live="polite"
            >
              {t(
                "admin.loading.data"
              )}
            </p>
          )}

          {!isLoading &&
            error && (
              <ErrorState
                message={error}
                onRetry={
                  loadDashboardStats
                }
              />
            )}

          {!isLoading &&
            !error && (
              <>
                <section
                  className="admin-stats"
                  aria-labelledby="admin-stats-title"
                >
                  <h2
                    id="admin-stats-title"
                    className="sr-only"
                  >
                    {t(
                      "admin.stats.title"
                    )}
                  </h2>

                  <article className="admin-stats__card">
                    <span className="admin-stats__label">
                      <Icon
                        name="Users"
                        size={16}
                        aria-hidden="true"
                      />

                      {t(
                        "admin.stats.registeredUsers"
                      )}
                    </span>

                    <strong>
                      {formatCount(
                        usersStats.total,
                        locale
                      )}
                    </strong>

                    {usersStats.total ===
                    null ? (
                      <small className="admin-stats__hint">
                        {t(
                          "admin.stats.usersEndpointUnavailable"
                        )}
                      </small>
                    ) : (
                      <small className="admin-stats__hint">
                        {t(
                          "admin.stats.newLastMonth",
                          {
                            count:
                              formatCount(
                                usersStats.newLastMonth,
                                locale
                              ),
                          }
                        )}
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

                      {t(
                        "admin.stats.contactMessages"
                      )}
                    </span>

                    <strong>
                      {formatCount(
                        messagesStats.total,
                        locale
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

                      {t(
                        "admin.stats.savedFavorites"
                      )}
                    </span>

                    <strong>
                      {formatCount(
                        favoritesStats.total,
                        locale
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
                    {t(
                      "admin.favorites.byCategoryTitle"
                    )}
                  </h2>

                  {favoritesStats.total ===
                  0 ? (
                    <p className="admin-page__empty">
                      {t(
                        "admin.favorites.none"
                      )}
                    </p>
                  ) : (
                    <ul className="admin-favorite-breakdown">
                      {favoritesStats.byCategory.map(
                        (
                          category
                        ) => {
                          const percentage =
                            favoritesStats.total
                              ? Math.round(
                                  (category.count /
                                    favoritesStats.total) *
                                    100
                                )
                              : 0;

                          const categoryLabel =
                            t(
                              `admin.favorites.categories.${String(
                                category.value
                              ).toLowerCase()}`,
                              {
                                defaultValue:
                                  category.label,
                              }
                            );

                          return (
                            <li
                              key={
                                category.value
                              }
                              className="admin-favorite-breakdown__item"
                            >
                              <div className="admin-favorite-breakdown__head">
                                <span>
                                  {
                                    categoryLabel
                                  }
                                </span>

                                <strong>
                                  {formatCount(
                                    category.count,
                                    locale
                                  )}
                                </strong>
                              </div>

                              <div
                                className="admin-favorite-breakdown__bar"
                                role="progressbar"
                                aria-label={t(
                                  "admin.favorites.progressAria",
                                  {
                                    category:
                                      categoryLabel,
                                    count:
                                      category.count,
                                  }
                                )}
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
                    {t(
                      "admin.favorites.topSavedTitle"
                    )}
                  </h2>

                  {favoritesStats
                    .topSaved
                    .length === 0 ? (
                    <p className="admin-page__empty">
                      {t(
                        "admin.favorites.insufficientData"
                      )}
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
                                {formatCount(
                                  item.saves,
                                  locale
                                )}
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
                      {t(
                        "admin.messages.title"
                      )}
                    </h2>

                    <span className="admin-messages__counter">
                      {t(
                        "admin.messages.unreadCount",
                        {
                          count:
                            formatCount(
                              messagesStats.unread,
                              locale
                            ),
                        }
                      )}
                    </span>
                  </div>

                  <div
                    className="admin-message-filters"
                    aria-label={t(
                      "admin.messages.filtersAria"
                    )}
                  >
                    <div className="admin-message-filters__search">
                      <Icon
                        name="Search"
                        size={17}
                        aria-hidden="true"
                      />

                      <input
                        type="search"
                        value={
                          messageSearch
                        }
                        onChange={
                          handleSearchChange
                        }
                        placeholder={t(
                          "admin.messages.searchPlaceholder"
                        )}
                        aria-label={t(
                          "admin.messages.searchAria"
                        )}
                      />
                    </div>

                    <div
                      className="admin-message-filters__tabs"
                      role="group"
                      aria-label={t(
                        "admin.messages.statusFilterAria"
                      )}
                    >
                      <button
                        type="button"
                        className={
                          messageStatusFilter ===
                          "all"
                            ? "admin-message-filter-tab admin-message-filter-tab--active"
                            : "admin-message-filter-tab"
                        }
                        onClick={() =>
                          handleStatusChange(
                            "all"
                          )
                        }
                        aria-pressed={
                          messageStatusFilter ===
                          "all"
                        }
                      >
                        {t(
                          "admin.messages.filters.all"
                        )}

                        <span aria-hidden="true">
                          {
                            messagesStats.total
                          }
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
                          handleStatusChange(
                            "unread"
                          )
                        }
                        aria-pressed={
                          messageStatusFilter ===
                          "unread"
                        }
                      >
                        {t(
                          "admin.messages.filters.unread"
                        )}

                        <span aria-hidden="true">
                          {
                            messagesStats.unread
                          }
                        </span>
                      </button>

                      <button
                        type="button"
                        className={
                          messageStatusFilter ===
                          "read"
                            ? "admin-message-filter-tab admin-message-filter-tab--active"
                            : "admin-message-filter-tab"
                        }
                        onClick={() =>
                          handleStatusChange(
                            "read"
                          )
                        }
                        aria-pressed={
                          messageStatusFilter ===
                          "read"
                        }
                      >
                        {t(
                          "admin.messages.filters.read"
                        )}

                        <span aria-hidden="true">
                          {
                            totalReadMessages
                          }
                        </span>
                      </button>
                    </div>

                    <label className="admin-message-filters__sort">
                      <span>
                        {t(
                          "admin.messages.sort.label"
                        )}
                      </span>

                      <select
                        value={
                          messageSort
                        }
                        onChange={(
                          event
                        ) =>
                          setMessageSort(
                            event
                              .target
                              .value
                          )
                        }
                      >
                        <option value="newest">
                          {t(
                            "admin.messages.sort.newest"
                          )}
                        </option>

                        <option value="oldest">
                          {t(
                            "admin.messages.sort.oldest"
                          )}
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
                      {t(
                        "admin.loading.messages"
                      )}
                    </p>
                  )}

                  {!isMessagesLoading &&
                    messagesError && (
                      <ErrorState
                        message={
                          messagesError
                        }
                        onRetry={
                          loadMessages
                        }
                      />
                    )}

                  {!isMessagesLoading &&
                    !messagesError &&
                    sortedMessages.length ===
                      0 && (
                      <p className="admin-page__empty">
                        {messagesStats.total ===
                        0
                          ? t(
                              "admin.messages.none"
                            )
                          : t(
                              "admin.messages.noResults"
                            )}
                      </p>
                    )}

                  {!isMessagesLoading &&
                    !messagesError &&
                    sortedMessages.length >
                      0 && (
                      <>
                        <p className="admin-messages__results">
                          {t(
                            "admin.messages.results",
                            {
                              from:
                                messagesStats.pagination.from,
                              to:
                                messagesStats.pagination.to,
                              total:
                                formatCount(
                                  messagesStats.filteredTotal,
                                  locale
                                ),
                            }
                          )}
                        </p>

                        <div
                          className="admin-messages"
                          aria-live="polite"
                        >
                          {sortedMessages.map(
                            (
                              message
                            ) => (
                              <article
                                key={
                                  message.id
                                }
                                className={`admin-message-card ${
                                  message.is_read
                                    ? "admin-message-card--read"
                                    : "admin-message-card--unread"
                                }`}
                              >
                                <div className="admin-message-card__head">
                                  <div className="admin-message-card__author">
                                    <div className="admin-message-card__name-row">
                                      <strong>
                                        {
                                          message.name
                                        }
                                      </strong>

                                      <span
                                        className={`admin-message-card__status ${
                                          message.is_read
                                            ? "admin-message-card__status--read"
                                            : "admin-message-card__status--unread"
                                        }`}
                                      >
                                        {message.is_read
                                          ? t(
                                              "admin.messages.status.read"
                                            )
                                          : t(
                                              "admin.messages.status.unread"
                                            )}
                                      </span>
                                    </div>

                                    <a
                                      href={`mailto:${message.email}`}
                                    >
                                      {
                                        message.email
                                      }
                                    </a>
                                  </div>

                                  <time
                                    dateTime={
                                      message.created_at
                                    }
                                  >
                                    {formatDate(
                                      message.created_at,
                                      locale
                                    )}
                                  </time>
                                </div>

                                <div className="admin-message-card__content">
                                  <h3>
                                    {
                                      message.subject
                                    }
                                  </h3>

                                  <p className="admin-message-card__body">
                                    {
                                      message.message
                                    }
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

                                      {t(
                                        "admin.messages.actions.markRead"
                                      )}
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

                                    {t(
                                      "admin.messages.actions.delete"
                                    )}
                                  </button>
                                </div>
                              </article>
                            )
                          )}
                        </div>

                        {messagesStats
                          .pagination
                          .lastPage >
                          1 && (
                          <nav
                            className="admin-pagination"
                            aria-label={t(
                              "admin.pagination.aria"
                            )}
                          >
                            <button
                              type="button"
                              className="admin-pagination__button"
                              onClick={
                                handlePreviousPage
                              }
                              disabled={
                                messagesStats
                                  .pagination
                                  .currentPage ===
                                1
                              }
                            >
                              <Icon
                                name="ChevronLeft"
                                size={17}
                                aria-hidden="true"
                              />

                              {t(
                                "admin.pagination.previous"
                              )}
                            </button>

                            <div className="admin-pagination__pages">
                              {visiblePages.map(
                                (
                                  page,
                                  index
                                ) => {
                                  const previousPage =
                                    visiblePages[
                                      index -
                                        1
                                    ];

                                  const showEllipsis =
                                    previousPage &&
                                    page -
                                      previousPage >
                                      1;

                                  return (
                                    <span
                                      key={
                                        page
                                      }
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
                                        aria-label={t(
                                          "admin.pagination.pageAria",
                                          {
                                            page,
                                          }
                                        )}
                                      >
                                        {
                                          page
                                        }
                                      </button>
                                    </span>
                                  );
                                }
                              )}
                            </div>

                            <button
                              type="button"
                              className="admin-pagination__button"
                              onClick={
                                handleNextPage
                              }
                              disabled={
                                messagesStats
                                  .pagination
                                  .currentPage ===
                                messagesStats
                                  .pagination
                                  .lastPage
                              }
                            >
                              {t(
                                "admin.pagination.next"
                              )}

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