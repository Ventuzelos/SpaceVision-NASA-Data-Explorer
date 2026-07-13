import { useEffect, useState } from "react";

import Button from "../common/Button/Button";
import Toast from "../common/Toast/Toast";
import Icon from "../common/Icon/Icon";
import FavoriteButton from "../common/FavoriteButton/FavoriteButton";

import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../../services/favoritesService";

import "./APODCard.css";

function APODCard({ apod }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [favoriteDatabaseId, setFavoriteDatabaseId] = useState(null);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const favoriteId = `apod-${apod.date}`;

  useEffect(() => {
    let isMounted = true;

    async function checkFavorite() {
      try {
        const favorites = await getFavorites("apod");

        const existingFavorite = favorites.find((item) => {
          const itemId = item.nasa_id || item.id;

          return String(itemId) === String(favoriteId);
        });

        if (isMounted) {
          setFavorite(Boolean(existingFavorite));
          setFavoriteDatabaseId(existingFavorite?.id || null);
        }
      } catch (error) {
        console.error("Erro ao verificar favorito:", error);

        if (isMounted) {
          setFavorite(false);
          setFavoriteDatabaseId(null);
        }
      }
    }

    checkFavorite();

    return () => {
      isMounted = false;
    };
  }, [favoriteId]);

  const formattedDate = new Date(apod.date).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function showToast(message) {
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage("");
    }, 2500);
  }

  async function handleFavoriteClick() {
    if (isFavoriteLoading) {
      return;
    }

    try {
      setIsFavoriteLoading(true);

      if (favorite && favoriteDatabaseId) {
        await removeFavorite(favoriteDatabaseId);

        setFavorite(false);
        setFavoriteDatabaseId(null);
        showToast("Removido dos favoritos");
        return;
      }

      const favoriteItem = {
        nasa_type: "apod",
        nasa_id: favoriteId,
        title: apod.title,
        image_url: apod.url,
        data: {
          date: apod.date,
          hd_url: apod.hdurl || null,
          description: apod.explanation,
          media_type: apod.media_type,
          copyright: apod.copyright || null,
        },
      };

      const createdFavorite = await addFavorite(favoriteItem);

      setFavorite(true);
      setFavoriteDatabaseId(createdFavorite.id);
      showToast("Adicionado aos favoritos");
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);

      if (error.response?.status === 401) {
        showToast("Inicia sessão para guardar favoritos");
      } else {
        showToast("Não foi possível atualizar o favorito");
      }
    } finally {
      setIsFavoriteLoading(false);
    }
  }

  return (
    <article className="apod-card">
      <div className="apod-card__media">
        {apod.media_type === "image" ? (
          <img src={apod.url} alt={apod.title} />
        ) : (
          <iframe src={apod.url} title={apod.title} allowFullScreen />
        )}
      </div>

      <div className="apod-card__content">
        <div className="apod-card__badges">
          <span className="badge">
            <Icon name="Calendar" size={16} />
            {formattedDate}
          </span>

          {apod.copyright && (
            <span className="badge">
              <Icon name="Image" size={16} />
              {apod.copyright}
            </span>
          )}

          <span className="badge">
            {apod.media_type === "image" ? (
              <>
                <Icon name="Image" size={16} />
                Imagem
              </>
            ) : (
              <>
                <Icon name="Video" size={16} />
                Vídeo
              </>
            )}
          </span>
        </div>

        <div className="apod-card__header">
          <h2>{apod.title}</h2>

          <FavoriteButton
            active={favorite}
            onClick={handleFavoriteClick}
            disabled={isFavoriteLoading}
            ariaLabel={
              favorite
                ? "Remover dos favoritos"
                : "Adicionar aos favoritos"
            }
          />
        </div>

        <p
          className={
            isExpanded
              ? "apod-card__text"
              : "apod-card__text apod-card__text--collapsed"
          }
        >
          {apod.explanation}
        </p>

        <div className="apod-card__actions">
          <Button
            variant="secondary"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Mostrar menos" : "Ler mais"}
          </Button>

          {apod.hdurl && (
            <a
              href={apod.hdurl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>
                <>
                  <Icon name="Download" size={16} />
                  {" Ver imagem HD"}
                </>
              </Button>
            </a>
          )}
        </div>
      </div>

      <Toast message={toastMessage} />
    </article>
  );
}

export default APODCard;