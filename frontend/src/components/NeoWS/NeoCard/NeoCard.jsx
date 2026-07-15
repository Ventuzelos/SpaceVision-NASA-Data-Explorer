import Icon from "../../common/Icon/Icon";
import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";

import "./NeoCard.css";

function formatDate(value) {
  if (!value) {
    return "Data não disponível";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatNumber(value, unit = "") {
  if (value == null || Number.isNaN(Number(value))) {
    return "Não disponível";
  }

  return `${new Intl.NumberFormat("pt-PT", {
    maximumFractionDigits: 0,
  }).format(Number(value))}${unit}`;
}

function formatSingleDiameter(value) {
  if (value == null || Number.isNaN(Number(value))) {
    return "Não disponível";
  }

  const numericValue = Number(value);

  return numericValue < 1
    ? `${Math.round(numericValue * 1000)} m`
    : `${numericValue.toFixed(2)} km`;
}

function formatDiameterRange(minimum, maximum) {
  if (
    minimum == null ||
    maximum == null ||
    Number.isNaN(Number(minimum)) ||
    Number.isNaN(Number(maximum))
  ) {
    return "Não disponível";
  }

  return `${formatSingleDiameter(
    minimum
  )} – ${formatSingleDiameter(maximum)}`;
}

function NeoCard({
  neo,
  isFavorite,
  isFavoriteLoading,
  onToggleFavorite,
}) {
  const objectName =
    neo.name || "Objeto próximo da Terra";

  const riskLabel = neo.isHazardous
    ? "Risco elevado"
    : "Risco baixo";

  return (
    <article
      className={`neo-card${
        neo.isHazardous
          ? " neo-card--hazard"
          : ""
      }`}
      aria-labelledby={`neo-card-title-${neo.id}`}
    >
      <div
        className="neo-card__avatar"
        aria-hidden="true"
      >
        <Icon
          name={
            neo.isHazardous
              ? "AlertCircle"
              : "Satellite"
          }
          size={20}
        />
      </div>

      <div className="neo-card__main">
        <div className="neo-card__title-row">
          <h3
            id={`neo-card-title-${neo.id}`}
            className="neo-card__title"
          >
            {objectName}
          </h3>

          {neo.isHazardous && (
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
          {formatDate(neo.closeApproachDate)}
        </p>

        <dl className="neo-card__metadata">
          <div className="neo-card__metadata-item">
            <dt>Distância mínima</dt>
            <dd>
              {formatNumber(
                neo.missDistanceKm,
                " km"
              )}
            </dd>
          </div>

          <div className="neo-card__metadata-item">
            <dt>Distância lunar</dt>
            <dd>
              {neo.missDistanceLunar != null &&
              !Number.isNaN(
                Number(neo.missDistanceLunar)
              )
                ? `${Number(
                    neo.missDistanceLunar
                  ).toFixed(1)} LD`
                : "Não disponível"}
            </dd>
          </div>

          <div className="neo-card__metadata-item">
            <dt>Diâmetro estimado</dt>
            <dd>
              {formatDiameterRange(
                neo.diameterMinKm,
                neo.diameterMaxKm
              )}
            </dd>
          </div>

          <div className="neo-card__metadata-item">
            <dt>Velocidade relativa</dt>
            <dd>
              {formatNumber(
                neo.velocityKmH,
                " km/h"
              )}
            </dd>
          </div>
        </dl>

        {neo.jplUrl && (
          <a
            className="neo-card__link"
            href={neo.jplUrl}
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
          active={isFavorite}
          disabled={isFavoriteLoading}
          onClick={() => onToggleFavorite(neo)}
          size={16}
          ariaLabel={
            isFavorite
              ? `Remover ${objectName} dos favoritos`
              : `Adicionar ${objectName} aos favoritos`
          }
        />

        <span
          className={`neo-card__risk ${
            neo.isHazardous
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