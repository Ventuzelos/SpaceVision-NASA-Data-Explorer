import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import {
  Pause,
  Play,
} from "lucide-react";

import Icon from "../../common/Icon/Icon";

import { createBennuScene } from "./bennuScene";

import "./BennuViewer.css";

const DEFAULT_SPEED = 0.6;
const MIN_SPEED = 0;
const MAX_SPEED = 20;
const SPEED_STEP = 0.1;

function BennuViewer() {
  const { t, i18n } =
    useTranslation();

  const mountRef = useRef(null);
  const sceneApiRef = useRef(null);
  const lastDisplayedDayRef =
    useRef(-1);

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

  const locale =
    i18n.resolvedLanguage?.startsWith(
      "en"
    )
      ? "en-GB"
      : "pt-PT";

  useEffect(() => {
    const container =
      mountRef.current;

    if (!container) {
      setSceneError(
        t(
          "neows.bennuViewer.errors.initialization"
        )
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
          "The 3D scene was not created."
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
        "Error starting the Bennu visualisation:",
        error
      );

      setSceneError(
        t(
          "neows.bennuViewer.errors.load"
        )
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

  const formattedElapsedDays =
    new Intl.NumberFormat(
      locale,
      {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }
    ).format(elapsedDays);

  const formattedSpeed =
    new Intl.NumberFormat(
      locale,
      {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }
    ).format(speed);

  const simulationButtonLabel =
    playing
      ? t(
          "neows.bennuViewer.controls.pause"
        )
      : t(
          "neows.bennuViewer.controls.resume"
        );

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
              {t(
                "neows.bennuViewer.errors.title"
              )}
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
      aria-label={t(
        "neows.bennuViewer.sectionAria"
      )}
    >
      <div
        className="bennu-viewer__canvas"
        ref={mountRef}
        role="img"
        aria-label={t(
          "neows.bennuViewer.canvasAria"
        )}
      />

      <div className="bennu-viewer__badge">
        <span>
          101955 Bennu
        </span>

        <small>
          {t(
            "neows.bennuViewer.notToScale"
          )}
        </small>
      </div>

      <div
        className="bennu-viewer__hint"
        aria-hidden="true"
      >
        {t(
          "neows.bennuViewer.interactionHint"
        )}
      </div>

      <div
        className="bennu-viewer__telemetry"
        aria-live="off"
      >
        {t(
          "neows.bennuViewer.telemetry",
          {
            count:
              formattedElapsedDays,
          }
        )}
      </div>

      <div
        className="bennu-viewer__controls"
        aria-label={t(
          "neows.bennuViewer.controls.ariaLabel"
        )}
      >
        <button
          type="button"
          className="bennu-viewer__play"
          onClick={() =>
            setPlaying(
              (current) =>
                !current
            )
          }
          aria-label={
            simulationButtonLabel
          }
          title={
            simulationButtonLabel
          }
        >
          {playing ? (
            <Pause
              size={17}
              aria-hidden="true"
            />
          ) : (
            <Play
              size={17}
              aria-hidden="true"
            />
          )}
        </button>

        <div className="bennu-viewer__speed">
          <label htmlFor="bennu-speed">
            {t(
              "neows.bennuViewer.controls.speedLabel",
              {
                speed:
                  formattedSpeed,
              }
            )}
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
            aria-valuetext={t(
              "neows.bennuViewer.controls.speedValue",
              {
                speed:
                  formattedSpeed,
              }
            )}
          />
        </div>

        <div
          className="bennu-viewer__toggles"
          aria-label={t(
            "neows.bennuViewer.controls.visibleElements"
          )}
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

            {t(
              "neows.bennuViewer.controls.orbits"
            )}
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

            {t(
              "neows.bennuViewer.controls.axis"
            )}
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

            {t(
              "neows.bennuViewer.controls.followBennu"
            )}
          </label>
        </div>
      </div>
    </section>
  );
}

export default BennuViewer;