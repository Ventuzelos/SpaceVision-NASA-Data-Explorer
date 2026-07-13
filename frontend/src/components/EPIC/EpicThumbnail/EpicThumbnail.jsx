import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

import "./EpicThumbnail.css";

import {
  buildImageUrl,
  buildThumbUrl,
} from "../../../services/epicService";

import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";

import {
  isFavorite,
  toggleFavorite,
} from "../../../services/favoritesService";

export default function EpicThumbnail({
  photo,
  date,
  onSelect,
}) {
  const thumbUrl = buildThumbUrl(photo, date);
  const fullUrl = buildImageUrl(photo, date);

  const time =
    photo.date?.split(" ")[1]?.substring(0, 5) ||
    "";

  const favoriteId = `epic-${photo.image}`;

  const [favorite, setFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] =
    useState(false);

  /*
   * Guardamos o URL da imagem que falhou.
   * Primeiro tenta thumbnail; se falhar, tenta imagem completa.
   */
  const [failedThumbUrl, setFailedThumbUrl] =
    useState("");

  const [failedFullUrl, setFailedFullUrl] =
    useState("");

  const thumbFailed = failedThumbUrl === thumbUrl;
  const fullFailed = failedFullUrl === fullUrl;

  const imageSource = thumbFailed
    ? fullUrl
    : thumbUrl;

  const imageError = thumbFailed && fullFailed;

  useEffect(() => {
    let isMounted = true;

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

  function handleSelect() {
    if (imageError) {
      return;
    }

    onSelect({
      image: photo.image,
      date,
      url: fullUrl,
      caption:
        photo.caption ||
        `Vista completa da Terra captada pela EPIC${
          time ? ` às ${time} UTC` : ""
        }`,
      time,
      lat:
        photo.centroid_coordinates?.lat?.toFixed(
          1
        ) || "",
      lon:
        photo.centroid_coordinates?.lon?.toFixed(
          1
        ) || "",
    });
  }

  async function handleFavoriteClick(event) {
    event.stopPropagation();

    if (isFavoriteLoading) {
      return;
    }

    try {
      setIsFavoriteLoading(true);

      const latitude =
        photo.centroid_coordinates?.lat?.toFixed(
          1
        ) || "";

      const longitude =
        photo.centroid_coordinates?.lon?.toFixed(
          1
        ) || "";

      const result = await toggleFavorite({
        id: favoriteId,
        source: "epic",
        type: "epic",
        title: `EPIC · Terra${
          time ? ` (${time} UTC)` : ""
        }`,
        date,
        imageUrl: fullUrl,
        hdUrl: fullUrl,
        description: photo.caption || "",
        data: {
          date,
          time,
          caption: photo.caption || "",
          image: photo.image,
          image_url: fullUrl,
          hd_url: fullUrl,
          latitude,
          longitude,
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

  function handleKeyDown(event) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      handleSelect();
    }
  }

  function handleImageError() {
    if (!thumbFailed) {
      setFailedThumbUrl(thumbUrl);
      return;
    }

    setFailedFullUrl(fullUrl);
  }

  return (
    <div
      className={`thumb${
        imageError ? " thumb--error" : ""
      }`}
      title={photo.caption || ""}
      role="button"
      tabIndex={imageError ? -1 : 0}
      aria-disabled={imageError}
      aria-label={
        imageError
          ? "Imagem EPIC indisponível"
          : photo.caption ||
            `Imagem EPIC${
              time ? ` às ${time} UTC` : ""
            }`
      }
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
    >
      {imageError ? (
        <div className="thumb__fallback">
          <span>Imagem indisponível</span>
        </div>
      ) : (
        <img
          src={imageSource}
          alt=""
          onError={handleImageError}
        />
      )}

      {time && (
        <div className="thumb-badge">
          <Clock size={10} aria-hidden="true" />
          {time}
        </div>
      )}

      <FavoriteButton
        active={favorite}
        onClick={handleFavoriteClick}
        disabled={isFavoriteLoading}
        size={12}
        ariaLabel={
          favorite
            ? "Remover dos favoritos"
            : "Adicionar aos favoritos"
        }
      />
    </div>
  );
}