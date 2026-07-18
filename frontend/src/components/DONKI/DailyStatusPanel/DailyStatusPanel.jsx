import { useMemo } from "react";

import { donkiEventTypes } from "../../../services/donkiService";
import { getTodaySeverity } from "../../../utils/donkiStats";

import "./DailyStatusPanel.css";

const LEVEL_CONFIG = {
  normal: {
    label: "Normal",
    modifier: "daily-status-panel__gauge--normal",
    description: "Sem atividade significativa registada hoje.",
  },
  moderate: {
    label: "Moderado",
    modifier: "daily-status-panel__gauge--moderate",
    description: "Atividade moderada registada hoje.",
  },
  critical: {
    label: "Crítico",
    modifier: "daily-status-panel__gauge--critical",
    description:
      "Atividade intensa registada hoje — mantém-te atento.",
  },
};

function DailyStatusPanel({ type, events, loading, error }) {
  const typeConfig = donkiEventTypes.find(
    (item) => item.id === type
  );

  const status = useMemo(() => {
    if (loading || error) return null;
    return getTodaySeverity(events, type);
  }, [events, type, loading, error]);

  const level = status ? LEVEL_CONFIG[status.level] : null;

  return (
    <div
      className="daily-status-panel"
      role="status"
      aria-live="polite"
    >
      <h2 className="daily-status-panel__title">
        Estado do Dia · {typeConfig?.shortLabel}
      </h2>

      <p className="daily-status-panel__hint">
        Reflete apenas os eventos de hoje — pode ser
        diferente do total do período de pesquisa
        apresentado mais abaixo.
      </p>

      {loading && (
        <p className="daily-status-panel__message">
          A avaliar o estado do dia...
        </p>
      )}

      {!loading && error && (
        <p className="daily-status-panel__message">
          Sem dados disponíveis para avaliar o estado do
          dia.
        </p>
      )}

      {!loading && !error && status && level && (
        <div
          className={`daily-status-panel__gauge ${level.modifier}`}
        >
          <span
            className="daily-status-panel__dot"
            aria-hidden="true"
          />

          <div className="daily-status-panel__gauge-text">
            <strong>{level.label}</strong>
            <p>{level.description}</p>
          </div>

          <span className="daily-status-panel__count">
            {status.count} evento(s) hoje
          </span>
        </div>
      )}
    </div>
  );
}

export default DailyStatusPanel;
