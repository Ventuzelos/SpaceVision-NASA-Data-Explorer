import { useState } from "react";

import Container from "../Container/Container";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import Icon from "../Icon/Icon";

import "./LegalLayout.css";

function LegalLayout({
  eyebrow,
  title,
  description,
  icon,
  lastUpdated,
  summary,
  sections,
}) {
  const [activeId, setActiveId] = useState(sections?.[0]?.id);

  function handleNavClick(id) {
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  return (
    <main className="legal-page">
      <Container>
        <Breadcrumb title={title} />

        <header className="legal-hero">
          <span className="legal-hero__icon">
            <Icon name={icon} size={26} />
          </span>
          <span className="legal-hero__eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          {lastUpdated && (
            <div className="legal-hero__updated">
              <Icon name="RefreshCw" size={14} />
              <span>Última atualização: {lastUpdated}</span>
            </div>
          )}
        </header>

        {summary && (
          <div className="legal-summary">
            <Icon name="ShieldCheck" size={18} />
            <p>
              <strong>Em resumo:</strong> {summary}
            </p>
          </div>
        )}

        <div className="legal-layout">
          <nav className="legal-toc" aria-label="Índice do documento">
            <span className="legal-toc__label">Neste documento</span>
            <ul>
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    type="button"
                    className={`legal-toc__link${
                      activeId === section.id ? " legal-toc__link--active" : ""
                    }`}
                    onClick={() => handleNavClick(section.id)}
                  >
                    <Icon name={section.icon} size={15} />
                    <span>{section.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="legal-content">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="legal-section"
              >
                <div className="legal-section__header">
                  <span className="legal-section__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2>
                    <Icon
                      name={section.icon}
                      size={19}
                      className="legal-section__icon"
                    />
                    {section.title}
                  </h2>
                </div>
                <div className="legal-section__body">{section.content}</div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}

export default LegalLayout;