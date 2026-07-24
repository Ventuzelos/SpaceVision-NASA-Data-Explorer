import Button from "../../common/Button/Button";
import "./DateRangeFilter.css";

const DATE_PRESETS = [
  { label: "Últimos 7 dias", days: 7 },
  { label: "Últimos 30 dias", days: 30 },
  { label: "Últimos 90 dias", days: 90 },
];

function padDatePart(value) {
  return String(value).padStart(2, "0");
}

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = padDatePart(date.getMonth() + 1);
  const day = padDatePart(date.getDate());

  return `${year}-${month}-${day}`;
}

function getDateRange(daysBack) {
  const endDate = new Date();
  const startDate = new Date();

  startDate.setDate(startDate.getDate() - daysBack);

  return {
    startDate: formatLocalDate(startDate),
    endDate: formatLocalDate(endDate),
  };
}

function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  loading,
}) {
  const today = formatLocalDate(new Date());

  function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    onSearch();
  }

  function handlePresetClick(days) {
    if (loading) {
      return;
    }

    const range = getDateRange(days);

    onStartDateChange(range.startDate);
    onEndDateChange(range.endDate);
    onSearch(range.startDate, range.endDate);
  }

  return (
    <form
      className="date-range-filter"
      onSubmit={handleSubmit}
      aria-busy={loading}
    >
      <div className="date-range-filter__left">
        <p
          id="date-range-filter-title"
          className="date-range-filter__title"
        >
          Período
        </p>

        <div
          className="date-range-filter__presets"
          role="group"
          aria-labelledby="date-range-filter-title"
        >
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.days}
              type="button"
              className="date-range-filter__preset"
              onClick={() => {
                handlePresetClick(preset.days);
              }}
              disabled={loading}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="date-range-filter__right">
        <div className="date-range-filter__field">
          <label htmlFor="donki-start-date">
            Data inicial
          </label>

          <input
            id="donki-start-date"
            type="date"
            value={startDate}
            max={endDate || today}
            onChange={(event) => {
              onStartDateChange(event.target.value);
            }}
            disabled={loading}
            required
          />
        </div>

        <div className="date-range-filter__field">
          <label htmlFor="donki-end-date">
            Data final
          </label>

          <input
            id="donki-end-date"
            type="date"
            value={endDate}
            min={startDate}
            max={today}
            onChange={(event) => {
              onEndDateChange(event.target.value);
            }}
            disabled={loading}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "A pesquisar..."
            : "Pesquisar eventos"}
        </Button>
      </div>
    </form>
  );
}

export default DateRangeFilter;