import { lazy, Suspense } from "react";

import Container from "../../components/common/Container/Container";
import DiscovrHero from "../../components/DISCOVR/DiscovrHero/DiscovrHero";
import DiscovrGallery from "../../components/DISCOVR/DiscovrGallery/DiscovrGallery";
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

          <Suspense
            fallback={
              <div
                className="discovr-solar-system-loading"
                role="status"
                aria-live="polite"
                aria-busy="true"
              >
                <div
                  className="discovr-solar-system-loading__spinner"
                  aria-hidden="true"
                />

                <p>A carregar simulação 3D...</p>
              </div>
            }
          >
            <DiscovrSolarSystem />
          </Suspense>

          <DiscovrTimeline />
          <DiscovrAsteroidRadar />
          <DiscovrMissionStatus />
        </Container>
      </main>
      </>
      );
}

      export default DISCOVR;
