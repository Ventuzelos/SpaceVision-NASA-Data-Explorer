import Container from "../../components/common/Container/Container";
import DiscovrHero from "../../components/DISCOVR/DiscovrHero/DiscovrHero";
import DiscovrGallery from "../../components/DISCOVR/DiscovrGallery/DiscovrGallery";
import DiscovrSolarSystem from "../../components/DISCOVR/DiscovrSolarSystem/DiscovrSolarSystem";
import DiscovrTimeline from "../../components/DISCOVR/DiscovrTimeline/DiscovrTimeline";
import DiscovrAsteroidRadar from "../../components/DISCOVR/DiscovrAsteroidRadar/DiscovrAsteroidRadar";
import DiscovrMissionStatus from "../../components/DISCOVR/DiscovrMissionStatus/DiscovrMissionStatus";

import "./DISCOVR.css";

function DISCOVR() {
  return (
    <main className="discovr-page">
      <DiscovrHero />
      

      <Container>
        <DiscovrGallery />
        <DiscovrSolarSystem />
        <DiscovrTimeline />
        <DiscovrAsteroidRadar />
        <DiscovrMissionStatus />
      </Container>
    </main>
  );
}

export default DISCOVR;
