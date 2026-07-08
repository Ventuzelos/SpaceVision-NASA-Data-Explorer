export default function EpicDateControls({ date, onDateChange, onLoad, onLatest }) {
  return (
    <div className="date-controls">
      <div>
        <div className="field-label">Data</div>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>
      <button className="btn" onClick={onLoad}>Carregar</button>
      <button className="btn" onClick={onLatest}>● Mais recente</button>
    </div>
  );
}