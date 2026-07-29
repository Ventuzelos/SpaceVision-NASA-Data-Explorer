import { useTranslation } from "react-i18next";

import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";
import Icon from "../../common/Icon/Icon";

import "./EventCard.css";

function formatShortDate(
  value,
  locale,
  unavailableText
) {
  if (!value) {
    return unavailableText;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return unavailableText;
  }

  return parsed.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMetaValue(
  item,
  locale,
  unavailableText
) {
  if (
    item?.value === null ||
    item?.value === undefined ||
    item?.value === ""
  ) {
    return unavailableText;
  }

  if (item.valueType === "dateTime") {
    const parsed = new Date(item.value);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return unavailableText;
    }

    return parsed.toLocaleString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return item.value;
}

function EventCard({
  event,
  isFavorite,
  isFavoriteLoading,
  onToggleFavorite,
  onViewDetails,
}) {
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage?.startsWith("en")
      ? "en-GB"
      : "pt-PT";

  const title =
    event?.title ||
    (event?.titleKey
      ? t(
          event.titleKey,
          event.titleOptions
        )
      : t("donki.defaultEventTitle"));

  const metaItems = Array.isArray(
    event?.meta
  )
    ? event.meta.slice(0, 2)
    : [];

  function handleFavoriteClick() {
    if (
      typeof onToggleFavorite === "function"
    ) {
      onToggleFavorite(event);
    }
  }

  function handleViewDetails() {
    if (
      typeof onViewDetails === "function"
    ) {
      onViewDetails(event);
    }
  }

  return (
    <article className="event-card">
      <div className="event-card__header">
        <div>
          <h3 className="event-card__title">
            {title}
          </h3>

          <p className="event-card__date">
            <Icon
              name="Calendar"
              size={15}
              aria-hidden="true"
            />

            {formatShortDate(
              event?.date,
              locale,
              t(
                "donki.eventCard.dateUnavailable"
              )
            )}
          </p>
        </div>

        <FavoriteButton
          active={Boolean(isFavorite)}
          disabled={Boolean(
            isFavoriteLoading
          )}
          onClick={handleFavoriteClick}
          ariaLabel={
            isFavorite
              ? t(
                  "donki.eventCard.removeFavorite",
                  {
                    title,
                  }
                )
              : t(
                  "donki.eventCard.addFavorite",
                  {
                    title,
                  }
                )
          }
        />
      </div>

      {event?.badge && (
        <span className="event-card__badge">
          {event.badge}
        </span>
      )}

      {metaItems.length > 0 && (
        <ul className="event-card__meta">
          {metaItems.map(
            (item, index) => (
              <li
                key={`${
                  item.labelKey ||
                  item.label
                }-${index}`}
              >
                <span>
                  {item.labelKey
                    ? t(item.labelKey)
                    : item.label ||
                      t(
                        "donki.eventCard.information"
                      )}
                </span>

                <strong>
                  {formatMetaValue(
                    item,
                    locale,
                    t(
                      "common.notAvailable"
                    )
                  )}
                </strong>
              </li>
            )
          )}
        </ul>
      )}

      <div className="event-card__actions">
        <button
          type="button"
          className="event-card__link"
          onClick={handleViewDetails}
          aria-label={t(
            "donki.eventCard.viewDetailsAria",
            {
              title,
            }
          )}
        >
          {t(
            "donki.eventCard.viewDetails"
          )}

          <Icon
            name="ArrowRight"
            size={16}
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
}

export default EventCard;