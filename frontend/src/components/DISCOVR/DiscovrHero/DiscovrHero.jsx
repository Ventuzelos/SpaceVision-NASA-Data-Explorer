import Container from "../../common/Container/Container";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
import Icon from "../../common/Icon/Icon";
import DiscovrSurpriseCard from "../DiscovrSurpriseCard/DiscovrSurpriseCard";

import heroImage from "../../../assets/hero.webp";
import astronautVideo from "../../../assets/videos/astronaut-float.mp4";

import "./DiscovrHero.css";

function DiscovrHero() {
  return (
    <section
      className="discovr-hero"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="discovr-hero__overlay" />

      <Container>
        <Breadcrumb title="Discover" />

        <div className="discovr-hero__grid">
          <div className="discovr-hero__content">
            <div className="discovr-hero__badge">
              <Icon name="Sparkles" size={16} />
              <span>Discover</span>
            </div>

            <h1>Descobre o Universo</h1>

            <p>
              Curiosidades, missões icónicas e o estado atual dos
              exploradores que continuam a expandir os limites do
              conhecimento humano.
            </p>

            <DiscovrSurpriseCard />
          </div>

          <div className="discovr-hero__astronaut">
            <video
              className="discovr-hero__astronaut-video"
              src={astronautVideo}
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              disableRemotePlayback
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default DiscovrHero;
