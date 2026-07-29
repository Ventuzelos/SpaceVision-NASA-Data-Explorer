import {
  useEffect,
  useRef,
  useState,
} from "react";
import { PlayCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";
import Toast from "../../common/Toast/Toast";

import useAuth from "../../../hooks/useAuth";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../../../services/favoritesService";

import "./APODHistoryCard.css";

function formatApodHistoryDate(
  date,
  locale
) {
  if (!date) {
    return "";
  }

  const [year, month, day] =
    date
      .split("-")
      .map(Number);

  if (
    !year ||
    !month ||
    !day
  ) {
    return date;
  }

  const parsedDate = new Date(
    year,
    month - 1,
    day
  );

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return new Intl.DateTimeFormat(
    locale,
    {
      day: "numeric",
      month: "short",
    }
  ).format(parsedDate);
}

function APODHistoryCard({
  item,
  active,
  onSelect,
}) {
  const { t, i18n } =
    useTranslation();

  const {
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  const [
    favorite,
    setFavorite,
  ] = useState(false);

  const [
    favoriteDatabaseId,
    setFavoriteDatabaseId,
  ] = useState(null);

  const [
    isFavoriteLoading,
    setIsFavoriteLoading,
  ] = useState(false);

  const [
    toastMessage,
    setToastMessage,
  ] = useState("");

  const toastTimeoutRef =
    useRef(null);

  const isEnglish =
    i18n.resolvedLanguage?.startsWith(
      "en"
    );

  const dateLocale = isEnglish
    ? "en-GB"
    : "pt-PT";

  const favoriteId = `apod-${item.date}`;

  const formattedDate =
    formatApodHistoryDate(
      item.date,
      dateLocale
    );

  const originalTitle =
    item.originalTitle ||
    item.original_title ||
    item.title_original ||
    item.title ||
    t(
      "apodHistoryCard.defaultTitle"
    );

  const translatedTitle =
    item.translatedTitle ||
    item.translated_title ||
    item.title_pt ||
    item.title ||
    originalTitle;

  const displayTitle = isEnglish
    ? originalTitle
    : translatedTitle;

  const originalExplanation =
    item.originalExplanation ||
    item.original_explanation ||
    item.explanation_original ||
    item.explanation ||
    "";

  const translatedExplanation =
    item.translatedExplanation ||
    item.translated_explanation ||
    item.explanation_pt ||
    item.explanation ||
    originalExplanation;

  const displayExplanation =
    isEnglish
      ? originalExplanation
      : translatedExplanation;

  useEffect(() => {
    let isMounted = true;

    if (
      isAuthLoading ||
      !isAuthenticated
    ) {
      return undefined;
    }

    async function checkFavorite() {
      try {
        const favorites =
          await getFavorites(
            "apod"
          );

        const existingFavorite =
          favorites.find(
            (favoriteItem) => {
              const itemId =
                favoriteItem.nasa_id ||
                favoriteItem.id;

              return (
                String(itemId) ===
                String(favoriteId)
              );
            }
          );

        if (!isMounted) {
          return;
        }

        setFavorite(
          Boolean(
            existingFavorite
          )
        );

        setFavoriteDatabaseId(
          existingFavorite?.id ||
            null
        );
      } catch (error) {
        if (
          error.response?.status !==
          401
        ) {
          console.error(
            "Erro ao verificar favorito:",
            error
          );
        }

        if (isMounted) {
          setFavorite(false);
          setFavoriteDatabaseId(
            null
          );
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
      if (
        toastTimeoutRef.current
      ) {
        window.clearTimeout(
          toastTimeoutRef.current
        );
      }
    };
  }, []);

  function showToast(message) {
    if (
      toastTimeoutRef.current
    ) {
      window.clearTimeout(
        toastTimeoutRef.current
      );
    }

    setToastMessage(message);

    toastTimeoutRef.current =
      window.setTimeout(() => {
        setToastMessage("");
        toastTimeoutRef.current =
          null;
      }, 2500);
  }

  async function handleFavoriteClick() {
    if (!isAuthenticated) {
      showToast(
        t(
          "apodCard.favorites.loginRequired"
        )
      );

      return;
    }

    if (isFavoriteLoading) {
      return;
    }

    try {
      setIsFavoriteLoading(true);

      if (
        favorite &&
        favoriteDatabaseId
      ) {
        await removeFavorite(
          favoriteDatabaseId
        );

        setFavorite(false);
        setFavoriteDatabaseId(
          null
        );

        showToast(
          t(
            "apodCard.favorites.removed"
          )
        );

        return;
      }

      const isImage =
        item.media_type ===
        "image";

      const favoriteItem = {
        nasa_type: "apod",
        nasa_id: favoriteId,
        title: displayTitle,

        image_url: isImage
          ? item.hdurl ||
            item.url
          : null,

        data: {
          ...item,
          title: displayTitle,
          explanation:
            displayExplanation,

          image_url: isImage
            ? item.hdurl ||
              item.url
            : null,
        },
      };

      const createdFavorite =
        await addFavorite(
          favoriteItem
        );

      setFavorite(true);

      setFavoriteDatabaseId(
        createdFavorite.id
      );

      showToast(
        t(
          "apodCard.favorites.added"
        )
      );
    } catch (error) {
      console.error(
        "Erro ao atualizar favorito:",
        error
      );

      if (
        error.response?.status ===
        401
      ) {
        showToast(
          t(
            "apodCard.favorites.loginRequired"
          )
        );
      } else {
        showToast(
          t(
            "apodCard.favorites.updateError"
          )
        );
      }
    } finally {
      setIsFavoriteLoading(false);
    }
  }

  function handleSelect() {
    if (
      typeof onSelect ===
      "function"
    ) {
      onSelect({
        ...item,
        title: displayTitle,
        explanation:
          displayExplanation,
      });
    }
  }

  return (
    <div
      className={`apod-history-card ${
        active
          ? "apod-history-card--active"
          : ""
      }`}
    >
      <button
        type="button"
        className="apod-history-card__trigger"
        onClick={handleSelect}
        aria-label={t(
          "apodHistoryCard.openItem",
          {
            title:
              displayTitle,
          }
        )}
      />

      <div className="apod-history-card__media">
        {item.media_type ===
        "image" ? (
          <img
            src={
              item.url ||
              item.hdurl
            }
            alt={
              displayTitle ||
              t(
                "apodHistoryCard.imageAlt"
              )
            }
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="apod-history-card__video">
            <PlayCircle
              size={42}
              aria-hidden="true"
            />

            <span>
              {t(
                "apodHistoryCard.video"
              )}
            </span>
          </div>
        )}
      </div>

      <div className="apod-history-card__overlay">
        <span className="apod-history-card__date">
          {formattedDate}
        </span>

        <h3 className="apod-history-card__title">
          {displayTitle}
        </h3>
      </div>

      <FavoriteButton
        className="apod-history-card__favorite"
        active={
          isAuthenticated &&
          favorite
        }
        onClick={
          handleFavoriteClick
        }
        disabled={
          isFavoriteLoading ||
          isAuthLoading
        }
        size={16}
        ariaLabel={
          favorite
            ? t(
                "apodCard.favorites.removeLabel"
              )
            : t(
                "apodCard.favorites.addLabel"
              )
        }
      />

      <Toast
        message={toastMessage}
      />
    </div>
  );
}

export default APODHistoryCard;