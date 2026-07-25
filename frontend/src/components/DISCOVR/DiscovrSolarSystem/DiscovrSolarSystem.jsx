import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Icon from "../../common/Icon/Icon";
import {
  createSolarSystemScene,
  PLANETS,
} from "./solarSystemScene";

import "./DiscovrSolarSystem.css";

const INITIAL_SPEED = 12;
const MAX_SPEED = 200;

function supportsIntersectionObserver() {
  return (
    typeof window !== "undefined" &&
    "IntersectionObserver" in window
  );
}

function supportsAnimationFrame() {
  return (
    typeof window !== "undefined" &&
    typeof window.requestAnimationFrame === "function"
  );
}

function DiscovrSolarSystem() {
  const mountRef = useRef(null);
  const sceneApiRef = useRef(null);
  const updateFrameRef = useRef(null);

  const [playing, setPlaying] =
    useState(true);

  const [speed, setSpeed] =
    useState(INITIAL_SPEED);

  const [showOrbits, setShowOrbits] =
    useState(true);

  const [focusId, setFocusId] =
    useState(null);

  const [elapsedDays, setElapsedDays] =
    useState(0);

  const [sceneError, setSceneError] =
    useState("");

  useEffect(() => {
    const container = mountRef.current;

    if (!container) {
      return undefined;
    }

    let sceneApi = null;
    let observer = null;
    let unsubscribe = null;
    let initializationTimeoutId = null;
    let disposed = false;

    initializationTimeoutId =
      window.setTimeout(() => {
        if (disposed) {
          return;
        }

        try {
          sceneApi =
            createSolarSystemScene(
              container,
              {
                initialSpeed:
                  INITIAL_SPEED,
              }
            );

          sceneApiRef.current =
            sceneApi;

          /*
           * Estado inicial da simulação.
           * Estes valores correspondem aos valores
           * iniciais dos estados React.
           */
          sceneApi.setPlaying(true);
          sceneApi.setSpeed(
            INITIAL_SPEED
          );
          sceneApi.setShowOrbits(true);
          sceneApi.setFocus(null);

          unsubscribe =
            sceneApi.onUpdate(
              (state) => {
                if (
                  disposed ||
                  !Number.isFinite(
                    state?.simDays
                  )
                ) {
                  return;
                }

                if (
                  updateFrameRef.current !==
                  null
                ) {
                  return;
                }

                if (
                  supportsAnimationFrame()
                ) {
                  updateFrameRef.current =
                    window.requestAnimationFrame(
                      () => {
                        updateFrameRef.current =
                          null;

                        if (!disposed) {
                          setElapsedDays(
                            state.simDays
                          );
                        }
                      }
                    );

                  return;
                }

                setElapsedDays(
                  state.simDays
                );
              }
            );

          if (
            supportsIntersectionObserver()
          ) {
            observer =
              new window.IntersectionObserver(
                ([entry]) => {
                  sceneApi?.setActive(
                    Boolean(
                      entry?.isIntersecting
                    )
                  );
                },
                {
                  root: null,
                  rootMargin:
                    "150px 0px",
                  threshold: 0.05,
                }
              );

            observer.observe(
              container
            );
          } else {
            sceneApi.setActive(true);
          }
        } catch (error) {
          console.error(
            "Erro ao iniciar a simulação do sistema solar:",
            error
          );

          if (!disposed) {
            setSceneError(
              "Não foi possível iniciar a simulação 3D neste dispositivo."
            );
          }
        }
      }, 0);

    return () => {
      disposed = true;

      if (
        initializationTimeoutId !==
        null
      ) {
        window.clearTimeout(
          initializationTimeoutId
        );
      }

      if (
        updateFrameRef.current !==
        null &&
        supportsAnimationFrame()
      ) {
        window.cancelAnimationFrame(
          updateFrameRef.current
        );

        updateFrameRef.current =
          null;
      }

      observer?.disconnect();
      unsubscribe?.();
      sceneApi?.dispose();

      sceneApiRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneApiRef.current?.setPlaying(
      playing
    );
  }, [playing]);

  useEffect(() => {
    sceneApiRef.current?.setSpeed(
      speed
    );
  }, [speed]);

  useEffect(() => {
    sceneApiRef.current?.setShowOrbits(
      showOrbits
    );
  }, [showOrbits]);

  useEffect(() => {
    sceneApiRef.current?.setFocus(
      focusId
    );
  }, [focusId]);

  const focusedPlanet = useMemo(
    () =>
      PLANETS.find(
        (planet) =>
          planet.id === focusId
      ) || null,
    [focusId]
  );

  const elapsedYears =
    Number.isFinite(elapsedDays)
      ? elapsedDays / 365.25
      : 0;

  function handleSpeedChange(event) {
    const nextSpeed = Number(
      event.target.value
    );

    if (
      !Number.isFinite(nextSpeed)
    ) {
      return;
    }

    setSpeed(
      Math.min(
        Math.max(nextSpeed, 0),
        MAX_SPEED
      )
    );
  }

  function handleTogglePlaying() {
    setPlaying(
      (currentPlaying) =>
        !currentPlaying
    );
  }

  function handleFocusPlanet(
    planetId
  ) {
    setFocusId(planetId);
  }

  return (
    <section
      id="sistema-solar"
      className="discovr-section"
      aria-labelledby="discovr-solar-system-title"
    >
      <h2
        id="discovr-solar-system-title"
        className="discovr-section__title"
      >
        <Icon
          name="Orbit"
          size={22}
          aria-hidden="true"
        />

        Sistema solar
      </h2>

      <p className="discovr-section__subtitle">
        Uma simulação orbital do Sol e dos oito planetas, com as suas distâncias e períodos reais. A escala visual foi comprimida para permitir que todos caibam no mesmo enquadramento.
      </p>

      <div className="discovr-solar-system">
        <div className="discovr-solar-system__stage">
          <div
            ref={mountRef}
            className="discovr-solar-system__canvas"
            role="img"
            aria-label="Simulação tridimensional interativa do sistema solar"
          />

          {sceneError && (
            <div
              className="discovr-solar-system__error"
              role="alert"
            >
              <strong>
                Simulação indisponível
              </strong>

              <p>{sceneError}</p>
            </div>
          )}

          {!sceneError && (
            <>
              <div className="discovr-solar-system__badge">
                <span>
                  {focusedPlanet
                    ? focusedPlanet.name
                    : "Sistema solar"}
                </span>

                <small>
                  escala não proporcional
                </small>
              </div>

              <div className="discovr-solar-system__hint">
                Arrasta para orbitar · utiliza a roda do rato para aproximar
              </div>

              <div
                className="discovr-solar-system__telemetry"
                aria-live="off"
              >
                T+{" "}
                {elapsedYears.toFixed(2)}{" "}
                anos simulados
              </div>

              <div className="discovr-solar-system__controls">
                <button
                  type="button"
                  className="discovr-solar-system__play"
                  onClick={
                    handleTogglePlaying
                  }
                  aria-label={
                    playing
                      ? "Pausar simulação"
                      : "Retomar simulação"
                  }
                  aria-pressed={
                    !playing
                  }
                >
                  <Icon
                    name={
                      playing
                        ? "Pause"
                        : "Play"
                    }
                    size={16}
                    aria-hidden="true"
                  />
                </button>

                <div className="discovr-solar-system__speed">
                  <label htmlFor="solar-system-speed">
                    Velocidade —{" "}
                    {speed.toFixed(0)}{" "}
                    dias por segundo
                  </label>

                  <input
                    id="solar-system-speed"
                    type="range"
                    min="0"
                    max={MAX_SPEED}
                    step="1"
                    value={speed}
                    onChange={
                      handleSpeedChange
                    }
                    aria-valuetext={`${speed.toFixed(
                      0
                    )} dias por segundo`}
                  />
                </div>

                <label
                  className={
                    showOrbits
                      ? "is-active"
                      : ""
                  }
                >
                  <input
                    type="checkbox"
                    checked={
                      showOrbits
                    }
                    onChange={(
                      event
                    ) =>
                      setShowOrbits(
                        event.target
                          .checked
                      )
                    }
                  />

                  Órbitas
                </label>
              </div>
            </>
          )}
        </div>

        {!sceneError && (
          <div
            className="discovr-solar-system__focus"
            role="group"
            aria-label="Selecionar o foco da simulação"
          >
            <button
              type="button"
              className={
                !focusId
                  ? "is-active"
                  : ""
              }
              onClick={() =>
                handleFocusPlanet(null)
              }
              aria-pressed={!focusId}
            >
              Visão geral
            </button>

            {PLANETS.map(
              (planet) => (
                <button
                  key={planet.id}
                  type="button"
                  className={
                    focusId ===
                    planet.id
                      ? "is-active"
                      : ""
                  }
                  onClick={() =>
                    handleFocusPlanet(
                      planet.id
                    )
                  }
                  aria-pressed={
                    focusId ===
                    planet.id
                  }
                >
                  {planet.name}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default DiscovrSolarSystem;