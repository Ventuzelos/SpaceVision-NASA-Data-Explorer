import { useTranslation } from "react-i18next";

import { donkiEventTypes } from "../../../services/donkiService";
import { Icons } from "../../../constants/icons";

import "./EventTypeSelector.css";

const donkiIcons = {
  sun: Icons.Sun,
  waves: Icons.Waves,
  magnet: Icons.Magnet,
  sparkles: Icons.Sparkles,
  wind: Icons.Wind,
  bell: Icons.Bell,
};

function EventTypeSelector({
  activeType,
  onSelect,
  notificationsCount,
}) {
  const { t } = useTranslation();

  return (
    <div
      className="event-type-selector"
      role="tablist"
      aria-label={t("donki.eventTypes.ariaLabel")}
    >
      {donkiEventTypes.map((type) => {
        const Icon = donkiIcons[type.icon];

        const showBadge =
          type.id === "NOTIFICATIONS" &&
          typeof notificationsCount === "number" &&
          notificationsCount > 0;

        return (
          <button
            key={type.id}
            type="button"
            role="tab"
            aria-selected={activeType === type.id}
            className={`event-type-card ${
              type.id === "NOTIFICATIONS"
                ? "event-type-card--feed"
                : ""
            } ${
              activeType === type.id
                ? "event-type-card--active"
                : ""
            }`}
            style={{ "--type-color": type.color }}
            onClick={() => onSelect(type.id)}
          >
            <span
              className="event-type-card__icon"
              aria-hidden="true"
            >
              {Icon && (
                <Icon
                  size={24}
                  strokeWidth={2}
                />
              )}

              {showBadge && (
                <span className="event-type-card__badge">
                  {notificationsCount}
                </span>
              )}
            </span>

            <span className="event-type-card__label">
              {t(type.shortLabelKey)}
            </span>

            <span className="event-type-card__description">
              {t(type.descriptionKey)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default EventTypeSelector;