import Icon from "../../common/Icon/Icon";

import "./DiscovrTimeline.css";

const MISSION_TIMELINE = [
  {
    year: "1969",
    title: "Apollo 11",
    text: "Armstrong e Aldrin tornam-se os primeiros humanos a pisar a Lua.",
    color: "var(--color-accent)",
    position: "up",
  },
  {
    year: "1977",
    title: "Voyager 1 & 2",
    text: "Lançamento das sondas gémeas rumo aos planetas exteriores.",
    color: "var(--color-secondary)",
    position: "down",
  },
  {
    year: "1990",
    title: "Telescópio Hubble",
    text: "O telescópio espacial revoluciona a astronomia observacional.",
    color: "var(--color-success)",
    position: "up",
  },
  {
    year: "1998",
    title: "Estação Espacial Internacional",
    text: "Início da construção do laboratório orbital internacional.",
    color: "var(--color-error)",
    position: "down",
  },
  {
    year: "2012",
    title: "Curiosity em Marte",
    text: "O rover pousa em Marte para estudar a sua habitabilidade.",
    color: "var(--color-accent)",
    position: "up",
  },
  {
    year: "2021",
    title: "Telescópio James Webb",
    text: "Lançado para observar o universo em infravermelho.",
    color: "var(--color-secondary)",
    position: "down",
  },
  {
    year: "2022",
    title: "Artemis I",
    text: "Voo de teste não tripulado à volta da Lua.",
    color: "var(--color-success)",
    position: "up",
  },
  {
    year: "Futuro",
    title: "Artemis II & III",
    text: "Missões tripuladas rumo a uma nova alunagem humana.",
    color: "var(--color-error)",
    position: "down",
    active: true,
  },
];

function TimelineText({ mission }) {
  return (
    <div className="discovr-timeline-h__content">
      <h4>{mission.title}</h4>
      <p>{mission.text}</p>
    </div>
  );
}

function DiscovrTimeline() {
  return (
    <section className="discovr-section">
      <h2 className="discovr-section__title">
        <Icon name="Calendar" size={22} />
        Linha do tempo interativa
      </h2>

      <p className="discovr-section__subtitle">
        Das primeiras pegadas na Lua às missões que ainda estão para vir.
      </p>

      <div className="discovr-timeline-card">
        <div className="discovr-timeline-h">
          {MISSION_TIMELINE.map((mission, index) => (
            <div
              className="discovr-timeline-h__cell discovr-timeline-h__cell--top"
              key={`top-${index}`}
            >
              {mission.position === "up" && <TimelineText mission={mission} />}
            </div>
          ))}

          {MISSION_TIMELINE.map((mission, index) => (
            <div className="discovr-timeline-h__node" key={`node-${index}`}>
              <span
                className={`discovr-timeline-h__dot${
                  mission.active ? " discovr-timeline-h__dot--active" : ""
                }`}
                style={{ "--dot-color": mission.color }}
              />
              <span
                className="discovr-timeline-h__year"
                style={{ color: mission.color }}
              >
                {mission.year}
              </span>
            </div>
          ))}

          {MISSION_TIMELINE.map((mission, index) => (
            <div
              className="discovr-timeline-h__cell discovr-timeline-h__cell--bottom"
              key={`bottom-${index}`}
            >
              {mission.position === "down" && (
                <TimelineText mission={mission} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DiscovrTimeline;
