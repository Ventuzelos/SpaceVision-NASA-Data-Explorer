import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  Code2,
  Database,
  ExternalLink,
  Globe2,
  Heart,
  Mail,
  Rocket,
  Satellite,
  Sparkles,
  Users,
} from "lucide-react";

import Container from "../../components/common/Container/Container";
import ContactForm from "../../components/common/ContactForm/ContactForm";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import { teamMembers } from "../../data/team";

import "./About.css";

const PROJECT_STATS = [
  {
    value: "4",
    label: "Elementos na equipa",
    icon: Users,
  },
  {
    value: "4",
    label: "APIs principais da NASA",
    icon: Satellite,
  },
  {
    value: "2",
    label: "Tecnologias principais",
    icon: Code2,
  },
  {
    value: "100%",
    label: "Dados reais da NASA",
    icon: Globe2,
  },
];

const TECHNOLOGIES = [
  {
    name: "React",
    description:
      "Interface responsiva, componentes reutilizáveis e experiência interativa.",
    icon: Code2,
  },
  {
    name: "Laravel",
    description:
      "API, autenticação, segurança, cache e ligação à base de dados.",
    icon: Database,
  },
  {
    name: "NASA Open APIs",
    description:
      "Dados astronómicos, meteorologia espacial e observação da Terra.",
    icon: Rocket,
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
        <Container>
          <Breadcrumb title="Sobre nós" />

          <section
            className="about-hero"
            aria-labelledby="about-page-title"
          >
            <div className="about-hero__content">
              <p className="about-page__eyebrow">
                O projeto por detrás da exploração
              </p>

              <h1 id="about-page-title">
                Tornamos os dados da NASA mais próximos de todos.
              </h1>

              <p className="about-hero__description">
                O SpaceVision é um explorador digital criado para transformar
                informação científica complexa numa experiência simples,
                visual e acessível.
              </p>

              <p className="about-hero__context">
                Desenvolvido por quatro alunas do curso de Software Developer
                do CESAE Digital.
              </p>
            </div>

            <div
              className="about-hero__visual"
              aria-hidden="true"
            >
              <div className="about-orbit about-orbit--outer">
                <div className="about-orbit__planet" />
              </div>

              <div className="about-orbit about-orbit--inner">
                <div className="about-orbit__satellite">
                  <Satellite size={26} />
                </div>
              </div>

              <div className="about-hero__core">
                <Sparkles size={42} />
                <span>SpaceVision</span>
              </div>
            </div>
          </section>

          <section
            className="about-stats"
            aria-labelledby="about-stats-title"
          >
            <h2
              id="about-stats-title"
              className="sr-only"
            >
              Informação geral do projeto
            </h2>

            {PROJECT_STATS.map(
              ({ value, label, icon: StatIcon }) => (
                <article
                  key={label}
                  className="about-stat"
                >
                  <div
                    className="about-stat__icon"
                    aria-hidden="true"
                  >
                    <StatIcon size={20} />
                  </div>

                  <div className="about-stat__content">
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                </article>
              )
            )}
          </section>

          <section
            className="about-section"
            aria-labelledby="about-mission-title"
          >
            <div className="about-section__heading">
              <div>
                <p className="about-page__eyebrow">
                  A nossa missão
                </p>

                <h2 id="about-mission-title">
                  Do dado científico à descoberta
                </h2>
              </div>

              <p>
                O SpaceVision organiza diferentes fontes da NASA numa única
                plataforma, permitindo explorar imagens, eventos espaciais,
                o planeta Terra e objetos próximos da sua órbita.
              </p>
            </div>

            <div className="about-mission-grid">
              <article className="about-mission-card">
                <Globe2 size={24} aria-hidden="true" />

                <h3>Acessível</h3>

                <p>
                  Informação apresentada com linguagem clara, navegação simples
                  e uma interface adaptada a diferentes dispositivos.
                </p>
              </article>

              <article className="about-mission-card">
                <Satellite size={24} aria-hidden="true" />

                <h3>Baseado em dados reais</h3>

                <p>
                  Conteúdos obtidos através das APIs públicas da NASA e
                  apresentados com contexto e significado.
                </p>
              </article>

              <article className="about-mission-card">
                <Heart size={24} aria-hidden="true" />

                <h3>Criado para despertar curiosidade</h3>

                <p>
                  Uma experiência pensada para aproximar ciência, tecnologia
                  e exploração espacial de diferentes públicos.
                </p>
              </article>
            </div>
          </section>

          <section
            className="about-section"
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
              {TECHNOLOGIES.map(
                ({
                  name,
                  description,
                  icon: TechnologyIcon,
                }) => (
                  <article
                    key={name}
                    className="about-technology-card"
                  >
                    <div
                      className="about-technology-card__icon"
                      aria-hidden="true"
                    >
                      <TechnologyIcon size={24} />
                    </div>

                    <div>
                      <h3>{name}</h3>
                      <p>{description}</p>
                    </div>
                  </article>
                )
              )}
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
                  Quatro pessoas, uma missão
                </h2>
              </div>

              <p>
                Cada elemento ficou responsável pela integração de uma API
                principal, participando também no desenvolvimento frontend e
                backend da plataforma.
              </p>
            </div>

            <div className="about-team-grid">
              {teamMembers.map((member, index) => (
                <article
                  key={member.name}
                  className="about-team-card"
                >
                  <div className="about-team-card__top">
                    <div
                      className="about-team-card__avatar"
                      aria-hidden="true"
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>

                    <span
                      className="about-team-card__number"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="about-team-card__content">
                    <h3>{member.name}</h3>

                    <p className="about-team-card__role">
                      {member.role}
                    </p>

                    {member.api && (
                      <p className="about-team-card__api">
                        API principal: {member.api}
                      </p>
                    )}

                    <p className="about-team-card__description">
                      {member.description ||
                        "Responsável pela integração de uma API da NASA e pelo desenvolvimento frontend e backend das funcionalidades associadas."}
                    </p>
                  </div>

                  {(member.github || member.linkedin) && (
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
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

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