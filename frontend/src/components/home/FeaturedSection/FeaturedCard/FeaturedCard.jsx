import { Link } from "react-router-dom";

import "./FeaturedCard.css";

function FeaturedCard({ image, title, description, date, link }) {
  return (
    <article className="featured-card">
      <div className="featured-card__media">
        <img className="featured-card__image" src={image} alt={title} />
      </div>

      <div className="featured-card__content">
        <span className="featured-card__date">{date}</span>

        <h3 className="featured-card__title">{title}</h3>

        <p className="featured-card__description">{description}</p>

        <Link to={link} className="featured-card__link">
          Explorar <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default FeaturedCard;