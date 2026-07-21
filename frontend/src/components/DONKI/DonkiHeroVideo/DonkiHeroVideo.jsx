import "./DonkiHeroVideo.css";
import donkiSun from "../../../assets/videos/donki_sun.mp4";

export default function DonkiHeroVideo() {
  return (
    <video
      className="donki-hero-video"
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
        src={donkiSun}
        type="video/mp4"
      />
    </video>
  );
}
