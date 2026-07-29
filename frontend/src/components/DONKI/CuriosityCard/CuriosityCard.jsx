import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icons } from "../../../constants/icons";
import {
  donkiFacts,
  generalSpaceWeatherFacts,
} from "../../../data/donkiFacts";

import "./CuriosityCard.css";

function pickRandomIndex(length, excludeIndex) {
  if (length <= 1) {
    return 0;
  }

  let index = Math.floor(
    Math.random() * length
  );

  while (index === excludeIndex) {
    index = Math.floor(
      Math.random() * length
    );
  }

  return index;
}

function CuriosityCard({
  type,
  className = "",
}) {
  const { t } = useTranslation();

  const facts = useMemo(
    () =>
      type && donkiFacts[type]?.length
        ? donkiFacts[type]
        : generalSpaceWeatherFacts,
    [type]
  );

  const [factIndex, setFactIndex] =
    useState(() =>
      pickRandomIndex(facts.length)
    );

  function handleNextFact() {
    setFactIndex((current) =>
      pickRandomIndex(
        facts.length,
        current
      )
    );
  }

  const currentFact =
    facts[factIndex] ??
    facts[0] ??
    "";

  return (
    <div
      className={`curiosity-card ${className}`.trim()}
    >
      <span
        className="curiosity-card__icon"
        aria-hidden="true"
      >
        <Icons.Lightbulb
          size={20}
          strokeWidth={2}
        />
      </span>

      <div className="curiosity-card__content">
        <h2 className="curiosity-card__label">
          {t("donki.curiosity.title")}
        </h2>

        <p className="curiosity-card__text">
          {currentFact ? t(currentFact) : ""}
        </p>
      </div>

      {facts.length > 1 && (
        <button
          type="button"
          className="curiosity-card__next"
          onClick={handleNextFact}
          aria-label={t(
            "donki.curiosity.showAnother"
          )}
          title={t(
            "donki.curiosity.showAnother"
          )}
        >
          <Icons.RefreshCw
            size={16}
            strokeWidth={2}
          />
        </button>
      )}
    </div>
  );
}

export default CuriosityCard;