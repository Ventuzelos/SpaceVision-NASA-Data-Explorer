import { useEffect, useState } from 'react';
import './EpicCard.css';
import FavoriteButton from '../../common/FavoriteButton/FavoriteButton';
import {
  isFavorite,
  toggleFavorite,
} from '../../../services/favoritesService';

export default function EpicCard({
  detail,
  onImageClick,
}) {
  const favoriteId = detail?.image
    ? `epic-${detail.image}`
    : null;

  const [favorite, setFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setFavorite(
      favoriteId ? isFavorite(favoriteId) : false
    );
  }, [favoriteId]);

  useEffect(() => {
    setImageError(false);
  }, [detail?.url]);

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

  function handleFavoriteClick() {
    if (!favoriteId) {
      return;
    }

    toggleFavorite({
      id: favoriteId,
      type: 'epic',
      title: `EPIC · Terra${
        time ? ` (${time} UTC)` : ''
      }`,
      date,
      imageUrl: url,
      hdUrl: url,
      description: caption,
    });

    setFavorite((currentValue) => !currentValue);
  }

  function handleImageKeyDown(event) {
    if (
      event.key === 'Enter' ||
      event.key === ' '
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
          {time ? `${time} UTC` : ''}
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
            onError={() => setImageError(true)}
          />
        )}

        <FavoriteButton
          active={favorite}
          onClick={handleFavoriteClick}
          size={18}
          ariaLabel={
            favorite
              ? 'Remover dos favoritos'
              : 'Adicionar aos favoritos'
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
