import { useTranslation } from "react-i18next";

import "./EpicPipeline.css";
import EpicSectionHead from "../EpicSectionHead/EpicSectionHead";

const PIPELINE_STEPS = [
  {
    number: "01",
    titleKey: "epic.pipeline.steps.capture.title",
    textKey: "epic.pipeline.steps.capture.text",
  },
  {
    number: "02",
    titleKey: "epic.pipeline.steps.downlink.title",
    textKey: "epic.pipeline.steps.downlink.text",
  },
  {
    number: "03",
    titleKey: "epic.pipeline.steps.processing.title",
    textKey: "epic.pipeline.steps.processing.text",
  },
  {
    number: "04",
    titleKey: "epic.pipeline.steps.publication.title",
    textKey: "epic.pipeline.steps.publication.text",
  },
];

export default function EpicPipeline() {
  const { t } = useTranslation();

  return (
    <section
      id="pipeline"
      className="epic-pipeline-section"
      aria-labelledby="epic-pipeline-title"
    >
      <EpicSectionHead
        titleId="epic-pipeline-title"
        title={t("epic.pipeline.title")}
        sub={t("epic.pipeline.description")}
      />

      <ol className="epic-pipeline">
        {PIPELINE_STEPS.map((step) => (
          <li
            className="epic-pipeline__step"
            key={step.number}
          >
            <span
              className="epic-pipeline__number"
              aria-hidden="true"
            >
              {step.number}
            </span>

            <h3 className="epic-pipeline__title">
              {t(step.titleKey)}
            </h3>

            <p className="epic-pipeline__description">
              {t(step.textKey)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}