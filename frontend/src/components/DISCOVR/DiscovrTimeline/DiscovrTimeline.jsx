import { useEffect, useRef, useState } from "react";

import Icon from "../../common/Icon/Icon";

import sceneImage from "../../../assets/hero1.jpg";

import "./DiscovrTimeline.css";

// Marcos alternam acima/abaixo da linha; ao clicar num ponto, o cartão
// de informação abre desse mesmo lado, sobre a fotografia de fundo.
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
  const sceneRef = useRef(null);

  useEffect(() => {
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
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const stepX = 100 / (MISSION_TIMELINE.length - 1);

  function handleToggle(index) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <section id="timeline" className="discovr-section">
      <h2 className="discovr-section__title">
        <Icon name="Calendar" size={22} />
        Linha do tempo interativa
      </h2>

      <p className="discovr-section__subtitle">
        Clica num ano da linha para veres a missão correspondente.
      </p>

      <div className="discovr-timeline-scene" ref={sceneRef}>
        <div
          className="discovr-timeline-scene__bg"
          style={{ backgroundImage: `url(${sceneImage})` }}
        />
        <div className="discovr-timeline-scene__overlay" />

        <div className="discovr-timeline-scene__path">
          <div className="discovr-timeline-scene__track">
          <div className="discovr-timeline-scene__rail" aria-hidden="true" />

          {MISSION_TIMELINE.map((mission, index) => {
            const isOpen = openIndex === index;
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
                style={{ left: `${index * stepX}%` }}
              >
                <button
                  type="button"
                  className={`discovr-timeline-scene__dot${
                    mission.active ? " discovr-timeline-scene__dot--active" : ""
                  }${isOpen ? " discovr-timeline-scene__dot--open" : ""}`}
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
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
                    aria-expanded={isOpen}
                    aria-controls={cardId}
                  >
                    {mission.year}
                  </button>

                  {isOpen && (
                    <div id={cardId} className="discovr-timeline-scene__card">
                      <button
                        type="button"
                        className="discovr-timeline-scene__card-close"
                        onClick={() => setOpenIndex(null)}
                        aria-label="Fechar"
                      >
                        <Icon name="X" size={14} />
                      </button>

                      <h4>{mission.title}</h4>
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
