import { useEffect, useRef, useState } from "react";

import Icon from "../../common/Icon/Icon";

import sceneImage from "../../../assets/hero1.webp";

import "./DiscovrTimeline.css";

const MISSION_TIMELINE = [
  {
    year: "1969",
    title: "Apollo 11",
    text: "Armstrong e Aldrin tornam-se os primeiros humanos a pisar a Lua.",
    position: "above",
  },
  {
    year: "1977",
    title: "Voyager 1 & 2",
    text: "Lançamento das sondas gémeas rumo aos planetas exteriores.",
    position: "below",
  },
  {
    year: "1990",
    title: "Telescópio Hubble",
    text: "O telescópio espacial revoluciona a astronomia observacional.",
    position: "above",
  },
  {
    year: "1998",
    title: "Estação Espacial Internacional",
    text: "Início da construção do laboratório orbital internacional.",
    position: "below",
  },
  {
    year: "2012",
    title: "Curiosity em Marte",
    text: "O rover pousa em Marte para estudar a sua habitabilidade.",
    position: "above",
  },
  {
    year: "2021",
    title: "Telescópio James Webb",
    text: "Lançado para observar o universo em infravermelho.",
    position: "below",
  },
  {
    year: "2022",
    title: "Artemis I",
    text: "Voo de teste não tripulado à volta da Lua.",
    position: "above",
  },
  {
    year: "Futuro",
    title: "Artemis II & III",
    text: "Missões tripuladas rumo a uma nova alunagem humana.",
    position: "below",
    active: true,
  },
];

function DiscovrTimeline() {
  const [openIndex, setOpenIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false); // NOVO: Estado para verificar tamanho do ecrã
  const sceneRef = useRef(null);
  const pathRef = useRef(null);

  // Estados locais controlados para o arrasto do rato
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [mouseMoved, setMouseMoved] = useState(false);

  useEffect(() => {
    // Deteta se a largura do ecrã é mobile (igual ao @media do CSS: 900px)
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    checkMobile(); // Executa ao carregar a página
    window.addEventListener("resize", checkMobile);

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpenIndex(null);
    }

    function handlePointerDown(event) {
      if (sceneRef.current && !sceneRef.current.contains(event.target)) {
        setOpenIndex(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const handleMouseDown = (e) => {
    if (isMobile) return; // Desativa arrasto no mobile já que a lista passa a ser vertical pura
    const slider = pathRef.current;
    if (!slider) return;

    setIsDragging(true);
    setMouseMoved(false);
    setStartX(e.pageX - slider.offsetLeft);
    setScrollLeftState(slider.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isMobile) return;
    const slider = pathRef.current;
    if (!slider) return;

    const x = e.pageX - slider.offsetLeft;
    const currentDistance = Math.abs(x - startX);

    if (currentDistance > 5) {
      setMouseMoved(true);
    }

    e.preventDefault();
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeftState - walk;
  };

  const stepX = 100 / (MISSION_TIMELINE.length - 1);

  function handleToggle(index) {
    if (isMobile) return; // Desativa cliques de fechar/abrir no mobile
    if (mouseMoved) {
      setMouseMoved(false);
      return;
    }
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <section id="timeline" className="discovr-section">
      <h2 className="discovr-section__title">
        <Icon name="Calendar" size={22} />
        Linha do tempo interativa
      </h2>

      <p className="discovr-section__subtitle">
        {isMobile ? "Desliza para baixo para explorares as missões." : "Clica num ano da linha para veres a missão correspondente."}
      </p>

      <div className="discovr-timeline-scene" ref={sceneRef}>
        <div
          className="discovr-timeline-scene__bg"
          style={{ backgroundImage: `url(${sceneImage})` }}
          aria-hidden="true"
        />
        <div className="discovr-timeline-scene__overlay" aria-hidden="true" />

        <div
          className={`discovr-timeline-scene__path ${isDragging ? "grabbing" : ""}`}
          ref={pathRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
        >
          <div className="discovr-timeline-scene__track">
            <div className="discovr-timeline-scene__rail" aria-hidden="true" />

            {MISSION_TIMELINE.map((mission, index) => {
              // MODIFICADO: Se for mobile, fica sempre aberto. Se for PC, depende do clique ou hover.
              const isOpen = isMobile ? true : openIndex === index;
              const isHovered = isMobile ? false : hoveredIndex === index;
              const cardId = `discovr-timeline-card-${index}`;

              let alignClass = "discovr-timeline-scene__info--center";
              if (index === 0) alignClass = "discovr-timeline-scene__info--start";
              if (index === MISSION_TIMELINE.length - 1) {
                alignClass = "discovr-timeline-scene__info--end";
              }

              return (
                <div
                  className="discovr-timeline-scene__marker"
                  key={mission.year}
                  style={{ left: isMobile ? "auto" : `${index * stepX}%` }}
                >
                  <button
                    type="button"
                    className={`discovr-timeline-scene__dot${mission.active ? " discovr-timeline-scene__dot--active" : ""
                      }${isOpen || isHovered ? " discovr-timeline-scene__dot--open" : ""}`}
                    onClick={() => handleToggle(index)}
                    disabled={isMobile} // Desativa interações do botão no mobile
                    aria-expanded={isOpen}
                    aria-pressed={isOpen}
                    aria-controls={cardId}
                    aria-label={`${mission.year} — ${mission.title}`}
                  />

                  <div
                    className={`discovr-timeline-scene__info discovr-timeline-scene__info--${mission.position} ${alignClass}`}
                  >
                    <button
                      type="button"
                      className="discovr-timeline-scene__year"
                      onClick={() => handleToggle(index)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      disabled={isMobile}
                      aria-expanded={isOpen}
                      aria-pressed={isOpen}
                      aria-controls={cardId}
                    >
                      {mission.year}
                    </button>

                    {isOpen && (
                      <div
                        id={cardId}
                        className="discovr-timeline-scene__card"
                        role="region"
                        aria-labelledby={`${cardId}-title`}
                      >
                        {!isMobile && (
                          <button
                            type="button"
                            className="discovr-timeline-scene__card-close"
                            onClick={() => setOpenIndex(null)}
                            aria-label={`Fechar detalhes de ${mission.title}`}
                          >
                            <Icon name="X" size={14} aria-hidden="true" />
                          </button>
                        )}

                        <h3 id={`${cardId}-title`}>
                          {mission.title}
                        </h3>

                        <p>{mission.text}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DiscovrTimeline;
