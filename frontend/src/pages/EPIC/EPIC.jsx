import React from 'react';
import EpicPanel from './EpicPanel';

function EPIC() {
  // Placeholder temporário para abrir o Lightbox partilhado
  const handleOpenLightbox = (src, caption) => {
    console.log('Abrir lightbox:', src, caption);
  };

  return (
    <div className="wrap">
      <h1>Earth Polychromatic Imaging Camera</h1>
      
      {/* O EpicPanel trata do loading interno e renderiza o EPICSkeleton se necessário */}
      <EpicPanel onOpenLightbox={handleOpenLightbox} />
    </div>
  );
}

export default EPIC;
