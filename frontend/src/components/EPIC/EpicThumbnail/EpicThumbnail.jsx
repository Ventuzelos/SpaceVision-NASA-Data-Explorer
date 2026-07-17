import { useState } from "react";
import { Clock } from "lucide-react";

import "./EpicThumbnail.css";

import {
  buildImageUrl,
  buildThumbUrl,
} from "../../../services/epicService";

import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";

export default function EpicThumbnail({
  photo,
  date,
  onSelect,
  isFavorite: favorite,
  isFavoriteLoading,
  onToggleFavorite,
}) {
  const thumbUrl = buildThumbUrl(photo, date);
  const fullUrl = buildImageUrl(photo, date);

  const time =
    photo.date?.split(" ")[1]?.substring(0, 5) ||
    "";

  const favoriteId = `epic-${photo.image}`;

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
        `Vista completa da Terra captada pela EPIC${time ? ` às ${time} UTC` : ""
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

  function handleFavoriteClick(event) {
    event.stopPropagation();

    const latitude =
      photo.centroid_coordinates?.lat?.toFixed(1) ||
      "";

    const longitude =
      photo.centroid_coordinates?.lon?.toFixed(1) ||
      "";

    onToggleFavorite(favoriteId, {
      id: favoriteId,
      nasa_id: favoriteId,
      source: "epic",
      type: "epic",
      nasa_type: "epic",
      title: `EPIC · Terra${time ? ` (${time} UTC)` : ""
        }`,
      date,
      imageUrl: fullUrl,
      image_url: fullUrl,
      hdUrl: fullUrl,
      description: photo.caption || "",
      data: {
        ...photo,
        date,
        time,
        caption: photo.caption || "",
        image: photo.image,
        image_url: fullUrl,
        url: fullUrl,
        hd_url: fullUrl,
        latitude,
        longitude,

        centroid_coordinates: {
          lat: latitude,
          lon: longitude,
        },
      },
    });
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
      className="epic-thumbnail"
      title={photo.caption || ""}
      aria-disabled={imageError}
    >
      {imageError ? (
        <div
          className="epic-thumbnail__fallback"
          role="img"
          aria-label="Imagem EPIC indisponível"
        >
          <span>Imagem indisponível</span>
        </div>
      ) : (
        <img
          className="epic-thumbnail__image"
          src={imageSource}
          alt=""
          role="button"
          tabIndex={0}
          aria-label={
            photo.caption ||
            `Imagem EPIC${time ? ` às ${time} UTC` : ""}`
          }
          onClick={handleSelect}
          onKeyDown={handleKeyDown}
          onError={handleImageError}
        />
      )}

      {time && (
        <div className="epic-thumbnail__time">
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