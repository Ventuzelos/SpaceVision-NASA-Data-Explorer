import { useEffect, useState } from "react";
import Container from "../../components/common/Container/Container";
import Button from "../../components/common/Button/Button";
import { getFavorites, removeFavorite } from "../../services/favoritesService";
import FavoriteCard from "../../components/favorites/FavoriteCard";
import "./Favorites.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  function handleRemoveFavorite(id) {
    removeFavorite(id);
    setFavorites(getFavorites());
  }

  return (
    <main className="favorites-page">
      <section className="favorites-hero">
        <Container>
          <p className="favorites-hero__label">Os teus conteúdos guardados</p>
          <h1>Favoritos</h1>
          <p className="favorites-hero__text">
            Guarda imagens e dados da NASA para consultares mais tarde.
          </p>
        </Container>
      </section>

      <section className="favorites-content">
        <Container>
          {favorites.length === 0 ? (
            <div className="favorites-empty">
              <h2>Ainda não tens favoritos</h2>
              <p>Explora a APOD e guarda os conteúdos que mais gostares.</p>
            </div>
          ) : (
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