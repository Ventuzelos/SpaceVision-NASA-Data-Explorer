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
  const [favoriteKeys, setFavoriteKeys] = useState([]);
  const [favoriteLoadingKeys, setFavoriteLoadingKeys] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initializeComponent() {
      try {
        setLoading(true);
        
        const currentFavs = await getFavorites(FAVORITES_SOURCE);
        if (currentFavs && Array.isArray(currentFavs)) {
          setFavoriteKeys(currentFavs.map((fav) => fav.id || fav.asteroidId));
        }

        const { startDate, endDate } = getDefaultDateRange();
        const data = await fetchNeoFeed(startDate, endDate);
        
        const sortedData = sortByMissDistance(data).slice(0, ASTEROID_LIST_SIZE);
        setAsteroids(sortedData);
      } catch (err) {
        setError(getApiErrorMessage(err));
        setToastMessage("Erro ao sincronizar informações com a NASA.");
      } finally {
        setLoading(false);
      }
    }

    initializeComponent();
  }, []);

  const handleToggleFavorite = useCallback(async (asteroid) => {
    if (!asteroid || !asteroid.id) return;
    const asteroidId = asteroid.id;

    setFavoriteLoadingKeys((prev) => ({ ...prev, [asteroidId]: true }));

    try {
      const isNowFavorite = await toggleFavorite(FAVORITES_SOURCE, asteroid);
      
      setFavoriteKeys((prev) =>
        isNowFavorite 
          ? [...prev, asteroidId] 
          : prev.filter((id) => id !== asteroidId)
      );

      setToastMessage(
        isNowFavorite 
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
      <div className="asteroid-radar-container loading">
        <Icon name="spinner" className="spin-animation" />
        <p>Carregando radar de asteroides da NASA...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="asteroid-radar-container">
      <header className="radar-header">
        <h1><Icon name="radar" /> Radar de Asteroides DISCOVR</h1>
        <Link to="/favorites" className="back-link">Ver Todos os Favoritos</Link>
      </header>

      <div className="asteroid-list">
        {asteroids.map((asteroid) => {
          const isFavorite = favoriteKeys.includes(asteroid.id);
          const isLoading = !!favoriteLoadingKeys[asteroid.id];

          return (
            <div key={asteroid.id} className="asteroid-card">
              <div className="card-header">
                <h3>{asteroid.name}</h3>
                <FavoriteButton
                  isFavorite={isFavorite}
                  isLoading={isLoading}
                  onClick={() => handleToggleFavorite(asteroid)}
                />
              </div>

              <div className="card-body">
                <p><strong>Distância:</strong> {formatDistanceKm(asteroid.close_approach_data?.[0]?.miss_distance?.kilometers)}</p>
                <p><strong>Diâmetro Estimado:</strong> {formatDiameter(asteroid.estimated_diameter?.kilometers?.estimated_diameter_min, asteroid.estimated_diameter?.kilometers?.estimated_diameter_max)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage("")} 
        />
      )}
    </div>
  );
}
