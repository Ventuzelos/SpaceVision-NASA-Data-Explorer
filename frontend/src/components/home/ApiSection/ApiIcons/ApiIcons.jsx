import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import "./ApiIcons.css";

function ApiIcons({ apis }) {
  const { t } = useTranslation();

  return (
    <div className="api-icons">
      {apis.map(
        ({
          titleKey,
          descriptionKey,
          categoryKey,
          icon: Icon,
          link,
          isLiveApi,
        }) => (
          <Link
            key={link}
            to={link}
            className="api-icons__item"
          >
            <span className="api-icons__icon">
              {Icon && (
                <Icon
                  size={28}
                  aria-hidden="true"
                />
              )}
            </span>

            <span className="api-icons__name">
              {t(titleKey)}
            </span>

            {isLiveApi && (
              <span className="api-icons__live-badge">
                <span
                  className="api-icons__live-pulse"
                  aria-hidden="true"
                />

                {t("common.live")}
              </span>
            )}

            {categoryKey && (
              <span className="api-icons__category">
                {t(categoryKey)}
              </span>
            )}

            {descriptionKey && (
              <span className="api-icons__description">
                {t(descriptionKey)}
              </span>
            )}
          </Link>
        )
      )}
    </div>
  );
}

export default ApiIcons;