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

function Privacy() {
  const { t } =
    useTranslation();

  const sections =
    useMemo(
      () => [
        {
          id: "introducao-privacidade",
          icon: "Lock",
          title: t(
            "privacy.sections.introduction.title"
          ),
          content: (
            <p>
              {t(
                "privacy.sections.introduction.description"
              )}
            </p>
          ),
        },
        {
          id: "dados-recolhidos",
          icon: "Database",
          title: t(
            "privacy.sections.data.title"
          ),
          content: (
            <>
              <div className="legal-table-wrap">
                <table className="legal-table">
                  <thead>
                    <tr>
                      <th scope="col">
                        {t(
                          "privacy.sections.data.table.columns.situation"
                        )}
                      </th>

                      <th scope="col">
                        {t(
                          "privacy.sections.data.table.columns.stored"
                        )}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>
                        {t(
                          "privacy.sections.data.table.rows.guest.situation"
                        )}
                      </td>

                      <td>
                        {t(
                          "privacy.sections.data.table.rows.guest.stored"
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td>
                        {t(
                          "privacy.sections.data.table.rows.registration.situation"
                        )}
                      </td>

                      <td>
                        {t(
                          "privacy.sections.data.table.rows.registration.stored"
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td>
                        {t(
                          "privacy.sections.data.table.rows.account.situation"
                        )}
                      </td>

                      <td>
                        {t(
                          "privacy.sections.data.table.rows.account.stored"
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td>
                        {t(
                          "privacy.sections.data.table.rows.contact.situation"
                        )}
                      </td>

                      <td>
                        {t(
                          "privacy.sections.data.table.rows.contact.stored"
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                {t(
                  "privacy.sections.data.note"
                )}
              </p>
            </>
          ),
        },
        {
          id: "para-que-usamos",
          icon: "Settings2",
          title: t(
            "privacy.sections.purposes.title"
          ),
          content: (
            <ul>
              <li>
                {t(
                  "privacy.sections.purposes.items.account"
                )}
              </li>

              <li>
                {t(
                  "privacy.sections.purposes.items.favorites"
                )}
              </li>

              <li>
                {t(
                  "privacy.sections.purposes.items.messages"
                )}
              </li>

              <li>
                {t(
                  "privacy.sections.purposes.items.security"
                )}
              </li>
            </ul>
          ),
        },
        {
          id: "armazenamento-seguranca",
          icon: "Server",
          title: t(
            "privacy.sections.security.title"
          ),
          content: (
            <>
              <p>
                {t(
                  "privacy.sections.security.database"
                )}
              </p>

              <p>
                {t(
                  "privacy.sections.security.sessionBefore"
                )}{" "}

                <strong>
                  sessionStorage
                </strong>{" "}

                {t(
                  "privacy.sections.security.sessionAfter"
                )}
              </p>

              <div className="legal-callout">
                <Icon
                  name="ShieldCheck"
                  size={18}
                  aria-hidden="true"
                />

                <span>
                  {t(
                    "privacy.sections.security.callout"
                  )}
                </span>
              </div>
            </>
          ),
        },
        {
          id: "partilha",
          icon: "Share2",
          title: t(
            "privacy.sections.sharing.title"
          ),
          content: (
            <>
              <p>
                {t(
                  "privacy.sections.sharing.description"
                )}
              </p>

              <ul>
                <li>
                  {t(
                    "privacy.sections.sharing.hostingBefore"
                  )}{" "}

                  <strong>
                    {t(
                      "privacy.sections.sharing.hostingLabel"
                    )}
                  </strong>{" "}

                  {t(
                    "privacy.sections.sharing.hostingAfter"
                  )}
                </li>

                <li>
                  {t(
                    "privacy.sections.sharing.nasaBefore"
                  )}{" "}

                  <strong>
                    {t(
                      "privacy.sections.sharing.nasaLabel"
                    )}
                  </strong>{" "}

                  {t(
                    "privacy.sections.sharing.nasaAfter"
                  )}
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "direitos",
          icon: "UserCircle",
          title: t(
            "privacy.sections.rights.title"
          ),
          content: (
            <>
              <p>
                {t(
                  "privacy.sections.rights.introduction"
                )}
              </p>

              <ul>
                <li>
                  {t(
                    "privacy.sections.rights.items.access"
                  )}
                </li>

                <li>
                  {t(
                    "privacy.sections.rights.items.correct"
                  )}
                </li>

                <li>
                  {t(
                    "privacy.sections.rights.items.delete"
                  )}
                </li>

                <li>
                  {t(
                    "privacy.sections.rights.items.complaint"
                  )}
                </li>
              </ul>

              <p>
                {t(
                  "privacy.sections.rights.deletion"
                )}
              </p>
            </>
          ),
        },
        {
          id: "menores",
          icon: "Baby",
          title: t(
            "privacy.sections.children.title"
          ),
          content: (
            <p>
              {t(
                "privacy.sections.children.description"
              )}
            </p>
          ),
        },
        {
          id: "alteracoes-privacidade",
          icon: "RefreshCw",
          title: t(
            "privacy.sections.changes.title"
          ),
          content: (
            <p>
              {t(
                "privacy.sections.changes.description"
              )}
            </p>
          ),
        },
        {
          id: "contacto-privacidade",
          icon: "Mail",
          title: t(
            "privacy.sections.contact.title"
          ),
          content: (
            <p>
              {t(
                "privacy.sections.contact.beforeLink"
              )}{" "}

              <Link to="/about">
                {t(
                  "privacy.sections.contact.link"
                )}
              </Link>

              {t(
                "privacy.sections.contact.afterLink"
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
          "privacy.meta.title"
        )}
        description={t(
          "privacy.meta.description"
        )}
      />

      <LegalLayout
        icon="Lock"
        eyebrow={t(
          "privacy.layout.eyebrow"
        )}
        title={t(
          "privacy.layout.title"
        )}
        description={t(
          "privacy.layout.description"
        )}
        lastUpdated={t(
          "privacy.layout.lastUpdated"
        )}
        summary={t(
          "privacy.layout.summary"
        )}
        sections={sections}
      />
    </>
  );
}

export default Privacy;