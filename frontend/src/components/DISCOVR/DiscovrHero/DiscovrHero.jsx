import Container from "../../common/Container/Container";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
import SurpriseCard from "../../common/SurpriseCard/SurpriseCard";

import heroImage from "../../../assets/hero.webp";
import astronautVideo from "../../../assets/videos/astronaut-float.mp4";

import "./DiscovrHero.css";

function DiscovrHero() {
  return (
    <section
      className="discovr-hero"
      aria-labelledby="discovr-page-title"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      <div
        className="discovr-hero__overlay"
        aria-hidden="true"
      />

      <Container>
        <Breadcrumb title="Descobrir" />

        <div className="discovr-hero__grid">
          <div className="discovr-hero__content">
            <p className="discovr-hero__badge">
              <span>Descobrir</span>
            </p>

            <h1
              id="discovr-page-title"
              className="discovr-hero__title"
            >
              Descobre o Universo
            </h1>

            <p className="discovr-hero__description">
              Curiosidades, missões icónicas e o estado
              atual dos exploradores que continuam a
              expandir os limites do conhecimento humano.
            </p>

            <SurpriseCard />
          </div>

          <div
            className="discovr-hero__media"
            aria-hidden="true"
          >
            <video
              className="discovr-hero__video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              disablePictureInPicture
              disableRemotePlayback
              aria-hidden="true"
              tabIndex={-1}
              poster={heroImage}
            >
              <source
                src={astronautVideo}
                type="video/mp4"
              />

              <track
                kind="captions"
                src="/captions/decorative-video.vtt"
                srcLang="pt"
                label="Português"
                default
              />
            </video>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default DiscovrHero;