import Icon from "../../common/Icon/Icon";

import "./DiscovrMissionStatus.css";

const MISSION_STATUS = [
  {
    id: "james-webb",
    name: "James Webb Space Telescope",
    icon: "Telescope",
    status: "Operacional",
    variant: "success",
    detail:
      "Em órbita em torno do ponto de Lagrange L2, continua a recolher dados infravermelhos sobre o Universo primitivo.",
    updatedLabel: "julho de 2026",
    updatedDate: "2026-07",
  },
  {
    id: "artemis-ii",
    name: "Artemis II",
    icon: "Rocket",
    status: "Em preparação",
    variant: "upcoming",
    detail:
      "Missão tripulada em preparação para o primeiro voo do programa Artemis em torno da Lua.",
    updatedLabel: "julho de 2026",
    updatedDate: "2026-07",
  },
  {
    id: "voyager-1",
    name: "Voyager 1",
    icon: "Satellite",
    status: "Ativa · Espaço interestelar",
    variant: "success",
    detail:
      "A sonda mais distante construída pela humanidade continua a transmitir dados científicos a partir do espaço interestelar.",
    updatedLabel: "julho de 2026",
    updatedDate: "2026-07",
  },
  {
    id: "voyager-2",
    name: "Voyager 2",
    icon: "Satellite",
    status: "Ativa · Espaço interestelar",
    variant: "success",
    detail:
      "Continua a enviar dados sobre o meio interestelar desde que ultrapassou a heliopausa em 2018.",
    updatedLabel: "julho de 2026",
    updatedDate: "2026-07",
  },
];

function DiscovrMissionStatus() {
  return (
    <section
      id="missoes"
      className="discovr-section"
      aria-labelledby="discovr-missions-title"
    >
      <h2
        id="discovr-missions-title"
        className="discovr-section__title"
      >
        <Icon
          name="Satellite"
          size={22}
          aria-hidden="true"
        />

        Estado das missões
      </h2>

      <p className="discovr-section__subtitle">
        Panorama informativo de algumas das missões mais emblemáticas
        associadas à exploração espacial da NASA.
      </p>

      <div className="discovr-status-grid">
        {MISSION_STATUS.map((mission) => {
          const titleId = `mission-status-${mission.id}`;

          return (
            <article
              className="discovr-status-card"
              key={mission.id}
              aria-labelledby={titleId}
            >
              <div className="discovr-status-card__header">
                <Icon
                  name={mission.icon}
                  size={22}
                  aria-hidden="true"
                />

                <span
                  className={`discovr-status-card__badge discovr-status-card__badge--${mission.variant}`}
                >
                  <span
                    className="discovr-status-card__pulse"
                    aria-hidden="true"
                  />

                  {mission.status}
                </span>
              </div>

              <h3 id={titleId}>
                {mission.name}
              </h3>

              <p>{mission.detail}</p>

              <span className="discovr-status-card__updated">
                Atualização editorial:{" "}
                <time dateTime={mission.updatedDate}>
                  {mission.updatedLabel}
                </time>
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default DiscovrMissionStatus;