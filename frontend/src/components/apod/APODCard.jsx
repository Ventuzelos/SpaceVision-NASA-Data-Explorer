import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "../common/Button/Button";
import Toast from "../common/Toast/Toast";
import Icon from "../common/Icon/Icon";
import FavoriteButton from "../common/FavoriteButton/FavoriteButton";

import useAuth from "../../hooks/useAuth";
import isSafeUrl from "../../utils/isSafeUrl";

import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../../services/favoritesService";

import "./APODCard.css";

function formatApodDate(date, locale, unavailableText) {
  if (!date) {
    return unavailableText;
  }

  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) {
    return date;
  }

  return new Date(year, month - 1, day).toLocaleDateString(
    locale,
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function APODCard({ apod }) {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, isAuthLoading } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [favoriteDatabaseId, setFavoriteDatabaseId] =
    useState(null);
  const [isFavoriteLoading, setIsFavoriteLoading] =
    useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const toastTimeoutRef = useRef(null);

  const currentLanguage =
    i18n.resolvedLanguage?.startsWith("en")
      ? "en"
      : "pt";

  const dateLocale =
    currentLanguage === "en" ? "en-GB" : "pt-PT";

  const favoriteId = `apod-${apod.date}`;

  const formattedDate = formatApodDate(
    apod.date,
    dateLocale,
    t("apodCard.dateUnavailable")
  );

  const isImage = apod.media_type === "image";
  const mediaUrl = isSafeUrl(apod.url) ? apod.url : null;
  const hdUrl = isSafeUrl(apod.hdurl) ? apod.hdurl : null;

  const originalTitle =
    apod.original_title ||
    apod.title ||
    t("apodCard.defaultTitle");

  const originalExplanation =
    apod.original_explanation ||
    apod.explanation ||
    "";

  const displayTitle =
    currentLanguage === "pt"
      ? apod.translated_title ||
        originalTitle
      : originalTitle;

  const displayExplanation =
    currentLanguage === "pt"
      ? apod.translated_explanation ||
        originalExplanation
      : originalExplanation;

  const hasAutomaticTranslation =
    currentLanguage === "pt" &&
    Boolean(apod.translated_explanation) &&
    apod.translated_explanation !== originalExplanation;

  useEffect(() => {
    let isMounted = true;

    if (isAuthLoading || !isAuthenticated) {
      return undefined;
    }

    async function checkFavorite() {
      try {
        const favorites = await getFavorites("apod");

        const existingFavorite = favorites.find((item) => {
          const itemId = item.nasa_id || item.id;

          return String(itemId) === String(favoriteId);
        });

        if (!isMounted) {
          return;
        }

        setFavorite(Boolean(existingFavorite));
        setFavoriteDatabaseId(existingFavorite?.id || null);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error(
            "Error checking favorite:",
            error
          );
        }

        if (isMounted) {
          setFavorite(false);
          setFavoriteDatabaseId(null);
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

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  function showToast(message) {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setToastMessage(message);

    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage("");
      toastTimeoutRef.current = null;
    }, 2500);
  }

  async function handleFavoriteClick() {
    if (!isAuthenticated) {
      showToast(
        t("apodCard.favorites.loginRequired")
      );
      return;
    }

    if (isFavoriteLoading) {
      return;
    }

    try {
      setIsFavoriteLoading(true);

      if (favorite && favoriteDatabaseId) {
        await removeFavorite(favoriteDatabaseId);

        setFavorite(false);
        setFavoriteDatabaseId(null);

        showToast(
          t("apodCard.favorites.removed")
        );
        return;
      }

      const favoriteItem = {
        nasa_type: "apod",
        nasa_id: favoriteId,
        title: displayTitle,
        image_url: isImage
          ? hdUrl || mediaUrl
          : null,

        data: {
          ...apod,
          image_url: isImage
            ? hdUrl || mediaUrl
            : null,
        },
      };

      const createdFavorite =
        await addFavorite(favoriteItem);

      setFavorite(true);
      setFavoriteDatabaseId(createdFavorite.id);

      showToast(
        t("apodCard.favorites.added")
      );
    } catch (error) {
      console.error(
        "Error updating favorite:",
        error
      );

      if (error.response?.status === 401) {
        showToast(
          t("apodCard.favorites.loginRequired")
        );
      } else {
        showToast(
          t("apodCard.favorites.updateError")
        );
      }
    } finally {
      setIsFavoriteLoading(false);
    }
  }

  return (
    <article className="apod-card">
      <div className="apod-card__media">
        {!mediaUrl && (
          <div
            className="apod-card__media-error"
            role="status"
          >
            <Icon
              name="ImageOff"
              size={32}
              aria-hidden="true"
            />

            <p>
              {t("apodCard.mediaUnavailable")}
            </p>
          </div>
        )}

        {mediaUrl && isImage && (
          <img
            src={mediaUrl}
            alt={
              displayTitle ||
              t("apodCard.imageAlt")
            }
            loading="lazy"
            decoding="async"
          />
        )}

        {mediaUrl && !isImage && (
          <iframe
            src={mediaUrl}
            title={
              displayTitle ||
              t("apodCard.videoTitle")
            }
            loading="lazy"
            allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>

      <div className="apod-card__content">
        <div className="apod-card__header">
          <h2>{displayTitle}</h2>

          <FavoriteButton
            active={isAuthenticated && favorite}
            onClick={handleFavoriteClick}
            disabled={
              isFavoriteLoading || isAuthLoading
            }
            ariaLabel={
              favorite
                ? t("apodCard.favorites.removeLabel")
                : t("apodCard.favorites.addLabel")
            }
          />
        </div>

        <div className="apod-card__badges">
          <span className="badge">
            <Icon
              name="Calendar"
              size={16}
              aria-hidden="true"
            />

            {formattedDate}
          </span>

          {apod.copyright && (
            <span className="badge">
              <Icon
                name="Copyright"
                size={16}
                aria-hidden="true"
              />

              {apod.copyright}
            </span>
          )}

          <span className="badge">
            <Icon
              name={isImage ? "Image" : "Video"}
              size={16}
              aria-hidden="true"
            />

            {isImage
              ? t("apodCard.mediaType.image")
              : t("apodCard.mediaType.video")}
          </span>
        </div>

        {displayExplanation ? (
          <>
            <p
              className={
                isExpanded
                  ? "apod-card__text"
                  : "apod-card__text apod-card__text--collapsed"
              }
            >
              {displayExplanation}
            </p>

            {hasAutomaticTranslation && (
              <p className="apod-card__translation-note">
                {t("apodCard.translationNote")}
              </p>
            )}

            <div className="apod-card__actions">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsExpanded(
                    (current) => !current
                  );
                }}
                aria-expanded={isExpanded}
              >
                {isExpanded
                  ? t("apodCard.showLess")
                  : t("apodCard.readMore")}
              </Button>

              {isImage && hdUrl && (
                <a
                  href={hdUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apod-card__hd-link"
                >
                  <Button>
                    <Icon
                      name="ExternalLink"
                      size={16}
                      aria-hidden="true"
                    />

                    {t("apodCard.viewHdImage")}
                  </Button>

                  <span className="sr-only">
                    {t("apodCard.opensNewWindow")}
                  </span>
                </a>
              )}
            </div>
          </>
        ) : (
          <p className="apod-card__text">
            {t("apodCard.explanationUnavailable")}
          </p>
        )}
      </div>

      <Toast message={toastMessage} />
    </article>
  );
}

export default APODCard;