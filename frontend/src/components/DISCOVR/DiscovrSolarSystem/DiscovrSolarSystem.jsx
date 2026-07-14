import { useEffect, useRef, useState } from "react";

import Icon from "../../common/Icon/Icon";
import { createSolarSystemScene, PLANETS } from "./solarSystemScene";

import "./DiscovrSolarSystem.css";

/**
 * Visualização orbital 3D e animada do sistema solar (Sol + 8 planetas),
 * inspirada no jsorrery (https://mgvez.github.io/jsorrery/). Câmara
 * controlável por arrasto/scroll, com controlos de reprodução, velocidade
 * e foco num planeta à escolha.
 */
function DiscovrSolarSystem() {
  const mountRef = useRef(null);
  const sceneApiRef = useRef(null);

  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(12);
  const [showOrbits, setShowOrbits] = useState(true);
  const [focusId, setFocusId] = useState(null);
  const [elapsedDays, setElapsedDays] = useState(0);

  useEffect(() => {
    const container = mountRef.current;
    const api = createSolarSystemScene(container, { initialSpeed: speed });
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
  useEffect(() => sceneApiRef.current?.setFocus(focusId), [focusId]);

  const focusedPlanet = PLANETS.find((planet) => planet.id === focusId);
  const elapsedYears = elapsedDays / 365.25;

  return (
    <section id="sistema-solar" className="discovr-section">
      <h2 className="discovr-section__title">
        <Icon name="Orbit" size={22} />
        Sistema solar
      </h2>

      <p className="discovr-section__subtitle">
        Uma simulação orbital do Sol e dos 8 planetas, com as suas
        distâncias e períodos reais (escala visual comprimida para
        caberem no mesmo enquadramento).
      </p>

      <div className="discovr-solar-system">
        <div className="discovr-solar-system__stage">
          <div className="discovr-solar-system__canvas" ref={mountRef} />

          <div className="discovr-solar-system__badge">
            <span>{focusedPlanet ? focusedPlanet.name : "Sistema solar"}</span>
            <small>escala não proporcional</small>
          </div>

          <div className="discovr-solar-system__hint">
            Arraste para orbitar · scroll para zoom
          </div>

          <div className="discovr-solar-system__telemetry">
            T+ {elapsedYears.toFixed(2)} anos simulados
          </div>

          <div className="discovr-solar-system__controls">
            <button
              type="button"
              className="discovr-solar-system__play"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pausar simulação" : "Retomar simulação"}
            >
              {playing ? "❚❚" : "►"}
            </button>

            <div className="discovr-solar-system__speed">
              <label htmlFor="solar-system-speed">
                Velocidade — {speed.toFixed(0)} d/s
              </label>
              <input
                id="solar-system-speed"
                type="range"
                min="0"
                max="200"
                step="1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
              />
            </div>

            <label className={showOrbits ? "is-active" : ""}>
              <input
                type="checkbox"
                checked={showOrbits}
                onChange={(e) => setShowOrbits(e.target.checked)}
              />
              Órbitas
            </label>
          </div>
        </div>

        <div
          className="discovr-solar-system__focus"
          role="group"
          aria-label="Focar num planeta"
        >
          <button
            type="button"
            className={!focusId ? "is-active" : ""}
            onClick={() => setFocusId(null)}
          >
            Visão geral
          </button>

          {PLANETS.map((planet) => (
            <button
              key={planet.id}
              type="button"
              className={focusId === planet.id ? "is-active" : ""}
              onClick={() => setFocusId(planet.id)}
            >
              {planet.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DiscovrSolarSystem;
