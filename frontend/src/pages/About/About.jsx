import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  Cog,
  ExternalLink,
  Mail,
  Rocket,
  Target,
  User,
} from "lucide-react";

import Container from "../../components/common/Container/Container";
import ContactForm from "../../components/common/ContactForm/ContactForm";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import ApiSection from "../../components/home/ApiSection/ApiSection";
import CTASection from "../../components/home/CTASection/CTASection";

import { teamMembers } from "../../data/team";

import aboutHeroImage from "../../assets/galaxy-night-panorama.webp";
import projectMainImage from "../../assets/milky-way.jpg";
import projectNebulaImage from "../../assets/jeremy-perkins-uhjiu8FjnsQ-unsplash.jpg";

import "./About.css";

const PROJECT_STATS = [
  {
    value: "4",
    label: "Elementos na equipa",
  },
  {
    value: "4",
    label: "APIs principais da NASA",
  },
  {
    value: "2",
    label: "Tecnologias principais",
  },
  {
    value: "100%",
    label: "Dados reais da NASA",
  },
];

const TECHNOLOGIES = [
  {
    name: "React",
    description:
      "Interface responsiva, componentes reutilizáveis e experiência interativa.",
  },
  {
    name: "Laravel",
    description:
      "API, autenticação, segurança, cache e ligação à base de dados.",
  },
  {
    name: "NASA Open APIs",
    description:
      "Dados astronómicos, meteorologia espacial e observação da Terra.",
  },
];

function About() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const sectionId = location.hash.replace("#", "");
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [location.hash]);

  return (
    <>
      <PageMeta
        title="Sobre o SpaceVision"
        description="Conhece o SpaceVision, um projeto que reúne dados oficiais da NASA numa experiência visual, educativa e acessível."
      />

      <main className="about-page">
        <section
          className="about-hero"
          style={{ "--about-hero-image": `url(${aboutHeroImage})` }}
          aria-labelledby="about-page-title"
        >
          <div className="about-hero__overlay">
            <Container>
              <Breadcrumb title="Sobre nós" />

              <div className="about-hero__content">
                <p className="about-page__eyebrow">
                  O projeto por detrás da exploração
                </p>

                <h1
                  id="about-page-title"
                  className="about-hero__title"
                >
                  Tornamos os dados da NASA mais próximos de todos.
                </h1>

                <p className="about-hero__subtitle">
                  O SpaceVision descomplica a ciência espacial. Uma plataforma
                  interativa e acessível que transforma os dados mais
                  complexos da NASA numa experiência puramente visual e
                  intuitiva.
                </p>

                <div
                  className="about-hero__stats"
                  aria-label="Informação geral do projeto"
                >
                  {PROJECT_STATS.map(({ value, label }) => (
                    <div
                      key={label}
                      className="about-hero__stat-item"
                    >
                      <span className="about-hero__stat-number">
                        {value}
                      </span>
                      <span className="about-hero__stat-label">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
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
                  01 / A Nossa Missão
                </p>

                <h2
                  id="about-mission-title"
                  className="sr-only"
                >
                  A nossa missão
                </h2>
              </div>
            </div>

            <div className="about-mission-grid">
              <div className="about-mission-item">
                <span
                  className="about-mission-item__icon"
                  aria-hidden="true"
                >
                  <Target size={20} />
                </span>

                <div>
                  <h3>O que fazemos</h3>
                  <p>
                    Democratizar o acesso à ciência espacial para todos os
                    utilizadores.
                  </p>
                </div>
              </div>

              <div className="about-mission-item">
                <span
                  className="about-mission-item__icon"
                  aria-hidden="true"
                >
                  <Cog size={20} />
                </span>

                <div>
                  <h3>Como fazemos</h3>
                  <p>
                    Traduzir dados brutos da NASA em aplicações práticas,
                    visuais e de fácil compreensão.
                  </p>
                </div>
              </div>

              <div className="about-mission-item">
                <span
                  className="about-mission-item__icon"
                  aria-hidden="true"
                >
                  <Rocket size={20} />
                </span>

                <div>
                  <h3>Porquê o fazemos</h3>
                  <p>
                    Inspirar a próxima geração de exploradores, cientistas
                    e entusiastas do universo.
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
                02 / O Projeto
              </p>

              <h2 id="about-project-title">
                Uma ponte digital para a{" "}
                <span className="about-project__accent">
                  ciência espacial
                </span>
                .
              </h2>

              <p>
                Este projeto nasceu do fascínio profundo pelas ciências do
                espaço e da oportunidade incrível aberta pelo programa
                oficial{" "}
                <a
                  href="https://api.nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NASA Open APIs
                </a>
                .
              </p>

              <p>
                Sabemos que os dados científicos e astronómicos podem ser
                intimidantes para o público geral. Por isso, criámos uma
                ponte digital que organiza, filtra e ilustra estas
                informações de forma simples, rápida e intuitiva.
              </p>
            </div>

            <div
              className="about-project__collage"
              aria-hidden="true"
            >
              <div className="about-project__image about-project__image--main">
                <img
                  src={projectMainImage}
                  alt=""
                  loading="lazy"
                />
              </div>

              <div className="about-project__image about-project__image--nebula">
                <img
                  src={projectNebulaImage}
                  alt=""
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        </Container>

        <ApiSection
          title="O que Vais Encontrar Aqui"
          subtitle="Ferramentas ao teu alcance"
        />

        <Container>
          <section
            className="about-section about-technology-section"
            aria-labelledby="about-technology-title"
          >
            <div className="about-section__heading">
              <div>
                <p className="about-page__eyebrow">
                  Tecnologia
                </p>

                <h2 id="about-technology-title">
                  Construído como um produto digital real
                </h2>
              </div>

              <p>
                O projeto combina frontend, backend, autenticação, base de
                dados, integração de APIs e princípios de UX/UI.
              </p>
            </div>

            <div className="about-technologies">
              {TECHNOLOGIES.map(({ name, description }) => (
                <div
                  key={name}
                  className="about-hero__stat-item"
                >
                  <span className="about-hero__stat-number">
                    {name}
                  </span>
                  <span className="about-hero__stat-label">
                    {description}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section
            className="about-section"
            aria-labelledby="about-team-title"
          >
            <div className="about-section__heading">
              <div>
                <p className="about-page__eyebrow">
                  A equipa
                </p>

                <h2 id="about-team-title">
                  Por Trás do Projeto
                </h2>
              </div>

              <p>
                Conhece as mentes que desenharam a rota entre a Terra e os
                dados da NASA.
              </p>
            </div>

            <div className="about-team-grid">
              {teamMembers.map((member) => (
                <article
                  key={member.name}
                  className="about-team-card"
                >
                  <div
                    className="about-team-card__photo"
                    aria-hidden="true"
                  >
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt=""
                        loading="lazy"
                      />
                    ) : (
                      <User size={36} />
                    )}
                  </div>

                  <h3 className="about-team-card__name">
                    {member.name}
                  </h3>

                  {(member.github ||
                    member.linkedin ||
                    member.portfolio) && (
                    <div
                      className="about-team-card__links"
                      aria-label={`Perfis profissionais de ${member.name}`}
                    >
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Abrir o GitHub de ${member.name} numa nova janela`}
                          title={`GitHub de ${member.name}`}
                        >
                          <ExternalLink
                            size={18}
                            aria-hidden="true"
                          />
                        </a>
                      )}

                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Abrir o LinkedIn de ${member.name} numa nova janela`}
                          title={`LinkedIn de ${member.name}`}
                        >
                          <ExternalLink
                            size={18}
                            aria-hidden="true"
                          />
                        </a>
                      )}

                      {member.portfolio && (
                        <a
                          href={member.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Abrir o portfólio de ${member.name} numa nova janela`}
                          title={`Portfólio de ${member.name}`}
                        >
                          <ExternalLink
                            size={18}
                            aria-hidden="true"
                          />
                        </a>
                      )}
                    </div>
                  )}
                </article>
              ))}
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
                Contacto
              </p>

              <h2 id="about-contact-title">
                Vamos falar sobre o Universo?
              </h2>

              <p>
                Encontraste um problema, tens uma sugestão ou queres saber mais
                sobre o projeto? Envia-nos uma mensagem.
              </p>

              <div className="about-contact__details">
                <div>
                  <Mail size={19} aria-hidden="true" />

                  <span>
                    Respondemos a questões relacionadas com o projeto e com a
                    utilização da plataforma.
                  </span>
                </div>

                <div>
                  <ExternalLink
                    size={19}
                    aria-hidden="true"
                  />

                  <span>
                    Os dados científicos pertencem às respetivas fontes e
                    serviços oficiais da NASA.
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