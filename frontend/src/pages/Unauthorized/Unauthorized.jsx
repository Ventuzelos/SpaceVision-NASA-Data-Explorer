import {
  useTranslation,
} from "react-i18next";
import {
  Link,
} from "react-router";

import Container from "../../components/common/Container/Container";
import Icon from "../../components/common/Icon/Icon";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import "./Unauthorized.css";

function Unauthorized() {
  const { t } =
    useTranslation();

  return (
    <>
      <PageMeta
        title={t(
          "unauthorized.meta.title"
        )}
        description={t(
          "unauthorized.meta.description"
        )}
      />

      <section className="unauthorized-page">
        <Container>
          <div className="unauthorized">
            <div className="unauthorized__icon">
              <Icon
                name="Lock"
                size={48}
                aria-hidden="true"
              />
            </div>

            <span className="unauthorized__eyebrow">
              {t(
                "unauthorized.eyebrow"
              )}
            </span>

            <h1 className="unauthorized__title">
              {t(
                "unauthorized.title"
              )}
            </h1>

            <p className="unauthorized__text">
              {t(
                "unauthorized.description"
              )}
            </p>

            <div className="unauthorized__actions">
              <Link
                to="/"
                className="unauthorized__btn unauthorized__btn--primary"
              >
                <Icon
                  name="ArrowLeft"
                  size={18}
                  aria-hidden="true"
                />

                {t(
                  "unauthorized.actions.home"
                )}
              </Link>

              <Link
                to="/login"
                className="unauthorized__btn unauthorized__btn--ghost"
              >
                {t(
                  "unauthorized.actions.login"
                )}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default Unauthorized;