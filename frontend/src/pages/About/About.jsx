import Container from "../../components/common/Container/Container";
import ContactForm from "../../components/common/ContactForm/ContactForm";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import { teamMembers } from "../../data/team";

import "./About.css";

function About() {
  return (
    <section className="about-page">
      <Container>
        <Breadcrumb title="Sobre nós" />
        <header className="about-page__header">
          <h1>Sobre nós</h1>
          <p>
            O SpaceVision é um projeto desenvolvido por um grupo de alunas do
            curso Software Developer do CESAE Digital, com o objetivo de
            tornar os dados públicos da NASA acessíveis a todos, através de
            uma experiência simples, educativa e interativa.
          </p>
        </header>

        <div className="about-page__team">
          <h2 className="about-page__section-title">Equipa</h2>

          <div className="about-page__team-grid">
            {teamMembers.map((member) => (
              <div key={member.name} className="about-page__team-card">
                <div className="about-page__team-avatar" aria-hidden="true">
                  {member.name.charAt(0)}
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-page__contact">
          <h2 className="about-page__section-title">Contacta-nos</h2>
          <p className="about-page__contact-intro">
            Tens alguma sugestão, encontraste um problema ou só queres
            dizer olá? Escreve-nos.
          </p>

          <ContactForm />
        </div>
      </Container>
    </section>
  );
}

export default About;
