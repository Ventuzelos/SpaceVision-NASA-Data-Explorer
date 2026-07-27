import { Link } from "react-router";

import "./ApiIcons.css";

function ApiIcons({ apis }) {
  return (
    <div className="api-icons">
      {apis.map(({ title, description, category, icon: Icon, link, isLiveApi }) => (
        <Link key={title} to={link} className="api-icons__item">
          <span className="api-icons__icon">
            {Icon && <Icon size={28} aria-hidden="true" />}
          </span>

          <span className="api-icons__name">{title}</span>

          {isLiveApi && (
            <span className="api-icons__live-badge">
              <span className="api-icons__live-pulse" aria-hidden="true" />
              Ao vivo
            </span>
          )}

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
