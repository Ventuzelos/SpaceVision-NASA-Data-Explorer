import { Link } from "react-router-dom";

import "./ApiIcons.css";

function ApiIcons({ apis }) {
  return (
    <div className="api-icons">
      {apis.map(({ title, description, category, icon: Icon, link }) => (
        <Link key={title} to={link} className="api-icons__item">
          <span className="api-icons__icon">
            {Icon && <Icon size={28} aria-hidden="true" />}
          </span>

          <span className="api-icons__name">{title}</span>

          {category && (
            <span className="api-icons__category">{category}</span>
          )}

          {description && (
            <span className="api-icons__description">{description}</span>
          )}
        </Link>
      ))}
    </div>
  );
}

export default ApiIcons;
