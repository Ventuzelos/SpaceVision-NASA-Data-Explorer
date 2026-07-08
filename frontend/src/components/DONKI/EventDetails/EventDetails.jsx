import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";
import Icon from "../../common/Icon/Icon";

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
      <button
        type="button"
        className="event-details__back"
        onClick={onBack}
      >
        <Icon name="ArrowLeft" size={18} />
        Voltar à lista
      </button>

      <div className="event-details__card">
        <div className="event-details__header">
          <div>
            <h2 className="event-details__title">{event.title}</h2>

            <p className="event-details__date">
              {formatFullDate(event.date)}
            </p>
          </div>

          <div className="event-details__header-actions">
            {event.badge && (
              <span className="event-details__badge">
                {event.badge}
              </span>
            )}

            <FavoriteButton
              active={isFavorite}
              onClick={() => onToggleFavorite(event)}
              ariaLabel={
                isFavorite
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"
              }
            />
          </div>
        </div>

        <dl className="event-details__grid">
          {event.meta.map((item) => (
            <div
              key={item.label}
              className="event-details__item"
            >
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        {event.body && (
          <p className="event-details__body">
            {event.body}
          </p>
        )}

        {event.link && (
          <div className="event-details__actions">
            <a
              href={event.link}
              target="_blank"
              rel="noreferrer"
              className="event-details__source-link"
            >
              Ver fonte na NASA
              <Icon name="ExternalLink" size={16} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetails;