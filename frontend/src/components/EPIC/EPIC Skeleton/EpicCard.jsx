import React from 'react';
import { buildEpicUrls } from '../../services/epicService';
import './EpicCard.css';

export default function EpicCard({ photo, date, onOpenLightbox }) {
  if (!photo) return null;

  // Utiliza a lógica do seu serviço original
  const { full } = buildEpicUrls(photo, date);
  const time = photo.date?.split(' ')[1]?.substring(0, 5) ?? '';
  const lat = photo.centroid_coordinates?.lat?.toFixed(1) || 'N/A';
  const lon = photo.centroid_coordinates?.lon?.toFixed(1) || 'N/A';

  return (
    <article className="epic-card">
      {/* Cabeçalho do Cartão */}
      <div className="epic-card__header" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', marginBottom: '-16px' }}>
        <span>Terra — Disco Completo</span>
        <span>{time} UTC</span>
      </div>

      {/* Média / Imagem da Terra */}
      <div className="epic-card__media">
        <img
          src={full}
          alt={photo.caption || photo.image}
          onClick={() => onOpenLightbox(full, photo.caption)}
          style={{ cursor: 'zoom-in' }}
        />
      </div>

      {/* Conteúdo e Detalhes */}
      <div className="epic-card__content">
        {photo.caption && <h2>{photo.caption}</h2>}
        
        <div className="epic-card__badges">
          <span className="badge">Satélite: DSCOVR</span>
          <span className="badge">ID: {photo.identifier}</span>
        </div>

        <div className="epic-card__meta">
          <p><strong>Centro visível:</strong> {lat}° lat · {lon}° lon</p>
          <p><strong>Data da Captura:</strong> {date}</p>
        </div>
      </div>
    </article>
  );
}
