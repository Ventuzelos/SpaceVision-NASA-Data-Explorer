import { useEffect, useState } from "react";

import "./EpicCard.css";

import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";

import useAuth from "../../../hooks/useAuth";

import {
  isFavorite,
  toggleFavorite,
} from "../../../services/favoritesService";

export default function EpicCard({
  detail,
  onImageClick,
}) {
  const {
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  const favoriteId = detail?.image
    ? `epic-${detail.image}`
    : null;

  const [favorite, setFavorite] =
    useState(false);

  const [
    isFavoriteLoading,
    setIsFavoriteLoading,
  ] = useState(false);

  const [failedImageUrl, setFailedImageUrl] =
    useState("");

  const imageError =
    Boolean(detail?.url) &&
    failedImageUrl === detail.url;

  useEffect(() => {
    let isMounted = true;

    if (
      isAuthLoading ||
      !isAuthenticated ||
      !favoriteId
    ) {
      return undefined;
    }

    async function checkFavorite() {
      try {
        const result = await isFavorite(
          favoriteId,
          "epic"
        );

        if (isMounted) {
          setFavorite(result);
        }
      } catch (error) {
        if (
          error.response?.status !== 401
        ) {
          console.error(
            "Erro ao verificar favorito EPIC:",
            error
          );
        }

        if (isMounted) {
          setFavorite(false);
        }
      }
    }

    checkFavorite();

    return () => {
      isMounted = false;
    };
  }, [
    favoriteId,
    isAuthenticated,
    isAuthLoading,
  ]);

  if (!detail) {
    return null;
  }

  const {
    url,
    caption,
    time,
    lat,
    lon,
    date,
  } = detail;

  async function handleFavoriteClick() {
    if (!isAuthenticated) {
      window.dispatchEvent(
        new CustomEvent("epicFavoriteError", {
          detail: {
            status: 401,
          },
        })
      );

      return;
    }

    if (
      !favoriteId ||
      isFavoriteLoading
    ) {
      return;
    }

    try {
      setIsFavoriteLoading(true);

      const result = await toggleFavorite({
        id: favoriteId,
        nasa_id: favoriteId,
        source: "epic",
        type: "epic",
        nasa_type: "epic",

        title: `EPIC · Terra${
          time ? ` (${time} UTC)` : ""
        }`,

        date,

        imageUrl: url,
        image_url: url,

        hdUrl: url,
        description: caption,

        data: {
          ...detail,
          date,
          time,
          caption,
          image: detail.image,
          image_url: url,
          url,
          hd_url: url,
          latitude: lat,
          longitude: lon,

          centroid_coordinates: {
            lat,
            lon,
          },
        },
      });

      setFavorite(result.isFavorite);

      window.dispatchEvent(
        new CustomEvent(
          "epicFavoriteUpdated",
          {
            detail: {
              isFavorite:
                result.isFavorite,
            },
          }
        )
      );
    } catch (error) {
      console.error(
        "Erro ao atualizar favorito EPIC:",
        error
      );

      window.dispatchEvent(
        new CustomEvent(
          "epicFavoriteError",
          {
            detail: {
              status:
                error.response?.status,
            },
          }
        )
      );
    } finally {
      setIsFavoriteLoading(false);
    }
  }

  function handleImageKeyDown(event) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      onImageClick?.();
    }
  }

  return (
    <article className="epic-card">
      <div className="epic-card__header">
        <h3 className="epic-card__title">
          Terra — Disco Completo
        </h3>

        <span className="epic-card__time">
          {time ? `${time} UTC` : ""}
        </span>
      </div>

      <div className="epic-card__image-wrapper">
        {imageError ? (
          <div
            className="epic-card__fallback"
            role="img"
            aria-label="A imagem EPIC não está disponível"
          >
            <strong>
              Imagem indisponível
            </strong>

            <span>
              Não foi possível carregar esta
              captura da Terra.
            </span>
          </div>
        ) : (
          <img
            className="epic-card__image"
            src={url}
            alt={caption}
            role="button"
            tabIndex={0}
            aria-label={`${caption}. Abrir imagem ampliada.`}
            onClick={onImageClick}
            onKeyDown={handleImageKeyDown}
            onError={() =>
              setFailedImageUrl(url)
            }
          />
        )}

        <FavoriteButton
          active={
            isAuthenticated &&
            favorite
          }
          onClick={handleFavoriteClick}
          disabled={isFavoriteLoading}
          size={18}
          ariaLabel={
            favorite
              ? "Remover dos favoritos"
              : "Adicionar aos favoritos"
          }
        />
      </div>

      <div className="epic-card__metadata">
        {caption && (
          <p className="epic-card__caption">
            {caption}
          </p>
        )}

        {lat && lon && (
          <p>
            Centro visível: {lat}° lat ·{" "}
            {lon}° lon
          </p>
        )}

        <p>Formato PNG 2048 × 2048 px</p>
      </div>
    </article>
  );
}