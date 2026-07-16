import "./EpicHeroVideo.css";
import epicBlueMarble from "../../../assets/videos/epic_blue_marble.mp4";

export default function EpicHeroVideo() {
  return (
    <video
      className="epic-hero-video"
      src={epicBlueMarble}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}