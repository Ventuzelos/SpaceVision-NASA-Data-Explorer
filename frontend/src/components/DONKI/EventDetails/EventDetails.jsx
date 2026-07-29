import { useRef } from "react";
import { useTranslation } from "react-i18next";

import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";
import Icon from "../../common/Icon/Icon";
import isSafeUrl from "../../../utils/isSafeUrl";
import { useModalA11y } from "../../../hooks/UseModalA11y";

import "./EventDetails.css";

function formatFullDate(
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

  return parsed.toLocaleString(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

function extractUrls(value) {
  if (!value) {
    return [];
  }

  return [
    ...new Set(
      value.match(
        /https?:\/\/[^\s]+/g
      ) || []
    ),
  ];
}

function EventDetails({
  event,
  isFavorite,
  isFavoriteLoading,
  onToggleFavorite,
  onBack,
}) {
  const { t, i18n } = useTranslation();

  const backButtonRef = useRef(null);

  const containerRef = useModalA11y({
    isOpen: Boolean(event),
    onClose: onBack,
    initialFocusRef: backButtonRef,
  });

  if (!event) {
    return null;
  }

  const isEnglish =
    i18n.resolvedLanguage?.startsWith("en");

  const locale = isEnglish
    ? "en-GB"
    : "pt-PT";

  const title =
    event.title ||
    (event.titleKey
      ? t(
          event.titleKey,
          event.titleOptions
        )
      : t("donki.defaultEventTitle"));

  const metaItems = Array.isArray(
    event.meta
  )
    ? event.meta
    : [];

  const originalBody =
    event.originalBody ||
    event.raw?.original_message_body ||
    event.raw?.messageBody ||
    null;

  const translatedBody =
    event.translatedBody ||
    event.body ||
    null;

  const displayBody =
    isEnglish
      ? originalBody ||
        translatedBody
      : translatedBody ||
        originalBody;

  const nasaLinks = extractUrls(
    originalBody ||
      translatedBody
  );

  return (
    <div
      className="event-details"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-details-title"
      onClick={onBack}
      ref={containerRef}
    >
      <div
        className="event-details__card"
        onClick={(clickEvent) => {
          clickEvent.stopPropagation();
        }}
      >
        <button
          ref={backButtonRef}
          type="button"
          className="event-details__back"
          onClick={onBack}
          aria-label={t(
            "donki.eventDetails.backAria"
          )}
        >
          <Icon
            name="ArrowLeft"
            size={18}
            aria-hidden="true"
          />

          {t(
            "donki.eventDetails.back"
          )}
        </button>

        <div className="event-details__header">
          <div>
            <h2
              id="event-details-title"
              className="event-details__title"
            >
              {title}
            </h2>

            <p className="event-details__date">
              {formatFullDate(
                event.date,
                locale,
                t(
                  "donki.eventDetails.dateUnavailable"
                )
              )}
            </p>
          </div>

          <div className="event-details__header-actions">
            {event.badge && (
              <span className="event-details__badge">
                {event.badge}
              </span>
            )}

            <FavoriteButton
              active={Boolean(isFavorite)}
              disabled={Boolean(
                isFavoriteLoading
              )}
              onClick={() => {
                if (
                  typeof onToggleFavorite ===
                  "function"
                ) {
                  onToggleFavorite(event);
                }
              }}
              ariaLabel={
                isFavorite
                  ? t(
                      "donki.eventDetails.removeFavorite",
                      {
                        title,
                      }
                    )
                  : t(
                      "donki.eventDetails.addFavorite",
                      {
                        title,
                      }
                    )
              }
            />
          </div>
        </div>

        {metaItems.length > 0 && (
          <dl className="event-details__grid">
            {metaItems.map(
              (item, index) => (
                <div
                  key={`${
                    item.labelKey ||
                    item.label
                  }-${index}`}
                  className="event-details__item"
                >
                  <dt>
                    {item.labelKey
                      ? t(item.labelKey)
                      : item.label ||
                        t(
                          "donki.eventCard.information"
                        )}
                  </dt>

                  <dd>
                    {formatMetaValue(
                      item,
                      locale,
                      t(
                        "common.notAvailable"
                      )
                    )}
                  </dd>
                </div>
              )
            )}
          </dl>
        )}

        {displayBody && (
          <p className="event-details__body">
            {displayBody}
          </p>
        )}

        {!isEnglish &&
          event.hasAutomaticTranslation && (
            <p className="event-details__translation-note">
              {t(
                "donki.eventDetails.translationNote"
              )}
            </p>
          )}

        {nasaLinks.length > 0 && (
          <div className="event-details__embedded-links">
            <h3>
              {t(
                "donki.eventDetails.relatedResources"
              )}
            </h3>

            <ul>
              {nasaLinks.map(
                (url, index) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={t(
                        "donki.eventDetails.openResourceAria",
                        {
                          number:
                            index + 1,
                        }
                      )}
                    >
                      {t(
                        "donki.eventDetails.openResource",
                        {
                          number:
                            index + 1,
                        }
                      )}

                      <Icon
                        name="ExternalLink"
                        size={15}
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {isSafeUrl(event.link) && (
          <div className="event-details__actions">
            <a
              href={event.link}
              target="_blank"
              rel="noreferrer"
              className="event-details__source-link"
              aria-label={t(
                "donki.eventDetails.viewNasaSourceAria"
              )}
            >
              {t(
                "donki.eventDetails.viewNasaSource"
              )}

              <Icon
                name="ExternalLink"
                size={16}
                aria-hidden="true"
              />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetails;