import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { donkiEventTypes } from "../../../services/donkiService";
import { getTodaySeverity } from "../../../utils/donkiStats";

import "./DailyStatusPanel.css";

const LEVEL_CONFIG = {
  normal: {
    labelKey: "donki.dailyStatus.levels.normal.label",
    descriptionKey:
      "donki.dailyStatus.levels.normal.description",
    modifier: "daily-status-panel__gauge--normal",
  },
  moderate: {
    labelKey: "donki.dailyStatus.levels.moderate.label",
    descriptionKey:
      "donki.dailyStatus.levels.moderate.description",
    modifier: "daily-status-panel__gauge--moderate",
  },
  critical: {
    labelKey: "donki.dailyStatus.levels.critical.label",
    descriptionKey:
      "donki.dailyStatus.levels.critical.description",
    modifier: "daily-status-panel__gauge--critical",
  },
};

function DailyStatusPanel({
  type,
  events,
  loading,
  error,
}) {
  const { t } = useTranslation();

  const typeConfig = donkiEventTypes.find(
    (item) => item.id === type
  );

  const status = useMemo(() => {
    if (loading || error) {
      return null;
    }

    return getTodaySeverity(events, type);
  }, [events, type, loading, error]);

  const level = status
    ? LEVEL_CONFIG[status.level]
    : null;

  const typeLabel = typeConfig
    ? t(typeConfig.shortLabelKey)
    : "";

  return (
    <div
      className="daily-status-panel"
      role="status"
      aria-live="polite"
    >
      <h2 className="daily-status-panel__title">
        {t("donki.dailyStatus.title", {
          type: typeLabel,
        })}
      </h2>

      <p className="daily-status-panel__hint">
        {t("donki.dailyStatus.hint")}
      </p>

      {loading && (
        <p className="daily-status-panel__message">
          {t("donki.dailyStatus.loading")}
        </p>
      )}

      {!loading && error && (
        <p className="daily-status-panel__message">
          {t("donki.dailyStatus.unavailable")}
        </p>
      )}

      {!loading &&
        !error &&
        status &&
        level && (
          <div
            className={`daily-status-panel__gauge ${level.modifier}`}
          >
            <span
              className="daily-status-panel__dot"
              aria-hidden="true"
            />

            <div className="daily-status-panel__gauge-text">
              <strong>
                {t(level.labelKey)}
              </strong>

              <p>
                {t(level.descriptionKey)}
              </p>
            </div>

            <span className="daily-status-panel__count">
              {t(
                "donki.dailyStatus.eventCount",
                {
                  count: status.count,
                }
              )}
            </span>
          </div>
        )}
    </div>
  );
}

export default DailyStatusPanel;