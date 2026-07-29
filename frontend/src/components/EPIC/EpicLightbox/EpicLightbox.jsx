import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useModalA11y } from "../../../hooks/UseModalA11y";

import "./EpicLightbox.css";

export default function EpicLightbox({
  photo,
  onClose,
}) {
  const { t, i18n } = useTranslation();

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

  const isEnglish =
    i18n.resolvedLanguage?.startsWith("en");

  const originalCaption =
    photo.original_caption ||
    photo.originalCaption ||
    photo.caption ||
    "";

  const translatedCaption =
    photo.translated_caption ||
    photo.translatedCaption ||
    originalCaption;

  const caption = isEnglish
    ? originalCaption ||
      translatedCaption ||
      t("epic.lightbox.defaultCaption")
    : translatedCaption ||
      originalCaption ||
      t("epic.lightbox.defaultCaption");

  return (
    <div
      className="epic-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby="epic-lightbox-title"
      aria-describedby={
        caption
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
          {t("epic.lightbox.title")}
        </h2>

        <button
          ref={closeButtonRef}
          className="epic-lightbox__close"
          type="button"
          aria-label={t(
            "epic.lightbox.closeAria"
          )}
          onClick={handleClose}
        >
          ×
        </button>

        {imageError ? (
          <div
            className="epic-lightbox__fallback"
            role="img"
            aria-label={t(
              "epic.lightbox.imageUnavailableAria"
            )}
          >
            <strong>
              {t(
                "epic.lightbox.imageUnavailable"
              )}
            </strong>

            <span>
              {t(
                "epic.lightbox.imageLoadError"
              )}
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

        {caption && (
          <p
            id="epic-lightbox-description"
            className="epic-lightbox__caption"
          >
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}