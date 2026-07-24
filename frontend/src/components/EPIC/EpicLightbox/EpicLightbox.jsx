import { useRef, useState } from "react";

import { useModalA11y } from "../../../hooks/UseModalA11y";

import "./EpicLightbox.css";

export default function EpicLightbox({
  photo,
  onClose,
}) {
  const closeButtonRef = useRef(null);

  const [failedImageUrl, setFailedImageUrl] =
    useState("");

  const imageUrl =
    typeof photo?.url === "string"
      ? photo.url
      : "";

  const imageError =
    !imageUrl ||
    failedImageUrl === imageUrl;

  function handleClose() {
    if (typeof onClose === "function") {
      onClose();
    }
  }

  const containerRef = useModalA11y({
    isOpen: Boolean(photo),
    onClose: handleClose,
    initialFocusRef: closeButtonRef,
  });

  if (!photo) {
    return null;
  }

  const caption =
    photo.caption ||
    "Imagem da Terra captada pela câmara EPIC da NASA";

  return (
    <div
      className="epic-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby="epic-lightbox-title"
      aria-describedby={
        photo.caption
          ? "epic-lightbox-description"
          : undefined
      }
      onClick={handleClose}
      ref={containerRef}
    >
      <div
        className="epic-lightbox__content"
        onClick={(event) => {
          event.stopPropagation();
        }}
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
          onClick={handleClose}
        >
          ×
        </button>

        {imageError ? (
          <div
            className="epic-lightbox__fallback"
            role="img"
            aria-label="A imagem EPIC ampliada não está disponível"
          >
            <strong>Imagem indisponível</strong>

            <span>
              Não foi possível carregar esta captura da Terra.
            </span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={caption}
            decoding="async"
            onError={() => {
              setFailedImageUrl(imageUrl);
            }}
          />
        )}

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