import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";
import Icon from "../../common/Icon/Icon";

import "./EventCard.css";

function formatShortDate(value) {
  if (!value) {
    return "Data não disponível";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Data não disponível";
  }

  return parsed.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function EventCard({
  event,
  isFavorite,
  isFavoriteLoading,
  onToggleFavorite,
  onViewDetails,
}) {
  const title = event?.title || "Evento DONKI";

  const metaItems = Array.isArray(event?.meta)
    ? event.meta.slice(0, 2)
    : [];

  function handleFavoriteClick() {
    if (
      typeof onToggleFavorite === "function"
    ) {
      onToggleFavorite(event);
    }
  }

  function handleViewDetails() {
    if (
      typeof onViewDetails === "function"
    ) {
      onViewDetails(event);
    }
  }

  return (
    <article className="event-card">
      <div className="event-card__header">
        <div>
          <h3 className="event-card__title">
            {title}
          </h3>

          <p className="event-card__date">
            <Icon
              name="Calendar"
              size={15}
              aria-hidden="true"
            />

            {formatShortDate(event?.date)}
          </p>
        </div>

        <FavoriteButton
          active={Boolean(isFavorite)}
          disabled={Boolean(isFavoriteLoading)}
          onClick={handleFavoriteClick}
          ariaLabel={
            isFavorite
              ? `Remover ${title} dos favoritos`
              : `Adicionar ${title} aos favoritos`
          }
        />
      </div>

      {event?.badge && (
        <span className="event-card__badge">
          {event.badge}
        </span>
      )}

      {metaItems.length > 0 && (
        <ul className="event-card__meta">
          {metaItems.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
            >
              <span>
                {item.label || "Informação"}
              </span>

              <strong>
                {item.value ?? "N/D"}
              </strong>
            </li>
          ))}
        </ul>
      )}

      <div className="event-card__actions">
        <button
          type="button"
          className="event-card__link"
          onClick={handleViewDetails}
          aria-label={`Ver detalhes de ${title}`}
        >
          Ver detalhes

          <Icon
            name="ArrowRight"
            size={16}
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
}

export default EventCard;