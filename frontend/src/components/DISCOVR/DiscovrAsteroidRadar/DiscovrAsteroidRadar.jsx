import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";

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
  return Number.isFinite(Number(value));
}

function formatDistanceKm(value) {
  if (!isFiniteNumber(value)) {
    return "Distância desconhecida";
  }

  const distance = Math.max(0, Number(value));
  return `${Math.round(distance).toLocaleString("pt-PT")} km`;
}

function formatDiameter(minimumKilometres, maximumKilometres) {
  if (!isFiniteNumber(minimumKilometres) || !isFiniteNumber(maximumKilometres)) {
    return "Diâmetro desconhecido";
  }

  const minimumMetres = Math.max(0, Number(minimumKilometres)) * 1000;
  const maximumMetres = Math.max(minimumMetres, Number(maximumKilometres) * 1000);

  return `${Math.round(minimumMetres).toLocaleString("pt-PT")} – ${Math.round(maximumMetres).toLocaleString("pt-PT")} m`;
}

export default function DiscovrAsteroidRadar() {
  const { isAuthenticated, isAuthLoading } = useAuth();

  const [favoriteKeys, setFavoriteKeys] = useState([]);
  const [favoriteLoadingKeys, setFavoriteLoadingKeys] = useState({});
  const [toastMessage, setToastMessage] = useState("");

  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAsteroids() {
      try {
        setLoading(true);

        const { startDate, endDate } = getDefaultDateRange();
        const data = await fetchNeoFeed(startDate, endDate);

        const sortedData = sortByMissDistance(data.objects).slice(0, ASTEROID_LIST_SIZE);
        setAsteroids(sortedData);
      } catch (err) {
        setError(getApiErrorMessage(err));
        setToastMessage("Erro ao sincronizar informações com a NASA.");
      } finally {
        setLoading(false);
      }
    }

    loadAsteroids();
  }, []);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;

    async function loadFavorites() {
      try {
        const currentFavs = await getFavorites(FAVORITES_SOURCE);
        if (Array.isArray(currentFavs)) {
          setFavoriteKeys(currentFavs.map((fav) => fav.nasa_id || fav.id));
        }
      } catch {
        setFavoriteKeys([]);
      }
    }

    loadFavorites();
  }, [isAuthenticated, isAuthLoading]);

  const handleToggleFavorite = useCallback(async (asteroid) => {
    if (!asteroid || !asteroid.id) return;
    const asteroidId = asteroid.id;

    setFavoriteLoadingKeys((prev) => ({ ...prev, [asteroidId]: true }));

    try {
      const result = await toggleFavorite({
        nasa_type: FAVORITES_SOURCE,
        nasa_id: asteroidId,
        title: asteroid.name,
        data: asteroid,
      });

      setFavoriteKeys((prev) =>
        result.isFavorite
          ? [...prev, asteroidId]
          : prev.filter((id) => id !== asteroidId)
      );

      setToastMessage(
        result.isFavorite
          ? "Asteroide adicionado aos favoritos!"
          : "Asteroide removido dos favoritos."
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
      setToastMessage("Não foi possível atualizar o status do favorito.");
    } finally {
      setFavoriteLoadingKeys((prev) => ({ ...prev, [asteroidId]: false }));
    }
  }, []);

  if (loading) {
    return (
      <div className="discovr-empty">
        <Icon name="LoaderCircle" className="spin-animation" />
        <p>Carregando radar de asteroides da NASA...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <section className="discovr-section">
      <h1 className="discovr-section__title">
        Radar de Asteroides DISCOVR
      </h1>

      <div className="discovr-asteroid-list">
        {asteroids.map((asteroid) => {
          const isFavorite = favoriteKeys.includes(asteroid.id);
          const isLoading = !!favoriteLoadingKeys[asteroid.id];

          return (
            <div key={asteroid.id} className="discovr-asteroid-card">
              <div className="discovr-asteroid-card__info">
                <div className="discovr-asteroid-card__header">
                  <h3>{asteroid.name}</h3>
                  <FavoriteButton
                    active={isFavorite}
                    disabled={isLoading}
                    onClick={() => handleToggleFavorite(asteroid)}
                  />
                </div>

                <div className="discovr-asteroid-card__body">
                  <p><strong>Distância:</strong> {formatDistanceKm(asteroid.missDistanceKm)}</p>
                  <p><strong>Diâmetro Estimado:</strong> {formatDiameter(asteroid.diameterMinKm, asteroid.diameterMaxKm)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Link to="/favorites" className="discovr-link">Ver Todos os Favoritos</Link>

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      )}
    </section>
  );
}
