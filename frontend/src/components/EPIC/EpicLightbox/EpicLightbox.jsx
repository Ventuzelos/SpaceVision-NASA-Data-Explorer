import { useRef } from 'react';
import { useModalA11y } from '../../../hooks/UseModalA11y';
import './EpicLightbox.css';

export default function EpicLightbox({ photo, onClose }) {
  const closeButtonRef = useRef(null);
  const containerRef = useModalA11y({
    isOpen: Boolean(photo),
    onClose,
    initialFocusRef: closeButtonRef,
  });

  if (!photo) return null;

  return (
    <div
      className="epic-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby="epic-lightbox-title"
      aria-describedby="epic-lightbox-description"
      onClick={onClose}
      ref={containerRef}
    >
      <div
        className="epic-lightbox__content"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="epic-lightbox-title"
          className="sr-only"
        >
          Imagem EPIC ampliada
        </h2>

        <button
          ref={closeButtonRef}
          className="epic-lightbox__close"
          type="button"
          aria-label="Fechar imagem ampliada"
          onClick={onClose}
        >
          ×
        </button>

        <img
          src={photo.url}
          alt={photo.caption || 'Imagem da Terra'}
        />

        {photo.caption && (
          <p
            id="epic-lightbox-description"
            className="epic-lightbox__caption"
          >
            {photo.caption}
          </p>
        )}
      </div>
    </div>
  );
}