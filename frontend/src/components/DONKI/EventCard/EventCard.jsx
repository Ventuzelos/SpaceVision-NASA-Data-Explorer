import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";
import Icon from "../../common/Icon/Icon";

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
        <div>
          <h3 className="event-card__title">{event.title}</h3>

          <p className="event-card__date">
            <Icon name="Calendar" size={15} />
            {formatShortDate(event.date)}
          </p>
        </div>

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

      {event.badge && (
        <span className="event-card__badge">
          {event.badge}
        </span>
      )}

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
          Ver detalhes
          <Icon name="ArrowRight" size={16} />
        </button>
      </div>
    </article>
  );
}

export default EventCard;