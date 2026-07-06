import "./EventCard.css";

function formatShortDate(value) {
  if (!value) return "Data não disponível";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function EventCard({ event, isFavorite, onToggleFavorite, onViewDetails }) {
  return (
    <article className="event-card">
      <div className="event-card__header">
        <h3 className="event-card__title">{event.title}</h3>
        {event.badge && <span className="event-card__badge">{event.badge}</span>}
      </div>

      <p className="event-card__date">{formatShortDate(event.date)}</p>

      <ul className="event-card__meta">
        {event.meta.slice(0, 2).map((item) => (
          <li key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </li>
        ))}
      </ul>

      <div className="event-card__actions">
        <button
          type="button"
          className="event-card__link"
          onClick={() => onViewDetails(event)}
        >
          Ver detalhes <span aria-hidden="true">→</span>
        </button>

        <button
          type="button"
          className={`event-card__favorite ${
            isFavorite ? "event-card__favorite--active" : ""
          }`}
          onClick={() => onToggleFavorite(event)}
          aria-label="Adicionar aos favoritos"
          aria-pressed={isFavorite}
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>
    </article>
  );
}

export default EventCard;
