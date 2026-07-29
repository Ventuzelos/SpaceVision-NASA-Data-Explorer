import { useTranslation } from "react-i18next";

import "./NeoSortControl.css";

function NeoSortControl({
  direction,
  onChange,
  count,
}) {
  const { t } = useTranslation();

  return (
    <div className="neo-sort">
      <span className="neo-sort__count">
        {t("neows.sort.resultsCount", {
          count,
        })}
      </span>

      <div
        className="neo-sort__toggle"
        role="group"
        aria-label={t(
          "neows.sort.ariaLabel"
        )}
      >
        <button
          type="button"
          className={`neo-sort__btn ${
            direction === "asc"
              ? "neo-sort__btn--active"
              : ""
          }`}
          onClick={() =>
            onChange("asc")
          }
          aria-pressed={
            direction === "asc"
          }
        >
          {t(
            "neows.sort.closestFirst"
          )}
        </button>

        <button
          type="button"
          className={`neo-sort__btn ${
            direction === "desc"
              ? "neo-sort__btn--active"
              : ""
          }`}
          onClick={() =>
            onChange("desc")
          }
          aria-pressed={
            direction === "desc"
          }
        >
          {t(
            "neows.sort.farthestFirst"
          )}
        </button>
      </div>
    </div>
  );
}

export default NeoSortControl;