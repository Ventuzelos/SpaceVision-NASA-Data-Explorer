import Icon from "../../common/Icon/Icon";

import "./DiscovrMissionStatus.css";

const MISSION_STATUS = [
  {
    name: "James Webb Space Telescope",
    icon: "Telescope",
    status: "Operacional",
    variant: "success",
    detail:
      "Em órbita ao redor do ponto de Lagrange L2, continua a recolher dados infravermelhos do universo primitivo.",
    updated: "julho de 2026",
  },
  {
    name: "Artemis II",
    icon: "Rocket",
    status: "Em preparação",
    variant: "upcoming",
    detail:
      "Missão tripulada em preparação para o primeiro voo do programa Artemis à volta da Lua.",
    updated: "julho de 2026",
  },
  {
    name: "Voyager 1",
    icon: "Satellite",
    status: "Ativa · Espaço interestelar",
    variant: "success",
    detail:
      "A sonda mais distante já construída pelo Homem continua a transmitir dados científicos há mais de 45 anos.",
    updated: "julho de 2026",
  },
  {
    name: "Voyager 2",
    icon: "Satellite",
    status: "Ativa · Espaço interestelar",
    variant: "success",
    detail:
      "Continua a enviar dados sobre o meio interestelar desde que ultrapassou a heliopausa em 2018.",
    updated: "julho de 2026",
  },
];

function DiscovrMissionStatus() {
  return (
    <section className="discovr-section">
      <h2 className="discovr-section__title">
        <Icon name="Satellite" size={22} />
        Status das missões
      </h2>

      <p className="discovr-section__subtitle">
        Panorama atual dos exploradores mais emblemáticos da NASA.
      </p>

      <div className="discovr-status-grid">
        {MISSION_STATUS.map((mission) => (
          <div className="discovr-status-card" key={mission.name}>
            <div className="discovr-status-card__header">
              <Icon name={mission.icon} size={22} />

              <span
                className={`discovr-status-card__badge discovr-status-card__badge--${mission.variant}`}
              >
                <span className="discovr-status-card__pulse" />
                {mission.status}
              </span>
            </div>

            <h3>{mission.name}</h3>
            <p>{mission.detail}</p>

            <span className="discovr-status-card__updated">
              Atualizado em {mission.updated}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DiscovrMissionStatus;
