import { useState } from "react";

import Button from "../common/Button/Button";
import Toast from "../common/Toast/Toast";
import Icon from "../common/Icon/Icon";
import FavoriteButton from "../common/FavoriteButton/FavoriteButton";

import "./APODCard.css";

import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from "../../services/favoritesService";

function APODCard({ apod }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const favoriteId = `apod-${apod.date}`;
  const [favorite, setFavorite] = useState(isFavorite(favoriteId));
  const [toastMessage, setToastMessage] = useState("");

  const formattedDate = new Date(apod.date).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function showToast(message) {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage("");
    }, 2500);
  }

  function handleFavoriteClick() {
    const favoriteItem = {
      id: favoriteId,
      type: "apod",
      title: apod.title,
      date: apod.date,
      imageUrl: apod.url,
      hdUrl: apod.hdurl,
      description: apod.explanation,
    };

    if (favorite) {
      removeFavorite(favoriteId);
      setFavorite(false);
      showToast("Removido dos favoritos");
      return;
    }

    addFavorite(favoriteItem);
    setFavorite(true);
    showToast("Adicionado aos favoritos");
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

      <div>
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
            ariaLabel={
              favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
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
            <a href={apod.hdurl} target="_blank" rel="noopener noreferrer">
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