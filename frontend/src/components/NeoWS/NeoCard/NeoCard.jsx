import Icon from "../../common/Icon/Icon";
import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";

import "./NeoCard.css";

function formatDate(value) {
  if (!value) return "Data não disponível";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatNumber(value, unit = "") {
  if (value == null || Number.isNaN(value)) return "N/D";

  return `${new Intl.NumberFormat("pt-PT", {
    maximumFractionDigits: 0,
  }).format(value)}${unit}`;
}

function formatSingleDiameter(value) {
  if (value == null || Number.isNaN(value)) return "N/D";

  return value < 1 ? `${Math.round(value * 1000)} m` : `${value.toFixed(2)} km`;
}

function formatDiameterRange(min, max) {
  if (min == null || max == null) return "N/D";

  return `${formatSingleDiameter(min)} – ${formatSingleDiameter(max)}`;
}

function NeoCard({
  neo,
  isFavorite,
  isFavoriteLoading,
  onToggleFavorite,
}) {
  const riskLabel = neo.isHazardous ? "Risco: Alto" : "Risco: Baixo";

  return (
    <article
      className={`neo-card ${neo.isHazardous ? "neo-card--hazard" : ""}`}
    >
      <div className="neo-card__avatar" aria-hidden="true">
        <Icon name={neo.isHazardous ? "AlertCircle" : "Satellite"} size={20} />
      </div>

      <div className="neo-card__main">
        <div className="neo-card__title-row">
          <h3 className="neo-card__title">{neo.name}</h3>
          {neo.isHazardous && (
            <span className="neo-card__hazard-tag">
              <Icon name="AlertCircle" size={12} />
              Potencialmente perigoso
            </span>
          )}
        </div>

        <p className="neo-card__date">
          Aproximação: {formatDate(neo.closeApproachDate)}
        </p>

        <ul className="neo-card__meta">
          <li>
            <span>Distância (miss distance)</span>
            <strong>{formatNumber(neo.missDistanceKm, " km")}</strong>
          </li>

          <li>
            <span>Distância lunar</span>
            <strong>
              {neo.missDistanceLunar != null
                ? `${neo.missDistanceLunar.toFixed(1)} LD`
                : "N/D"}
            </strong>
          </li>

          <li>
            <span>Diâmetro estimado</span>
            <strong>
              {formatDiameterRange(neo.diameterMinKm, neo.diameterMaxKm)}
            </strong>
          </li>

          <li>
            <span>Velocidade relativa</span>
            <strong>{formatNumber(neo.velocityKmH, " km/h")}</strong>
          </li>
        </ul>

        {neo.jplUrl && (
          <a
            className="neo-card__link"
            href={neo.jplUrl}
            target="_blank"
            rel="noreferrer"
          >
            Ver no JPL
            <Icon name="ArrowRight" size={14} />
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
              ? "Remover dos favoritos"
              : "Adicionar aos favoritos"
          }
        />

        <span
          className={`neo-card__risk ${neo.isHazardous ? "neo-card__risk--high" : "neo-card__risk--low"
            }`}
        >
          {riskLabel}
        </span>
      </div>
    </article>
  );
}

export default NeoCard;