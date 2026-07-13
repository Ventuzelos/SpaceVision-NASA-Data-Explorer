import './EpicHero.css';
import EpicHeroVideo from '../EpicHeroVideo/EpicHeroVideo';
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";

export default function EpicHero() {
  return (
    <section className="hero" id="hero">
      <div>
        <Breadcrumb title="Earth" />
        <div className="eyebrow">EPIC · Earth Polychromatic Imaging Camera</div>
        <h1 className="headline">
          O nosso planeta. Visto de longe, em tempo real.
        </h1>
        <p className="lede">
          Descubra a Terra como nunca a viu. Através dos olhos da câmara EPIC, a bordo do
          satélite DSCOVR no ponto de Lagrange L1, aceda a imagens atualizadas a cada duas
          horas que capturam a totalidade do disco terrestre totalmente iluminado pelo Sol.
        </p>
        <div className="hero-cta">
          <a href="#viewer" className="btn btn-primary">Ver imagens do dia →</a>
        </div>
        <div className="readout">
          <div><div className="val">1.5M km</div><div className="lab">Distância à Terra</div></div>
          <div><div className="val">10</div><div className="lab">Canais espectrais</div></div>
          <div><div className="val">2015→</div><div className="lab">Em operação desde</div></div>
        </div>
      </div>

      <div className="hero-video-panel">
        <EpicHeroVideo />
      </div>
    </section>
  );
}
