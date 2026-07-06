import React from 'react';
import EpicCard from './EpicCard';

export default function EpicDetail({ photo, date, onOpenLightbox }) {
  return (
    <div className="epic-detail-container">
      <EpicCard 
        photo={photo} 
        date={date} 
        onOpenLightbox={onOpenLightbox} 
      />
    </div>
  );
}
