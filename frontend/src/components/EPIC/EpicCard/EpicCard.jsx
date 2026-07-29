import {
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";

import useAuth from "../../../hooks/useAuth";

import {
  isFavorite,
  toggleFavorite,
} from "../../../services/favoritesService";

import "./EpicCard.css";

function hasCoordinate(value) {
  return (
    value !== null &&
    value !== undefined &&
    value !== ""
  );
}

export default function EpicCard({
  detail,
  onImageClick,
}) {
  const { t, i18n } = useTranslation();

  const {
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  const favoriteId = detail?.image
    ? `epic-${detail.image}`
    : "";

  const [favorite, setFavorite] =
    useState(false);

  const [
    isFavoriteLoading,
    setIsFavoriteLoading,
  ] = useState(false);

  const [
    failedImageUrl,
    setFailedImageUrl,
  ] = useState("");

  const imageUrl =
    typeof detail?.url === "string"
      ? detail.url
      : "";

  const imageError =
    !imageUrl ||
    failedImageUrl === imageUrl;

  const isEnglish =
    i18n.resolvedLanguage?.startsWith(
      "en"
    );

  useEffect(() => {
    let isMounted = true;

    if (
      isAuthLoading ||
      !isAuthenticated ||
      !favoriteId
    ) {
      return undefined;
    }

    async function checkFavorite() {
      try {
        const result = await isFavorite(
          favoriteId,
          "epic"
        );

        if (isMounted) {
          setFavorite(
            Boolean(result)
          );
        }
      } catch (error) {
        if (
          error.response?.status !== 401
        ) {
          console.error(
            "Error checking EPIC favorite:",
            error
          );
        }

        if (isMounted) {
          setFavorite(false);
        }
      }
    }

    checkFavorite();

    return () => {
      isMounted = false;
    };
  }, [
    favoriteId,
    isAuthenticated,
    isAuthLoading,
  ]);

  if (!detail) {
    return null;
  }

  const {
    caption,
    time,
    lat,
    lon,
    date,
  } = detail;

  const originalCaption =
    detail.original_caption ||
    detail.originalCaption ||
    caption ||
    "";

  const translatedCaption =
    detail.translated_caption ||
    detail.translatedCaption ||
    originalCaption;

  const hasAutomaticTranslation =
    Boolean(
      translatedCaption &&
        originalCaption &&
        translatedCaption !==
          originalCaption
    );

  const displayCaption = isEnglish
    ? originalCaption ||
      translatedCaption
    : translatedCaption ||
      originalCaption;

  const accessibleCaption =
    displayCaption ||
    t("epic.card.defaultCaption");

  function handleOpenImage() {
    if (
      imageError ||
      typeof onImageClick !== "function"
    ) {
      return;
    }

    onImageClick();
  }

  async function handleFavoriteClick() {
    if (!isAuthenticated) {
      window.dispatchEvent(
        new CustomEvent(
          "epicFavoriteError",
          {
            detail: {
              status: 401,
            },
          }
        )
      );

      return;
    }

    if (
      !favoriteId ||
      !imageUrl ||
      isFavoriteLoading
    ) {
      return;
    }

    try {
      setIsFavoriteLoading(true);

      const result =
        await toggleFavorite({
          id: favoriteId,
          nasa_id: favoriteId,
          source: "epic",
          type: "epic",
          nasa_type: "epic",

          title: t(
            "epic.card.favoriteTitle",
            {
              time: time
                ? ` (${time} UTC)`
                : "",
            }
          ),

          date,

          imageUrl,
          image_url: imageUrl,
          hdUrl: imageUrl,
          description:
            accessibleCaption,

          data: {
            ...detail,
            date,
            time,
            caption:
              accessibleCaption,
            original_caption:
              originalCaption,
            translated_caption:
              translatedCaption,
            image: detail.image,
            image_url: imageUrl,
            url: imageUrl,
            hd_url: imageUrl,
            latitude: lat,
            longitude: lon,

            centroid_coordinates: {
              lat,
              lon,
            },
          },
        });

      setFavorite(
        Boolean(result.isFavorite)
      );

      window.dispatchEvent(
        new CustomEvent(
          "epicFavoriteUpdated",
          {
            detail: {
              isFavorite:
                result.isFavorite,
            },
          }
        )
      );
    } catch (error) {
      console.error(
        "Error updating EPIC favorite:",
        error
      );

      window.dispatchEvent(
        new CustomEvent(
          "epicFavoriteError",
          {
            detail: {
              status:
                error.response?.status,
            },
          }
        )
      );
    } finally {
      setIsFavoriteLoading(false);
    }
  }

  function handleImageKeyDown(event) {
    if (
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    event.preventDefault();
    handleOpenImage();
  }

  return (
    <article className="epic-card">
      <div className="epic-card__header">
        <h3 className="epic-card__title">
          {t("epic.card.title")}
        </h3>

        {time && (
          <span className="epic-card__time">
            {time} UTC
          </span>
        )}
      </div>

      <div className="epic-card__image-wrapper">
        {imageError ? (
          <div
            className="epic-card__fallback"
            role="img"
            aria-label={t(
              "epic.card.imageUnavailableAria"
            )}
          >
            <strong>
              {t(
                "epic.card.imageUnavailable"
              )}
            </strong>

            <span>
              {t(
                "epic.card.imageLoadError"
              )}
            </span>
          </div>
        ) : (
          <img
            className="epic-card__image"
            src={imageUrl}
            alt={accessibleCaption}
            role="button"
            tabIndex={0}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            aria-label={t(
              "epic.card.openImageAria",
              {
                caption:
                  accessibleCaption,
              }
            )}
            onClick={
              handleOpenImage
            }
            onKeyDown={
              handleImageKeyDown
            }
            onError={() => {
              setFailedImageUrl(
                imageUrl
              );
            }}
          />
        )}

        <FavoriteButton
          active={
            isAuthenticated &&
            favorite
          }
          onClick={
            handleFavoriteClick
          }
          disabled={
            isFavoriteLoading ||
            isAuthLoading ||
            !favoriteId ||
            !imageUrl
          }
          size={18}
          ariaLabel={
            favorite
              ? t(
                  "epic.card.removeFavorite"
                )
              : t(
                  "epic.card.addFavorite"
                )
          }
        />
      </div>

      <div className="epic-card__metadata">
        {displayCaption && (
          <>
            <p className="epic-card__caption">
              {displayCaption}
            </p>

            {!isEnglish &&
              hasAutomaticTranslation && (
                <p className="epic-card__translation-note">
                  {t(
                    "epic.card.translationNote"
                  )}
                </p>
              )}
          </>
        )}

        {hasCoordinate(lat) &&
          hasCoordinate(lon) && (
            <p>
              {t(
                "epic.card.visibleCenter",
                {
                  lat,
                  lon,
                }
              )}
            </p>
          )}

        <p>
          {t("epic.card.format")}
        </p>
      </div>
    </article>
  );
}