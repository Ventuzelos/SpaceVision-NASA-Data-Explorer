import "./NeoStats.css";

function formatKm(value) {
  if (value == null || Number.isNaN(value)) return "N/D";
  return `${new Intl.NumberFormat("pt-PT", {
    maximumFractionDigits: 0,
  }).format(value)} km`;
}

function formatDiameter(value) {
  if (value == null || Number.isNaN(value)) return "N/D";
  if (value < 1) {
    return `${Math.round(value * 1000)} m`;
  }
  return `${value.toFixed(2)} km`;
}

function NeoStats({ stats, loading }) {
  return (
    <div className="neo-stats" aria-live="polite">
      <div className="neo-stats__card">
        <span>Total de objetos</span>
        <strong>{loading ? "—" : stats.total}</strong>
      </div>

      <div className="neo-stats__card neo-stats__card--hazard">
        <span>Potencialmente perigosos</span>
        <strong>{loading ? "—" : stats.hazardousCount}</strong>
      </div>

      <div className="neo-stats__card">
        <span>Objeto mais próximo</span>
        <strong className="neo-stats__name">
          {loading || !stats.closest ? "N/D" : stats.closest.name}
        </strong>
        {!loading && stats.closest && (
          <small>{formatKm(stats.closest.missDistanceKm)}</small>
        )}
      </div>

      <div className="neo-stats__card">
        <span>Maior diâmetro estimado</span>
        <strong className="neo-stats__name">
          {loading || !stats.largest ? "N/D" : stats.largest.name}
        </strong>
        {!loading && stats.largest && (
          <small>{formatDiameter(stats.largest.diameterMaxKm)}</small>
        )}
      </div>
    </div>
  );
}

export default NeoStats;
