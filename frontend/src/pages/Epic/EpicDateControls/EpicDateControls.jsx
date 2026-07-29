import { useTranslation } from "react-i18next";

import "./EpicDateControls.css";

function getLocalToday() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function EpicDateControls({
  date,
  onDateChange,
  onLoad,
  onLatest,
  loading,
  validationError,
}) {
  const { t } = useTranslation();

  function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    onLoad();
  }

  return (
    <form
      className="epic-date-controls"
      onSubmit={handleSubmit}
      aria-busy={loading}
    >
      <div className="epic-date-controls__field">
        <label
          className="epic-date-controls__label"
          htmlFor="epic-date"
        >
          {t("epic.dateControls.dateLabel")}
        </label>

        <input
          id="epic-date"
          type="date"
          value={date}
          max={getLocalToday()}
          disabled={loading}
          aria-invalid={Boolean(
            validationError
          )}
          aria-describedby={
            validationError
              ? "epic-date-error"
              : undefined
          }
          onChange={(event) =>
            onDateChange(
              event.target.value
            )
          }
        />

        {validationError && (
          <span
            id="epic-date-error"
            className="epic-date-controls__error"
            role="alert"
          >
            {validationError}
          </span>
        )}
      </div>

      <button
        className="epic-date-controls__button"
        type="submit"
        disabled={loading}
      >
        {loading
          ? t(
              "epic.dateControls.loading"
            )
          : t(
              "epic.dateControls.load"
            )}
      </button>

      <button
        className="epic-date-controls__button"
        type="button"
        disabled={loading}
        onClick={onLatest}
      >
        {t("epic.dateControls.latest")}
      </button>
    </form>
  );
}