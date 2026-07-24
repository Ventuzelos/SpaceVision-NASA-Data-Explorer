import { useState } from "react";

import Button from "../../common/Button/Button";

import {
  MAX_RANGE_DAYS,
  clampDateRange,
} from "../../../services/neowsService";

import "./NeoDateRangeFilter.css";

const PRESETS = [
  {
    label: "Hoje",
    daysAhead: 0,
  },
  {
    label: "Próximos 3 dias",
    daysAhead: 3,
  },
  {
    label: `Próximos ${MAX_RANGE_DAYS} dias`,
    daysAhead: MAX_RANGE_DAYS,
  },
];

function padDatePart(value) {
  return String(value).padStart(2, "0");
}

function toISODate(date) {
  if (
    !(date instanceof Date) ||
    Number.isNaN(date.getTime())
  ) {
    return "";
  }

  const year = date.getFullYear();
  const month = padDatePart(
    date.getMonth() + 1
  );
  const day = padDatePart(
    date.getDate()
  );

  return `${year}-${month}-${day}`;
}

function getLocalToday() {
  return toISODate(new Date());
}

function getFutureRange(daysAhead) {
  const startDate = new Date();
  const endDate = new Date(startDate);

  const safeDaysAhead = Math.min(
    Math.max(Number(daysAhead) || 0, 0),
    MAX_RANGE_DAYS
  );

  endDate.setDate(
    endDate.getDate() + safeDaysAhead
  );

  return {
    startDate: toISODate(startDate),
    endDate: toISODate(endDate),
  };
}

function NeoDateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  loading,
}) {
  const [
    rangeWarning,
    setRangeWarning,
  ] = useState("");

  const today = getLocalToday();

  function applyClamp(
    nextStartDate,
    nextEndDate
  ) {
    const clampedRange =
      clampDateRange(
        nextStartDate,
        nextEndDate
      );

    setRangeWarning(
      clampedRange.wasClamped
        ? `O intervalo máximo permitido pela API é de ${MAX_RANGE_DAYS} dias. A data final foi ajustada.`
        : ""
    );

    return clampedRange;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      loading ||
      typeof onSearch !== "function"
    ) {
      return;
    }

    const clampedRange =
      applyClamp(
        startDate,
        endDate
      );

    onStartDateChange?.(
      clampedRange.startDate
    );

    onEndDateChange?.(
      clampedRange.endDate
    );

    onSearch(
      clampedRange.startDate,
      clampedRange.endDate
    );
  }

  function handlePresetClick(
    daysAhead
  ) {
    if (loading) {
      return;
    }

    const range =
      getFutureRange(daysAhead);

    setRangeWarning("");

    onStartDateChange?.(
      range.startDate
    );

    onEndDateChange?.(
      range.endDate
    );

    onSearch?.(
      range.startDate,
      range.endDate
    );
  }

  function handleStartDateChange(
    value
  ) {
    setRangeWarning("");
    onStartDateChange?.(value);
  }

  function handleEndDateChange(
    value
  ) {
    setRangeWarning("");
    onEndDateChange?.(value);
  }

  return (
    <form
      className="neo-date-filter"
      onSubmit={handleSubmit}
    >
      <div className="neo-date-filter__left">
        <span className="neo-date-filter__title">
          Período de aproximação
        </span>

        <div className="neo-date-filter__presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="neo-date-filter__preset"
              disabled={loading}
              onClick={() =>
                handlePresetClick(
                  preset.daysAhead
                )
              }
            >
              {preset.label}
            </button>
          ))}
        </div>

        {rangeWarning && (
          <p
            className="neo-date-filter__warning"
            role="alert"
          >
            {rangeWarning}
          </p>
        )}
      </div>

      <div className="neo-date-filter__right">
        <div className="neo-date-filter__field">
          <label htmlFor="neo-start-date">
            Data inicial
          </label>

          <input
            id="neo-start-date"
            type="date"
            value={startDate}
            min={today}
            disabled={loading}
            onChange={(event) =>
              handleStartDateChange(
                event.target.value
              )
            }
          />
        </div>

        <div className="neo-date-filter__field">
          <label htmlFor="neo-end-date">
            Data final
          </label>

          <input
            id="neo-end-date"
            type="date"
            value={endDate}
            min={startDate || today}
            disabled={loading}
            onChange={(event) =>
              handleEndDateChange(
                event.target.value
              )
            }
          />
        </div>

        <Button
          type="submit"
          disabled={
            loading ||
            !startDate ||
            !endDate
          }
        >
          {loading
            ? "A pesquisar..."
            : "Pesquisar objetos"}
        </Button>
      </div>
    </form>
  );
}

export default NeoDateRangeFilter;