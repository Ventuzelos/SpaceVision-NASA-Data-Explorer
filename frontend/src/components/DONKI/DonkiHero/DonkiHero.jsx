import { useTranslation } from "react-i18next";

import "./DonkiHero.css";

import DonkiHeroVideo from "../DonkiHeroVideo/DonkiHeroVideo";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";

export default function DonkiHero() {
  const { t } = useTranslation();

  return (
    <section
      className="donki-hero"
      aria-labelledby="donki-page-title"
    >
      <Breadcrumb
        title={t("donki.hero.breadcrumb")}
      />

      <div className="donki-hero__grid">
        <div className="donki-hero__content">
          <p className="donki-hero__eyebrow">
            {t("donki.hero.eyebrow")}
          </p>

          <h1
            id="donki-page-title"
            className="donki-hero__title"
          >
            {t("donki.hero.title")}
          </h1>

          <p className="donki-hero__description">
            {t("donki.hero.description")}
          </p>
        </div>

        <div
          className="donki-hero__media"
          aria-hidden="true"
        >
          <DonkiHeroVideo />
        </div>
      </div>
    </section>
  );
}