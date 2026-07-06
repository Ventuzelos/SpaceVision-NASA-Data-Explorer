import Button from "../../common/Button/Button";

import "./EventDetails.css";

function formatFullDate(value) {
  if (!value) return "Data não disponível";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString("pt-PT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EventDetails({ event, isFavorite, onToggleFavorite, onBack }) {
  return (
    <div className="event-details">
      <button type="button" className="event-details__back" onClick={onBack}>
        <span aria-hidden="true">←</span> Voltar à lista
      </button>

      <div className="event-details__card">
        <div className="event-details__header">
          <div>
            <h2 className="event-details__title">{event.title}</h2>
            <p className="event-details__date">{formatFullDate(event.date)}</p>
          </div>

          {event.badge && (
            <span className="event-details__badge">{event.badge}</span>
          )}
        </div>

        <dl className="event-details__grid">
          {event.meta.map((item) => (
            <div key={item.label} className="event-details__item">
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        {event.body && <p className="event-details__body">{event.body}</p>}

        <div className="event-details__actions">
          <Button
            variant={isFavorite ? "secondary" : "primary"}
            onClick={() => onToggleFavorite(event)}
          >
            {isFavorite ? "★ Nos favoritos" : "☆ Adicionar aos favoritos"}
          </Button>

          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noreferrer"
              className="event-details__source-link"
            >
              Ver fonte na NASA <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
