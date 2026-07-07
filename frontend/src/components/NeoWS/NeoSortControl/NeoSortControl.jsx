import "./NeoSortControl.css";

function NeoSortControl({ direction, onChange, count }) {
  return (
    <div className="neo-sort">
      <span className="neo-sort__count">
        {count} objeto{count === 1 ? "" : "s"} encontrado{count === 1 ? "" : "s"}
      </span>

      <div
        className="neo-sort__toggle"
        role="group"
        aria-label="Ordenar por distância de aproximação"
      >
        <button
          type="button"
          className={`neo-sort__btn ${
            direction === "asc" ? "neo-sort__btn--active" : ""
          }`}
          onClick={() => onChange("asc")}
          aria-pressed={direction === "asc"}
        >
          Mais próximo primeiro
        </button>

        <button
          type="button"
          className={`neo-sort__btn ${
            direction === "desc" ? "neo-sort__btn--active" : ""
          }`}
          onClick={() => onChange("desc")}
          aria-pressed={direction === "desc"}
        >
          Mais distante primeiro
        </button>
      </div>
    </div>
  );
}

export default NeoSortControl;
