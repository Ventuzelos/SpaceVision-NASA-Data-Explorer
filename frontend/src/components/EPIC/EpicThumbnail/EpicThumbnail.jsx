import { useState } from "react";
import { Clock } from "lucide-react";

import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";

import {
  buildImageUrl,
  buildThumbUrl,
} from "../../../services/epicService";

import "./EpicThumbnail.css";

function formatCoordinate(value) {
  return typeof value === "number"
    ? value.toFixed(1)
    : "";
}

function getPhotoTime(value) {
  if (typeof value !== "string") {
    return "";
  }

  return (
    value
      .split(" ")[1]
      ?.substring(0, 5) || ""
  );
}

export default function EpicThumbnail({
  photo,
  date,
  onSelect,
  isFavorite: favorite,
  isFavoriteLoading,
  onToggleFavorite,
}) {
  const photoImage =
    typeof photo?.image === "string"
      ? photo.image
      : "";

  const photoDate =
    typeof photo?.date === "string"
      ? photo.date.split(" ")[0]
      : date;

  const thumbUrl = buildThumbUrl(
    photo,
    photoDate
  );

  const fullUrl = buildImageUrl(
    photo,
    photoDate
  );

  const time =
    photo?.time ||
    getPhotoTime(photo?.date);

  const caption =
    photo?.caption ||
    `Vista completa da Terra captada pela EPIC${
      time ? ` às ${time} UTC` : ""
    }`;

  const favoriteId = photoImage
    ? `epic-${photoImage}`
    : "";

  const latitude =
    photo?.lat ||
    formatCoordinate(
      photo?.centroid_coordinates?.lat
    );

  const longitude =
    photo?.lon ||
    formatCoordinate(
      photo?.centroid_coordinates?.lon
    );

  /*
   * Primeiro é apresentada a thumbnail.
   * Se falhar, é tentada a imagem completa.
   */
  const [
    failedThumbUrl,
    setFailedThumbUrl,
  ] = useState("");

  const [
    failedFullUrl,
    setFailedFullUrl,
  ] = useState("");

  const thumbFailed =
    Boolean(thumbUrl) &&
    failedThumbUrl === thumbUrl;

  const fullFailed =
    Boolean(fullUrl) &&
    failedFullUrl === fullUrl;

  const imageSource =
    !thumbFailed && thumbUrl
      ? thumbUrl
      : fullUrl;

  const imageError =
    !imageSource ||
    (thumbFailed && fullFailed);

  function getSelectedPhoto() {
    return {
      ...photo,
      image: photoImage,
      date: photoDate,
      url: fullUrl,
      image_url: fullUrl,
      caption,
      time,
      lat: latitude,
      lon: longitude,
    };
  }

  function handleSelect() {
    if (
      imageError ||
      !fullUrl ||
      typeof onSelect !== "function"
    ) {
      return;
    }

    onSelect(getSelectedPhoto());
  }

  function handleFavoriteClick(event) {
    event.stopPropagation();

    if (
      !favoriteId ||
      !fullUrl ||
      typeof onToggleFavorite !==
        "function"
    ) {
      return;
    }

    onToggleFavorite(favoriteId, {
      id: favoriteId,
      nasa_id: favoriteId,
      source: "epic",
      type: "epic",
      nasa_type: "epic",

      title: `EPIC · Terra${
        time ? ` (${time} UTC)` : ""
      }`,

      date: photoDate,

      imageUrl: fullUrl,
      image_url: fullUrl,
      hdUrl: fullUrl,

      description:
        photo?.caption || caption,

      data: {
        ...photo,

        date: photoDate,
        time,
        caption,
        image: photoImage,

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
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    event.preventDefault();
    handleSelect();
  }

  function handleImageError() {
    if (!thumbFailed && thumbUrl) {
      setFailedThumbUrl(thumbUrl);
      return;
    }

    if (fullUrl) {
      setFailedFullUrl(fullUrl);
    }
  }

  return (
    <div
      className="epic-thumbnail"
      title={caption}
      aria-disabled={imageError}
    >
      {imageError ? (
        <div
          className="epic-thumbnail__fallback"
          role="img"
          aria-label={`Imagem EPIC indisponível${
            time ? ` das ${time} UTC` : ""
          }`}
        >
          <span>
            Imagem indisponível
          </span>
        </div>
      ) : (
        <img
          className="epic-thumbnail__image"
          src={imageSource}
          alt=""
          role="button"
          tabIndex={0}
          loading="lazy"
          decoding="async"
          aria-label={`Abrir ${caption}`}
          onClick={handleSelect}
          onKeyDown={handleKeyDown}
          onError={handleImageError}
        />
      )}

      {time && (
        <div className="epic-thumbnail__time">
          <Clock
            size={10}
            aria-hidden="true"
          />

          {time}
        </div>
      )}

      <FavoriteButton
        active={Boolean(favorite)}
        onClick={handleFavoriteClick}
        disabled={
          Boolean(isFavoriteLoading) ||
          !favoriteId ||
          !fullUrl
        }
        size={12}
        ariaLabel={
          favorite
            ? `Remover imagem EPIC${
                time
                  ? ` das ${time} UTC`
                  : ""
              } dos favoritos`
            : `Adicionar imagem EPIC${
                time
                  ? ` das ${time} UTC`
                  : ""
              } aos favoritos`
        }
      />
    </div>
  );
}