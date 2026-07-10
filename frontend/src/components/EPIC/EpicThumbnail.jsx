import { useState } from 'react';
import { Clock } from 'lucide-react';
import { buildThumbUrl, buildImageUrl } from '../../services/epicService';
import FavoriteButton from '../common/FavoriteButton/FavoriteButton';
import { isFavorite, toggleFavorite } from '../../services/favoritesService';

// Componente "folha" desenha uma unica miniatura EPIC.
// Nao sabe nada sobre a lista toda, so sobre a sua propria foto.
export default function EpicThumbnail({ photo, date, onSelect }) {
  const thumbUrl = buildThumbUrl(photo, date);
  const fullUrl = buildImageUrl(photo, date);
  const time = photo.date ? photo.date.split(' ')[1]?.substring(0, 5) : '';

  const favoriteId = `epic-${photo.image}`;
  const [favorite, setFavorite] = useState(isFavorite(favoriteId));

  const handleSelect = () => {
    onSelect({
      image: photo.image,
      date,
      url: fullUrl,
      caption: photo.caption || `Vista completa da Terra captada pela EPIC${time ? ` às ${time} UTC` : ''}`,
      time,
      lat: photo.centroid_coordinates?.lat?.toFixed(1) || '',
      lon: photo.centroid_coordinates?.lon?.toFixed(1) || '',
    });
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite({
      id: favoriteId,
      type: 'epic',
      title: `EPIC · Terra${time ? ` (${time} UTC)` : ''}`,
      date,
      imageUrl: fullUrl,
      hdUrl: fullUrl,
      description: photo.caption || '',
    });
    setFavorite((f) => !f);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect();
    }
  };

  return (
    <div
      className="thumb"
      title={photo.caption || ''}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={photo.caption || `Imagem EPIC ${time ? `às ${time} UTC` : ''}`}
    >
      <img
        src={thumbUrl}
        alt=""
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fullUrl;
          e.currentTarget.style.objectFit = 'contain';
        }}
      />
      <div className="thumb-badge">
        <Clock size={10} />
        {time}
      </div>
      <FavoriteButton
        active={favorite}
        onClick={handleFavoriteClick}
        size={12}
        ariaLabel={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      />
    </div>
  );
}
