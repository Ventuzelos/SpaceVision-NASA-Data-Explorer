import { useTranslation } from "react-i18next";

import { donkiEventTypes } from "../../../services/donkiService";
import { donkiExplainers } from "../../../data/donkiExplainers";

import "./EventExplainer.css";

function EventExplainer({ type }) {
  const { t } = useTranslation();

  const explainer = donkiExplainers[type];

  if (!explainer) {
    return null;
  }

  const typeConfig = donkiEventTypes.find(
    (item) => item.id === type
  );

  return (
    <div
      className="event-explainer"
      style={{
        "--type-color": typeConfig?.color,
      }}
    >
      <h2 className="event-explainer__title">
        {typeConfig
          ? t(typeConfig.shortLabelKey)
          : ""}
      </h2>

      <div className="event-explainer__grid">
        <div className="event-explainer__section">
          <h3>
            {t(
              "donki.explainer.whatIsHappening"
            )}
          </h3>

          <p>
            {t(
              explainer.whatIsHappeningKey
            )}
          </p>
        </div>

        <div className="event-explainer__section">
          <h3>
            {t(
              "donki.explainer.howItAffectsYou"
            )}
          </h3>

          <p>
            {t(
              explainer.howItAffectsYouKey
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default EventExplainer;