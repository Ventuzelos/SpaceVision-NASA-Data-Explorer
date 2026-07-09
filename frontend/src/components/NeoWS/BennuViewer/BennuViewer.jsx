import { useEffect, useRef, useState } from "react";
import { createBennuScene } from "./bennuScene";
import "./BennuViewer.css";

/**
 * Visualização orbital 3D e animada do asteroide 101955 Bennu,
 * inspirada no "Eyes on Asteroids" da NASA/JPL. Mostra o Sol, a Terra
 * (referência de escala) e Bennu na sua órbita real, com rotação
 * própria retrógrada. Câmara controlável por arrasto/scroll.
 */
function BennuViewer() {
  const mountRef = useRef(null);
  const sceneApiRef = useRef(null);

  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(0.6);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showAxis, setShowAxis] = useState(true);
  const [followBennu, setFollowBennu] = useState(true);
  const [elapsedDays, setElapsedDays] = useState(0);

  useEffect(() => {
    const container = mountRef.current;
    const api = createBennuScene(container, { initialSpeed: speed });
    sceneApiRef.current = api;

    const unsubscribe = api.onUpdate((state) => {
      setElapsedDays(state.simDays);
    });

    return () => {
      unsubscribe();
      api.dispose();
      sceneApiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => sceneApiRef.current?.setPlaying(playing), [playing]);
  useEffect(() => sceneApiRef.current?.setSpeed(speed), [speed]);
  useEffect(() => sceneApiRef.current?.setShowOrbits(showOrbits), [showOrbits]);
  useEffect(() => sceneApiRef.current?.setShowAxis(showAxis), [showAxis]);
  useEffect(() => sceneApiRef.current?.setFollow(followBennu), [followBennu]);

  return (
    <div className="bennu-viewer">
      <div className="bennu-viewer__canvas" ref={mountRef} />

      <div className="bennu-viewer__badge">
        <span>101955 Bennu</span>
        <small>escala não proporcional</small>
      </div>

      <div className="bennu-viewer__hint">
        Arraste para orbitar · scroll para zoom
      </div>

      <div className="bennu-viewer__telemetry">
        T+ {elapsedDays.toFixed(1)} dias simulados
      </div>

      <div className="bennu-viewer__controls">
        <button
          type="button"
          className="bennu-viewer__play"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pausar simulação" : "Retomar simulação"}
        >
          {playing ? "❚❚" : "►"}
        </button>

        <div className="bennu-viewer__speed">
          <label htmlFor="bennu-speed">Velocidade — {speed.toFixed(1)} d/s</label>
          <input
            id="bennu-speed"
            type="range"
            min="0"
            max="20"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
        </div>

        <div className="bennu-viewer__toggles">
          <label className={showOrbits ? "is-active" : ""}>
            <input
              type="checkbox"
              checked={showOrbits}
              onChange={(e) => setShowOrbits(e.target.checked)}
            />
            Órbitas
          </label>
          <label className={showAxis ? "is-active" : ""}>
            <input
              type="checkbox"
              checked={showAxis}
              onChange={(e) => setShowAxis(e.target.checked)}
            />
            Eixo
          </label>
          <label className={followBennu ? "is-active" : ""}>
            <input
              type="checkbox"
              checked={followBennu}
              onChange={(e) => setFollowBennu(e.target.checked)}
            />
            Seguir
          </label>
        </div>
      </div>
    </div>
  );
}

export default BennuViewer;
