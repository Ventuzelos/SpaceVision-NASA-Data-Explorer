import {
  useMemo,
} from "react";
import {
  useTranslation,
} from "react-i18next";
import {
  Link,
} from "react-router";

import LegalLayout from "../../../components/common/LegalLayout/LegalLayout";
import Icon from "../../../components/common/Icon/Icon";
import PageMeta from "../../../components/common/PageMeta/PageMeta";

function Terms() {
  const { t } =
    useTranslation();

  const sections =
    useMemo(
      () => [
        {
          id: "introducao",
          icon: "FileText",
          title: t(
            "terms.sections.introduction.title"
          ),
          content: (
            <>
              <p>
                {t(
                  "terms.sections.introduction.paragraphOne"
                )}
              </p>

              <p>
                {t(
                  "terms.sections.introduction.paragraphTwo"
                )}
              </p>
            </>
          ),
        },
        {
          id: "o-que-e",
          icon: "Rocket",
          title: t(
            "terms.sections.features.title"
          ),
          content: (
            <>
              <p>
                {t(
                  "terms.sections.features.introduction"
                )}
              </p>

              <ul>
                <li>
                  {t(
                    "terms.sections.features.items.apod"
                  )}
                </li>

                <li>
                  {t(
                    "terms.sections.features.items.donki"
                  )}
                </li>

                <li>
                  {t(
                    "terms.sections.features.items.epic"
                  )}
                </li>

                <li>
                  {t(
                    "terms.sections.features.items.neowatch"
                  )}
                </li>
              </ul>

              <p>
                {t(
                  "terms.sections.features.account"
                )}
              </p>
            </>
          ),
        },
        {
          id: "a-tua-conta",
          icon: "UserCircle",
          title: t(
            "terms.sections.account.title"
          ),
          content: (
            <>
              <p>
                {t(
                  "terms.sections.account.introduction"
                )}
              </p>

              <ul>
                <li>
                  {t(
                    "terms.sections.account.items.accurateData"
                  )}
                </li>

                <li>
                  {t(
                    "terms.sections.account.items.password"
                  )}
                </li>

                <li>
                  {t(
                    "terms.sections.account.items.unauthorisedAccess"
                  )}
                </li>

                <li>
                  {t(
                    "terms.sections.account.items.automation"
                  )}
                </li>

                <li>
                  {t(
                    "terms.sections.account.items.restrictedAreas"
                  )}
                </li>
              </ul>

              <p>
                {t(
                  "terms.sections.account.deletion"
                )}
              </p>
            </>
          ),
        },
        {
          id: "propriedade",
          icon: "Scale",
          title: t(
            "terms.sections.intellectualProperty.title"
          ),
          content: (
            <p>
              {t(
                "terms.sections.intellectualProperty.description"
              )}
            </p>
          ),
        },
        {
          id: "responsabilidade",
          icon: "AlertCircle",
          title: t(
            "terms.sections.liability.title"
          ),
          content: (
            <>
              <p>
                {t(
                  "terms.sections.liability.description"
                )}
              </p>

              <div className="legal-callout">
                <Icon
                  name="Info"
                  size={18}
                  aria-hidden="true"
                />

                <span>
                  {t(
                    "terms.sections.liability.callout"
                  )}
                </span>
              </div>
            </>
          ),
        },
        {
          id: "alteracoes-termos",
          icon: "RefreshCw",
          title: t(
            "terms.sections.changes.title"
          ),
          content: (
            <p>
              {t(
                "terms.sections.changes.description"
              )}
            </p>
          ),
        },
        {
          id: "contacto-termos",
          icon: "Mail",
          title: t(
            "terms.sections.contact.title"
          ),
          content: (
            <p>
              {t(
                "terms.sections.contact.beforeLink"
              )}{" "}

              <Link to="/about">
                {t(
                  "terms.sections.contact.link"
                )}
              </Link>

              {t(
                "terms.sections.contact.afterLink"
              )}
            </p>
          ),
        },
      ],
      [t]
    );

  return (
    <>
      <PageMeta
        title={t(
          "terms.meta.title"
        )}
        description={t(
          "terms.meta.description"
        )}
      />

      <LegalLayout
        icon="Scale"
        eyebrow={t(
          "terms.layout.eyebrow"
        )}
        title={t(
          "terms.layout.title"
        )}
        description={t(
          "terms.layout.description"
        )}
        lastUpdated={t(
          "terms.layout.lastUpdated"
        )}
        summary={t(
          "terms.layout.summary"
        )}
        sections={sections}
      />
    </>
  );
}

export default Terms;