import { useTranslation } from "react-i18next";

import Icon from "../../common/Icon/Icon";

import "./DiscovrMissionStatus.css";

const MISSION_STATUS = [
  {
    id: "james-webb",
    nameKey:
      "discovr.missionStatus.missions.jamesWebb.name",
    icon: "Telescope",
    statusKey:
      "discovr.missionStatus.missions.jamesWebb.status",
    variant: "success",
    detailKey:
      "discovr.missionStatus.missions.jamesWebb.detail",
    updatedDate: "2026-07",
  },
  {
    id: "artemis-ii",
    nameKey:
      "discovr.missionStatus.missions.artemisII.name",
    icon: "Rocket",
    statusKey:
      "discovr.missionStatus.missions.artemisII.status",
    variant: "upcoming",
    detailKey:
      "discovr.missionStatus.missions.artemisII.detail",
    updatedDate: "2026-07",
  },
  {
    id: "voyager-1",
    nameKey:
      "discovr.missionStatus.missions.voyager1.name",
    icon: "Satellite",
    statusKey:
      "discovr.missionStatus.missions.voyager1.status",
    variant: "success",
    detailKey:
      "discovr.missionStatus.missions.voyager1.detail",
    updatedDate: "2026-07",
  },
  {
    id: "voyager-2",
    nameKey:
      "discovr.missionStatus.missions.voyager2.name",
    icon: "Satellite",
    statusKey:
      "discovr.missionStatus.missions.voyager2.status",
    variant: "success",
    detailKey:
      "discovr.missionStatus.missions.voyager2.detail",
    updatedDate: "2026-07",
  },
];

function formatUpdatedDate(
  dateString,
  locale
) {
  if (
    typeof dateString !== "string" ||
    !/^\d{4}-\d{2}$/.test(
      dateString
    )
  ) {
    return dateString;
  }

  const [year, month] =
    dateString
      .split("-")
      .map(Number);

  const parsedDate = new Date(
    year,
    month - 1,
    1
  );

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return dateString;
  }

  return new Intl.DateTimeFormat(
    locale,
    {
      month: "long",
      year: "numeric",
    }
  ).format(parsedDate);
}

function DiscovrMissionStatus() {
  const { t, i18n } =
    useTranslation();

  const locale =
    i18n.resolvedLanguage?.startsWith(
      "en"
    )
      ? "en-GB"
      : "pt-PT";

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
        {t(
          "discovr.missionStatus.title"
        )}
      </h2>

      <p className="discovr-section__subtitle">
        {t(
          "discovr.missionStatus.description"
        )}
      </p>

      <div className="discovr-status-grid">
        {MISSION_STATUS.map(
          (mission) => {
            const titleId =
              `mission-status-${mission.id}`;

            const missionName =
              t(
                mission.nameKey
              );

            const missionStatus =
              t(
                mission.statusKey
              );

            const missionDetail =
              t(
                mission.detailKey
              );

            const updatedLabel =
              formatUpdatedDate(
                mission.updatedDate,
                locale
              );

            return (
              <article
                className="discovr-status-card"
                key={mission.id}
                aria-labelledby={
                  titleId
                }
              >
                <div className="discovr-status-card__header">
                  <Icon
                    name={
                      mission.icon
                    }
                    size={22}
                    aria-hidden="true"
                  />

                  <span
                    className={`discovr-status-card__badge discovr-status-card__badge--${mission.variant}`}
                    aria-label={t(
                      "discovr.missionStatus.statusAria",
                      {
                        status:
                          missionStatus,
                      }
                    )}
                  >
                    <span
                      className="discovr-status-card__pulse"
                      aria-hidden="true"
                    />

                    {
                      missionStatus
                    }
                  </span>
                </div>

                <h3 id={titleId}>
                  {missionName}
                </h3>

                <p>
                  {missionDetail}
                </p>

                <span className="discovr-status-card__updated">
                  {t(
                    "discovr.missionStatus.updatedLabel"
                  )}{" "}
                  <time
                    dateTime={
                      mission.updatedDate
                    }
                  >
                    {
                      updatedLabel
                    }
                  </time>
                </span>
              </article>
            );
          }
        )}
      </div>
    </section>
  );
}

export default DiscovrMissionStatus;