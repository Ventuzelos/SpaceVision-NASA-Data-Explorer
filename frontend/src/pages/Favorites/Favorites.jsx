import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import Container from "../../components/common/Container/Container";
import FavoriteCard from "../../components/favorites/FavoriteCard";
import FavoriteDetailsModal from "../../components/favorites/FavoriteDetailsModal";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import Pagination from "../../components/common/Pagination/Pagination";
import Button from "../../components/common/Button/Button";
import Toast from "../../components/common/Toast/Toast";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../../services/favoritesService";

import { usePagination } from "../../hooks/usePagination";
import useAuth from "../../hooks/useAuth";

import "./Favorites.css";

const FAVORITES_PER_PAGE = 8;
const UNDO_TIMEOUT_MS = 5000;
const TOAST_TIMEOUT_MS = 2500;

const FAVORITE_FILTERS = [
  {
    value: "all",
    labelKey: "all",
  },
  {
    value: "apod",
    labelKey: "apod",
  },
  {
    value: "donki",
    labelKey: "donki",
  },
  {
    value: "epic",
    labelKey: "epic",
  },
  {
    value: "neows",
    labelKey: "neows",
  },
];

function Favorites() {
  const { t } =
    useTranslation();

  const { user } =
    useAuth();

  const toastTimeoutRef =
    useRef(null);

  const [
    toastMessage,
    setToastMessage,
  ] = useState("");

  const [
    selectedFavorite,
    setSelectedFavorite,
  ] = useState(null);

  const [
    favorites,
    setFavorites,
  ] = useState([]);

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("all");

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    undoState,
    setUndoState,
  ] = useState(null);

  useEffect(() => {
    const timeoutId =
      window.setTimeout(
        async () => {
          try {
            setIsLoading(true);
            setError("");

            const data =
              await getFavorites();

            setFavorites(
              Array.isArray(data)
                ? data
                : []
            );
          } catch (requestError) {
            console.error(
              "Erro ao carregar favoritos:",
              requestError
            );

            if (
              requestError.response
                ?.status === 401
            ) {
              setError(
                t(
                  "favorites.errors.authentication"
                )
              );
            } else {
              setError(
                t(
                  "favorites.errors.load"
                )
              );
            }
          } finally {
            setIsLoading(false);
          }
        },
        0
      );

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [t]);

  useEffect(() => {
    return () => {
      if (
        undoState?.timerId
      ) {
        window.clearTimeout(
          undoState.timerId
        );
      }
    };
  }, [undoState]);

  useEffect(() => {
    return () => {
      if (
        toastTimeoutRef.current
      ) {
        window.clearTimeout(
          toastTimeoutRef.current
        );
      }
    };
  }, []);

  const filteredFavorites =
    useMemo(() => {
      if (
        activeFilter ===
        "all"
      ) {
        return favorites;
      }

      return favorites.filter(
        (favorite) => {
          const favoriteType =
            favorite.nasa_type ||
            favorite.type ||
            favorite.data
              ?.nasa_type ||
            favorite.data?.type ||
            "";

          return (
            String(
              favoriteType
            ).toLowerCase() ===
            activeFilter
          );
        }
      );
    }, [
      favorites,
      activeFilter,
    ]);

  const {
    paginatedItems:
      paginatedFavorites,
    currentPage,
    totalPages,
    setPage,
    shouldShowPagination,
  } = usePagination(
    filteredFavorites,
    FAVORITES_PER_PAGE
  );

  function showToast(
    message
  ) {
    if (
      toastTimeoutRef.current
    ) {
      window.clearTimeout(
        toastTimeoutRef.current
      );
    }

    setToastMessage(message);

    toastTimeoutRef.current =
      window.setTimeout(() => {
        setToastMessage("");
        toastTimeoutRef.current =
          null;
      }, TOAST_TIMEOUT_MS);
  }

  async function handleRemoveFavorite(
    id
  ) {
    const removedFavorite =
      favorites.find(
        (favorite) =>
          favorite.id === id
      );

    setFavorites(
      (currentFavorites) =>
        currentFavorites.filter(
          (favorite) =>
            favorite.id !== id
        )
    );

    if (
      selectedFavorite?.id ===
      id
    ) {
      setSelectedFavorite(null);
    }

    try {
      await removeFavorite(id);
    } catch (requestError) {
      console.error(
        "Erro ao remover favorito:",
        requestError
      );

      showToast(
        t(
          "favorites.toast.removeError"
        )
      );

      if (removedFavorite) {
        setFavorites(
          (currentFavorites) => [
            removedFavorite,
            ...currentFavorites,
          ]
        );
      }

      return;
    }

    if (removedFavorite) {
      if (
        undoState?.timerId
      ) {
        window.clearTimeout(
          undoState.timerId
        );
      }

      const timerId =
        window.setTimeout(() => {
          setUndoState(null);
        }, UNDO_TIMEOUT_MS);

      setUndoState({
        favorite:
          removedFavorite,
        timerId,
      });
    }
  }

  async function handleUndoRemove() {
    if (!undoState) {
      return;
    }

    window.clearTimeout(
      undoState.timerId
    );

    const { favorite } =
      undoState;

    setUndoState(null);

    try {
      const restored =
        await addFavorite(
          favorite
        );

      setFavorites(
        (currentFavorites) => [
          restored,
          ...currentFavorites,
        ]
      );

      showToast(
        t(
          "favorites.toast.restored"
        )
      );
    } catch (requestError) {
      console.error(
        "Erro ao restaurar favorito:",
        requestError
      );

      showToast(
        t(
          "favorites.toast.restoreError"
        )
      );
    }
  }

  function handleFilterChange(
    filter
  ) {
    setActiveFilter(filter);
    setPage(1);
  }

  function handlePageChange(
    page
  ) {
    setPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const pageTitle =
    user?.name
      ? t(
          "favorites.hero.userTitle",
          {
            name: user.name,
          }
        )
      : t(
          "favorites.hero.title"
        );

  return (
    <>
      <PageMeta
        title={t(
          "favorites.meta.title"
        )}
        description={t(
          "favorites.meta.description"
        )}
      />

      <main className="favorites-page">
        <section className="favorites-hero">
          <Container>
            <Breadcrumb
              title={t(
                "favorites.breadcrumb"
              )}
            />

            <p className="favorites-hero__label">
              {t(
                "favorites.hero.label"
              )}
            </p>

            <h1>
              {pageTitle}
            </h1>

            <p className="favorites-hero__text">
              {t(
                "favorites.hero.description"
              )}
            </p>
          </Container>
        </section>

        <section
          className="favorites-content"
          aria-labelledby="favorites-content-title"
        >
          <Container>
            <h2
              id="favorites-content-title"
              className="sr-only"
            >
              {t(
                "favorites.contentTitle"
              )}
            </h2>

            {undoState && (
              <div
                className="favorites-undo"
                role="status"
                aria-live="polite"
              >
                <span>
                  {t(
                    "favorites.undo.removed"
                  )}
                </span>

                <Button
                  variant="secondary"
                  onClick={
                    handleUndoRemove
                  }
                >
                  {t(
                    "favorites.undo.action"
                  )}
                </Button>
              </div>
            )}

            {!isLoading &&
              !error &&
              favorites.length >
                0 && (
                <div className="favorites-filters">
                  <h2 className="favorites-filters__title">
                    {t(
                      "favorites.filters.title"
                    )}
                  </h2>

                  <div
                    className="favorites-filters__buttons"
                    role="group"
                    aria-label={t(
                      "favorites.filters.aria"
                    )}
                  >
                    {FAVORITE_FILTERS.map(
                      (filter) => {
                        const isActive =
                          activeFilter ===
                          filter.value;

                        return (
                          <button
                            key={
                              filter.value
                            }
                            type="button"
                            className={`favorites-filter-button${
                              isActive
                                ? " favorites-filter-button--active"
                                : ""
                            }`}
                            onClick={() =>
                              handleFilterChange(
                                filter.value
                              )
                            }
                            aria-pressed={
                              isActive
                            }
                          >
                            {t(
                              `favorites.filters.options.${filter.labelKey}`
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

            {isLoading && (
              <div
                className="favorites-empty"
                role="status"
                aria-live="polite"
                aria-busy="true"
              >
                <h2>
                  {t(
                    "favorites.states.loading"
                  )}
                </h2>
              </div>
            )}

            {!isLoading &&
              error && (
                <div
                  className="favorites-empty"
                  role="alert"
                >
                  <h2>
                    {t(
                      "favorites.states.errorTitle"
                    )}
                  </h2>

                  <p>
                    {error}
                  </p>
                </div>
              )}

            {!isLoading &&
              !error &&
              favorites.length ===
                0 && (
                <div className="favorites-empty">
                  <h2>
                    {t(
                      "favorites.states.emptyTitle"
                    )}
                  </h2>

                  <p>
                    {t(
                      "favorites.states.emptyDescription"
                    )}
                  </p>
                </div>
              )}

            {!isLoading &&
              !error &&
              favorites.length >
                0 &&
              filteredFavorites.length ===
                0 && (
                <div className="favorites-empty">
                  <h2>
                    {t(
                      "favorites.states.filterEmptyTitle"
                    )}
                  </h2>

                  <p>
                    {t(
                      "favorites.states.filterEmptyDescription"
                    )}
                  </p>
                </div>
              )}

            {!isLoading &&
              !error &&
              filteredFavorites.length >
                0 && (
                <>
                  <div className="favorites-grid">
                    {paginatedFavorites.map(
                      (
                        favorite
                      ) => (
                        <FavoriteCard
                          key={
                            favorite.id
                          }
                          favorite={
                            favorite
                          }
                          onRemove={
                            handleRemoveFavorite
                          }
                          onView={
                            setSelectedFavorite
                          }
                        />
                      )
                    )}
                  </div>

                  {shouldShowPagination && (
                    <Pagination
                      currentPage={
                        currentPage
                      }
                      totalPages={
                        totalPages
                      }
                      onPageChange={
                        handlePageChange
                      }
                    />
                  )}
                </>
              )}
          </Container>
        </section>

        {selectedFavorite && (
          <FavoriteDetailsModal
            favorite={
              selectedFavorite
            }
            onClose={() =>
              setSelectedFavorite(
                null
              )
            }
          />
        )}

        {toastMessage && (
          <Toast
            message={
              toastMessage
            }
            onClose={() =>
              setToastMessage("")
            }
          />
        )}
      </main>
    </>
  );
}

export default Favorites;