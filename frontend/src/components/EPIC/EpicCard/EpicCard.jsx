import { useEffect, useState } from "react";
import "./EpicCard.css";

import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";

import {
  isFavorite,
  toggleFavorite,
} from "../../../services/favoritesService";

export default function EpicCard({
  detail,
  onImageClick,
}) {
  const favoriteId = detail?.image
    ? `epic-${detail.image}`
    : null;

  const [favorite, setFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] =
    useState(false);

  /*
   * Em vez de guardar apenas true/false,
   * guardamos qual URL falhou.
   * Assim, quando a URL muda, o erro anterior deixa
   * automaticamente de se aplicar.
   */
  const [failedImageUrl, setFailedImageUrl] =
    useState("");

  const imageError =
    Boolean(detail?.url) &&
    failedImageUrl === detail.url;

  useEffect(() => {
    let isMounted = true;

    async function checkFavorite() {
      if (!favoriteId) {
        return;
      }

      try {
        const result = await isFavorite(
          favoriteId,
          "epic"
        );

        if (isMounted) {
          setFavorite(result);
        }
      } catch (error) {
        console.error(
          "Erro ao verificar favorito EPIC:",
          error
        );

        if (isMounted) {
          setFavorite(false);
        }
      }
    }

    checkFavorite();

    return () => {
      isMounted = false;
    };
  }, [favoriteId]);

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
    if (!favoriteId || isFavoriteLoading) {
      return;
    }

    try {
      setIsFavoriteLoading(true);

      const result = await toggleFavorite({
        id: favoriteId,
        source: "epic",
        type: "epic",
        title: `EPIC · Terra${
          time ? ` (${time} UTC)` : ""
        }`,
        date,
        imageUrl: url,
        hdUrl: url,
        description: caption,
        data: {
          date,
          time,
          caption,
          image: detail.image,
          image_url: url,
          hd_url: url,
          latitude: lat,
          longitude: lon,
        },
      });

      setFavorite(result.isFavorite);
    } catch (error) {
      console.error(
        "Erro ao atualizar favorito EPIC:",
        error
      );

      if (error.response?.status === 401) {
        window.alert(
          "Precisas de iniciar sessão para guardar favoritos."
        );
      } else {
        window.alert(
          "Não foi possível atualizar o favorito."
        );
      }
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
    <article className="card">
      <div className="card-header">
        <span className="card-title">
          Terra — Disco Completo
        </span>

        <span className="card-label">
          {time ? `${time} UTC` : ""}
        </span>
      </div>

      <div className="card-image-wrap">
        {imageError ? (
          <div
            className="epic-image-fallback"
            role="img"
            aria-label="A imagem EPIC não está disponível"
          >
            <strong>Imagem indisponível</strong>

            <span>
              Não foi possível carregar esta captura da
              Terra.
            </span>
          </div>
        ) : (
          <img
            className="epic-detail-image"
            src={url}
            alt={caption}
            role="button"
            tabIndex={0}
            aria-label={`${caption}. Abrir imagem ampliada.`}
            onClick={onImageClick}
            onKeyDown={handleImageKeyDown}
            onError={() => setFailedImageUrl(url)}
          />
        )}

        <FavoriteButton
          active={favorite}
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
            Centro visível: {lat}° lat · {lon}° lon
          </p>
        )}

        <p>Formato PNG 2048 × 2048 px</p>
      </div>
    </article>
  );
}