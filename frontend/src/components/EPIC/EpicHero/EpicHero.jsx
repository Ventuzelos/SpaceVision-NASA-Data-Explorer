import { useTranslation } from "react-i18next";

import "./EpicHero.css";

import EpicHeroVideo from "../EpicHeroVideo/EpicHeroVideo";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";

export default function EpicHero() {
  const { t } = useTranslation();

  return (
    <section
      className="epic-hero"
      aria-labelledby="epic-page-title"
    >
      <Breadcrumb
        title={t("epic.hero.breadcrumb")}
      />

      <div className="epic-hero__grid">
        <div className="epic-hero__content">
          <p className="epic-hero__eyebrow">
            {t("epic.hero.eyebrow")}
          </p>

          <h1
            id="epic-page-title"
            className="epic-hero__title"
          >
            {t("epic.hero.title")}
          </h1>

          <p className="epic-hero__description">
            {t("epic.hero.description")}
          </p>

          <div className="epic-hero__actions">
            <a
              href="#viewer"
              className="epic-hero__button"
            >
              {t("epic.hero.cta")}
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <dl className="epic-hero__readout">
            <div className="epic-hero__readout-item">
              <dt>
                {t(
                  "epic.hero.readout.distanceLabel"
                )}
              </dt>

              <dd>
                {t(
                  "epic.hero.readout.distanceValue"
                )}
              </dd>
            </div>

            <div className="epic-hero__readout-item">
              <dt>
                {t(
                  "epic.hero.readout.channelsLabel"
                )}
              </dt>

              <dd>
                {t(
                  "epic.hero.readout.channelsValue"
                )}
              </dd>
            </div>

            <div className="epic-hero__readout-item">
              <dt>
                {t(
                  "epic.hero.readout.operationLabel"
                )}
              </dt>

              <dd>
                {t(
                  "epic.hero.readout.operationValue"
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="epic-hero__media">
          <EpicHeroVideo />
        </div>
      </div>
    </section>
  );
}