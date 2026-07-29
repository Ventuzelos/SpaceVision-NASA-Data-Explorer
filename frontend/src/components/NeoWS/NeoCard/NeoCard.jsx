import { useTranslation } from "react-i18next";

import Icon from "../../common/Icon/Icon";
import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";

import "./NeoCard.css";

function parseNeoDate(value) {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null;
  }

  const normalizedValue =
    value.trim();

  const dateOnlyMatch =
    normalizedValue.match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

  if (dateOnlyMatch) {
    const [, year, month, day] =
      dateOnlyMatch;

    const parsedDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return Number.isNaN(
      parsedDate.getTime()
    )
      ? null
      : parsedDate;
  }

  const nasaDateMatch =
    normalizedValue.match(
      /^(\d{4})-([A-Za-z]{3})-(\d{2})(?:[ T](\d{2}):(\d{2}))?$/
    );

  if (nasaDateMatch) {
    const [
      ,
      year,
      monthName,
      day,
      hour = "00",
      minute = "00",
    ] = nasaDateMatch;

    const monthIndexes = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const normalizedMonth =
      monthName
        .charAt(0)
        .toUpperCase() +
      monthName
        .slice(1)
        .toLowerCase();

    const monthIndex =
      monthIndexes[
      normalizedMonth
      ];

    if (
      monthIndex === undefined
    ) {
      return null;
    }

    const parsedDate = new Date(
      Number(year),
      monthIndex,
      Number(day),
      Number(hour),
      Number(minute)
    );

    return Number.isNaN(
      parsedDate.getTime()
    )
      ? null
      : parsedDate;
  }

  const parsedDate = new Date(
    normalizedValue.replace(
      " ",
      "T"
    )
  );

  return Number.isNaN(
    parsedDate.getTime()
  )
    ? null
    : parsedDate;
}

function formatDate(
  value,
  locale,
  unavailableText
) {
  if (!value) {
    return unavailableText;
  }

  const parsedDate =
    parseNeoDate(value);

  if (!parsedDate) {
    return value;
  }

  const hasTime =
    typeof value === "string" &&
    (value.includes(" ") ||
      value.includes("T"));

  return new Intl.DateTimeFormat(
    locale,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...(hasTime
        ? {
          hour: "2-digit",
          minute: "2-digit",
        }
        : {}),
    }
  ).format(parsedDate);
}

function toFiniteNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function formatNumber(
  value,
  locale,
  unavailableText,
  unit = ""
) {
  const numericValue =
    toFiniteNumber(value);

  if (numericValue === null) {
    return unavailableText;
  }

  return `${new Intl.NumberFormat(
    locale,
    {
      maximumFractionDigits: 0,
    }
  ).format(numericValue)}${unit}`;
}

function formatSingleDiameter(
  value,
  locale,
  unavailableText
) {
  const numericValue =
    toFiniteNumber(value);

  if (numericValue === null) {
    return unavailableText;
  }

  if (numericValue < 1) {
    return `${new Intl.NumberFormat(
      locale,
      {
        maximumFractionDigits: 0,
      }
    ).format(
      numericValue * 1000
    )} m`;
  }

  return `${new Intl.NumberFormat(
    locale,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(numericValue)} km`;
}

function formatDiameterRange(
  minimum,
  maximum,
  locale,
  unavailableText
) {
  const numericMinimum =
    toFiniteNumber(minimum);

  const numericMaximum =
    toFiniteNumber(maximum);

  if (
    numericMinimum === null ||
    numericMaximum === null
  ) {
    return unavailableText;
  }

  return `${formatSingleDiameter(
    numericMinimum,
    locale,
    unavailableText
  )} – ${formatSingleDiameter(
    numericMaximum,
    locale,
    unavailableText
  )}`;
}

function formatLunarDistance(
  value,
  locale,
  unavailableText
) {
  const numericValue =
    toFiniteNumber(value);

  if (numericValue === null) {
    return unavailableText;
  }

  return `${new Intl.NumberFormat(
    locale,
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }
  ).format(numericValue)} LD`;
}

function getSafeExternalUrl(value) {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return "";
  }

  try {
    const url = new URL(value);

    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
}

function createSafeId(value) {
  return String(
    value || "unknown"
  ).replace(
    /[^a-zA-Z0-9_-]/g,
    "-"
  );
}

function NeoCard({
  neo,
  isFavorite,
  isFavoriteLoading,
  onToggleFavorite,
}) {
  const { t, i18n } =
    useTranslation();

  if (!neo) {
    return null;
  }

  const locale =
    i18n.resolvedLanguage?.startsWith(
      "en"
    )
      ? "en-GB"
      : "pt-PT";

  const unavailableText = t(
    "neows.card.unavailable"
  );

  const objectName =
    typeof neo.name === "string" &&
      neo.name.trim()
      ? neo.name.trim()
      : t(
        "neows.object.defaultTitle"
      );

  const hazardous = Boolean(
    neo.isHazardous
  );

  const riskLabel = hazardous
    ? t("neows.card.highRisk")
    : t("neows.card.lowRisk");

  const cardTitleId =
    `neo-card-title-${createSafeId(
      neo.id
    )}`;

  const jplUrl =
    getSafeExternalUrl(
      neo.jplUrl
    );

  function handleFavoriteClick() {
    if (
      typeof onToggleFavorite ===
      "function"
    ) {
      onToggleFavorite(neo);
    }
  }

  return (
    <article
      className={`neo-card${hazardous
          ? " neo-card--hazard"
          : ""
        }`}
      aria-labelledby={
        cardTitleId
      }
    >
      <div
        className="neo-card__avatar"
        aria-hidden="true"
      >
        <Icon
          name={
            hazardous
              ? "AlertCircle"
              : "Satellite"
          }
          size={20}
        />
      </div>

      <div className="neo-card__main">
        <div className="neo-card__title-row">
          <h3
            id={cardTitleId}
            className="neo-card__title"
          >
            {objectName}
          </h3>

          {hazardous && (
            <span className="neo-card__hazard-tag">
              <Icon
                name="AlertCircle"
                size={12}
                aria-hidden="true"
              />

              {t(
                "neows.card.potentiallyHazardous"
              )}
            </span>
          )}
        </div>

        <p className="neo-card__date">
          {t(
            "neows.card.approach"
          )}
          {": "}
          {formatDate(
            neo.closeApproachDate,
            locale,
            t(
              "neows.card.dateUnavailable"
            )
          )}
        </p>

        <dl className="neo-card__metadata">
          <div className="neo-card__metadata-item">
            <dt>
              {t(
                "neows.card.minimumDistance"
              )}
            </dt>

            <dd>
              {formatNumber(
                neo.missDistanceKm,
                locale,
                unavailableText,
                " km"
              )}
            </dd>
          </div>

          <div className="neo-card__metadata-item">
            <dt>
              {t(
                "neows.card.lunarDistance"
              )}
            </dt>

            <dd>
              {formatLunarDistance(
                neo.missDistanceLunar,
                locale,
                unavailableText
              )}
            </dd>
          </div>

          <div className="neo-card__metadata-item">
            <dt>
              {t(
                "neows.card.estimatedDiameter"
              )}
            </dt>

            <dd>
              {formatDiameterRange(
                neo.diameterMinKm,
                neo.diameterMaxKm,
                locale,
                unavailableText
              )}
            </dd>
          </div>

          <div className="neo-card__metadata-item">
            <dt>
              {t(
                "neows.card.relativeVelocity"
              )}
            </dt>

            <dd>
              {formatNumber(
                neo.velocityKmH,
                locale,
                unavailableText,
                " km/h"
              )}
            </dd>
          </div>
        </dl>

        {jplUrl && (
          <a
            className="neo-card__link"
            href={jplUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(
              "neows.card.jplAria",
              {
                name: objectName,
              }
            )}
          >
            {t(
              "neows.card.viewOnJpl"
            )}

            <Icon
              name="ArrowRight"
              size={14}
              aria-hidden="true"
            />

            <span className="sr-only">
              {t(
                "neows.card.newWindow"
              )}
            </span>
          </a>
        )}
      </div>

      <div className="neo-card__side">
        <FavoriteButton
          active={Boolean(
            isFavorite
          )}
          disabled={
            Boolean(
              isFavoriteLoading
            ) ||
            neo.id === null ||
            neo.id === undefined ||
            neo.id === ""
          }
          onClick={
            handleFavoriteClick
          }
          size={16}
          ariaLabel={
            isFavorite
              ? t(
                "neows.card.removeFavoriteAria",
                {
                  name: objectName,
                }
              )
              : t(
                "neows.card.addFavoriteAria",
                {
                  name: objectName,
                }
              )
          }
        />

        <span
          className={`neo-card__risk ${hazardous
              ? "neo-card__risk--high"
              : "neo-card__risk--low"
            }`}
        >
          {riskLabel}
        </span>
      </div>
    </article>
  );
}

export default NeoCard;