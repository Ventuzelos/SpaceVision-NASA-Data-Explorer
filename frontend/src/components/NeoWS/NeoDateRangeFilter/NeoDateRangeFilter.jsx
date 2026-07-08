import { useState } from "react";

import Button from "../../common/Button/Button";
import { MAX_RANGE_DAYS, clampDateRange } from "../../../services/neowsService";

import "./NeoDateRangeFilter.css";

const PRESETS = [
  { label: "Hoje", days: 0 },
  { label: "Próximos 3 dias", days: 3 },
  { label: `Próximos ${MAX_RANGE_DAYS} dias`, days: MAX_RANGE_DAYS },
];

function toISODate(date) {
  return date.toISOString().split("T")[0];
}

function getRangeFromToday(daysAhead) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + daysAhead);

  return { startDate: toISODate(startDate), endDate: toISODate(endDate) };
}

function NeoDateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  loading,
}) {
  const [rangeWarning, setRangeWarning] = useState(null);

  const applyClamp = (nextStart, nextEnd) => {
    const clamped = clampDateRange(nextStart, nextEnd);

    setRangeWarning(
      clamped.wasClamped
        ? `O intervalo máximo permitido pela API é de ${MAX_RANGE_DAYS} dias. Ajustámos a data final.`
        : null
    );

    return clamped;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const clamped = applyClamp(startDate, endDate);
    onStartDateChange(clamped.startDate);
    onEndDateChange(clamped.endDate);
    onSearch(clamped.startDate, clamped.endDate);
  };

  const handlePresetClick = (days) => {
    const range = getRangeFromToday(days);

    setRangeWarning(null);
    onStartDateChange(range.startDate);
    onEndDateChange(range.endDate);
    onSearch(range.startDate, range.endDate);
  };

  const handleStartDateChange = (value) => {
    const clamped = applyClamp(value, endDate);
    onStartDateChange(clamped.startDate);
    onEndDateChange(clamped.endDate);
  };

  const handleEndDateChange = (value) => {
    const clamped = applyClamp(startDate, value);
    onEndDateChange(clamped.endDate);
  };

  return (
    <form className="neo-date-filter" onSubmit={handleSubmit}>
      <div className="neo-date-filter__left">
        <span className="neo-date-filter__title">Período de aproximação</span>

        <div className="neo-date-filter__presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="neo-date-filter__preset"
              onClick={() => handlePresetClick(preset.days)}
              disabled={loading}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <p className="neo-date-filter__hint">
          Máximo de {MAX_RANGE_DAYS} dias por pesquisa (limite da API).
        </p>

        {rangeWarning && (
          <p className="neo-date-filter__warning" role="alert">
            {rangeWarning}
          </p>
        )}
      </div>

      <div className="neo-date-filter__right">
        <div className="neo-date-filter__field">
          <label htmlFor="neo-start-date">Data inicial</label>
          <input
            id="neo-start-date"
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
          />
        </div>

        <div className="neo-date-filter__field">
          <label htmlFor="neo-end-date">Data final</label>
          <input
            id="neo-end-date"
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "A pesquisar..." : "Pesquisar objetos"}
        </Button>
      </div>
    </form>
  );
}

export default NeoDateRangeFilter;
