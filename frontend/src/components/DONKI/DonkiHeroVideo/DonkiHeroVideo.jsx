import "./DonkiHeroVideo.css";
import donkiSun from "../../../assets/videos/donki_sun.mp4";

export default function DonkiHeroVideo() {
  return (
    <video
      className="donki-hero-video"
      src={donkiSun}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
