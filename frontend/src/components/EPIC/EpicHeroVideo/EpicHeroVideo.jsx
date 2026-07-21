import "./EpicHeroVideo.css";
import epicBlueMarble from "../../../assets/videos/epic_blue_marble.mp4";

export default function EpicHeroVideo() {
  return (
    <video
      className="epic-hero-video"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      tabIndex={-1}
    >
      <source
        src={epicBlueMarble}
        type="video/mp4"
      />
    </video>
  );
}