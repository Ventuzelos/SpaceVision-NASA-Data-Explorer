import { useTranslation } from "react-i18next";

import "./EpicTimeline.css";

const TIMELINE_ITEMS = [
  {
    id: "launch",
    yearKey: "epic.timeline.items.launch.year",
    titleKey: "epic.timeline.items.launch.title",
    textKey: "epic.timeline.items.launch.text",
  },
  {
    id: "l1Arrival",
    yearKey: "epic.timeline.items.l1Arrival.year",
    titleKey: "epic.timeline.items.l1Arrival.title",
    textKey: "epic.timeline.items.l1Arrival.text",
  },
  {
    id: "firstImages",
    yearKey: "epic.timeline.items.firstImages.year",
    titleKey: "epic.timeline.items.firstImages.title",
    textKey: "epic.timeline.items.firstImages.text",
  },
  {
    id: "apiLaunch",
    yearKey: "epic.timeline.items.apiLaunch.year",
    titleKey: "epic.timeline.items.apiLaunch.title",
    textKey: "epic.timeline.items.apiLaunch.text",
  },
  {
    id: "today",
    yearKey: "epic.timeline.items.today.year",
    titleKey: "epic.timeline.items.today.title",
    textKey: "epic.timeline.items.today.text",
    active: true,
  },
];

export default function EpicTimeline() {
  const { t } = useTranslation();

  return (
    <ol className="epic-timeline">
      {TIMELINE_ITEMS.map((item) => (
        <li
          className="epic-timeline__item"
          key={item.id}
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
              {t(item.yearKey)}
            </span>
          </div>

          <div className="epic-timeline__content">
            <h3 className="epic-timeline__title">
              {t(item.titleKey)}
            </h3>

            <p className="epic-timeline__description">
              {t(item.textKey)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}