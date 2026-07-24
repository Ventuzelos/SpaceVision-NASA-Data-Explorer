import { useEffect, useRef, useState } from "react";
import { PlayCircle } from "lucide-react";

import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";
import Toast from "../../common/Toast/Toast";

import useAuth from "../../../hooks/useAuth";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../../../services/favoritesService";

import "./APODHistoryCard.css";

function APODHistoryCard({ item, active, onSelect }) {
  const { isAuthenticated, isAuthLoading } = useAuth();

  const [favorite, setFavorite] = useState(false);
  const [favoriteDatabaseId, setFavoriteDatabaseId] = useState(null);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const toastTimeoutRef = useRef(null);

  const favoriteId = `apod-${item.date}`;

  const formattedDate = new Date(item.date).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "short",
  });

  useEffect(() => {
    let isMounted = true;

    if (isAuthLoading || !isAuthenticated) {
      return undefined;
    }

    async function checkFavorite() {
      try {
        const favorites = await getFavorites("apod");

        const existingFavorite = favorites.find((favoriteItem) => {
          const itemId = favoriteItem.nasa_id || favoriteItem.id;

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

      const isImage = item.media_type === "image";

      const favoriteItem = {
        nasa_type: "apod",
        nasa_id: favoriteId,
        title: item.title || "Imagem astronómica da NASA",
        image_url: isImage ? item.hdurl || item.url : null,

        data: {
          ...item,
          image_url: isImage ? item.hdurl || item.url : null,
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
    <div
      className={`apod-history-card ${active ? "apod-history-card--active" : ""}`}
    >
      <button
        type="button"
        className="apod-history-card__trigger"
        onClick={() => onSelect(item)}
        aria-label={`Ver ${item.title}, abre no site da NASA numa nova janela`}
      />

      <div className="apod-history-card__media">
        {item.media_type === "image" ? (
          <img
            src={item.url}
            alt={item.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="apod-history-card__video">
            <PlayCircle size={42} />
            <span>Vídeo</span>
          </div>
        )}
      </div>

      <div className="apod-history-card__overlay">
        <span className="apod-history-card__date">{formattedDate}</span>
        <h3 className="apod-history-card__title">{item.title}</h3>
      </div>

      <FavoriteButton
        className="apod-history-card__favorite"
        active={isAuthenticated && favorite}
        onClick={handleFavoriteClick}
        disabled={isFavoriteLoading || isAuthLoading}
        size={16}
        ariaLabel={
          favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
        }
      />

      <Toast message={toastMessage} />
    </div>
  );
}

export default APODHistoryCard;
