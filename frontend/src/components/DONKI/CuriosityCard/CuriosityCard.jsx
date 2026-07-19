import { useMemo, useState } from "react";

import { Icons } from "../../../constants/icons";
import {
  donkiFacts,
  generalSpaceWeatherFacts,
} from "../../../data/donkiFacts";

import "./CuriosityCard.css";

function pickRandomIndex(length, excludeIndex) {
  if (length <= 1) return 0;

  let index = Math.floor(Math.random() * length);

  while (index === excludeIndex) {
    index = Math.floor(Math.random() * length);
  }

  return index;
}

function CuriosityCard({ type, className = "" }) {
  const facts = useMemo(
    () =>
      type && donkiFacts[type]?.length
        ? donkiFacts[type]
        : generalSpaceWeatherFacts,
    [type]
  );

  // Inicializa o estado com base na lista de factos computada
  const [factIndex, setFactIndex] = useState(() => pickRandomIndex(facts.length));

  function handleNextFact() {
    setFactIndex((current) =>
      pickRandomIndex(facts.length, current)
    );
  }

  return (
    <div className={`curiosity-card ${className}`.trim()}>
      <span className="curiosity-card__icon" aria-hidden="true">
        <Icons.Lightbulb size={20} strokeWidth={2} />
      </span>

      <div className="curiosity-card__content">
        <h2 className="curiosity-card__label">Sabias que...</h2>
        <p className="curiosity-card__text">{facts[factIndex] ?? facts[0]}</p>
      </div>

      {facts.length > 1 && (
        <button
          type="button"
          className="curiosity-card__next"
          onClick={handleNextFact}
          aria-label="Mostrar outra curiosidade"
          title="Mostrar outra curiosidade"
        >
          <Icons.RefreshCw size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

export default CuriosityCard;
