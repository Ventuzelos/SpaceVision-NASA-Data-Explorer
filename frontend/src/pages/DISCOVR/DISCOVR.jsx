import Container from "../../components/common/Container/Container";
import DiscovrHero from "../../components/DISCOVR/DiscovrHero/DiscovrHero";
import DiscovrSectionNav from "../../components/DISCOVR/DiscovrSectionNav/DiscovrSectionNav";
import DiscovrGallery from "../../components/DISCOVR/DiscovrGallery/DiscovrGallery";
import DiscovrTimeline from "../../components/DISCOVR/DiscovrTimeline/DiscovrTimeline";
import DiscovrAsteroidRadar from "../../components/DISCOVR/DiscovrAsteroidRadar/DiscovrAsteroidRadar";
import DiscovrMissionStatus from "../../components/DISCOVR/DiscovrMissionStatus/DiscovrMissionStatus";

import "./DISCOVR.css";

function DISCOVR() {
  return (
    <main className="discovr-page">
      <DiscovrHero />
      <DiscovrSectionNav />

      <Container>
        <DiscovrGallery />
        <DiscovrTimeline />
        <DiscovrAsteroidRadar />
        <DiscovrMissionStatus />
      </Container>
    </main>
  );
}

export default DISCOVR;
