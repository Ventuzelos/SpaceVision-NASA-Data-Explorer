import { donkiEventTypes } from "../../../services/donkiService";
import { donkiExplainers } from "../../../data/donkiExplainers";

import "./EventExplainer.css";

function EventExplainer({ type }) {
  const explainer = donkiExplainers[type];

  if (!explainer) return null;

  const typeConfig = donkiEventTypes.find(
    (item) => item.id === type
  );

  return (
    <div
      className="event-explainer"
      style={{ "--type-color": typeConfig?.color }}
    >
      <h2 className="event-explainer__title">
        {typeConfig?.shortLabel}
      </h2>

      <div className="event-explainer__grid">
        <div className="event-explainer__section">
          <h3>O que está a acontecer?</h3>
          <p>{explainer.whatIsHappening}</p>
        </div>

        <div className="event-explainer__section">
          <h3>Como te afeta?</h3>
          <p>{explainer.howItAffectsYou}</p>
        </div>
      </div>
    </div>
  );
}

export default EventExplainer;
