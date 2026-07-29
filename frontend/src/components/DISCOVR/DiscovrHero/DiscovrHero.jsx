import { useTranslation } from "react-i18next";

import Container from "../../common/Container/Container";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
import SurpriseCard from "../../common/SurpriseCard/SurpriseCard";

import heroImage from "../../../assets/hero.webp";
import astronautVideo from "../../../assets/videos/astronaut-float.mp4";

import "./DiscovrHero.css";

function DiscovrHero() {
  const { t } = useTranslation();

  return (
    <section
      className="discovr-hero"
      aria-labelledby="discovr-page-title"
    >
      <div
        className="discovr-hero__overlay"
        aria-hidden="true"
      />

      <Container>
        <Breadcrumb
          title={t(
            "discovr.hero.breadcrumb"
          )}
        />

        <div className="discovr-hero__grid">
          <div className="discovr-hero__content">
            <p className="discovr-hero__eyebrow">
              <span>
                {t(
                  "discovr.hero.eyebrow"
                )}
              </span>
            </p>

            <h1
              id="discovr-page-title"
              className="discovr-hero__title"
            >
              {t(
                "discovr.hero.title"
              )}
            </h1>

            <p className="discovr-hero__description">
              {t(
                "discovr.hero.description"
              )}
            </p>

            <SurpriseCard />

            <dl className="discovr-hero__readout">
              <div className="discovr-hero__readout-item">
                <dt>
                  {t(
                    "discovr.hero.readout.interactiveSections"
                  )}
                </dt>

                <dd>6</dd>
              </div>

              <div className="discovr-hero__readout-item">
                <dt>
                  {t(
                    "discovr.hero.readout.update"
                  )}
                </dt>

                <dd>
                  {t(
                    "discovr.hero.readout.dailyApod"
                  )}
                </dd>
              </div>

              <div className="discovr-hero__readout-item">
                <dt>
                  {t(
                    "discovr.hero.readout.solarSystem"
                  )}
                </dt>

                <dd>
                  {t(
                    "discovr.hero.readout.simulation"
                  )}
                </dd>
              </div>
            </dl>
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
                label={t(
                  "discovr.hero.videoCaptionLabel"
                )}
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