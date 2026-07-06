import { donkiEventTypes } from "../../../services/donkiService";

import "./EventTypeSelector.css";

function EventTypeSelector({ activeType, onSelect }) {
  return (
    <div className="event-type-selector" role="tablist" aria-label="Tipo de evento DONKI">
      {donkiEventTypes.map((type) => (
        <button
          key={type.id}
          type="button"
          role="tab"
          aria-selected={activeType === type.id}
          className={`event-type-card ${
            activeType === type.id ? "event-type-card--active" : ""
          }`}
          style={{ "--type-color": type.color }}
          onClick={() => onSelect(type.id)}
        >
          <span className="event-type-card__icon" aria-hidden="true">
            {type.icon}
          </span>
          <span className="event-type-card__label">{type.shortLabel}</span>
          <span className="event-type-card__description">
            {type.description}
          </span>
        </button>
      ))}
    </div>
  );
}

export default EventTypeSelector;
