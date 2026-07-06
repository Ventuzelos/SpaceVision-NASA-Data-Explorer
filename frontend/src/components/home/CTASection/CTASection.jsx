import { Link } from "react-router-dom";
import Button from "../../common/Button/Button";

import "./CTASection.css";

function CTASection() {
  return (
    <section className="cta-section">
      <div className="container cta-section__container">
        <h2>Pronto para explorar o Universo?</h2>

        <p>
          Começa pela imagem astronómica do dia ou explora fotografias reais
          captadas em Marte.
        </p>

        <div className="cta-section__actions">
          <Link to="/apod">
            <Button>Explorar APOD</Button>
          </Link>

          <Link to="/mars-rover">
            <Button variant="secondary">Ver Mars Rover</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTASection;