import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import Icon from "../../common/Icon/Icon";
import ErrorState from "../../common/ErrorState/ErrorState";
import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";
import Toast from "../../common/Toast/Toast";

import useAuth from "../../../hooks/useAuth";
import {
  fetchNeoFeed,
  getDefaultDateRange,
  sortByMissDistance,
} from "../../../services/neowsService";
import {
  getFavorites,
  toggleFavorite,
} from "../../../services/favoritesService";
import getApiErrorMessage from "../../../utils/getApiErrorMessage";

import "./DiscovrAsteroidRadar.css";

const ASTEROID_LIST_SIZE = 5;
const FAVORITES_SOURCE = "neows";

function isFiniteNumber(value) {
  return Number.isFinite(
    Number(value)
  );
}

function formatDistanceKm(
  value,
  locale,
  unavailableText
) {
  if (!isFiniteNumber(value)) {
    return unavailableText;
  }

  const distance = Math.max(
    0,
    Number(value)
  );

  return `${Math.round(
    distance
  ).toLocaleString(locale)} km`;
}

function formatDiameter(
  minimumKilometres,
  maximumKilometres,
  locale,
  unavailableText
) {
  if (
    !isFiniteNumber(
      minimumKilometres
    ) ||
    !isFiniteNumber(
      maximumKilometres
    )
  ) {
    return unavailableText;
  }

  const minimumMetres =
    Math.max(
      0,
      Number(
        minimumKilometres
      )
    ) * 1000;

  const maximumMetres =
    Math.max(
      minimumMetres,
      Number(
        maximumKilometres
      ) * 1000
    );

  return `${Math.round(
    minimumMetres
  ).toLocaleString(
    locale
  )} – ${Math.round(
    maximumMetres
  ).toLocaleString(locale)} m`;
}

export default function DiscovrAsteroidRadar() {
  const { t, i18n } =
    useTranslation();

  const {
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
    favoriteKeys,
    setFavoriteKeys,
  ] = useState([]);

  const [
    favoriteLoadingKeys,
    setFavoriteLoadingKeys,
  ] = useState({});

  const [
    toastMessage,
    setToastMessage,
  ] = useState("");

  const [
    asteroids,
    setAsteroids,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [error, setError] =
    useState(null);

  const loadAsteroids =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          startDate,
          endDate,
        } =
          getDefaultDateRange();

        const data =
          await fetchNeoFeed(
            startDate,
            endDate
          );

        const sortedData =
          sortByMissDistance(
            data.objects
          ).slice(
            0,
            ASTEROID_LIST_SIZE
          );

        setAsteroids(
          sortedData
        );
      } catch (requestError) {
        setError(
          getApiErrorMessage(
            requestError,
            t(
              "discovr.asteroidRadar.errors.loadFallback"
            )
          )
        );

        setToastMessage(
          t(
            "discovr.asteroidRadar.errors.sync"
          )
        );
      } finally {
        setLoading(false);
      }
    }, [t]);

  useEffect(() => {
    const timeoutId =
      window.setTimeout(() => {
        loadAsteroids();
      }, 0);

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [loadAsteroids]);

  useEffect(() => {
    if (
      isAuthLoading ||
      !isAuthenticated
    ) {
      return undefined;
    }

    let isMounted = true;

    async function loadFavorites() {
      try {
        const currentFavorites =
          await getFavorites(
            FAVORITES_SOURCE
          );

        if (
          !isMounted ||
          !Array.isArray(
            currentFavorites
          )
        ) {
          return;
        }

        setFavoriteKeys(
          currentFavorites.map(
            (favorite) =>
              String(
                favorite.nasa_id ||
                  favorite.id
              )
          )
        );
      } catch {
        if (isMounted) {
          setFavoriteKeys([]);
        }
      }
    }

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [
    isAuthenticated,
    isAuthLoading,
  ]);

  const handleToggleFavorite =
    useCallback(
      async (asteroid) => {
        if (
          !asteroid ||
          !asteroid.id
        ) {
          return;
        }

        if (!isAuthenticated) {
          setToastMessage(
            t(
              "discovr.asteroidRadar.favorites.loginRequired"
            )
          );

          return;
        }

        const asteroidId =
          String(asteroid.id);

        setFavoriteLoadingKeys(
          (previous) => ({
            ...previous,
            [asteroidId]: true,
          })
        );

        try {
          const result =
            await toggleFavorite({
              nasa_type:
                FAVORITES_SOURCE,

              nasa_id:
                asteroidId,

              title:
                asteroid.name ||
                t(
                  "discovr.asteroidRadar.defaultName"
                ),

              data: asteroid,
            });

          setFavoriteKeys(
            (previous) =>
              result.isFavorite
                ? Array.from(
                    new Set([
                      ...previous,
                      asteroidId,
                    ])
                  )
                : previous.filter(
                    (id) =>
                      String(id) !==
                      asteroidId
                  )
          );

          setToastMessage(
            result.isFavorite
              ? t(
                  "discovr.asteroidRadar.favorites.added"
                )
              : t(
                  "discovr.asteroidRadar.favorites.removed"
                )
          );
        } catch (
          requestError
        ) {
          setError(
            getApiErrorMessage(
              requestError,
              t(
                "discovr.asteroidRadar.errors.favoriteFallback"
              )
            )
          );

          setToastMessage(
            t(
              "discovr.asteroidRadar.favorites.updateError"
            )
          );
        } finally {
          setFavoriteLoadingKeys(
            (previous) => ({
              ...previous,
              [asteroidId]:
                false,
            })
          );
        }
      },
      [
        isAuthenticated,
        t,
      ]
    );

  const visibleFavoriteKeys =
    isAuthenticated
      ? favoriteKeys
      : [];

  return (
    <section
      className="discovr-section"
      aria-labelledby="discovr-asteroid-radar-title"
    >
      <h2
        id="discovr-asteroid-radar-title"
        className="discovr-section__title"
      >
        {t(
          "discovr.asteroidRadar.title"
        )}
      </h2>

      <p className="discovr-section__subtitle">
        {t(
          "discovr.asteroidRadar.description"
        )}
      </p>

      {loading && (
        <div
          className="discovr-empty"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <Icon
            name="LoaderCircle"
            className="spin-animation"
            aria-hidden="true"
          />

          <p>
            {t(
              "discovr.asteroidRadar.loading"
            )}
          </p>
        </div>
      )}

      {!loading && error && (
        <ErrorState
          title={t(
            "discovr.asteroidRadar.errors.title"
          )}
          message={error}
          onRetry={
            loadAsteroids
          }
        />
      )}

      {!loading &&
        !error &&
        asteroids.length === 0 && (
          <div
            className="discovr-empty"
            role="status"
          >
            <Icon
              name="Orbit"
              size={24}
              aria-hidden="true"
            />

            <p>
              {t(
                "discovr.asteroidRadar.empty"
              )}
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        asteroids.length > 0 && (
          <>
            <div className="discovr-asteroid-list">
              {asteroids.map(
                (asteroid) => {
                  const asteroidId =
                    String(
                      asteroid.id
                    );

                  const isFavorite =
                    visibleFavoriteKeys.some(
                      (id) =>
                        String(id) ===
                        asteroidId
                    );

                  const isFavoriteLoading =
                    Boolean(
                      favoriteLoadingKeys[
                        asteroidId
                      ]
                    );

                  const asteroidName =
                    asteroid.name ||
                    t(
                      "discovr.asteroidRadar.defaultName"
                    );

                  return (
                    <article
                      key={
                        asteroidId
                      }
                      className="discovr-asteroid-card"
                    >
                      <div className="discovr-asteroid-card__info">
                        <div className="discovr-asteroid-card__header">
                          <h3>
                            {
                              asteroidName
                            }
                          </h3>

                          <FavoriteButton
                            active={
                              isAuthenticated &&
                              isFavorite
                            }
                            disabled={
                              isFavoriteLoading ||
                              isAuthLoading
                            }
                            onClick={() =>
                              handleToggleFavorite(
                                asteroid
                              )
                            }
                            ariaLabel={
                              isFavorite
                                ? t(
                                    "discovr.asteroidRadar.favorites.removeAria",
                                    {
                                      name: asteroidName,
                                    }
                                  )
                                : t(
                                    "discovr.asteroidRadar.favorites.addAria",
                                    {
                                      name: asteroidName,
                                    }
                                  )
                            }
                          />
                        </div>

                        <div className="discovr-asteroid-card__body">
                          <p>
                            <strong>
                              {t(
                                "discovr.asteroidRadar.distance"
                              )}
                              :
                            </strong>{" "}
                            {formatDistanceKm(
                              asteroid.missDistanceKm,
                              locale,
                              t(
                                "discovr.asteroidRadar.distanceUnavailable"
                              )
                            )}
                          </p>

                          <p>
                            <strong>
                              {t(
                                "discovr.asteroidRadar.estimatedDiameter"
                              )}
                              :
                            </strong>{" "}
                            {formatDiameter(
                              asteroid.diameterMinKm,
                              asteroid.diameterMaxKm,
                              locale,
                              t(
                                "discovr.asteroidRadar.diameterUnavailable"
                              )
                            )}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>

            <Link
              to="/favorites"
              className="discovr-link"
            >
              {t(
                "discovr.asteroidRadar.viewFavorites"
              )}

              <Icon
                name="ArrowRight"
                size={16}
                aria-hidden="true"
              />
            </Link>
          </>
        )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() =>
            setToastMessage("")
          }
        />
      )}
    </section>
  );
}