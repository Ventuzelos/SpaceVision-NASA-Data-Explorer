import "./EpicHero.css";

import EpicHeroVideo from "../EpicHeroVideo/EpicHeroVideo";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";

export default function EpicHero() {
  return (
    <section
      className="epic-hero"
      aria-labelledby="epic-page-title"
    >
      <Breadcrumb title="EPIC" />

      <div className="epic-hero__grid">
        <div className="epic-hero__content">
          <p className="epic-hero__eyebrow">
            EPIC · Earth Polychromatic Imaging Camera
          </p>

          <h1
            id="epic-page-title"
            className="epic-hero__title"
          >
            O nosso planeta. Visto de longe, em tempo real.
          </h1>

          <p className="epic-hero__description">
            Descobre a Terra como nunca a viste. Através dos
            olhos da câmara EPIC, a bordo do satélite DSCOVR
            no ponto de Lagrange L1, acede a imagens
            atualizadas a cada duas horas que capturam a
            totalidade do disco terrestre iluminado pelo Sol.
          </p>

          <div className="epic-hero__actions">
            <a
              href="#viewer"
              className="epic-hero__button"
            >
              Ver imagens do dia
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <dl className="epic-hero__readout">
            <div className="epic-hero__readout-item">
              <dt>Distância à Terra</dt>
              <dd>1,5 milhões km</dd>
            </div>

            <div className="epic-hero__readout-item">
              <dt>Canais espectrais</dt>
              <dd>10</dd>
            </div>

            <div className="epic-hero__readout-item">
              <dt>Em operação desde</dt>
              <dd>2015</dd>
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
