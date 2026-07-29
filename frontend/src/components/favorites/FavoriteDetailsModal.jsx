import { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ExternalLink,
  X,
} from "lucide-react";

import { useModalA11y } from "../../hooks/UseModalA11y";

import "./FavoriteDetailsModal.css";

function parseFavoriteData(data) {
  if (!data) {
    return {};
  }

  if (typeof data === "object") {
    return data;
  }

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error(
        "Não foi possível interpretar os dados do favorito:",
        error
      );

      return {};
    }
  }

  return {};
}

function normalizeLabel(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );
}

function getDonkiMetaLabel(
  label,
  t
) {
  const normalizedLabel =
    normalizeLabel(label);

  const labelKeys = {
    inicio: "start",
    start: "start",

    pico: "peak",
    peak: "peak",

    fim: "end",
    end: "end",

    "regiao ativa":
      "activeRegion",
    "active region":
      "activeRegion",

    instrumentos:
      "instruments",
    instruments:
      "instruments",

    tipo: "type",
    type: "type",

    localizacao:
      "location",
    location:
      "location",

    velocidade:
      "speed",
    speed:
      "speed",

    duracao: "duration",
    duration: "duration",
  };

  const translationKey =
    labelKeys[
      normalizedLabel
    ];

  if (!translationKey) {
    return label;
  }

  return t(
    `favoriteModal.donki.labels.${translationKey}`
  );
}

function getLocalizedRisk(
  risk,
  isHazardous,
  t
) {
  const normalizedRisk =
    normalizeLabel(risk);

  const lowValues = [
    "baixo",
    "baixa",
    "low",
  ];

  const highValues = [
    "elevado",
    "elevada",
    "alto",
    "alta",
    "high",
  ];

  if (
    lowValues.includes(
      normalizedRisk
    )
  ) {
    return t(
      "favoriteModal.neows.riskLow"
    );
  }

  if (
    highValues.includes(
      normalizedRisk
    )
  ) {
    return t(
      "favoriteModal.neows.riskHigh"
    );
  }

  if (risk) {
    return String(risk);
  }

  return isHazardous
    ? t(
        "favoriteModal.neows.riskHigh"
      )
    : t(
        "favoriteModal.neows.riskLow"
      );
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
    new Date(value);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return String(value);
  }

  return parsedDate.toLocaleDateString(
    locale,
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function formatDateTime(
  value,
  locale,
  unavailableText,
  separator
) {
  if (!value) {
    return unavailableText;
  }

  const parsedDate =
    new Date(value);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return String(value);
  }

  const date =
    parsedDate.toLocaleDateString(
      locale,
      {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );

  const time =
    parsedDate.toLocaleTimeString(
      locale,
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  return `${date} ${separator} ${time}`;
}

function formatShortDateTime(
  value,
  locale,
  unavailableText
) {
  if (!value) {
    return unavailableText;
  }

  const parsedDate =
    new Date(value);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return String(value);
  }

  const date =
    parsedDate.toLocaleDateString(
      locale
    );

  const time =
    parsedDate.toLocaleTimeString(
      locale,
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  return `${date}, ${time}`;
}

function formatNumber(
  value,
  locale,
  unavailableText,
  maximumFractionDigits = 0
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return unavailableText;
  }

  const number =
    Number(value);

  if (
    Number.isNaN(number)
  ) {
    return String(value);
  }

  return number.toLocaleString(
    locale,
    {
      maximumFractionDigits,
    }
  );
}

function formatValueWithUnit(
  value,
  unit,
  locale,
  unavailableText,
  maximumFractionDigits = 0
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return unavailableText;
  }

  if (
    typeof value === "string"
  ) {
    const trimmedValue =
      value.trim();

    if (
      trimmedValue
        .toLowerCase()
        .includes(
          unit.toLowerCase()
        )
    ) {
      return trimmedValue;
    }

    const normalizedValue =
      trimmedValue
        .replace(/\s/g, "")
        .replace(",", ".");

    const numericValue =
      Number(
        normalizedValue
      );

    if (
      !Number.isNaN(
        numericValue
      )
    ) {
      return `${formatNumber(
        numericValue,
        locale,
        unavailableText,
        maximumFractionDigits
      )} ${unit}`;
    }

    return trimmedValue;
  }

  return `${formatNumber(
    value,
    locale,
    unavailableText,
    maximumFractionDigits
  )} ${unit}`;
}

function getFavoriteType(
  favorite
) {
  return String(
    favorite?.nasa_type ||
      favorite?.source ||
      favorite?.type ||
      "nasa"
  ).toLowerCase();
}

function getImageUrl(
  favorite,
  data,
  favoriteType
) {
  if (
    favoriteType ===
      "apod" &&
    data.media_type ===
      "video"
  ) {
    return "";
  }

  return (
    favorite.image_url ||
    data.image_url ||
    data.imageUrl ||
    data.hdurl ||
    data.hd_url ||
    data.url ||
    ""
  );
}

function getMetaValue(
  meta,
  possibleLabels
) {
  if (
    !Array.isArray(meta)
  ) {
    return null;
  }

  const normalizedLabels =
    possibleLabels.map(
      (label) =>
        normalizeLabel(label)
    );

  const matchingItem =
    meta.find((item) => {
      const itemLabel =
        normalizeLabel(
          item?.label
        );

      return normalizedLabels.some(
        (label) =>
          itemLabel ===
            label ||
          itemLabel.includes(
            label
          )
      );
    });

  return (
    matchingItem?.value ??
    null
  );
}

function getLocalizedValue(
  data,
  language,
  keys
) {
  const isEnglish =
    language?.startsWith(
      "en"
    );

  const preferredKeys =
    isEnglish
      ? keys.english
      : keys.portuguese;

  const fallbackKeys =
    isEnglish
      ? keys.portuguese
      : keys.english;

  for (
    const key of preferredKeys
  ) {
    if (data?.[key]) {
      return data[key];
    }
  }

  for (
    const key of fallbackKeys
  ) {
    if (data?.[key]) {
      return data[key];
    }
  }

  return "";
}

function getEstimatedDiameter(
  data,
  rawData,
  meta,
  locale,
  unavailableText
) {
  const diameterFromData =
    data.diameter ||
    data.estimatedDiameter ||
    data.estimated_diameter_text ||
    data.estimatedDiameterText;

  if (diameterFromData) {
    return diameterFromData;
  }

  const diameterFromMeta =
    getMetaValue(meta, [
      "diâmetro estimado",
      "diametro estimado",
      "estimated diameter",
      "diâmetro",
      "diametro",
      "diameter",
    ]);

  if (diameterFromMeta) {
    return diameterFromMeta;
  }

  const diameterMeters =
    rawData?.estimated_diameter
      ?.meters ||
    data?.estimated_diameter
      ?.meters;

  if (diameterMeters) {
    const minimum =
      diameterMeters
        .estimated_diameter_min;

    const maximum =
      diameterMeters
        .estimated_diameter_max;

    return `${formatNumber(
      minimum,
      locale,
      unavailableText
    )} m – ${formatNumber(
      maximum,
      locale,
      unavailableText
    )} m`;
  }

  const diameterKilometers =
    rawData?.estimated_diameter
      ?.kilometers ||
    data?.estimated_diameter
      ?.kilometers;

  if (diameterKilometers) {
    const minimum =
      diameterKilometers
        .estimated_diameter_min;

    const maximum =
      diameterKilometers
        .estimated_diameter_max;

    return `${formatNumber(
      minimum,
      locale,
      unavailableText,
      2
    )} km – ${formatNumber(
      maximum,
      locale,
      unavailableText,
      2
    )} km`;
  }

  return unavailableText;
}

function FavoriteDetailsModal({
  favorite,
  onClose,
}) {
  const { t, i18n } =
    useTranslation();

  const closeButtonRef =
    useRef(null);

  const containerRef =
    useModalA11y({
      isOpen:
        Boolean(favorite),
      onClose,
      initialFocusRef:
        closeButtonRef,
    });

  if (!favorite) {
    return null;
  }

  const locale =
    i18n.resolvedLanguage?.startsWith(
      "en"
    )
      ? "en-GB"
      : "pt-PT";

  const unavailableText =
    t(
      "favoriteModal.unavailable"
    );

  const data =
    parseFavoriteData(
      favorite.data
    );

  const favoriteType =
    getFavoriteType(
      favorite
    );

  const imageUrl =
    getImageUrl(
      favorite,
      data,
      favoriteType
    );

  const rawData =
    data.raw &&
    typeof data.raw ===
      "object"
      ? data.raw
      : data;

  const localizedTitle =
    getLocalizedValue(
      data,
      i18n.resolvedLanguage,
      {
        english: [
          "originalTitle",
          "original_title",
          "title",
          "name",
        ],
        portuguese: [
          "translatedTitle",
          "translated_title",
          "title",
          "name",
        ],
      }
    );

  const title =
    localizedTitle ||
    favorite.title ||
    t(
      "favoriteModal.untitled"
    );

  const localizedDescription =
    getLocalizedValue(
      data,
      i18n.resolvedLanguage,
      {
        english: [
          "originalExplanation",
          "original_explanation",
          "explanation",
          "description",
          "caption",
        ],
        portuguese: [
          "translatedExplanation",
          "translated_explanation",
          "explanation",
          "description",
          "caption",
        ],
      }
    );

  const neowsMeta =
    Array.isArray(data.meta)
      ? data.meta
      : Array.isArray(
          rawData.meta
        )
        ? rawData.meta
        : [];

  const approach =
    rawData
      .close_approach_data?.[0] ||
    data
      .close_approach_data?.[0] ||
    null;

  const neowsApproachDate =
    data.date ||
    data.approachDate ||
    data.approach_date ||
    data.closeApproachDate ||
    data.close_approach_date ||
    approach
      ?.close_approach_date_full ||
    approach
      ?.close_approach_date;

  const neowsDistanceKm =
    data.distanceKm ||
    data.distance_km ||
    data.missDistanceKm ||
    data.miss_distance_km ||
    data.missDistance ||
    data.miss_distance ||
    getMetaValue(
      neowsMeta,
      [
        "distância (miss distance)",
        "distancia (miss distance)",
        "miss distance",
        "distância",
        "distancia",
        "distance",
      ]
    ) ||
    approach?.miss_distance
      ?.kilometers;

  const neowsLunarDistance =
    data.lunarDistance ||
    data.lunar_distance ||
    data.distanceLunar ||
    data.distance_lunar ||
    getMetaValue(
      neowsMeta,
      [
        "distância lunar",
        "distancia lunar",
        "lunar distance",
      ]
    ) ||
    approach?.miss_distance
      ?.lunar;

  const neowsVelocity =
    data.velocityKmH ||
    data.velocity_kmh ||
    data.relativeVelocity ||
    data.relative_velocity ||
    data.relativeVelocityKmH ||
    data.relative_velocity_kmh ||
    getMetaValue(
      neowsMeta,
      [
        "velocidade relativa",
        "relative velocity",
        "velocidade",
        "velocity",
      ]
    ) ||
    approach
      ?.relative_velocity
      ?.kilometers_per_hour;

  const neowsDiameter =
    getEstimatedDiameter(
      data,
      rawData,
      neowsMeta,
      locale,
      unavailableText
    );

  const isHazardous =
    data.isHazardous ??
    data.hazardous ??
    data
      .is_potentially_hazardous_asteroid ??
    rawData
      .is_potentially_hazardous_asteroid ??
    false;

  const rawNeowsRisk =
    data.risk ||
    data.riskLevel ||
    data.risk_level ||
    getMetaValue(
      neowsMeta,
      [
        "risco",
        "risk",
      ]
    );

  const neowsRisk =
    getLocalizedRisk(
      rawNeowsRisk,
      isHazardous,
      t
    );

  const neowsLink =
    data.link ||
    data.jplUrl ||
    data.jpl_url ||
    data.nasa_jpl_url ||
    rawData.nasa_jpl_url ||
    "";

  const typeLabel =
    t(
      `favoriteModal.types.${favoriteType}`,
      {
        defaultValue:
          favoriteType.toUpperCase(),
      }
    );

  return (
    <div
      className="favorite-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="favorite-modal-title"
      onClick={onClose}
      ref={containerRef}
    >
      <div
        className="favorite-modal__content"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="favorite-modal__close"
          onClick={onClose}
          aria-label={t(
            "favoriteModal.closeAria"
          )}
        >
          <X
            size={22}
            aria-hidden="true"
          />
        </button>

        <span className="favorite-modal__type">
          {typeLabel}
        </span>

        <h2 id="favorite-modal-title">
          {title}
        </h2>

        {imageUrl && (
          <img
            className="favorite-modal__image"
            src={imageUrl}
            alt={
              title ||
              t(
                "favoriteModal.imageAlt"
              )
            }
          />
        )}

        {favoriteType ===
          "apod" && (
          <div className="favorite-modal__details">
            <p>
              <strong>
                {t(
                  "favoriteModal.common.date"
                )}
                :
              </strong>{" "}
              {formatDate(
                data.date,
                locale,
                unavailableText
              )}
            </p>

            {data.copyright && (
              <p>
                <strong>
                  {t(
                    "favoriteModal.apod.credits"
                  )}
                  :
                </strong>{" "}
                {
                  data.copyright
                }
              </p>
            )}

            {localizedDescription ? (
              <div>
                <h3>
                  {t(
                    "favoriteModal.common.description"
                  )}
                </h3>

                <p>
                  {
                    localizedDescription
                  }
                </p>
              </div>
            ) : (
              <p>
                {t(
                  "favoriteModal.common.descriptionUnavailable"
                )}
              </p>
            )}

            {data.media_type ===
              "video" &&
              data.url && (
                <a
                  className="favorite-modal__link"
                  href={
                    data.url
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {t(
                    "favoriteModal.apod.openVideo"
                  )}
                </a>
              )}
          </div>
        )}

        {favoriteType ===
          "epic" && (
          <div className="favorite-modal__details">
            <p>
              <strong>
                {t(
                  "favoriteModal.common.date"
                )}
                :
              </strong>{" "}
              {formatDate(
                data.date,
                locale,
                unavailableText
              )}
            </p>

            {localizedDescription ? (
              <div>
                <h3>
                  {t(
                    "favoriteModal.common.description"
                  )}
                </h3>

                <p>
                  {
                    localizedDescription
                  }
                </p>
              </div>
            ) : (
              <p>
                {t(
                  "favoriteModal.common.descriptionUnavailable"
                )}
              </p>
            )}

            {data.centroid_coordinates && (
              <>
                <p>
                  <strong>
                    {t(
                      "favoriteModal.epic.latitude"
                    )}
                    :
                  </strong>{" "}
                  {
                    data
                      .centroid_coordinates
                      .lat
                  }
                </p>

                <p>
                  <strong>
                    {t(
                      "favoriteModal.epic.longitude"
                    )}
                    :
                  </strong>{" "}
                  {
                    data
                      .centroid_coordinates
                      .lon
                  }
                </p>
              </>
            )}

            {data.identifier && (
              <p>
                <strong>
                  {t(
                    "favoriteModal.epic.identifier"
                  )}
                  :
                </strong>{" "}
                {
                  data.identifier
                }
              </p>
            )}
          </div>
        )}

        {favoriteType ===
          "donki" && (
          <div className="favorite-modal__details">
            <div className="favorite-modal__donki-summary">
              <p className="favorite-modal__donki-date">
                {formatDateTime(
                  data.date ||
                    data.event_date,
                  locale,
                  unavailableText,
                  t(
                    "favoriteModal.dateTimeSeparator"
                  )
                )}
              </p>

              {data.badge && (
                <span className="favorite-modal__donki-badge">
                  {
                    data.badge
                  }
                </span>
              )}
            </div>

            {Array.isArray(
              data.meta
            ) &&
            data.meta.length >
              0 ? (
              <dl className="favorite-modal__data-grid">
                {data.meta.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      className="favorite-modal__data-item"
                      key={`${item.label}-${index}`}
                    >
                      <dt>
                        {getDonkiMetaLabel(
                          item.label,
                          t
                        )}
                      </dt>

                      <dd>
                        {item.value ||
                          unavailableText}
                      </dd>
                    </div>
                  )
                )}
              </dl>
            ) : (
              <p>
                {t(
                  "favoriteModal.donki.noDetails"
                )}
              </p>
            )}

            {data.link && (
              <a
                className="favorite-modal__source-link"
                href={
                  data.link
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(
                  "favoriteModal.donki.viewSource"
                )}

                <ExternalLink
                  size={16}
                  aria-hidden="true"
                />
              </a>
            )}
          </div>
        )}

        {favoriteType ===
          "neows" && (
          <div className="favorite-modal__details">
            <div className="favorite-modal__neows-summary">
              <p>
                <strong>
                  {t(
                    "favoriteModal.neows.approach"
                  )}
                  :
                </strong>{" "}
                {formatShortDateTime(
                  neowsApproachDate,
                  locale,
                  unavailableText
                )}
              </p>

              <p
                className={`favorite-modal__risk ${
                  isHazardous
                    ? "favorite-modal__risk--high"
                    : "favorite-modal__risk--low"
                }`}
              >
                {t(
                  "favoriteModal.neows.risk"
                )}
                : {neowsRisk}
              </p>
            </div>

            <dl className="favorite-modal__data-grid favorite-modal__data-grid--neows">
              <div className="favorite-modal__data-item">
                <dt>
                  {t(
                    "favoriteModal.neows.missDistance"
                  )}
                </dt>

                <dd>
                  {formatValueWithUnit(
                    neowsDistanceKm,
                    "km",
                    locale,
                    unavailableText
                  )}
                </dd>
              </div>

              <div className="favorite-modal__data-item">
                <dt>
                  {t(
                    "favoriteModal.neows.lunarDistance"
                  )}
                </dt>

                <dd>
                  {formatValueWithUnit(
                    neowsLunarDistance,
                    "LD",
                    locale,
                    unavailableText,
                    2
                  )}
                </dd>
              </div>

              <div className="favorite-modal__data-item">
                <dt>
                  {t(
                    "favoriteModal.neows.estimatedDiameter"
                  )}
                </dt>

                <dd>
                  {
                    neowsDiameter
                  }
                </dd>
              </div>

              <div className="favorite-modal__data-item">
                <dt>
                  {t(
                    "favoriteModal.neows.relativeVelocity"
                  )}
                </dt>

                <dd>
                  {formatValueWithUnit(
                    neowsVelocity,
                    "km/h",
                    locale,
                    unavailableText
                  )}
                </dd>
              </div>
            </dl>

            {neowsLink && (
              <a
                className="favorite-modal__source-link"
                href={
                  neowsLink
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(
                  "favoriteModal.neows.viewJpl"
                )}

                <ExternalLink
                  size={16}
                  aria-hidden="true"
                />
              </a>
            )}
          </div>
        )}

        {Object.keys(
          data
        ).length === 0 && (
          <div className="favorite-modal__details">
            <p>
              {t(
                "favoriteModal.incompleteData"
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoriteDetailsModal;