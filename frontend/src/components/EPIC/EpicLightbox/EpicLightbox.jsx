import { useEffect, useRef } from 'react';
import './EpicLightbox.css';

export default function EpicLightbox({ photo, onClose }) {
  const lightboxRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!photo) return undefined;

    previousFocusRef.current = document.activeElement;
    lightboxRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
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
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption || 'Imagem EPIC ampliada'}
      tabIndex={-1}
      ref={lightboxRef}
    >
      <img src={photo.url} alt={photo.caption || ''} />
    </div>
  );
}
