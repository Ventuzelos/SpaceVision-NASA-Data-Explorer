import "./NeoStats.css";

function formatKm(value) {
  if (value == null || Number.isNaN(value)) {
    return "Não disponível";
  }

  return `${new Intl.NumberFormat("pt-PT", {
    maximumFractionDigits: 0,
  }).format(value)} km`;
}

function formatDiameter(value) {
  if (value == null || Number.isNaN(value)) {
    return "Não disponível";
  }

  if (value < 1) {
    return `${Math.round(value * 1000)} m`;
  }

  return `${value.toFixed(2)} km`;
}

function NeoStats({ stats, loading }) {
  return (
    <section
      className="neo-stats-section"
      aria-labelledby="neo-stats-title"
      aria-busy={loading}
    >
      <h2 id="neo-stats-title" className="sr-only">
        Estatísticas dos objetos próximos da Terra
      </h2>

      <dl className="neo-stats">
        <div className="neo-stats__card">
          <dt className="neo-stats__label">
            Total de objetos
          </dt>

          <dd className="neo-stats__value">
            {loading ? "—" : stats.total}
          </dd>
        </div>

        <div className="neo-stats__card neo-stats__card--hazard">
          <dt className="neo-stats__label">
            Potencialmente perigosos
          </dt>

          <dd className="neo-stats__value">
            {loading ? "—" : stats.hazardousCount}
          </dd>
        </div>

        <div className="neo-stats__card">
          <dt className="neo-stats__label">
            Objeto mais próximo
          </dt>

          <dd className="neo-stats__value neo-stats__value--name">
            {loading || !stats.closest
              ? "Não disponível"
              : stats.closest.name}
          </dd>

          {!loading && stats.closest && (
            <dd className="neo-stats__detail">
              {formatKm(stats.closest.missDistanceKm)}
            </dd>
          )}
        </div>

        <div className="neo-stats__card">
          <dt className="neo-stats__label">
            Maior diâmetro estimado
          </dt>

          <dd className="neo-stats__value neo-stats__value--name">
            {loading || !stats.largest
              ? "Não disponível"
              : stats.largest.name}
          </dd>

          {!loading && stats.largest && (
            <dd className="neo-stats__detail">
              {formatDiameter(
                stats.largest.diameterMaxKm
              )}
            </dd>
          )}
        </div>
      </dl>

      <p className="sr-only" aria-live="polite">
        {loading
          ? "A atualizar estatísticas."
          : `Foram encontrados ${stats.total} objetos, dos quais ${stats.hazardousCount} são potencialmente perigosos.`}
      </p>
    </section>
  );
}

export default NeoStats;