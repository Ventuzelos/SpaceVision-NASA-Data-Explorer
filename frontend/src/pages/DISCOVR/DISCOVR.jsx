import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import Container from "../../components/common/Container/Container";
import DiscovrHero from "../../components/DISCOVR/DiscovrHero/DiscovrHero";
import DiscovrGallery from "../../components/DISCOVR/DiscovrGallery/DiscovrGallery";
import DiscovrApodHistory from "../../components/DISCOVR/DiscovrApodHistory/DiscovrApodHistory";
import DiscovrTimeline from "../../components/DISCOVR/DiscovrTimeline/DiscovrTimeline";
import DiscovrAsteroidRadar from "../../components/DISCOVR/DiscovrAsteroidRadar/DiscovrAsteroidRadar";
import DiscovrMissionStatus from "../../components/DISCOVR/DiscovrMissionStatus/DiscovrMissionStatus";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import "./DISCOVR.css";

const DiscovrSolarSystem = lazy(() =>
  import(
    "../../components/DISCOVR/DiscovrSolarSystem/DiscovrSolarSystem"
  )
);

function supportsIntersectionObserver() {
  return (
    typeof window !== "undefined" &&
    "IntersectionObserver" in window
  );
}

function DISCOVR() {
  const { t } = useTranslation();

  const solarSystemTriggerRef =
    useRef(null);

  const [
    shouldLoadSolarSystem,
    setShouldLoadSolarSystem,
  ] = useState(
    () =>
      !supportsIntersectionObserver()
  );

  useEffect(() => {
    const trigger =
      solarSystemTriggerRef.current;

    if (
      !trigger ||
      shouldLoadSolarSystem ||
      !supportsIntersectionObserver()
    ) {
      return undefined;
    }

    const observer =
      new window.IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) {
            return;
          }

          setShouldLoadSolarSystem(
            true
          );

          observer.disconnect();
        },
        {
          root: null,
          rootMargin: "300px 0px",
          threshold: 0.01,
        }
      );

    observer.observe(trigger);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoadSolarSystem]);

  function handleLoadSolarSystem() {
    setShouldLoadSolarSystem(true);
  }

  return (
    <>
      <PageMeta
        title={t(
          "discovr.meta.title"
        )}
        description={t(
          "discovr.meta.description"
        )}
      />

      <main className="discovr-page">
        <DiscovrHero />

        <Container>
          <DiscovrGallery />

          <DiscovrApodHistory />

          <div
            ref={solarSystemTriggerRef}
            className="discovr-solar-system-wrapper"
          >
            {shouldLoadSolarSystem ? (
              <Suspense
                fallback={
                  <section
                    className="discovr-section discovr-solar-system-placeholder"
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                    aria-label={t(
                      "discovr.solarSystem.loadingAria"
                    )}
                  >
                    <h2 className="discovr-section__title">
                      {t(
                        "discovr.solarSystem.title"
                      )}
                    </h2>

                    <p>
                      {t(
                        "discovr.solarSystem.preparing"
                      )}
                    </p>
                  </section>
                }
              >
                <DiscovrSolarSystem />
              </Suspense>
            ) : (
              <section
                className="discovr-section discovr-solar-system-placeholder"
                aria-labelledby="discovr-solar-system-title"
              >
                <h2
                  id="discovr-solar-system-title"
                  className="discovr-section__title"
                >
                  {t(
                    "discovr.solarSystem.title"
                  )}
                </h2>

                <p>
                  {t(
                    "discovr.solarSystem.autoLoadDescription"
                  )}
                </p>

                <button
                  type="button"
                  className="discovr-solar-system-placeholder__button"
                  onClick={
                    handleLoadSolarSystem
                  }
                >
                  {t(
                    "discovr.solarSystem.loadButton"
                  )}
                </button>
              </section>
            )}
          </div>

          <DiscovrTimeline />

          <DiscovrAsteroidRadar />

          <DiscovrMissionStatus />
        </Container>
      </main>
    </>
  );
}

export default DISCOVR;