import { Link } from "react-router-dom";
import Button from "../../common/Button/Button";

import "./CTASection.css";

function CTASection() {
  return (
    <section className="cta-section">
      <div className="container cta-section__container">
        <h2>Pronto para explorar o Universo?</h2>

        <p>
          Começa pela imagem astronómica do dia ou navega pelas nossas APIs.
        </p>

        <div className="cta-section__actions">
          <Link to="/apod">
            <Button>Explorar APOD</Button>
          </Link>

          <Link to="/donki">
            <Button variant="secondary">Ver DONKI</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTASection;