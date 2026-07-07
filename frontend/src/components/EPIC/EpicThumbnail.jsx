// Componente "folha" desenha uma unica miniatura EPIC.
// Nao sabe nada sobre a lista toda, so sobre a sua propria foto.

import { buildThumbUrl, buildImageUrl } from '../../services/epicService';

export default function EpicThumbnail({ photo, date, onSelect }) {
  const thumbUrl = buildThumbUrl(photo, date);
  const fullUrl = buildImageUrl(photo, date);
  const time = photo.date ? photo.date.split(' ')[1]?.substring(0, 5) : '';

  const handleClick = () => {
    onSelect({
      url: fullUrl,
      caption: photo.caption || photo.image,
      time,
      lat: photo.centroid_coordinates?.lat?.toFixed(1) || '',
      lon: photo.centroid_coordinates?.lon?.toFixed(1) || '',
    });
  };

  return (
    <div
      className="rover-img-wrap"
      onClick={handleClick}
      title={photo.caption || ''}
      style={{ position: 'relative' }}
    >
      <img
        className="rover-img"
        src={thumbUrl}
        alt={photo.image}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fullUrl;
          e.currentTarget.style.objectFit = 'contain';
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.6)',
          padding: '4px 6px',
          fontFamily: 'var(--mono)',
          fontSize: '9px',
          color: 'var(--cyan)',
        }}
      >
        {time} UTC
      </div>
    </div>
  );
}