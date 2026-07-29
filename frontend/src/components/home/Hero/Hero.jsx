import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { Icons } from "../../../constants/icons";
import SearchInput from "../../common/SearchInput/SearchInput";
import heroImage from "../../../assets/astronaut_nasa.jpg";
import { searchablePages } from "../../../constants/searchPages";

import "../../common/Button/Button.css";
import "./Hero.css";

const searchIcons = {
  sun: Icons.Sun,
  globe: Icons.Globe,
  asteroid: Icons.Orbit,
  rocket: Icons.Rocket,
  help: Icons.HelpCircle,
};

function Hero() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPages = searchablePages.filter((page) => {
    const searchValue = searchTerm.toLowerCase().trim();

    if (!searchValue) return false;

    const translatedTitle = t(page.titleKey).toLowerCase();
    const translatedSubtitle = t(page.subtitleKey).toLowerCase();

    return (
      translatedTitle.includes(searchValue) ||
      translatedSubtitle.includes(searchValue) ||
      page.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchValue)
      )
    );
  });

  return (
    <section
      className="hero"
      style={{ "--hero-image": `url(${heroImage})` }}
    >
      <div className="hero__overlay">
        <div className="container hero__container">
          <div className="hero__content">
            <span className="hero__welcome-text">
              {t("home.hero.welcome")}
            </span>

            <h1 className="hero__title">
              SPACE VISION
            </h1>

            <p className="hero__description">
              {t("home.hero.description")}
            </p>

            <div className="hero__search">
              <SearchInput
                placeholder={t("home.hero.searchPlaceholder")}
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

              {filteredPages.length > 0 && (
                <div className="hero__search-results">
                  {filteredPages.map((page) => {
                    const Icon = searchIcons[page.icon];

                    return (
                      <Link
                        key={page.path}
                        to={page.path}
                        className="hero__search-result"
                      >
                        <span className="hero__search-result-icon-wrapper">
                          {Icon && (
                            <Icon
                              className="hero__search-result-icon"
                              size={18}
                              aria-hidden="true"
                            />
                          )}
                        </span>

                        <span className="hero__search-result-content">
                          <strong>{t(page.titleKey)}</strong>
                          <span>{t(page.subtitleKey)}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="hero__stats">
              <div className="hero__stat-item">
                <span className="hero__stat-number">
                  4
                </span>

                <span className="hero__stat-label">
                  {t("home.hero.stats.nasaApis")}
                </span>
              </div>

              <div className="hero__stat-item">
                <span className="hero__stat-number">
                  &infin;
                </span>

                <span className="hero__stat-label">
                  {t("home.hero.stats.cosmicObjects")}
                </span>
              </div>

              <div className="hero__stat-item">
                <span className="hero__stat-number">
                  24/7
                </span>

                <span className="hero__stat-label">
                  {t("home.hero.stats.liveData")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;