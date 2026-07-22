import { Link } from "react-router-dom";

import "./ApiCard.css";

function ApiCard({ title, description, image, link }) {
  return (
    <article className="api-card">
      <div className="api-card__media">
        <img
          className="api-card__image"
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="api-card__content">
        <h3 className="api-card__title">{title}</h3>

        <p className="api-card__description">{description}</p>

        <Link to={link} className="api-card__link">
          Explorar <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default ApiCard;