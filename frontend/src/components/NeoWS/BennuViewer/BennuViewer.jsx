import {
  useEffect,
  useRef,
  useState,
} from "react";

import Icon from "../../common/Icon/Icon";

import { createBennuScene } from "./bennuScene";

import "./BennuViewer.css";

const DEFAULT_SPEED = 0.6;
const MIN_SPEED = 0;
const MAX_SPEED = 20;
const SPEED_STEP = 0.1;

function BennuViewer() {
  const mountRef = useRef(null);
  const sceneApiRef = useRef(null);
  const lastDisplayedDayRef = useRef(-1);

  const [playing, setPlaying] =
    useState(true);

  const [speed, setSpeed] =
    useState(DEFAULT_SPEED);

  const [showOrbits, setShowOrbits] =
    useState(true);

  const [showAxis, setShowAxis] =
    useState(true);

  const [followBennu, setFollowBennu] =
    useState(true);

  const [elapsedDays, setElapsedDays] =
    useState(0);

  const [sceneError, setSceneError] =
    useState("");

  useEffect(() => {
    const container =
      mountRef.current;

    if (!container) {
      setSceneError(
        "Não foi possível iniciar a visualização 3D."
      );

      return undefined;
    }

    let sceneApi = null;
    let unsubscribe = null;

    try {
      sceneApi = createBennuScene(
        container,
        {
          initialSpeed:
            DEFAULT_SPEED,
        }
      );

      if (!sceneApi) {
        throw new Error(
          "A cena 3D não foi criada."
        );
      }

      sceneApiRef.current =
        sceneApi;

      sceneApi.setPlaying?.(
        playing
      );

      sceneApi.setSpeed?.(
        speed
      );

      sceneApi.setShowOrbits?.(
        showOrbits
      );

      sceneApi.setShowAxis?.(
        showAxis
      );

      sceneApi.setFollow?.(
        followBennu
      );

      if (
        typeof sceneApi.onUpdate ===
        "function"
      ) {
        unsubscribe =
          sceneApi.onUpdate(
            (state) => {
              const simulationDays =
                Number(
                  state?.simDays
                );

              if (
                !Number.isFinite(
                  simulationDays
                )
              ) {
                return;
              }

              const displayedDay =
                Math.floor(
                  simulationDays * 10
                );

              if (
                displayedDay ===
                lastDisplayedDayRef.current
              ) {
                return;
              }

              lastDisplayedDayRef.current =
                displayedDay;

              setElapsedDays(
                simulationDays
              );
            }
          );
      }
    } catch (error) {
      console.error(
        "Erro ao iniciar a visualização de Bennu:",
        error
      );

      setSceneError(
        "Não foi possível carregar a visualização 3D de Bennu."
      );
    }

    return () => {
      if (
        typeof unsubscribe ===
        "function"
      ) {
        unsubscribe();
      }

      sceneApi?.dispose?.();

      sceneApiRef.current =
        null;

      if (container) {
        container.replaceChildren();
      }
    };
    // A cena deve ser criada apenas uma vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sceneApiRef.current
      ?.setPlaying?.(playing);
  }, [playing]);

  useEffect(() => {
    sceneApiRef.current
      ?.setSpeed?.(speed);
  }, [speed]);

  useEffect(() => {
    sceneApiRef.current
      ?.setShowOrbits?.(
        showOrbits
      );
  }, [showOrbits]);

  useEffect(() => {
    sceneApiRef.current
      ?.setShowAxis?.(
        showAxis
      );
  }, [showAxis]);

  useEffect(() => {
    sceneApiRef.current
      ?.setFollow?.(
        followBennu
      );
  }, [followBennu]);

  function handleSpeedChange(
    event
  ) {
    const nextSpeed =
      Number(
        event.target.value
      );

    if (
      !Number.isFinite(
        nextSpeed
      )
    ) {
      return;
    }

    setSpeed(nextSpeed);
  }

  function handleTogglePlaying() {
    setPlaying(
      (currentPlaying) =>
        !currentPlaying
    );
  }

  if (sceneError) {
    return (
      <div
        className="bennu-viewer bennu-viewer--error"
        role="alert"
      >
        <div className="bennu-viewer__error">
          <Icon
            name="AlertCircle"
            size={24}
            aria-hidden="true"
          />

          <div>
            <strong>
              Visualização indisponível
            </strong>

            <p>{sceneError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      className="bennu-viewer"
      aria-label="Visualização orbital 3D do asteroide Bennu"
    >
      <div
        className="bennu-viewer__canvas"
        ref={mountRef}
        role="img"
        aria-label="Simulação tridimensional do Sol, da Terra e da órbita do asteroide Bennu"
      />

      <div className="bennu-viewer__badge">
        <span>
          101955 Bennu
        </span>

        <small>
          Escala não proporcional
        </small>
      </div>

      <div
        className="bennu-viewer__hint"
        aria-hidden="true"
      >
        Arrasta para orbitar · usa o scroll para ampliar
      </div>

      <div
        className="bennu-viewer__telemetry"
        aria-live="off"
      >
        T+{" "}
        {elapsedDays.toFixed(1)}{" "}
        dias simulados
      </div>

      <div
        className="bennu-viewer__controls"
        aria-label="Controlos da simulação"
      >
        <button
          type="button"
          className="bennu-viewer__play"
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

        <div className="bennu-viewer__speed">
          <label htmlFor="bennu-speed">
            Velocidade —{" "}
            {speed.toFixed(1)}{" "}
            dias por segundo
          </label>

          <input
            id="bennu-speed"
            type="range"
            min={MIN_SPEED}
            max={MAX_SPEED}
            step={SPEED_STEP}
            value={speed}
            onChange={
              handleSpeedChange
            }
            aria-valuemin={
              MIN_SPEED
            }
            aria-valuemax={
              MAX_SPEED
            }
            aria-valuenow={
              speed
            }
            aria-valuetext={`${speed.toFixed(
              1
            )} dias por segundo`}
          />
        </div>

        <div
          className="bennu-viewer__toggles"
          aria-label="Elementos visíveis"
        >
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

          <label
            className={
              showAxis
                ? "is-active"
                : ""
            }
          >
            <input
              type="checkbox"
              checked={
                showAxis
              }
              onChange={(
                event
              ) =>
                setShowAxis(
                  event.target
                    .checked
                )
              }
            />

            Eixo
          </label>

          <label
            className={
              followBennu
                ? "is-active"
                : ""
            }
          >
            <input
              type="checkbox"
              checked={
                followBennu
              }
              onChange={(
                event
              ) =>
                setFollowBennu(
                  event.target
                    .checked
                )
              }
            />

            Seguir Bennu
          </label>
        </div>
      </div>
    </section>
  );
}

export default BennuViewer;