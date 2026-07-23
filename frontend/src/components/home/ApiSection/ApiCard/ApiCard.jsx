import { Link } from "react-router-dom";

import "./ApiCard.css";

function ApiCard({
  title,
  description,
  category,
  icon: Icon,
  image,
  imagePosition = "center",
  link,
}) {
  const isAnchor = link.startsWith("#") || link.startsWith("/#");
  const CardTag = isAnchor ? "a" : Link;
  const navigationProps = isAnchor ? { href: link } : { to: link };

  return (
    <CardTag
      className="api-card"
      style={{
        backgroundImage: `url(${image})`,
        backgroundPosition: imagePosition,
      }}
      aria-label={title}
      {...navigationProps}
    >
      <div className="api-card__header">
        {Icon && (
          <span className="api-card__icon">
            <Icon size={18} aria-hidden="true" />
          </span>
        )}

        <span className="api-card__category">{category}</span>
      </div>

      <div className="api-card__body">
        <h3 className="api-card__title">
          {title} <span aria-hidden="true">↗</span>
        </h3>

        <p className="api-card__description">{description}</p>
      </div>
    </CardTag>
  );
}

export default ApiCard;
