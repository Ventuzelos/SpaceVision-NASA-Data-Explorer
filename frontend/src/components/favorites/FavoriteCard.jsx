import { useTranslation } from "react-i18next";

import Button from "../common/Button/Button";

import "./FavoriteCard.css";

function getLocalizedTitle(
  favorite,
  language
) {
  const favoriteData =
    favorite?.data || {};

  const isEnglish =
    language?.startsWith("en");

  if (isEnglish) {
    return (
      favoriteData.originalTitle ||
      favoriteData.original_title ||
      favoriteData.title ||
      favorite.title ||
      ""
    );
  }

  return (
    favoriteData.translatedTitle ||
    favoriteData.translated_title ||
    favoriteData.title ||
    favorite.title ||
    favoriteData.originalTitle ||
    favoriteData.original_title ||
    ""
  );
}

function localizeSavedTitle(
  title,
  language
) {
  const value = String(
    title || ""
  );

  const isEnglish =
    language?.startsWith("en");

  if (isEnglish) {
    return value
      .replace(
        /\bTerra\b/gi,
        "Earth"
      )
      .replace(
        /\bSol\b/gi,
        "Sun"
      )
      .replace(
        /\bLua\b/gi,
        "Moon"
      );
  }

  return value
    .replace(
      /\bEarth\b/gi,
      "Terra"
    )
    .replace(
      /\bSun\b/gi,
      "Sol"
    )
    .replace(
      /\bMoon\b/gi,
      "Lua"
    );
}

function FavoriteCard({
  favorite,
  onRemove,
  onView,
}) {
  const { t, i18n } =
    useTranslation();

  const favoriteData =
    favorite?.data || {};

  const locale =
    i18n.resolvedLanguage?.startsWith(
      "en"
    )
      ? "en-GB"
      : "pt-PT";

  const rawDate =
    favoriteData.date ||
    favoriteData.event_date ||
    favoriteData.eventDate ||
    favorite.created_at ||
    null;

  let formattedDate = t(
    "favoriteCard.dateUnavailable"
  );

  if (rawDate) {
    const parsedDate =
      new Date(rawDate);

    if (
      !Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      formattedDate =
        parsedDate.toLocaleDateString(
          locale,
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        );
    }
  }

  const rawFavoriteType =
    favorite.nasa_type ||
    favorite.source ||
    favorite.type ||
    favoriteData.nasa_type ||
    favoriteData.source ||
    favoriteData.type ||
    "nasa";

  const normalizedFavoriteType =
    String(
      rawFavoriteType
    ).toLowerCase();

  const favoriteType = t(
    `favoriteCard.types.${normalizedFavoriteType}`,
    {
      defaultValue:
        String(
          rawFavoriteType
        ).toUpperCase(),
    }
  );

  const rawTitle =
    getLocalizedTitle(
      favorite,
      i18n.resolvedLanguage
    );

  const title =
    localizeSavedTitle(
      rawTitle,
      i18n.resolvedLanguage
    ) ||
    t(
      "favoriteCard.untitled"
    );

  return (
    <article
      className="favorite-card"
      aria-labelledby={`favorite-title-${favorite.id}`}
    >
      <div className="favorite-card__content">
        <span className="favorite-card__type">
          {favoriteType}
        </span>

        <h2
          id={`favorite-title-${favorite.id}`}
        >
          {title}
        </h2>

        <p>
          {formattedDate}
        </p>

        <div className="favorite-card__actions">
          <Button
            type="button"
            onClick={() =>
              onView(favorite)
            }
            aria-label={t(
              "favoriteCard.actions.viewAria",
              {
                title,
              }
            )}
          >
            {t(
              "favoriteCard.actions.view"
            )}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              onRemove(
                favorite.id
              )
            }
            aria-label={t(
              "favoriteCard.actions.removeAria",
              {
                title,
              }
            )}
          >
            {t(
              "favoriteCard.actions.remove"
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}

export default FavoriteCard;