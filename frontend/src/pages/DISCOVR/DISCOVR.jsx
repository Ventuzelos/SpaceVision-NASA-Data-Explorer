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

function supportsIntersectionObserver() {
  return (
    typeof window !== "undefined" &&
    "IntersectionObserver" in window
  );
}

function DISCOVR() {
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
        title="Descobrir o Espaço"
        description="Explora conteúdos visuais, curiosidades e experiências interativas sobre o Universo com dados e recursos da NASA."
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
                    aria-label="A carregar sistema solar interativo"
                  >
                    <h2 className="discovr-section__title">
                      Sistema solar
                    </h2>

                    <p>
                      A preparar a simulação
                      3D...
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
                  Sistema solar
                </h2>

                <p>
                  A simulação 3D será
                  carregada automaticamente
                  quando estiveres perto desta
                  secção.
                </p>

                <button
                  type="button"
                  className="discovr-solar-system-placeholder__button"
                  onClick={
                    handleLoadSolarSystem
                  }
                >
                  Carregar simulação 3D
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