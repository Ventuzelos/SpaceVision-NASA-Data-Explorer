import { Link } from "react-router-dom";

import "./CTASection.css";

const ctaImage =
  "https://images.unsplash.com/photo-1464802686167-b939a6910659?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";

function CTASection() {
  return (
    <section className="cta-section">
      <div className="container">
        <div
          className="cta-section__card"
          style={{ backgroundImage: `url(${ctaImage})` }}
        >
          <div className="cta-section__overlay" aria-hidden="true" />

          <div className="cta-section__content">
            <h2 className="cta-section__title">
              Espaço:{" "}
              <span className="cta-section__title-accent">
                A Fronteira Final
              </span>
            </h2>

            <p className="cta-section__description">
              A nossa comunidade dedica-se a partilhar dados pelo amor ao
              espaço. Encontra o teu lugar dentro da nossa base de dados
              cósmica.
            </p>

            <Link to="/discover" className="cta-section__button">
              Explorar o Universo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
