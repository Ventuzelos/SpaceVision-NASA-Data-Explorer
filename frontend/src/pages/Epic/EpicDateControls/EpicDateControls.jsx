import './EpicDateControls.css';

export default function EpicDateControls({
  date,
  onDateChange,
  onLoad,
  onLatest,
  loading,
  validationError,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onLoad();
  }

  return (
    <form
      className="epic-date-controls"
      onSubmit={handleSubmit}
    >
      <div className="epic-date-controls__field">
        <label
          className="epic-date-controls__label"
          htmlFor="epic-date"
        >
          Data
        </label>

        <input
          id="epic-date"
          type="date"
          value={date}
          max={new Date().toISOString().split('T')[0]}
          disabled={loading}
          aria-invalid={Boolean(validationError)}
          aria-describedby={
            validationError
              ? 'epic-date-error'
              : undefined
          }
          onChange={(event) =>
            onDateChange(event.target.value)
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
        {loading ? "A carregar..." : "Carregar"}
      </button>

      <button
        className="epic-date-controls__button"
        type="button"
        disabled={loading}
        onClick={onLatest}
      >
        Mais recente
      </button>
    </form>
  );
}
