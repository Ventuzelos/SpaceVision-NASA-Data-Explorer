// Componente "folha" desenha uma unica miniatura EPIC.
// Nao sabe nada sobre a lista toda, so sobre a sua propria foto.

import { buildThumbUrl, buildImageUrl } from '../../services/epicService';

const wrapStyle = {
  position: 'relative',
  aspectRatio: '1 / 1',
  width: '100%',
  borderRadius: '10px',
  overflow: 'hidden',
  cursor: 'pointer',
  border: '1px solid var(--line-strong, rgba(255,255,255,0.15))',
  background: 'var(--panel-2, #101d3c)',
};

const imgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const timeLabelStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'rgba(0,0,0,0.6)',
  padding: '4px 6px',
  fontFamily: 'var(--font-family)',
  fontSize: '9px',
  color: 'var(--color-accent)',
};

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
      style={wrapStyle}
      onClick={handleClick}
      title={photo.caption || ''}
    >
      <img
        className="rover-img"
        style={imgStyle}
        src={thumbUrl}
        alt={photo.image}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fullUrl;
          e.currentTarget.style.objectFit = 'contain';
        }}
      />
      <div style={timeLabelStyle}>
        {time} UTC
      </div>
    </div>
  );
}