import { useRef } from "react";

import FavoriteButton from "../../common/FavoriteButton/FavoriteButton";
import Icon from "../../common/Icon/Icon";
import isSafeUrl from "../../../utils/isSafeUrl";
import { useModalA11y } from "../../../hooks/UseModalA11y";

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

function EventDetails({
  event,
  isFavorite,
  isFavoriteLoading,
  onToggleFavorite,
  onBack,
}) {
  const backButtonRef = useRef(null);
  const containerRef = useModalA11y({
    isOpen: Boolean(event),
    onClose: onBack,
    initialFocusRef: backButtonRef,
  });

  if (!event) return null;

  return (
    <div
      className="event-details"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-details-title"
      onClick={onBack}
      ref={containerRef}
    >
      <div
        className="event-details__card"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        <button
          ref={backButtonRef}
          type="button"
          className="event-details__back"
          onClick={onBack}
        >
          <Icon name="ArrowLeft" size={18} />
          Voltar à lista
        </button>

        <div className="event-details__header">
          <div>
            <h2
              id="event-details-title"
              className="event-details__title"
            >
              {event.title}
            </h2>

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
              disabled={isFavoriteLoading}
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

        {isSafeUrl(event.link) && (
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