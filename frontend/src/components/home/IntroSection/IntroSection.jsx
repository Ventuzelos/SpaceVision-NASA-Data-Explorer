import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import nebulaImage from "../../../assets/lua2.webp";

import "../../common/Button/Button.css";
import "./IntroSection.css";

const MAIN_IMAGE =
  "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?crop=entropy&cs=srgb&fm=jpg&q=85&w=800";

const PLANET_IMAGE =
  "https://images.pexels.com/photos/4233216/pexels-photo-4233216.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

function IntroSection() {
  const { t } = useTranslation();

  return (
    <section className="intro">
      <div className="container intro__container">
        <div className="intro__content">
          <p className="intro__eyebrow">
            {t("home.intro.eyebrow")}
          </p>

          <h2 className="intro__title">
            {t("home.intro.titlePrefix")}{" "}
            <span className="intro__title-accent">
              Space Vision
            </span>
            ?
          </h2>

          <p className="intro__description">
            {t("home.intro.description")}
          </p>

          <Link
            to="/about"
            className="btn btn--primary intro__link"
          >
            {t("home.intro.readMore")}{" "}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div
          className="intro__collage"
          aria-hidden="true"
        >
          <div className="intro__image intro__image--main">
            <img
              src={MAIN_IMAGE}
              alt=""
              loading="lazy"
            />
          </div>

          <div className="intro__image intro__image--nebula">
            <img
              src={nebulaImage}
              alt=""
              loading="lazy"
            />
          </div>

          <div className="intro__image intro__image--planet">
            <img
              src={PLANET_IMAGE}
              alt=""
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntroSection;