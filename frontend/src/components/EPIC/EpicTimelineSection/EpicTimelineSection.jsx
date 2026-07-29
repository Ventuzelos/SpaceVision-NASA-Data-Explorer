import { useTranslation } from "react-i18next";

import "./EpicTimelineSection.css";

import EpicSectionHead from "../EpicSectionHead/EpicSectionHead";
import EpicTimeline from "../EpicTimeline/EpicTimeline";

export default function EpicTimelineSection() {
  const { t } = useTranslation();

  return (
    <section
      id="timeline"
      aria-labelledby="epic-timeline-title"
    >
      <EpicSectionHead
        titleId="epic-timeline-title"
        title={t(
          "epic.timelineSection.title"
        )}
        sub={t(
          "epic.timelineSection.description"
        )}
      />

      <div className="timeline-spacer" />

      <div className="timeline-card">
        <EpicTimeline />
      </div>
    </section>
  );
}