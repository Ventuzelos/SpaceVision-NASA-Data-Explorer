const VIDEO_SRC = 'https://svs.gsfc.nasa.gov/vis/a000000/a005500/a005570/Earth_wAtmos_spin_02_1080p60.mp4';
const POSTER = 'https://svs.gsfc.nasa.gov/vis/a000000/a005500/a005570/Earth_wAtmos_spin_02.01000.preview.jpg';

// Loop de vídeo do hero: "Spinning Earth with clouds, atmosphere, and
// night lights" (NASA SVS #5570), ficheiro mp4 direto.
export default function EpicHeroVideo() {
  return (
    <video
      className="hero-video-panel__video"
      src={VIDEO_SRC}
      poster={POSTER}
      autoPlay
      muted
      loop
      playsInline
    />
  );
}
