import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";

import Icon from "../../common/Icon/Icon";
import ErrorState from "../../common/ErrorState/ErrorState";

import {
  fetchNeoFeed,
  getDefaultDateRange,
  sortByMissDistance,
} from "../../../services/neowsService";
import getApiErrorMessage from "../../../utils/getApiErrorMessage";

import "./DiscovrAsteroidRadar.css";

const ASTEROID_LIST_SIZE = 5;

function isFiniteNumber(value) {
  return Number.isFinite(Number(value));
}

function formatDistanceKm(value) {
  if (!isFiniteNumber(value)) {
    return "Distância desconhecida";
  }

  const distance = Math.max(
    0,
    Number(value)
  );

  return `${Math.round(
    distance
  ).toLocaleString("pt-PT")} km`;
}

function formatDiameter(
  minimumKilometres,
  maximumKilometres
) {
  if (
    !isFiniteNumber(
      minimumKilometres
    ) ||
    !isFiniteNumber(
      maximumKilometres
    )
  ) {
    return "Diâmetro desconhecido";
  }

  const minimumMetres =
    Math.max(
      0,
      Number(minimumKilometres)
    ) * 1000;

  const maximumMetres =
    Math.max(
      minimumMetres,
      Number(maximumKilometres) *
        1000
    );

  return `${Math.round(
    minimumMetres
  ).toLocaleString(
    "pt-PT"
  )} – ${Math.round(
    maximumMetres
  ).toLocaleString("pt-PT")} m`;
}

function getClosenessPercent(
  distance,
  minimum,
  maximum
) {
  if (
    !isFiniteNumber(distance) ||
    !isFiniteNumber(minimum) ||
    !isFiniteNumber(maximum)
  ) {
    return 0;
  }

  const currentDistance =
    Number(distance);

  const minimumDistance =
    Number(minimum);

  const maximumDistance =
    Number(maximum);

  if (
    maximumDistance ===
    minimumDistance
  ) {
    return 100;
  }

  const normalizedCloseness =
    1 -
    (currentDistance -
      minimumDistance) /
      (maximumDistance -
        minimumDistance);

  const percentage =
    18 +
    normalizedCloseness * 82;

  return Math.round(
    Math.min(
      100,
      Math.max(0, percentage)
    )
  );
}

function normalizeAsteroid(asteroid) {
  if (
    !asteroid ||
    typeof asteroid !== "object"
  ) {
    return null;
  }

  const id =
    asteroid.id != null
      ? String(asteroid.id)
      : "";

  if (!id) {
    return null;
  }

  return {
    ...asteroid,

    id,

    name:
      typeof asteroid.name ===
        "string" &&
      asteroid.name.trim()
        ? asteroid.name.trim()
        : "Asteroide sem nome",

    missDistanceKm:
      isFiniteNumber(
        asteroid.missDistanceKm
      )
        ? Number(
            asteroid.missDistanceKm
          )
        : null,

    diameterMinKm:
      isFiniteNumber(
        asteroid.diameterMinKm
      )
        ? Number(
            asteroid.diameterMinKm
          )
        : null,

    diameterMaxKm:
      isFiniteNumber(
        asteroid.diameterMaxKm
      )
        ? Number(
            asteroid.diameterMaxKm
          )
        : null,

    isHazardous:
      Boolean(
        asteroid.isHazardous
      ),
  };
}

function DiscovrAsteroidRadar() {
  const [
    asteroids,
    setAsteroids,
  ] = useState([]);

  const [
    asteroidsLoading,
    setAsteroidsLoading,
  ] = useState(true);

  const [
    asteroidsError,
    setAsteroidsError,
  ] = useState("");

  const mountedRef =
    useRef(true);

  const requestIdRef =
    useRef(0);

  const loadAsteroids =
    useCallback(async () => {
      const requestId =
        ++requestIdRef.current;

      if (mountedRef.current) {
        setAsteroidsLoading(true);
        setAsteroidsError("");
      }

      try {
        const {
          startDate,
          endDate,
        } =
          getDefaultDateRange();

        const feed =
          await fetchNeoFeed(
            startDate,
            endDate
          );

        if (
          !mountedRef.current ||
          requestIdRef.current !==
            requestId
        ) {
          return;
        }

        const objects =
          Array.isArray(
            feed?.objects
          )
            ? feed.objects
                .map(
                  normalizeAsteroid
                )
                .filter(Boolean)
            : [];

        const closest =
          sortByMissDistance(
            objects,
            "asc"
          ).slice(
            0,
            ASTEROID_LIST_SIZE
          );

        setAsteroids(
          closest
        );
      } catch (
        requestError
      ) {
        if (
          !mountedRef.current ||
          requestIdRef.current !==
            requestId
        ) {
          return;
        }

        console.error(
          "Erro ao carregar asteroides:",
          requestError
        );

        setAsteroids([]);

        setAsteroidsError(
          getApiErrorMessage(
            requestError,
            "Não foi possível carregar os dados de asteroides."
          )
        );
      } finally {
        if (
          mountedRef.current &&
          requestIdRef.current ===
            requestId
        ) {
          setAsteroidsLoading(
            false
          );
        }
      }
    }, []);

  useEffect(() => {
    mountedRef.current = true;

    const initialLoadTimeoutId =
      window.setTimeout(() => {
        loadAsteroids();
      }, 0);

    return () => {
      mountedRef.current =
        false;

      requestIdRef.current +=
        1;

      window.clearTimeout(
        initialLoadTimeoutId
      );
    };
  }, [loadAsteroids]);

  const validDistances =
    useMemo(
      () =>
        asteroids
          .map(
            (asteroid) =>
              asteroid.missDistanceKm
          )
          .filter(
            isFiniteNumber
          )
          .map(Number),
      [asteroids]
    );

  const minDistance =
    validDistances.length > 0
      ? Math.min(
          ...validDistances
        )
      : null;

  const maxDistance =
    validDistances.length > 0
      ? Math.max(
          ...validDistances
        )
      : null;

  return (
    <section
      id="radar"
      className="discovr-section"
      aria-labelledby="discovr-asteroid-radar-title"
    >
      <h2
        id="discovr-asteroid-radar-title"
        className="discovr-section__title"
      >
        <Icon
          name="Radar"
          size={22}
          aria-hidden="true"
        />

        Radar de asteroides
      </h2>

      <p className="discovr-section__subtitle">
        Objetos próximos da Terra detetados pela NASA nos próximos dias, ordenados pela distância de aproximação.
      </p>

      {asteroidsLoading && (
        <div
          className="discovr-asteroid-list"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="A carregar asteroides próximos da Terra"
        >
          {Array.from({
            length:
              ASTEROID_LIST_SIZE,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="discovr-asteroid-card discovr-asteroid-card--skeleton"
                aria-hidden="true"
              >
                <span className="discovr-skeleton discovr-asteroid-card__radar" />

                <div className="discovr-asteroid-card__info">
                  <div className="discovr-skeleton-line discovr-skeleton-line--title" />

                  <div className="discovr-skeleton-line discovr-skeleton-line--short" />
                </div>
              </div>
            )
          )}
        </div>
      )}

      {!asteroidsLoading &&
        asteroidsError && (
          <ErrorState
            title="Radar offline"
            message={
              asteroidsError
            }
            onRetry={
              loadAsteroids
            }
          />
        )}

      {!asteroidsLoading &&
        !asteroidsError &&
        asteroids.length ===
          0 && (
          <div
            className="discovr-empty"
            role="status"
          >
            <Icon
              name="Radar"
              size={28}
              aria-hidden="true"
            />

            <p>
              Sem objetos próximos detetados nesta janela temporal.
            </p>
          </div>
        )}

      {!asteroidsLoading &&
        !asteroidsError &&
        asteroids.length >
          0 && (
          <div className="discovr-asteroid-list">
            {asteroids.map(
              (asteroid) => {
                const closeness =
                  getClosenessPercent(
                    asteroid.missDistanceKm,
                    minDistance,
                    maxDistance
                  );

                return (
                  <article
                    key={
                      asteroid.id
                    }
                    className={`discovr-asteroid-card${
                      asteroid.isHazardous
                        ? " discovr-asteroid-card--hazard"
                        : ""
                    }`}
                  >
                    <span
                      className="discovr-asteroid-card__radar"
                      aria-hidden="true"
                    >
                      <span className="discovr-asteroid-card__radar-pulse" />
                    </span>

                    <div className="discovr-asteroid-card__info">
                      <div className="discovr-asteroid-card__header">
                        <h3>
                          {
                            asteroid.name
                          }
                        </h3>

                        {asteroid.isHazardous && (
                          <span className="discovr-asteroid-card__hazard-badge">
                            <Icon
                              name="AlertCircle"
                              size={12}
                              aria-hidden="true"
                            />

                            Potencialmente perigoso
                          </span>
                        )}
                      </div>

                      <div className="discovr-asteroid-card__distance">
                        <div className="discovr-asteroid-card__distance-labels">
                          <span className="discovr-asteroid-card__stat-label">
                            Distância da Terra
                          </span>

                          <span className="discovr-asteroid-card__stat-value">
                            {formatDistanceKm(
                              asteroid.missDistanceKm
                            )}
                          </span>
                        </div>

                        <div
                          className="discovr-asteroid-card__distance-track"
                          role="progressbar"
                          aria-label={`Proximidade relativa de ${asteroid.name}`}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-valuenow={
                            closeness
                          }
                          aria-valuetext={`${closeness}% de proximidade relativa entre os objetos apresentados`}
                        >
                          <div
                            className="discovr-asteroid-card__distance-fill"
                            style={{
                              width: `${closeness}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="discovr-asteroid-card__stats">
                        <div className="discovr-asteroid-card__stat">
                          <span className="discovr-asteroid-card__stat-label">
                            Diâmetro estimado
                          </span>

                          <span className="discovr-asteroid-card__stat-value">
                            {formatDiameter(
                              asteroid.diameterMinKm,
                              asteroid.diameterMaxKm
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}

      <Link
        to="/neowatch"
        className="discovr-link discovr-asteroid-list__link"
      >
        Ver todos os asteroides

        <Icon
          name="ArrowRight"
          size={16}
          aria-hidden="true"
        />
      </Link>
    </section>
  );
}

export default DiscovrAsteroidRadar;