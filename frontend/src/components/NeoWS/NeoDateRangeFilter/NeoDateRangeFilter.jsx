import { useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "../../common/Button/Button";

import {
  MAX_RANGE_DAYS,
  clampDateRange,
} from "../../../services/neowsService";

import "./NeoDateRangeFilter.css";

const PRESETS = [
  {
    id: "today",
    labelKey: "neows.dateRange.today",
    daysAhead: 0,
  },
  {
    id: "next3Days",
    labelKey: "neows.dateRange.next3Days",
    daysAhead: 3,
  },
  {
    id: "nextMaximumDays",
    labelKey:
      "neows.dateRange.nextMaximumDays",
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
    Math.max(
      Number(daysAhead) || 0,
      0
    ),
    MAX_RANGE_DAYS
  );

  endDate.setDate(
    endDate.getDate() +
      safeDaysAhead
  );

  return {
    startDate:
      toISODate(startDate),
    endDate:
      toISODate(endDate),
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
  const { t } = useTranslation();

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
        ? t(
            "neows.dateRange.rangeAdjusted",
            {
              count:
                MAX_RANGE_DAYS,
            }
          )
        : ""
    );

    return clampedRange;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      loading ||
      typeof onSearch !==
        "function"
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
      getFutureRange(
        daysAhead
      );

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
    const clampedRange =
      applyClamp(
        value,
        endDate
      );

    onStartDateChange?.(
      clampedRange.startDate
    );

    if (
      clampedRange.wasClamped
    ) {
      onEndDateChange?.(
        clampedRange.endDate
      );
    }
  }

  function handleEndDateChange(
    value
  ) {
    setRangeWarning("");

    onEndDateChange?.(
      value
    );
  }

  return (
    <form
      className="neo-date-filter"
      onSubmit={handleSubmit}
      aria-busy={loading}
    >
      <div className="neo-date-filter__left">
        <span
          id="neo-date-filter-title"
          className="neo-date-filter__title"
        >
          {t(
            "neows.dateRange.period"
          )}
        </span>

        <div
          className="neo-date-filter__presets"
          role="group"
          aria-labelledby="neo-date-filter-title"
        >
          {PRESETS.map(
            (preset) => (
              <button
                key={preset.id}
                type="button"
                className="neo-date-filter__preset"
                disabled={loading}
                onClick={() =>
                  handlePresetClick(
                    preset.daysAhead
                  )
                }
              >
                {t(
                  preset.labelKey,
                  {
                    count:
                      MAX_RANGE_DAYS,
                  }
                )}
              </button>
            )
          )}
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
            {t(
              "neows.dateRange.startDate"
            )}
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
            required
          />
        </div>

        <div className="neo-date-filter__field">
          <label htmlFor="neo-end-date">
            {t(
              "neows.dateRange.endDate"
            )}
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
            required
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
            ? t(
                "neows.dateRange.searching"
              )
            : t(
                "neows.dateRange.searchObjects"
              )}
        </Button>
      </div>
    </form>
  );
}

export default NeoDateRangeFilter;