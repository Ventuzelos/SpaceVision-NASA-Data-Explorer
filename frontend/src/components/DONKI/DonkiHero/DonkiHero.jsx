import "./DonkiHero.css";

import DonkiHeroVideo from "../DonkiHeroVideo/DonkiHeroVideo";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";

export default function DonkiHero() {
  return (
    <section
      className="donki-hero"
      aria-labelledby="donki-page-title"
    >
      <Breadcrumb title="DONKI" />

      <div className="donki-hero__grid">
        <div className="donki-hero__content">
          <p className="donki-hero__eyebrow">
            DONKI · Base de dados de meteorologia espacial da NASA
          </p>

          <h1
            id="donki-page-title"
            className="donki-hero__title"
          >
            Meteorologia espacial em tempo real
          </h1>

          <p className="donki-hero__description">
            Consulta erupções solares, ejeções de massa
            coronal, tempestades geomagnéticas e outros
            fenómenos monitorizados pela NASA para
            perceber o que está a acontecer à volta do
            Sol e da Terra.
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
