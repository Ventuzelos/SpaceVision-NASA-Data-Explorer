import { useMemo, useState } from "react";
import {
  Trans,
  useTranslation,
} from "react-i18next";

import Container from "../../components/common/Container/Container";
import Icon from "../../components/common/Icon/Icon";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import SearchInput from "../../components/common/SearchInput/SearchInput";
import PageMeta from "../../components/common/PageMeta/PageMeta";
import Pagination from "../../components/common/Pagination/Pagination";

import "./FAQ.css";

const CATEGORY_IDS = [
  "all",
  "general",
  "nasaApis",
  "data",
  "account",
  "favorites",
  "nasaKey",
  "privacy",
  "support",
];

const FAQ_ITEMS = [
  {
    id: "whatIsSpaceVision",
    category: "general",
    icon: "Rocket",
  },
  {
    id: "officialNasaApp",
    category: "general",
    icon: "ShieldCheck",
  },
  {
    id: "targetAudience",
    category: "general",
    icon: "UserCircle",
  },
  {
    id: "responsive",
    category: "general",
    icon: "Globe",
  },
  {
    id: "nasaApis",
    category: "nasaApis",
    icon: "Satellite",
    answerType: "apiList",
  },
  {
    id: "apod",
    category: "nasaApis",
    icon: "Image",
  },
  {
    id: "spaceWeather",
    category: "nasaApis",
    icon: "Sun",
  },
  {
    id: "epic",
    category: "nasaApis",
    icon: "Globe",
  },
  {
    id: "nearEarthObjects",
    category: "nasaApis",
    icon: "Orbit",
  },
  {
    id: "realTime",
    category: "data",
    icon: "Database",
    answerType: "updateCallout",
  },
  {
    id: "updateFrequency",
    category: "data",
    icon: "Database",
  },
  {
    id: "noResults",
    category: "data",
    icon: "AlertCircle",
  },
  {
    id: "mediaNotLoading",
    category: "data",
    icon: "Image",
  },
  {
    id: "accountRequired",
    category: "account",
    icon: "UserCircle",
  },
  {
    id: "createAccount",
    category: "account",
    icon: "UserCircle",
  },
  {
    id: "forgotPassword",
    category: "account",
    icon: "KeyRound",
  },
  {
    id: "deleteAccount",
    category: "account",
    icon: "Trash2",
  },
  {
    id: "howFavoritesWork",
    category: "favorites",
    icon: "Heart",
    answerType: "favoritesStrong",
  },
  {
    id: "favoritesAcrossDevices",
    category: "favorites",
    icon: "Heart",
  },
  {
    id: "favoritesLogin",
    category: "favorites",
    icon: "UserCircle",
  },
  {
    id: "whatIsNasaKey",
    category: "nasaKey",
    icon: "KeyRound",
  },
  {
    id: "personalNasaKey",
    category: "nasaKey",
    icon: "KeyRound",
    answerType: "nasaKey",
  },
  {
    id: "rateLimit",
    category: "nasaKey",
    icon: "AlertCircle",
  },
  {
    id: "nasaKeySecurity",
    category: "nasaKey",
    icon: "ShieldCheck",
  },
  {
    id: "storedPersonalData",
    category: "privacy",
    icon: "ShieldCheck",
  },
  {
    id: "passwordStorage",
    category: "privacy",
    icon: "ShieldCheck",
  },
  {
    id: "downloadData",
    category: "privacy",
    icon: "Download",
  },
  {
    id: "cookies",
    category: "privacy",
    icon: "ShieldCheck",
  },
  {
    id: "connectionError",
    category: "support",
    icon: "AlertCircle",
  },
  {
    id: "supportedBrowsers",
    category: "support",
    icon: "Globe",
  },
  {
    id: "keyboardSupport",
    category: "support",
    icon: "ShieldCheck",
  },
  {
    id: "contactTeam",
    category: "support",
    icon: "HelpCircle",
    answerType: "aboutStrong",
  },
];

const ITEMS_PER_PAGE = 8;

function FAQAnswer({
  item,
}) {
  const baseKey =
    `faq.items.${item.id}`;

  if (
    item.answerType ===
    "apiList"
  ) {
    return (
      <>
        <p>
          <Trans
            i18nKey={`${baseKey}.answer`}
          />
        </p>

        <ul className="faq-answer-grid">
          {[
            "apod",
            "donki",
            "epic",
            "neows",
          ].map((apiId) => (
            <li key={apiId}>
              <strong>
                <Trans
                  i18nKey={`${baseKey}.apis.${apiId}.name`}
                />
              </strong>

              <Trans
                i18nKey={`${baseKey}.apis.${apiId}.description`}
              />
            </li>
          ))}
        </ul>
      </>
    );
  }

  if (
    item.answerType ===
    "updateCallout"
  ) {
    return (
      <>
        <p>
          <Trans
            i18nKey={`${baseKey}.answer`}
          />
        </p>

        <div className="faq-callout">
          <Icon
            name="CheckCircle"
            size={16}
            aria-hidden="true"
          />

          <span>
            <Trans
              i18nKey={`${baseKey}.callout`}
            />
          </span>
        </div>
      </>
    );
  }

  if (
    item.answerType ===
    "nasaKey"
  ) {
    return (
      <>
        <p>
          <Trans
            i18nKey={`${baseKey}.paragraph1`}
          />
        </p>

        <p>
          <Trans
            i18nKey={`${baseKey}.paragraph2`}
          />
        </p>

        <p>
          <Trans
            i18nKey={`${baseKey}.paragraph3`}
            components={{
              strong: <strong />,
            }}
          />
        </p>

        <div className="faq-callout">
          <Icon
            name="ExternalLink"
            size={16}
            aria-hidden="true"
          />

          <span>
            <Trans
              i18nKey={`${baseKey}.callout`}
              components={{
                nasaLink: (
                  <a
                    href="https://api.nasa.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            />
          </span>
        </div>
      </>
    );
  }

  if (
    item.answerType ===
      "favoritesStrong" ||
    item.answerType ===
      "aboutStrong"
  ) {
    return (
      <p>
        <Trans
          i18nKey={`${baseKey}.answer`}
          components={{
            strong: <strong />,
          }}
        />
      </p>
    );
  }

  return (
    <p>
      <Trans
        i18nKey={`${baseKey}.answer`}
      />
    </p>
  );
}

function FAQItem({
  item,
  panelId,
  triggerId,
  isOpen,
  onToggle,
}) {
  const { t } =
    useTranslation();

  return (
    <article
      className={`faq-item${
        isOpen
          ? " faq-item--active"
          : ""
      }`}
    >
      <h2 className="faq-item__heading">
        <button
          id={triggerId}
          type="button"
          className="faq-item__trigger"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span className="faq-item__question">
            <Icon
              name={item.icon}
              size={20}
              className="faq-item__icon"
              aria-hidden="true"
            />

            <span>
              {t(
                `faq.items.${item.id}.question`
              )}
            </span>
          </span>

          <Icon
            name="ChevronDown"
            size={18}
            className="faq-item__chevron"
            aria-hidden="true"
          />
        </button>
      </h2>

      <div
        id={panelId}
        className="faq-item__content"
        role="region"
        aria-labelledby={triggerId}
        hidden={!isOpen}
      >
        <div className="faq-item__answer">
          <FAQAnswer
            item={item}
          />
        </div>
      </div>
    </article>
  );
}

function normalizeSearchText(
  value
) {
  return String(value || "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLocaleLowerCase();
}

function FAQ() {
  const { t } =
    useTranslation();

  const [search, setSearch] =
    useState("");

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("all");

  const [
    openItemId,
    setOpenItemId,
  ] = useState(null);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const visibleItems =
    useMemo(() => {
      const term =
        normalizeSearchText(
          search.trim()
        );

      return FAQ_ITEMS.filter(
        (item) => {
          const matchesCategory =
            activeCategory ===
              "all" ||
            item.category ===
              activeCategory;

          const searchableText =
            normalizeSearchText(
              [
                t(
                  `faq.items.${item.id}.question`
                ),
                t(
                  `faq.categories.${item.category}`
                ),
                t(
                  `faq.items.${item.id}.keywords`
                ),
              ].join(" ")
            );

          const matchesSearch =
            !term ||
            searchableText.includes(
              term
            );

          return (
            matchesCategory &&
            matchesSearch
          );
        }
      );
    }, [
      activeCategory,
      search,
      t,
    ]);

  const totalPages =
    Math.ceil(
      visibleItems.length /
        ITEMS_PER_PAGE
    );

  const safeCurrentPage =
    Math.min(
      currentPage,
      Math.max(
        totalPages,
        1
      )
    );

  const startIndex =
    (safeCurrentPage - 1) *
    ITEMS_PER_PAGE;

  const paginatedItems =
    visibleItems.slice(
      startIndex,
      startIndex +
        ITEMS_PER_PAGE
    );

  function handleToggle(
    itemId
  ) {
    setOpenItemId(
      (currentId) =>
        currentId === itemId
          ? null
          : itemId
    );
  }

  function handleCategoryChange(
    category
  ) {
    setActiveCategory(category);
    setOpenItemId(null);
    setCurrentPage(1);
  }

  function handleSearchChange(
    event
  ) {
    setSearch(
      event.target.value
    );

    setCurrentPage(1);
    setOpenItemId(null);
  }

  return (
    <>
      <PageMeta
        title={t(
          "faq.meta.title"
        )}
        description={t(
          "faq.meta.description"
        )}
      />

      <main className="faq-page">
        <Container>
          <Breadcrumb
            title={t(
              "faq.breadcrumb"
            )}
          />

          <header className="faq-hero">
            <p className="faq-hero__eyebrow">
              {t(
                "faq.hero.eyebrow"
              )}
            </p>

            <h1>
              {t(
                "faq.hero.title"
              )}
            </h1>

            <p className="faq-hero__description">
              {t(
                "faq.hero.description"
              )}
            </p>
          </header>

          <section
            className="faq-tools"
            aria-label={t(
              "faq.toolsAria"
            )}
          >
            <div className="faq-search">
              <SearchInput
                placeholder={t(
                  "faq.searchPlaceholder"
                )}
                value={search}
                onChange={
                  handleSearchChange
                }
              />
            </div>

            <div
              className="faq-filters"
              role="group"
              aria-label={t(
                "faq.filtersAria"
              )}
            >
              {CATEGORY_IDS.map(
                (category) => {
                  const isActive =
                    category ===
                    activeCategory;

                  return (
                    <button
                      key={
                        category
                      }
                      type="button"
                      className={`faq-filter${
                        isActive
                          ? " faq-filter--active"
                          : ""
                      }`}
                      onClick={() =>
                        handleCategoryChange(
                          category
                        )
                      }
                      aria-pressed={
                        isActive
                      }
                    >
                      {t(
                        `faq.categories.${category}`
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </section>

          <section
            className="faq-list"
            aria-label={t(
              "faq.listAria"
            )}
            aria-live="polite"
          >
            {paginatedItems.map(
              (item) => {
                const panelId =
                  `faq-panel-${item.id}`;

                const triggerId =
                  `faq-trigger-${item.id}`;

                return (
                  <FAQItem
                    key={item.id}
                    item={item}
                    panelId={
                      panelId
                    }
                    triggerId={
                      triggerId
                    }
                    isOpen={
                      openItemId ===
                      item.id
                    }
                    onToggle={() =>
                      handleToggle(
                        item.id
                      )
                    }
                  />
                );
              }
            )}
          </section>

          {totalPages > 1 && (
            <Pagination
              currentPage={
                safeCurrentPage
              }
              totalPages={
                totalPages
              }
              onPageChange={(
                page
              ) => {
                setCurrentPage(
                  page
                );

                setOpenItemId(
                  null
                );

                window.scrollTo({
                  top: 0,
                  behavior:
                    "smooth",
                });
              }}
            />
          )}

          {visibleItems.length ===
            0 && (
            <div
              className="faq-empty"
              role="status"
            >
              <Icon
                name="AlertCircle"
                size={32}
                aria-hidden="true"
              />

              <p>
                {t(
                  "faq.empty.title"
                )}
              </p>

              <span>
                {t(
                  "faq.empty.description"
                )}
              </span>
            </div>
          )}
        </Container>
      </main>
    </>
  );
}

export default FAQ;