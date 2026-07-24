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

  const normalizedValue = value
    .trim()
    .replace(" ", "T");

  const parsedDate = new Date(
    normalizedValue
  );

  return Number.isNaN(
    parsedDate.getTime()
  )
    ? null
    : parsedDate;
}

function formatDate(value) {
  if (!value) {
    return "Data não disponível";
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
    "pt-PT",
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
  unit = ""
) {
  const numericValue =
    toFiniteNumber(value);

  if (numericValue === null) {
    return "Não disponível";
  }

  return `${new Intl.NumberFormat(
    "pt-PT",
    {
      maximumFractionDigits: 0,
    }
  ).format(numericValue)}${unit}`;
}

function formatSingleDiameter(
  value
) {
  const numericValue =
    toFiniteNumber(value);

  if (numericValue === null) {
    return "Não disponível";
  }

  if (numericValue < 1) {
    return `${Math.round(
      numericValue * 1000
    )} m`;
  }

  return `${new Intl.NumberFormat(
    "pt-PT",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(numericValue)} km`;
}

function formatDiameterRange(
  minimum,
  maximum
) {
  const numericMinimum =
    toFiniteNumber(minimum);

  const numericMaximum =
    toFiniteNumber(maximum);

  if (
    numericMinimum === null ||
    numericMaximum === null
  ) {
    return "Não disponível";
  }

  return `${formatSingleDiameter(
    numericMinimum
  )} – ${formatSingleDiameter(
    numericMaximum
  )}`;
}

function formatLunarDistance(
  value
) {
  const numericValue =
    toFiniteNumber(value);

  if (numericValue === null) {
    return "Não disponível";
  }

  return `${new Intl.NumberFormat(
    "pt-PT",
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }
  ).format(numericValue)} LD`;
}

function getSafeExternalUrl(
  value
) {
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
    value || "desconhecido"
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
  if (!neo) {
    return null;
  }

  const objectName =
    typeof neo.name === "string" &&
    neo.name.trim()
      ? neo.name.trim()
      : "Objeto próximo da Terra";

  const hazardous = Boolean(
    neo.isHazardous
  );

  const riskLabel = hazardous
    ? "Risco elevado"
    : "Risco baixo";

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
      className={`neo-card${
        hazardous
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

              Potencialmente perigoso
            </span>
          )}
        </div>

        <p className="neo-card__date">
          Aproximação:{" "}
          {formatDate(
            neo.closeApproachDate
          )}
        </p>

        <dl className="neo-card__metadata">
          <div className="neo-card__metadata-item">
            <dt>
              Distância mínima
            </dt>

            <dd>
              {formatNumber(
                neo.missDistanceKm,
                " km"
              )}
            </dd>
          </div>

          <div className="neo-card__metadata-item">
            <dt>
              Distância lunar
            </dt>

            <dd>
              {formatLunarDistance(
                neo.missDistanceLunar
              )}
            </dd>
          </div>

          <div className="neo-card__metadata-item">
            <dt>
              Diâmetro estimado
            </dt>

            <dd>
              {formatDiameterRange(
                neo.diameterMinKm,
                neo.diameterMaxKm
              )}
            </dd>
          </div>

          <div className="neo-card__metadata-item">
            <dt>
              Velocidade relativa
            </dt>

            <dd>
              {formatNumber(
                neo.velocityKmH,
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
            aria-label={`Consultar ${objectName} no JPL da NASA, abre numa nova janela`}
          >
            Ver no JPL

            <Icon
              name="ArrowRight"
              size={14}
              aria-hidden="true"
            />

            <span className="sr-only">
              , abre numa nova janela
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
              ? `Remover ${objectName} dos favoritos`
              : `Adicionar ${objectName} aos favoritos`
          }
        />

        <span
          className={`neo-card__risk ${
            hazardous
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