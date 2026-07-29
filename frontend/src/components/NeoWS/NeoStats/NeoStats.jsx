import { useTranslation } from "react-i18next";

import "./NeoStats.css";

function formatKm(value, locale, unavailableText) {
  if (
    value == null ||
    Number.isNaN(value)
  ) {
    return unavailableText;
  }

  return `${new Intl.NumberFormat(
    locale,
    {
      maximumFractionDigits: 0,
    }
  ).format(value)} km`;
}

function formatDiameter(
  value,
  locale,
  unavailableText
) {
  if (
    value == null ||
    Number.isNaN(value)
  ) {
    return unavailableText;
  }

  if (value < 1) {
    return `${new Intl.NumberFormat(
      locale,
      {
        maximumFractionDigits: 0,
      }
    ).format(value * 1000)} m`;
  }

  return `${new Intl.NumberFormat(
    locale,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(value)} km`;
}

function NeoStats({
  stats,
  loading,
}) {
  const { t, i18n } =
    useTranslation();

  const locale =
    i18n.resolvedLanguage?.startsWith(
      "en"
    )
      ? "en-GB"
      : "pt-PT";

  const unavailableText = t(
    "neows.stats.unavailable"
  );

  return (
    <section
      className="neo-stats-section"
      aria-labelledby="neo-stats-title"
      aria-busy={loading}
    >
      <h2
        id="neo-stats-title"
        className="sr-only"
      >
        {t(
          "neows.stats.sectionTitle"
        )}
      </h2>

      <dl className="neo-stats">
        <div className="neo-stats__card">
          <dt className="neo-stats__label">
            {t(
              "neows.stats.totalObjects"
            )}
          </dt>

          <dd className="neo-stats__value">
            {loading
              ? "—"
              : stats.total}
          </dd>
        </div>

        <div className="neo-stats__card neo-stats__card--hazard">
          <dt className="neo-stats__label">
            {t(
              "neows.stats.hazardousObjects"
            )}
          </dt>

          <dd className="neo-stats__value">
            {loading
              ? "—"
              : stats.hazardousCount}
          </dd>
        </div>

        <div className="neo-stats__card">
          <dt className="neo-stats__label">
            {t(
              "neows.stats.closestObject"
            )}
          </dt>

          <dd className="neo-stats__value neo-stats__value--name">
            {loading ||
            !stats.closest
              ? unavailableText
              : stats.closest.name}
          </dd>

          {!loading &&
            stats.closest && (
              <dd className="neo-stats__detail">
                {formatKm(
                  stats.closest
                    .missDistanceKm,
                  locale,
                  unavailableText
                )}
              </dd>
            )}
        </div>

        <div className="neo-stats__card">
          <dt className="neo-stats__label">
            {t(
              "neows.stats.largestDiameter"
            )}
          </dt>

          <dd className="neo-stats__value neo-stats__value--name">
            {loading ||
            !stats.largest
              ? unavailableText
              : stats.largest.name}
          </dd>

          {!loading &&
            stats.largest && (
              <dd className="neo-stats__detail">
                {formatDiameter(
                  stats.largest
                    .diameterMaxKm,
                  locale,
                  unavailableText
                )}
              </dd>
            )}
        </div>
      </dl>

      <p
        className="sr-only"
        aria-live="polite"
      >
        {loading
          ? t(
              "neows.stats.updating"
            )
          : t(
              "neows.stats.summary",
              {
                total:
                  stats.total,
                hazardous:
                  stats.hazardousCount,
              }
            )}
      </p>
    </section>
  );
}

export default NeoStats;