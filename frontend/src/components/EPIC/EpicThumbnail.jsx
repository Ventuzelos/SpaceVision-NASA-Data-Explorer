import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import {
  buildImageUrl,
  buildThumbUrl,
} from "../../services/epicService";
import FavoriteButton from "../common/FavoriteButton/FavoriteButton";
import {
  isFavorite,
  toggleFavorite,
} from "../../services/favoritesService";

export default function EpicThumbnail({
  photo,
  date,
  onSelect,
}) {
  const thumbUrl = buildThumbUrl(photo, date);
  const fullUrl = buildImageUrl(photo, date);

  const time =
    photo.date?.split(" ")[1]?.substring(0, 5) || "";

  const favoriteId = `epic-${photo.image}`;

  const [favorite, setFavorite] = useState(
    isFavorite(favoriteId)
  );

  const [imageSource, setImageSource] =
    useState(thumbUrl);

  const [imageError, setImageError] =
    useState(false);

  useEffect(() => {
    setImageSource(thumbUrl);
    setImageError(false);
  }, [thumbUrl]);

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
        photo.centroid_coordinates?.lat?.toFixed(1) ||
        "",
      lon:
        photo.centroid_coordinates?.lon?.toFixed(1) ||
        "",
    });
  }

  function handleFavoriteClick(event) {
    event.stopPropagation();

    toggleFavorite({
      id: favoriteId,
      type: "epic",
      title: `EPIC · Terra${
        time ? ` (${time} UTC)` : ""
      }`,
      date,
      imageUrl: fullUrl,
      hdUrl: fullUrl,
      description: photo.caption || "",
    });

    setFavorite((currentValue) => !currentValue);
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
    if (imageSource !== fullUrl) {
      setImageSource(fullUrl);
      return;
    }

    setImageError(true);
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