import { useEffect, useState } from "react";

import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";

import useAuth from "../../../hooks/useAuth";

import {
  isFavorite,
  toggleFavorite,
} from "../../../services/favoritesService";

import "./EpicCard.css";

function hasCoordinate(value) {
  return value !== null &&
    value !== undefined &&
    value !== "";
}

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
    : "";

  const [favorite, setFavorite] =
    useState(false);

  const [
    isFavoriteLoading,
    setIsFavoriteLoading,
  ] = useState(false);

  const [
    failedImageUrl,
    setFailedImageUrl,
  ] = useState("");

  const imageUrl =
    typeof detail?.url === "string"
      ? detail.url
      : "";

  const imageError =
    !imageUrl ||
    failedImageUrl === imageUrl;

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
          setFavorite(Boolean(result));
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
    caption,
    time,
    lat,
    lon,
    date,
  } = detail;

  const accessibleCaption =
    caption ||
    "Imagem da Terra captada pela câmara EPIC da NASA";

  function handleOpenImage() {
    if (
      imageError ||
      typeof onImageClick !== "function"
    ) {
      return;
    }

    onImageClick();
  }

  async function handleFavoriteClick() {
    if (!isAuthenticated) {
      window.dispatchEvent(
        new CustomEvent(
          "epicFavoriteError",
          {
            detail: {
              status: 401,
            },
          }
        )
      );

      return;
    }

    if (
      !favoriteId ||
      !imageUrl ||
      isFavoriteLoading
    ) {
      return;
    }

    try {
      setIsFavoriteLoading(true);

      const result =
        await toggleFavorite({
          id: favoriteId,
          nasa_id: favoriteId,
          source: "epic",
          type: "epic",
          nasa_type: "epic",

          title: `EPIC · Terra${
            time
              ? ` (${time} UTC)`
              : ""
          }`,

          date,

          imageUrl,
          image_url: imageUrl,
          hdUrl: imageUrl,
          description:
            caption || accessibleCaption,

          data: {
            ...detail,
            date,
            time,
            caption:
              caption ||
              accessibleCaption,
            image: detail.image,
            image_url: imageUrl,
            url: imageUrl,
            hd_url: imageUrl,
            latitude: lat,
            longitude: lon,

            centroid_coordinates: {
              lat,
              lon,
            },
          },
        });

      setFavorite(
        Boolean(result.isFavorite)
      );

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
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    event.preventDefault();
    handleOpenImage();
  }

  return (
    <article className="epic-card">
      <div className="epic-card__header">
        <h3 className="epic-card__title">
          Terra — Disco Completo
        </h3>

        {time && (
          <span className="epic-card__time">
            {time} UTC
          </span>
        )}
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
            src={imageUrl}
            alt={accessibleCaption}
            role="button"
            tabIndex={0}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            aria-label={`${accessibleCaption}. Abrir imagem ampliada.`}
            onClick={handleOpenImage}
            onKeyDown={handleImageKeyDown}
            onError={() => {
              setFailedImageUrl(imageUrl);
            }}
          />
        )}

        <FavoriteButton
          active={
            isAuthenticated &&
            favorite
          }
          onClick={
            handleFavoriteClick
          }
          disabled={
            isFavoriteLoading ||
            isAuthLoading ||
            !favoriteId ||
            !imageUrl
          }
          size={18}
          ariaLabel={
            favorite
              ? "Remover esta imagem EPIC dos favoritos"
              : "Adicionar esta imagem EPIC aos favoritos"
          }
        />
      </div>

      <div className="epic-card__metadata">
        {caption && (
          <p className="epic-card__caption">
            {caption}
          </p>
        )}

        {hasCoordinate(lat) &&
          hasCoordinate(lon) && (
            <p>
              Centro visível: {lat}° lat ·{" "}
              {lon}° lon
            </p>
          )}

        <p>
          Formato PNG 2048 × 2048 px
        </p>
      </div>
    </article>
  );
}