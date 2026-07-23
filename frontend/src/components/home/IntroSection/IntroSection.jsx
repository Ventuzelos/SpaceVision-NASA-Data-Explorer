import { Link } from "react-router-dom";

import nebulaImage from "../../../assets/hero1.webp";

import "./IntroSection.css";

const MAIN_IMAGE =
  "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?crop=entropy&cs=srgb&fm=jpg&q=85&w=800";
const PLANET_IMAGE =
  "https://images.pexels.com/photos/4233216/pexels-photo-4233216.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

function IntroSection() {
  return (
    <section className="intro">
      <div className="container intro__container">
        <div className="intro__content">
          <p className="intro__eyebrow">Introdução</p>

          <h2 className="intro__title">
            O que é o <span className="intro__title-accent">Space Vision</span>?
          </h2>

          <p className="intro__description">
            O Space Vision é um conjunto de ferramentas que te permite
            participar na exploração de asteroides, contribuindo com dados
            diretamente através do teu navegador de internet.
          </p>

          <Link to="/about" className="intro__link">
            Ler mais <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="intro__collage" aria-hidden="true">
          <div className="intro__image intro__image--main">
            <img src={MAIN_IMAGE} alt="" loading="lazy" />
          </div>

          <div className="intro__image intro__image--nebula">
            <img src={nebulaImage} alt="" loading="lazy" />
          </div>

          <div className="intro__image intro__image--planet">
            <img src={PLANET_IMAGE} alt="" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntroSection;
