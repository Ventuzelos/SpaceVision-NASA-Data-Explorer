import './EpicHeroVideo.css';
import epicBlueMarble from '../../../assets/videos/epic_blue_marble.mp4';

export default function EpicHeroVideo() {
  return (
    <video
      className="hero-video-panel__video"
      src={epicBlueMarble}
      autoPlay
      muted
      loop
      playsInline
    />
  );
}
