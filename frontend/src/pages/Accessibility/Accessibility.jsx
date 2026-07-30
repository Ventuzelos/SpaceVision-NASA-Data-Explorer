import {
  useTranslation,
} from "react-i18next";

import Container from "../../components/common/Container/Container";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import "./Accessibility.css";

function Accessibility() {
  const { t } =
    useTranslation();

  const accessibilityMeasures = t(
    "accessibility.measures.items",
    {
      returnObjects: true,
    }
  );

  const knownLimitations = t(
    "accessibility.limitations.items",
    {
      returnObjects: true,
    }
  );

  const feedbackDetails = t(
    "accessibility.feedback.items",
    {
      returnObjects: true,
    }
  );

  return (
    <>
      <PageMeta
        title={t(
          "accessibility.meta.title"
        )}
        description={t(
          "accessibility.meta.description"
        )}
      />

      <main className="accessibility-page">
        <Container>
          <Breadcrumb
            title={t(
              "accessibility.breadcrumb"
            )}
          />

          <header className="accessibility-page__header">
            <span className="accessibility-page__eyebrow">
              {t(
                "accessibility.hero.eyebrow"
              )}
            </span>

            <h1>
              {t(
                "accessibility.hero.title"
              )}
            </h1>

            <p>
              {t(
                "accessibility.hero.description"
              )}
            </p>
          </header>

          <section aria-labelledby="commitment-title">
            <h2 id="commitment-title">
              {t(
                "accessibility.commitment.title"
              )}
            </h2>

            <p>
              {t(
                "accessibility.commitment.description"
              )}
            </p>
          </section>

          <section aria-labelledby="measures-title">
            <h2 id="measures-title">
              {t(
                "accessibility.measures.title"
              )}
            </h2>

            <ul>
              {Array.isArray(
                accessibilityMeasures
              ) &&
                accessibilityMeasures.map(
                  (item) => (
                    <li key={item}>
                      {item}
                    </li>
                  )
                )}
            </ul>
          </section>

          <section aria-labelledby="compatibility-title">
            <h2 id="compatibility-title">
              {t(
                "accessibility.compatibility.title"
              )}
            </h2>

            <p>
              {t(
                "accessibility.compatibility.browsers"
              )}
            </p>

            <p>
              {t(
                "accessibility.compatibility.assistiveTechnologies"
              )}
            </p>
          </section>

          <section aria-labelledby="limitations-title">
            <h2 id="limitations-title">
              {t(
                "accessibility.limitations.title"
              )}
            </h2>

            <p>
              {t(
                "accessibility.limitations.introduction"
              )}
            </p>

            <ul>
              {Array.isArray(
                knownLimitations
              ) &&
                knownLimitations.map(
                  (item) => (
                    <li key={item}>
                      {item}
                    </li>
                  )
                )}
            </ul>

            <p>
              {t(
                "accessibility.limitations.conclusion"
              )}
            </p>
          </section>

          <section aria-labelledby="feedback-title">
            <h2 id="feedback-title">
              {t(
                "accessibility.feedback.title"
              )}
            </h2>

            <p>
              {t(
                "accessibility.feedback.description"
              )}
            </p>

            <p>
              {t(
                "accessibility.feedback.instructions"
              )}
            </p>

            <ul>
              {Array.isArray(
                feedbackDetails
              ) &&
                feedbackDetails.map(
                  (item) => (
                    <li key={item}>
                      {item}
                    </li>
                  )
                )}
            </ul>
          </section>

          <section aria-labelledby="assessment-title">
            <h2 id="assessment-title">
              {t(
                "accessibility.assessment.title"
              )}
            </h2>

            <p>
              {t(
                "accessibility.assessment.description"
              )}
            </p>
          </section>

          <section aria-labelledby="update-title">
            <h2 id="update-title">
              {t(
                "accessibility.update.title"
              )}
            </h2>

            <p>
              {t(
                "accessibility.update.description"
              )}
            </p>
          </section>
        </Container>
      </main>
    </>
  );
}

export default Accessibility;