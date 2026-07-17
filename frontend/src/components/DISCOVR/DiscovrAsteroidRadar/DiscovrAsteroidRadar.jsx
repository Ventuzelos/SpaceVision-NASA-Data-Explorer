import { useEffect, useState } from "react";
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

function formatDistanceKm(km) {
  if (km == null) return "Distância desconhecida";

  return `${Math.round(km).toLocaleString("pt-PT")} km`;
}

function formatDiameter(minKm, maxKm) {
  if (minKm == null || maxKm == null) return "Diâmetro desconhecido";

  const minM = Math.round(minKm * 1000);
  const maxM = Math.round(maxKm * 1000);

  return `${minM.toLocaleString("pt-PT")} – ${maxM.toLocaleString("pt-PT")} m`;
}

// Quanto mais perto do mínimo do grupo, mais cheia a barra fica — a
// distância em si já é mostrada em texto, a barra só torna a comparação
// entre os 5 objetos instantânea, sem precisar de ler todos os números.


function getClosenessPercent(km, min, max) {
  if (km == null || min == null || max == null) return 0;
  if (max === min) return 100;

  const closeness = 1 - (km - min) / (max - min);
  return Math.round(18 + closeness * 82);
}

function DiscovrAsteroidRadar() {
  const [asteroids, setAsteroids] = useState([]);
  const [asteroidsLoading, setAsteroidsLoading] = useState(true);
  const [asteroidsError, setAsteroidsError] = useState("");

  useEffect(() => {
    loadAsteroids();
  }, []);

  async function loadAsteroids() {
    setAsteroidsLoading(true);
    setAsteroidsError("");

    try {
      const { startDate, endDate } = getDefaultDateRange();
      const feed = await fetchNeoFeed(startDate, endDate);

      const closest = sortByMissDistance(feed.objects, "asc").slice(
        0,
        ASTEROID_LIST_SIZE
      );

      setAsteroids(closest);
    } catch (requestError) {
      console.error("Erro ao carregar asteroides:", requestError);

      setAsteroidsError(
        getApiErrorMessage(
          requestError,
          "Não foi possível carregar os dados de asteroides."
        )
      );
      setAsteroids([]);
    } finally {
      setAsteroidsLoading(false);
    }
  }

  const missDistances = asteroids.map((neo) => neo.missDistanceKm);
  const minDistance = asteroids.length ? Math.min(...missDistances) : null;
  const maxDistance = asteroids.length ? Math.max(...missDistances) : null;

  return (
    <section id="radar" className="discovr-section">
      <h2 className="discovr-section__title">
        <Icon name="Radar" size={22} aria-hidden="true"/>
        Radar de asteroides
      </h2>

      <p className="discovr-section__subtitle">
        Objetos próximos da Terra detetados pela NASA nos próximos dias,
        ordenados pela distância de aproximação.
      </p>

      {asteroidsLoading && (
        <div className="discovr-asteroid-list">
          {Array.from({ length: ASTEROID_LIST_SIZE }).map((_, index) => (
            <div
              key={index}
              className="discovr-asteroid-card discovr-asteroid-card--skeleton"
            >
              <span className="discovr-skeleton discovr-asteroid-card__radar" />

              <div className="discovr-asteroid-card__info">
                <div className="discovr-skeleton-line discovr-skeleton-line--title" />
                <div className="discovr-skeleton-line discovr-skeleton-line--short" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!asteroidsLoading && asteroidsError && (
        <ErrorState
          title="Radar offline"
          message={asteroidsError}
          onRetry={loadAsteroids}
        />
      )}

      {!asteroidsLoading && !asteroidsError && asteroids.length === 0 && (
        <div className="discovr-empty">
          <Icon name="Radar" size={28} aria-hidden="true" />
          <p>Sem objetos próximos detetados nesta janela temporal.</p>
        </div>
      )}

      {!asteroidsLoading && !asteroidsError && asteroids.length > 0 && (
        <div className="discovr-asteroid-list">
          {asteroids.map((neo) => (
            <div
              key={neo.id}
              className={`discovr-asteroid-card${
                neo.isHazardous ? " discovr-asteroid-card--hazard" : ""
              }`}
            >
              <span className="discovr-asteroid-card__radar">
                <span className="discovr-asteroid-card__radar-pulse" />
              </span>

              <div className="discovr-asteroid-card__info">
                <div className="discovr-asteroid-card__header">
                  <h3>{neo.name}</h3>

                  {neo.isHazardous && (
                    <span className="discovr-asteroid-card__hazard-badge">
                      <Icon name="AlertCircle" size={12} aria-hidden="true" />
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
                      {formatDistanceKm(neo.missDistanceKm)}
                    </span>
                  </div>

                  <div
                    className="discovr-asteroid-card__distance-track"
                    role="img"
                    aria-label={`Proximidade relativa aos outros objetos listados: ${getClosenessPercent(
                      neo.missDistanceKm,
                      minDistance,
                      maxDistance
                    )}%`}
                  >
                    <div
                      className="discovr-asteroid-card__distance-fill"
                      style={{
                        width: `${getClosenessPercent(
                          neo.missDistanceKm,
                          minDistance,
                          maxDistance
                        )}%`,
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
                      {formatDiameter(neo.diameterMinKm, neo.diameterMaxKm)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        to="/neowatch"
        className="discovr-link discovr-asteroid-list__link"
      >
        Ver todos os asteroides
        <Icon name="ArrowRight" size={16} aria-hidden="true" />
      </Link>
    </section>
  );
}

export default DiscovrAsteroidRadar;
