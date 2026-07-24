import { useEffect, useRef, useState } from "react";

import Button from "../common/Button/Button";
import Toast from "../common/Toast/Toast";
import Icon from "../common/Icon/Icon";
import FavoriteButton from "../common/FavoriteButton/FavoriteButton";

import useAuth from "../../hooks/useAuth";
import isSafeUrl from "../../utils/isSafeUrl";

import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../../services/favoritesService";

import "./APODCard.css";

function formatApodDate(date) {
  if (!date) {
    return "Data indisponível";
  }

  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) {
    return date;
  }

  return new Date(year, month - 1, day).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function APODCard({ apod }) {
  const { isAuthenticated, isAuthLoading } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [favoriteDatabaseId, setFavoriteDatabaseId] = useState(null);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const toastTimeoutRef = useRef(null);

  const favoriteId = `apod-${apod.date}`;
  const formattedDate = formatApodDate(apod.date);

  const isImage = apod.media_type === "image";
  const mediaUrl = isSafeUrl(apod.url) ? apod.url : null;
  const hdUrl = isSafeUrl(apod.hdurl) ? apod.hdurl : null;


  useEffect(() => {
    let isMounted = true;

    if (isAuthLoading || !isAuthenticated) {
      return undefined;
    }

    async function checkFavorite() {
      try {
        const favorites = await getFavorites("apod");

        const existingFavorite = favorites.find((item) => {
          const itemId = item.nasa_id || item.id;

          return String(itemId) === String(favoriteId);
        });

        if (!isMounted) {
          return;
        }

        setFavorite(Boolean(existingFavorite));
        setFavoriteDatabaseId(existingFavorite?.id || null);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Erro ao verificar favorito:", error);
        }

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
  }, [favoriteId, isAuthenticated, isAuthLoading]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  function showToast(message) {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setToastMessage(message);

    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage("");
      toastTimeoutRef.current = null;
    }, 2500);
  }

  async function handleFavoriteClick() {
    if (!isAuthenticated) {
      showToast("Precisas de iniciar sessão para guardar favoritos");
      return;
    }

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
        title: apod.title || "Imagem astronómica da NASA",
        image_url: isImage ? hdUrl || mediaUrl : null,

        data: {
          ...apod,
          image_url: isImage ? hdUrl || mediaUrl : null,
        },
      };

      const createdFavorite = await addFavorite(favoriteItem);

      setFavorite(true);
      setFavoriteDatabaseId(createdFavorite.id);

      showToast("Adicionado aos favoritos");
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);

      if (error.response?.status === 401) {
        showToast("Precisas de iniciar sessão para guardar favoritos");
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
        {!mediaUrl && (
          <div className="apod-card__media-error" role="status">
            <Icon name="ImageOff" size={32} />

            <p>O conteúdo multimédia desta APOD não está disponível.</p>
          </div>
        )}

        {mediaUrl && isImage && (
          <img
            src={mediaUrl}
            alt={apod.title || "Imagem astronómica disponibilizada pela NASA"}
            loading="lazy"
            decoding="async"
          />
        )}

        {mediaUrl && !isImage && (
          <iframe
            src={mediaUrl}
            title={apod.title || "Vídeo astronómico disponibilizado pela NASA"}
            loading="lazy"
            allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
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
              <Icon name="Copyright" size={16} />
              {apod.copyright}
            </span>
          )}

          <span className="badge">
            <Icon
              name={isImage ? "Image" : "Video"}
              size={16}
            />

            {isImage ? "Imagem" : "Vídeo"}
          </span>
        </div>

        <div className="apod-card__header">
          <h2>{apod.title || "Imagem astronómica do dia"}</h2>

          <FavoriteButton
            active={isAuthenticated && favorite}
            onClick={handleFavoriteClick}
            disabled={isFavoriteLoading || isAuthLoading}
            ariaLabel={
              favorite
                ? "Remover dos favoritos"
                : "Adicionar aos favoritos"
            }
          />
        </div>

        {apod.explanation ? (
          <>
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
                onClick={() => {
                  setIsExpanded((current) => !current);
                }}
                aria-expanded={isExpanded}
              >
                {isExpanded ? "Mostrar menos" : "Ler mais"}
              </Button>

              {isImage && hdUrl && (
                <a
                  href={hdUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apod-card__hd-link"
                >
                  <Button>
                    <Icon name="ExternalLink" size={16} />
                    Ver imagem HD
                  </Button>
                </a>
              )}
            </div>
          </>
        ) : (
          <p className="apod-card__text">
            Não está disponível uma explicação para este conteúdo.
          </p>
        )}
      </div>

      <Toast message={toastMessage} />
    </article>
  );
}

export default APODCard;