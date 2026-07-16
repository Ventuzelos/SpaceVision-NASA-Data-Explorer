import "./EpicTimeline.css";

const TIMELINE_ITEMS = [
  {
    year: "Fev 2015",
    title: "Lançamento do DSCOVR",
    text: "O satélite Deep Space Climate Observatory é lançado num foguetão Falcon 9 da SpaceX, numa parceria entre a NASA, a NOAA e a Força Aérea dos EUA.",
    color: "var(--color-accent)",
  },
  {
    year: "Jun 2015",
    title: "Chegada ao ponto L1",
    text: "Após meses de viagem, o DSCOVR entra em órbita a cerca de 1,5 milhões de km da Terra, no ponto de Lagrange L1.",
    color: "var(--color-secondary)",
  },
  {
    year: "Verão 2015",
    title: "Primeiras imagens da EPIC",
    text: "A NASA divulga as primeiras imagens a cores naturais do disco completo da Terra, captadas pelo espectroradiómetro EPIC.",
    color: "var(--color-success)",
  },
  {
    year: "Desde 2015",
    title: "Abertura da EPIC API",
    text: "A EPIC API passa a disponibilizar publicamente cada captura e os respetivos metadados, prontos a explorar por qualquer pessoa.",
    color: "var(--color-error)",
  },
  {
    year: "Hoje",
    title: "Mais de uma década de dados",
    text: "A EPIC continua em operação, a capturar o disco completo da Terra a cada duas horas — um arquivo contínuo com mais de dez anos de imagens.",
    color: "var(--color-accent)",
    active: true,
  },
];

export default function EpicTimeline() {
  return (
    <ol className="epic-timeline">
      {TIMELINE_ITEMS.map((item) => (
        <li
          className="epic-timeline__item"
          key={`${item.year}-${item.title}`}
          style={{ "--timeline-color": item.color }}
        >
          <div className="epic-timeline__marker">
            <span
              className={`epic-timeline__dot${
                item.active
                  ? " epic-timeline__dot--active"
                  : ""
              }`}
              aria-hidden="true"
            />

            <span className="epic-timeline__year">
              {item.year}
            </span>
          </div>

          <div className="epic-timeline__content">
            <h3 className="epic-timeline__title">
              {item.title}
            </h3>

            <p className="epic-timeline__description">
              {item.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}