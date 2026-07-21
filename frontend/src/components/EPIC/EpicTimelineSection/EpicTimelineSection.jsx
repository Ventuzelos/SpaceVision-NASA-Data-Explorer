import './EpicTimelineSection.css';
import EpicSectionHead from '../EpicSectionHead/EpicSectionHead';
import EpicTimeline from '../EpicTimeline/EpicTimeline';

export default function EpicTimelineSection() {
  return (
    <section id="timeline">
      <EpicSectionHead
        title="Mais de uma década a fotografar o nosso planeta"
        sub="Os marcos principais da missão DSCOVR e da câmara EPIC, desde o lançamento até à atualidade."
      />
      <div className="timeline-spacer" />
      <div className="timeline-card">
        <EpicTimeline />
      </div>
    </section>
  );
}
