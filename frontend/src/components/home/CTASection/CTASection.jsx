import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import "./CTASection.css";

const ctaImage =
  "https://images.unsplash.com/photo-1464802686167-b939a6910659?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";

function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="cta-section">
      <div className="container">
        <div
          className="cta-section__card"
          style={{ backgroundImage: `url(${ctaImage})` }}
        >
          <div
            className="cta-section__overlay"
            aria-hidden="true"
          />

          <div className="cta-section__content">
            <h2 className="cta-section__title">
              {t("home.ctaSection.titlePrefix")}{" "}
              <span className="cta-section__title-accent">
                {t("home.ctaSection.titleAccent")}
              </span>
            </h2>

            <p className="cta-section__description">
              {t("home.ctaSection.description")}
            </p>

            <div className="cta-section__actions">
              <Link
                to="/discover"
                className="cta-section__button"
              >
                {t("home.ctaSection.primaryAction")}
              </Link>

              <div className="cta-section__secondary-links">
                <Link
                  to="/neowatch"
                  className="cta-section__secondary-link"
                >
                  {t("home.ctaSection.asteroids")}
                </Link>

                <Link
                  to="/donki"
                  className="cta-section__secondary-link"
                >
                  {t("home.ctaSection.spaceWeather")}
                </Link>

                <Link
                  to="/epic"
                  className="cta-section__secondary-link"
                >
                  {t("home.ctaSection.earth")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;