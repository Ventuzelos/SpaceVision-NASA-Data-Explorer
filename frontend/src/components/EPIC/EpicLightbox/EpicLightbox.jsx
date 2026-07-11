import { useEffect, useRef } from 'react';
import './EpicLightbox.css';

export default function EpicLightbox({ photo, onClose }) {
  const closeButtonRef = useRef(null);
  const lightboxRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!photo) {
      return undefined;
    }

    previousFocusRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      className="epic-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby="epic-lightbox-title"
      aria-describedby="epic-lightbox-description"
      onClick={onClose}
      ref={lightboxRef}
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
