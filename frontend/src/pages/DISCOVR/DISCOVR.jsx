import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

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

function DISCOVR() {
  const solarSystemTriggerRef = useRef(null);

  const [shouldLoadSolarSystem, setShouldLoadSolarSystem] =
    useState(false);

  useEffect(() => {
    const trigger = solarSystemTriggerRef.current;

    if (!trigger || shouldLoadSolarSystem) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadSolarSystem(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "300px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(trigger);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoadSolarSystem]);

  return (
    <>
      <PageMeta
        title="Descobrir o Espaço — SpaceVision"
        description="Explora conteúdos visuais, curiosidades e experiências interativas sobre o Universo com dados e recursos da NASA."
      />

      <main className="discovr-page">
        <DiscovrHero />

        <Container>
          <DiscovrGallery />

          <DiscovrApodHistory />

          <div ref={solarSystemTriggerRef}>
            {shouldLoadSolarSystem ? (
              <Suspense
                fallback={
                  <section
                    className="discovr-section discovr-solar-system-placeholder"
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                  >
                    <h2 className="discovr-section__title">
                      Sistema solar
                    </h2>

                    <p>A preparar a simulação 3D...</p>
                  </section>
                }
              >
                <DiscovrSolarSystem />
              </Suspense>
            ) : (
              <section
                className="discovr-section discovr-solar-system-placeholder"
                aria-label="Sistema solar interativo"
              >
                <h2 className="discovr-section__title">
                  Sistema solar
                </h2>

                <p>
                  A simulação 3D será carregada quando
                  estiveres perto desta secção.
                </p>
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