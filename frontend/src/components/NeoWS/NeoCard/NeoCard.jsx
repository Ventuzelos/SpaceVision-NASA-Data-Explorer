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

function NeoCard({ neo, isFavorite, onToggleFavorite }) {
  return (
    <article
      className={`neo-card ${neo.isHazardous ? "neo-card--hazard" : ""}`}
    >
      {neo.isHazardous && (
        <span className="neo-card__hazard-tag">
          <span aria-hidden="true">⚠️</span> Potencialmente perigoso
        </span>
      )}

      <div className="neo-card__header">
        <h3 className="neo-card__title">{neo.name}</h3>

        <button
          type="button"
          className={`neo-card__favorite ${
            isFavorite ? "neo-card__favorite--active" : ""
          }`}
          onClick={() => onToggleFavorite(neo)}
          aria-label="Adicionar aos favoritos"
          aria-pressed={isFavorite}
        >
          {isFavorite ? "★" : "☆"}
        </button>
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
          Ver no JPL <span aria-hidden="true">→</span>
        </a>
      )}
    </article>
  );
}

export default NeoCard;
