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
import { teamMembers } from "../../data/team";

import "./About.css";

const projectStats = [
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

const technologies = [
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
  return (
    <main className="about-page">
      <Container>
        <Breadcrumb title="Sobre nós" />

        <section className="about-hero">
          <div className="about-hero__content">
            <p className="about-page__eyebrow">
              O projeto por detrás da exploração
            </p>

            <h1>
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

          <div className="about-hero__visual" aria-hidden="true">
            <div className="about-orbit about-orbit--outer">
              <div className="about-orbit__planet" />
            </div>

            <div className="about-orbit about-orbit--inner">
              <div className="about-orbit__satellite">
                <Satellite size={26} />
              </div>
            </div>

            <div className="about-hero__core">
              { <Sparkles size={42} /> /*adicionar imagem aqui */}
              <span>SpaceVision</span>
            </div>
          </div>
        </section>

        <section
          className="about-stats"
          aria-label="Informação geral do projeto"
        >
          {projectStats.map(({ value, label, icon: Icon }) => (
            <article key={label} className="about-stat">
              <div className="about-stat__icon">
                <Icon size={20} aria-hidden="true" />
              </div>

              <div>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="about-section">
          <div className="about-section__heading">
            <div>
              <p className="about-page__eyebrow">
                A nossa missão
              </p>

              <h2>Do dado científico à descoberta</h2>
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

        <section className="about-section">
          <div className="about-section__heading">
            <div>
              <p className="about-page__eyebrow">
                Tecnologia
              </p>

              <h2>Construído como um produto digital real</h2>
            </div>

            <p>
              O projeto combina frontend, backend, autenticação, base de
              dados, integração de APIs e princípios de UX/UI.
            </p>
          </div>

          <div className="about-technologies">
            {technologies.map(
              ({ name, description, icon: Icon }) => (
                <article
                  key={name}
                  className="about-technology-card"
                >
                  <div className="about-technology-card__icon">
                    <Icon size={24} aria-hidden="true" />
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

        <section className="about-section">
          <div className="about-section__heading">
            <div>
              <p className="about-page__eyebrow">
                A equipa
              </p>

              <h2>Quatro pessoas, uma missão</h2>
            </div>

            <p>
              Cada elemento ficou responsável pela integração de uma API principal,
              participando também no desenvolvimento frontend e backend da plataforma.
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

                  <span className="about-team-card__number">
                    0{index + 1}
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
                  <div className="about-team-card__links">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`GitHub de ${member.name}`}
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}

                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`LinkedIn de ${member.name}`}
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="about-contact">
          <div className="about-contact__intro">
            <p className="about-page__eyebrow">
              Contacto
            </p>

            <h2>Vamos falar sobre o Universo?</h2>

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
                <ExternalLink size={19} aria-hidden="true" />

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
  );
}

export default About;