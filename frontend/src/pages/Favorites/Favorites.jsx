import { useEffect, useState } from "react";
import Container from "../../components/common/Container/Container";
import {
  getFavorites,
  removeFavorite,
} from "../../services/favoritesService";
import FavoriteCard from "../../components/favorites/FavoriteCard";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import "./Favorites.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFavorites() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getFavorites();

        setFavorites(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar favoritos:", err);

        if (err.response?.status === 401) {
          setError(
            "Precisas de iniciar sessão para consultar os teus favoritos."
          );
        } else {
          setError("Não foi possível carregar os favoritos.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, []);

  async function handleRemoveFavorite(id) {
    try {
      await removeFavorite(id);

      setFavorites((currentFavorites) =>
        currentFavorites.filter((favorite) => favorite.id !== id)
      );
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
      setError("Não foi possível remover o favorito.");
    }
  }

  return (
    <main className="favorites-page">
      <section className="favorites-hero">
        <Container>
          <Breadcrumb title="Favoritos" />
          <p className="favorites-hero__label">Os teus conteúdos guardados</p>
          <h1>Favoritos</h1>

          <p className="favorites-hero__text">
            Guarda imagens e dados da NASA para consultares mais tarde.
          </p>
        </Container>
      </section>

      <section className="favorites-content">
        <Container>
          {isLoading && (
            <div className="favorites-empty">
              <h2>A carregar favoritos...</h2>
            </div>
          )}

          {!isLoading && error && (
            <div className="favorites-empty" role="alert">
              <h2>Favoritos indisponíveis</h2>
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && favorites.length === 0 && (
            <div className="favorites-empty">
              <h2>Ainda não tens favoritos</h2>
              <p>
                Explora os conteúdos da NASA e guarda os que mais gostares.
              </p>
            </div>
          )}

          {!isLoading && !error && favorites.length > 0 && (
            <div className="favorites-grid">
              {favorites.map((favorite) => (
                <FavoriteCard
                  key={favorite.id}
                  favorite={favorite}
                  onRemove={handleRemoveFavorite}
                />
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}

export default Favorites;