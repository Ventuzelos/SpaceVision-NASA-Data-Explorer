import Button from "../../common/Button/Button";
import "./DateRangeFilter.css";

const DATE_PRESETS = [
  { label: "Últimos 7 dias", days: 7 },
  { label: "Últimos 30 dias", days: 30 },
  { label: "Últimos 90 dias", days: 90 },
];

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getDateRange(daysBack) {
  const endDate = new Date();
  const startDate = new Date();

  startDate.setDate(startDate.getDate() - daysBack);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
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
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handlePresetClick = (days) => {
    const range = getDateRange(days);

    onStartDateChange(range.startDate);
    onEndDateChange(range.endDate);
    onSearch(range.startDate, range.endDate);
  };

  return (
    <form className="date-range-filter" onSubmit={handleSubmit}>
      <div className="date-range-filter__left">
        <span className="date-range-filter__title">Período</span>

        <div className="date-range-filter__presets">
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.days}
              type="button"
              className="date-range-filter__preset"
              onClick={() => handlePresetClick(preset.days)}
              disabled={loading}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="date-range-filter__right">
        <div className="date-range-filter__field">
          <label htmlFor="donki-start-date">Data inicial</label>
          <input
            id="donki-start-date"
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>

        <div className="date-range-filter__field">
          <label htmlFor="donki-end-date">Data final</label>
          <input
            id="donki-end-date"
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "A pesquisar..." : "Pesquisar eventos"}
        </Button>
      </div>
    </form>
  );
}

export default DateRangeFilter;