import { useEffect, useRef, useState } from "react";

import Container from "../../common/Container/Container";

import "./DiscovrSectionNav.css";

const SECTIONS = [
  { id: "galeria", label: "Galeria" },
  { id: "timeline", label: "Linha do tempo" },
  { id: "radar", label: "Radar de asteroides" },
  { id: "missoes", label: "Missões" },
];

function DiscovrSectionNav() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const sections = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    );

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function handleClick(event, id) {
    event.preventDefault();
    setActiveId(id);

    isClickScrolling.current = true;
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.clearTimeout(handleClick.timeoutId);
    handleClick.timeoutId = window.setTimeout(() => {
      isClickScrolling.current = false;
    }, 700);
  }

  return (
    <div className="discovr-section-nav">
      <Container>
        <nav
          className="discovr-section-nav__list"
          aria-label="Navegação das secções Discover"
        >
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(event) => handleClick(event, section.id)}
              aria-current={activeId === section.id ? "true" : undefined}
              className={`discovr-section-nav__link${
                activeId === section.id
                  ? " discovr-section-nav__link--active"
                  : ""
              }`}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </Container>
    </div>
  );
}

export default DiscovrSectionNav;
