import { useEffect } from "react";
import {
  Trans,
  useTranslation,
} from "react-i18next";
import { useLocation } from "react-router";

import {
  Cog,
  ExternalLink,
  Mail,
  Rocket,
  Target
} from "lucide-react";

import Container from "../../components/common/Container/Container";
import ContactForm from "../../components/common/ContactForm/ContactForm";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import ApiSection from "../../components/home/ApiSection/ApiSection";
import CTASection from "../../components/home/CTASection/CTASection";

import aboutHeroImage from "../../assets/galaxy-night-panorama.webp";
import projectMainImage from "../../assets/milky-way.jpg";
import projectNebulaImage from "../../assets/jeremy-perkins-uhjiu8FjnsQ-unsplash.jpg";
import "./About.css";

const PROJECT_STATS = [
  {
    id: "teamMembers",
    value: "4",
  },
  {
    id: "nasaApis",
    value: "4",
  },
  {
    id: "technologies",
    value: "2",
  },
  {
    id: "realData",
    value: "100%",
  },
];

const TECHNOLOGIES = [
  {
    id: "react",
    name: "React",
  },
  {
    id: "laravel",
    name: "Laravel",
  },
  {
    id: "nasaApis",
    name: "NASA Open APIs",
  },
];

function About() {
  const { t } =
    useTranslation();

  const location =
    useLocation();

  useEffect(() => {
    if (!location.hash) {
      return undefined;
    }

    const sectionId =
      location.hash.replace(
        "#",
        ""
      );

    const section =
      document.getElementById(
        sectionId
      );

    if (!section) {
      return undefined;
    }

    const animationFrame =
      window.requestAnimationFrame(
        () => {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      );

    return () => {
      window.cancelAnimationFrame(
        animationFrame
      );
    };
  }, [location.hash]);

  return (
    <>
      <PageMeta
        title={t(
          "about.meta.title"
        )}
        description={t(
          "about.meta.description"
        )}
      />

      <main className="about-page">
        <section
          className="about-hero"
          style={{
            "--about-hero-image":
              `url(${aboutHeroImage})`,
          }}
          aria-labelledby="about-page-title"
        >
          <div className="about-hero__overlay">
            <Container>
              <Breadcrumb
                title={t(
                  "about.breadcrumb"
                )}
              />
            </Container>

            <div className="about-hero__center">
              <Container>
                <div className="about-hero__content">
                  <p className="about-page__eyebrow">
                    {t(
                      "about.hero.eyebrow"
                    )}
                  </p>

                  <h1
                    id="about-page-title"
                    className="about-hero__title"
                  >
                    {t(
                      "about.hero.title"
                    )}
                  </h1>

                  <p className="about-hero__subtitle">
                    {t(
                      "about.hero.subtitle"
                    )}
                  </p>

                  <div
                    className="about-hero__stats"
                    aria-label={t(
                      "about.hero.statsAria"
                    )}
                  >
                    {PROJECT_STATS.map(
                      ({
                        id,
                        value,
                      }) => (
                        <div
                          key={id}
                          className="about-hero__stat-item"
                        >
                          <span className="about-hero__stat-number">
                            {
                              value
                            }
                          </span>

                          <span className="about-hero__stat-label">
                            {t(
                              `about.hero.stats.${id}`
                            )}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </Container>
            </div>
          </div>
        </section>

        <Container>
          <section
            className="about-section"
            aria-labelledby="about-mission-title"
          >
            <div className="about-section__heading">
              <div>
                <p className="about-page__eyebrow">
                  {t(
                    "about.mission.eyebrow"
                  )}
                </p>

                <h2
                  id="about-mission-title"
                  className="sr-only"
                >
                  {t(
                    "about.mission.title"
                  )}
                </h2>
              </div>
            </div>

            <div className="about-mission-grid">
              <div className="about-mission-item">
                <span
                  className="about-mission-item__icon"
                  aria-hidden="true"
                >
                  <Target
                    size={20}
                  />
                </span>

                <div>
                  <h3>
                    {t(
                      "about.mission.what.title"
                    )}
                  </h3>

                  <p>
                    {t(
                      "about.mission.what.description"
                    )}
                  </p>
                </div>
              </div>

              <div className="about-mission-item">
                <span
                  className="about-mission-item__icon"
                  aria-hidden="true"
                >
                  <Cog
                    size={20}
                  />
                </span>

                <div>
                  <h3>
                    {t(
                      "about.mission.how.title"
                    )}
                  </h3>

                  <p>
                    {t(
                      "about.mission.how.description"
                    )}
                  </p>
                </div>
              </div>

              <div className="about-mission-item">
                <span
                  className="about-mission-item__icon"
                  aria-hidden="true"
                >
                  <Rocket
                    size={20}
                  />
                </span>

                <div>
                  <h3>
                    {t(
                      "about.mission.why.title"
                    )}
                  </h3>

                  <p>
                    {t(
                      "about.mission.why.description"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            className="about-section about-project"
            aria-labelledby="about-project-title"
          >
            <div className="about-project__content">
              <p className="about-page__eyebrow">
                {t(
                  "about.project.eyebrow"
                )}
              </p>

              <h2 id="about-project-title">
                <Trans
                  i18nKey="about.project.title"
                  components={{
                    accent: (
                      <span className="about-project__accent" />
                    ),
                  }}
                />
              </h2>

              <p>
                <Trans
                  i18nKey="about.project.paragraph1"
                  components={{
                    nasaLink: (
                      <a
                        href="https://api.nasa.gov"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                />
              </p>

              <p>
                {t(
                  "about.project.paragraph2"
                )}
              </p>
            </div>

            <div
              className="about-project__collage"
              aria-hidden="true"
            >
              <div className="about-project__image about-project__image--main">
                <img
                  src={
                    projectMainImage
                  }
                  alt=""
                  loading="lazy"
                />
              </div>

              <div className="about-project__image about-project__image--nebula">
                <img
                  src={
                    projectNebulaImage
                  }
                  alt=""
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        </Container>

        <ApiSection
          title={t(
            "about.apiSection.title"
          )}
          subtitle={t(
            "about.apiSection.subtitle"
          )}
        />

        <Container>
          <section
            className="about-section about-technology-section"
            aria-labelledby="about-technology-title"
          >
            <div className="about-section__heading">
              <div>
                <p className="about-page__eyebrow">
                  {t(
                    "about.technology.eyebrow"
                  )}
                </p>

                <h2 id="about-technology-title">
                  {t(
                    "about.technology.title"
                  )}
                </h2>
              </div>

              <p>
                {t(
                  "about.technology.description"
                )}
              </p>
            </div>

            <div className="about-technologies">
              {TECHNOLOGIES.map(
                ({
                  id,
                  name,
                }) => (
                  <div
                    key={id}
                    className="about-hero__stat-item"
                  >
                    <span className="about-hero__stat-number">
                      {
                        name
                      }
                    </span>

                    <span className="about-hero__stat-label">
                      {t(
                        `about.technology.items.${id}`
                      )}
                    </span>
                  </div>
                )
              )}
            </div>
          </section>

        </Container>

        <CTASection />

        <Container>
          <section
            id="contact"
            className="about-contact"
            aria-labelledby="about-contact-title"
          >
            <div className="about-contact__intro">
              <p className="about-page__eyebrow">
                {t(
                  "about.contact.eyebrow"
                )}
              </p>

              <h2 id="about-contact-title">
                {t(
                  "about.contact.title"
                )}
              </h2>

              <p>
                {t(
                  "about.contact.description"
                )}
              </p>

              <div className="about-contact__details">
                <div>
                  <Mail
                    size={19}
                    aria-hidden="true"
                  />

                  <span>
                    {t(
                      "about.contact.projectSupport"
                    )}
                  </span>
                </div>

                <div>
                  <ExternalLink
                    size={19}
                    aria-hidden="true"
                  />

                  <span>
                    {t(
                      "about.contact.nasaDisclaimer"
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="about-contact__form">
              <ContactForm />
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}

export default About;