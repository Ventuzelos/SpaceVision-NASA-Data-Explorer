import { useState } from "react";
import { useTranslation } from "react-i18next";

import Icon from "../Icon/Icon";
import Button from "../Button/Button";

import "./SurpriseCard.css";

const SPACE_FACT_KEYS = [
  "discovr.surpriseCard.facts.venusDay",
  "discovr.surpriseCard.facts.voyager",
  "discovr.surpriseCard.facts.olympusMons",
  "discovr.surpriseCard.facts.issSpeed",
  "discovr.surpriseCard.facts.stars",
  "discovr.surpriseCard.facts.jamesWebb",
  "discovr.surpriseCard.facts.neptuneYear",
  "discovr.surpriseCard.facts.newHorizons",
  "discovr.surpriseCard.facts.sunMass",
  "discovr.surpriseCard.facts.moonFootprints",
  "discovr.surpriseCard.facts.saturnDensity",
  "discovr.surpriseCard.facts.sunlight",
];

function pickRandomFactIndex(currentIndex) {
  if (SPACE_FACT_KEYS.length <= 1) {
    return 0;
  }

  let nextIndex = Math.floor(
    Math.random() * SPACE_FACT_KEYS.length
  );

  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(
      Math.random() * SPACE_FACT_KEYS.length
    );
  }

  return nextIndex;
}

function SurpriseCard() {
  const { t } = useTranslation();

  const [factIndex, setFactIndex] =
    useState(0);

  const [
    hasRevealedFact,
    setHasRevealedFact,
  ] = useState(false);

  function handleSurpriseMe() {
    setFactIndex((current) =>
      pickRandomFactIndex(current)
    );

    setHasRevealedFact(true);
  }

  return (
    <div className="surprise-card">
      <Button onClick={handleSurpriseMe}>
        {hasRevealedFact
          ? t(
              "discovr.surpriseCard.anotherFact"
            )
          : t(
              "discovr.surpriseCard.surpriseMe"
            )}
      </Button>

      {hasRevealedFact && (
        <div
          className="surprise-card__reveal"
          key={factIndex}
        >
          <Icon
            name="Sparkles"
            size={16}
            className="surprise-card__icon"
            aria-hidden="true"
          />

          <p className="surprise-card__fact">
            {t(
              SPACE_FACT_KEYS[factIndex]
            )}
          </p>

          <button
            type="button"
            className="surprise-card__close"
            onClick={() =>
              setHasRevealedFact(false)
            }
            aria-label={t(
              "discovr.surpriseCard.closeAria"
            )}
          >
            <Icon
              name="X"
              size={14}
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </div>
  );
}

export default SurpriseCard;