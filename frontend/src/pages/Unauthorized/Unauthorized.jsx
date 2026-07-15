// src/pages/Unauthorized/Unauthorized.jsx
import { Link } from "react-router-dom";

import Container from "../../components/common/Container/Container";
import Icon from "../../components/common/Icon/Icon";
import "./Unauthorized.css";

function Unauthorized() {
  return (
    <section className="unauthorized-page">
      <Container>
        <div className="unauthorized">
          <div className="unauthorized__icon">
            <Icon name="Lock" size={48} />
          </div>

          <span className="unauthorized__eyebrow">Erro 403</span>
          <h1 className="unauthorized__title">Acesso não autorizado</h1>
          <p className="unauthorized__text">
            Não tens permissão para aceder a esta página.
          </p>

          <div className="unauthorized__actions">
            <Link to="/" className="unauthorized__btn unauthorized__btn--primary">
              <Icon name="ArrowLeft" size={18} />
              Voltar ao início
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Unauthorized;