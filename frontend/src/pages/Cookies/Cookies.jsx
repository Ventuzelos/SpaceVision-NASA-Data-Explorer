import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useTranslation,
} from "react-i18next";
import {
  Link,
} from "react-router";
import {
  Cookie,
  ShieldCheck,
  Database,
  Globe2,
  SlidersHorizontal,
  History,
  Mail,
} from "lucide-react";

import Container from "../../components/common/Container/Container";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import "./Cookies.css";

const SECTION_DEFINITIONS = [
  {
    id: "o-que-sao",
    translationKey: "whatAreCookies",
    icon: Cookie,
  },
  {
    id: "como-usamos",
    translationKey: "howWeStore",
    icon: Database,
  },
  {
    id: "terceiros",
    translationKey: "thirdParties",
    icon: Globe2,
  },
  {
    id: "controlo",
    translationKey: "control",
    icon: SlidersHorizontal,
  },
  {
    id: "alteracoes",
    translationKey: "changes",
    icon: History,
  },
  {
    id: "contacto",
    translationKey: "contact",
    icon: Mail,
  },
];

function Cookies() {
  const { t } =
    useTranslation();

  const [
    activeId,
    setActiveId,
  ] = useState(
    SECTION_DEFINITIONS[0].id
  );

  const sectionRefs =
    useRef({});

  const sections =
    useMemo(
      () =>
        SECTION_DEFINITIONS.map(
          (section) => ({
            ...section,
            label: t(
              `cookies.navigation.${section.translationKey}`
            ),
          })
        ),
      [t]
    );

  const storageItems =
    useMemo(
      () => [
        {
          name: t(
            "cookies.storage.items.authentication.name"
          ),
          mechanism:
            "sessionStorage",
          duration: t(
            "cookies.storage.items.authentication.duration"
          ),
          purpose: t(
            "cookies.storage.items.authentication.purpose"
          ),
        },
        {
          name: t(
            "cookies.storage.items.favorites.name"
          ),
          mechanism:
            "localStorage",
          duration: t(
            "cookies.storage.items.favorites.duration"
          ),
          purpose: t(
            "cookies.storage.items.favorites.purpose"
          ),
        },
        {
          name: t(
            "cookies.storage.items.tracking.name"
          ),
          mechanism: t(
            "cookies.storage.items.tracking.mechanism"
          ),
          duration: "—",
          purpose: t(
            "cookies.storage.items.tracking.purpose"
          ),
        },
      ],
      [t]
    );

  useEffect(() => {
    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting
              ) {
                setActiveId(
                  entry.target.id
                );
              }
            }
          );
        },
        {
          rootMargin:
            "-20% 0px -70% 0px",
          threshold: 0,
        }
      );

    Object.values(
      sectionRefs.current
    ).forEach((element) => {
      if (element) {
        observer.observe(
          element
        );
      }
    });

    return () =>
      observer.disconnect();
  }, []);

  return (
    <>
      <PageMeta
        title={t(
          "cookies.meta.title"
        )}
        description={t(
          "cookies.meta.description"
        )}
      />

      <main className="cookies-page">
        <Container>
          <Breadcrumb
            title={t(
              "cookies.breadcrumb"
            )}
          />

          <header className="cookies-hero">
            <p className="cookies-page__eyebrow">
              {t(
                "cookies.hero.eyebrow"
              )}
            </p>

            <h1>
              {t(
                "cookies.hero.title"
              )}
            </h1>

            <p className="cookies-hero__description">
              {t(
                "cookies.hero.description"
              )}
            </p>

            <p className="cookies-hero__meta">
              {t(
                "cookies.hero.lastUpdated"
              )}
            </p>
          </header>

          <div className="cookies-summary">
            <ShieldCheck
              size={22}
              aria-hidden="true"
            />

            <p>
              <strong>
                {t(
                  "cookies.summary.label"
                )}
              </strong>{" "}

              {t(
                "cookies.summary.text"
              )}
            </p>
          </div>

          <nav
            className="cookies-toc"
            aria-label={t(
              "cookies.navigation.aria"
            )}
          >
            {sections.map(
              ({
                id,
                label,
                icon: Icon,
              }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`cookies-toc__link${
                    activeId === id
                      ? " cookies-toc__link--active"
                      : ""
                  }`}
                  aria-current={
                    activeId === id
                      ? "true"
                      : undefined
                  }
                >
                  <Icon
                    size={16}
                    aria-hidden="true"
                  />

                  <span>
                    {label}
                  </span>
                </a>
              )
            )}
          </nav>

          <div className="cookies-layout">
            <aside
              className="cookies-rail"
              aria-hidden="true"
            >
              {sections.map(
                ({
                  id,
                  label,
                  icon: Icon,
                }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`cookies-rail__link${
                      activeId === id
                        ? " cookies-rail__link--active"
                        : ""
                    }`}
                  >
                    <Icon
                      size={17}
                      aria-hidden="true"
                    />

                    <span>
                      {label}
                    </span>
                  </a>
                )
              )}
            </aside>

            <div className="cookies-content">
              <section
                id="o-que-sao"
                ref={(element) => {
                  sectionRefs.current[
                    "o-que-sao"
                  ] = element;
                }}
                className="cookies-section"
              >
                <span className="cookies-section__index">
                  01
                </span>

                <h2>
                  {t(
                    "cookies.sections.whatAreCookies.title"
                  )}
                </h2>

                <p>
                  {t(
                    "cookies.sections.whatAreCookies.paragraphOneBeforeLocalStorage"
                  )}{" "}

                  <code>
                    localStorage
                  </code>{" "}

                  {t(
                    "cookies.sections.whatAreCookies.paragraphOneBetweenStorage"
                  )}{" "}

                  <code>
                    sessionStorage
                  </code>{" "}

                  {t(
                    "cookies.sections.whatAreCookies.paragraphOneAfterStorage"
                  )}
                </p>

                <p>
                  {t(
                    "cookies.sections.whatAreCookies.paragraphTwo"
                  )}
                </p>
              </section>

              <section
                id="como-usamos"
                ref={(element) => {
                  sectionRefs.current[
                    "como-usamos"
                  ] = element;
                }}
                className="cookies-section"
              >
                <span className="cookies-section__index">
                  02
                </span>

                <h2>
                  {t(
                    "cookies.sections.howWeStore.title"
                  )}
                </h2>

                <p>
                  {t(
                    "cookies.sections.howWeStore.description"
                  )}
                </p>

                <div className="cookies-table-wrap">
                  <table className="cookies-table">
                    <thead>
                      <tr>
                        <th scope="col">
                          {t(
                            "cookies.storage.columns.item"
                          )}
                        </th>

                        <th scope="col">
                          {t(
                            "cookies.storage.columns.mechanism"
                          )}
                        </th>

                        <th scope="col">
                          {t(
                            "cookies.storage.columns.duration"
                          )}
                        </th>

                        <th scope="col">
                          {t(
                            "cookies.storage.columns.purpose"
                          )}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {storageItems.map(
                        (item) => (
                          <tr
                            key={
                              item.name
                            }
                          >
                            <td
                              data-label={t(
                                "cookies.storage.columns.item"
                              )}
                            >
                              {
                                item.name
                              }
                            </td>

                            <td
                              data-label={t(
                                "cookies.storage.columns.mechanism"
                              )}
                            >
                              <code>
                                {
                                  item.mechanism
                                }
                              </code>
                            </td>

                            <td
                              data-label={t(
                                "cookies.storage.columns.duration"
                              )}
                            >
                              {
                                item.duration
                              }
                            </td>

                            <td
                              data-label={t(
                                "cookies.storage.columns.purpose"
                              )}
                            >
                              {
                                item.purpose
                              }
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section
                id="terceiros"
                ref={(element) => {
                  sectionRefs.current[
                    "terceiros"
                  ] = element;
                }}
                className="cookies-section"
              >
                <span className="cookies-section__index">
                  03
                </span>

                <h2>
                  {t(
                    "cookies.sections.thirdParties.title"
                  )}
                </h2>

                <p>
                  {t(
                    "cookies.sections.thirdParties.paragraphOneBeforeApi"
                  )}{" "}

                  <code>
                    api.nasa.gov
                  </code>

                  {t(
                    "cookies.sections.thirdParties.paragraphOneBeforeLink"
                  )}{" "}

                  <a
                    href="https://www.nasa.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    nasa.gov
                  </a>{" "}

                  {t(
                    "cookies.sections.thirdParties.paragraphOneAfterLink"
                  )}
                </p>

                <p>
                  {t(
                    "cookies.sections.thirdParties.paragraphTwo"
                  )}
                </p>
              </section>

              <section
                id="controlo"
                ref={(element) => {
                  sectionRefs.current[
                    "controlo"
                  ] = element;
                }}
                className="cookies-section"
              >
                <span className="cookies-section__index">
                  04
                </span>

                <h2>
                  {t(
                    "cookies.sections.control.title"
                  )}
                </h2>

                <p>
                  {t(
                    "cookies.sections.control.description"
                  )}
                </p>

                <ul className="cookies-list">
                  <li>
                    {t(
                      "cookies.sections.control.items.logout"
                    )}
                  </li>

                  <li>
                    {t(
                      "cookies.sections.control.items.clearBrowserData"
                    )}
                  </li>

                  <li>
                    {t(
                      "cookies.sections.control.items.privateMode"
                    )}
                  </li>
                </ul>

                <p className="cookies-note">
                  {t(
                    "cookies.sections.control.note"
                  )}
                </p>
              </section>

              <section
                id="alteracoes"
                ref={(element) => {
                  sectionRefs.current[
                    "alteracoes"
                  ] = element;
                }}
                className="cookies-section"
              >
                <span className="cookies-section__index">
                  05
                </span>

                <h2>
                  {t(
                    "cookies.sections.changes.title"
                  )}
                </h2>

                <p>
                  {t(
                    "cookies.sections.changes.description"
                  )}
                </p>
              </section>

              <section
                id="contacto"
                ref={(element) => {
                  sectionRefs.current[
                    "contacto"
                  ] = element;
                }}
                className="cookies-section"
              >
                <span className="cookies-section__index">
                  06
                </span>

                <h2>
                  {t(
                    "cookies.sections.contact.title"
                  )}
                </h2>

                <p>
                  {t(
                    "cookies.sections.contact.descriptionBeforeLink"
                  )}{" "}

                  <Link to="/about">
                    {t(
                      "cookies.sections.contact.link"
                    )}
                  </Link>

                  {t(
                    "cookies.sections.contact.descriptionAfterLink"
                  )}
                </p>
              </section>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

export default Cookies;