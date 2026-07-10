// Cartão de detalhe — mostra a imagem completa da Terra (2048x2048)
// junto com legenda e coordenadas do centro visível.

import { useState, useEffect } from 'react';
import FavoriteButton from '../common/FavoriteButton/FavoriteButton';
import { isFavorite, toggleFavorite } from '../../services/favoritesService';

export default function EpicCard({ detail, onImageClick }) {
  const favoriteId = detail?.image ? `epic-${detail.image}` : null;
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(favoriteId ? isFavorite(favoriteId) : false);
  }, [favoriteId]);

  if (!detail) return null;

  const { url, caption, time, lat, lon, date } = detail;

  function handleFavoriteClick() {
    if (!favoriteId) return;
    toggleFavorite({
      id: favoriteId,
      type: 'epic',
      title: `EPIC · Terra${time ? ` (${time} UTC)` : ''}`,
      date,
      imageUrl: url,
      hdUrl: url,
      description: caption,
    });
    setFavorite((f) => !f);
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Terra — Disco Completo</span>
        <span className="card-label">{time ? `${time} UTC` : ''}</span>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div className="card-image-wrap" style={{ width: '100%', maxWidth: '640px' }}>
          <img
            src={url}
            alt={caption}
            onClick={onImageClick}
            style={{
              width: '100%',
              borderRadius: 'var(--radius-md)',
              display: 'block',
              cursor: 'zoom-in',
            }}
          />
          <FavoriteButton
            active={favorite}
            onClick={handleFavoriteClick}
            size={18}
            ariaLabel={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          />
        </div>
        <div
          style={{
            marginTop: '12px',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-family)',
          }}
        >
          {caption && <div style={{ marginBottom: '6px' }}>{caption}</div>}
          {lat && lon && (
            <div>Centro visível: {lat}° lat · {lon}° lon</div>
          )}
          <div style={{ marginTop: '6px', color: 'var(--color-text-secondary)' }}>
            Formato PNG 2048×2048 px
          </div>
        </div>
      </div>
    </div>
  );
}
