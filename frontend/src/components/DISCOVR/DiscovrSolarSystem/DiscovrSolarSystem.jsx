import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

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
    typeof window.requestAnimationFrame ===
      "function"
  );
}

function getPlanetTranslationKey(
  planetId
) {
  return `discovr.solarSystemSimulation.planets.${planetId}`;
}

function DiscovrSolarSystem() {
  const { t, i18n } =
    useTranslation();

  const mountRef = useRef(null);
  const sceneApiRef = useRef(null);
  const updateFrameRef =
    useRef(null);

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

  const [
    hasSceneError,
    setHasSceneError,
  ] = useState(false);

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
      return undefined;
    }

    let sceneApi = null;
    let observer = null;
    let unsubscribe = null;
    let initializationTimeoutId =
      null;

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

          sceneApi.setPlaying(true);

          sceneApi.setSpeed(
            INITIAL_SPEED
          );

          sceneApi.setShowOrbits(
            true
          );

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
            setHasSceneError(
              true
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

      sceneApiRef.current =
        null;
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

  const focusedPlanetName =
    focusedPlanet
      ? t(
          getPlanetTranslationKey(
            focusedPlanet.id
          ),
          {
            defaultValue:
              focusedPlanet.name,
          }
        )
      : t(
          "discovr.solarSystemSimulation.systemName"
        );

  const elapsedYears =
    Number.isFinite(elapsedDays)
      ? elapsedDays / 365.25
      : 0;

  const formattedElapsedYears =
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(elapsedYears);

  const formattedSpeed =
    new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(speed);

  function handleSpeedChange(
    event
  ) {
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
        Math.max(
          nextSpeed,
          0
        ),
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
        {t(
          "discovr.solarSystemSimulation.title"
        )}
      </h2>

      <p className="discovr-section__subtitle">
        {t(
          "discovr.solarSystemSimulation.description"
        )}
      </p>

      <div className="discovr-solar-system">
        <div className="discovr-solar-system__stage">
          <div
            ref={mountRef}
            className="discovr-solar-system__canvas"
            role="img"
            aria-label={t(
              "discovr.solarSystemSimulation.canvasAria"
            )}
          />

          {hasSceneError && (
            <div
              className="discovr-solar-system__error"
              role="alert"
            >
              <strong>
                {t(
                  "discovr.solarSystemSimulation.error.title"
                )}
              </strong>

              <p>
                {t(
                  "discovr.solarSystemSimulation.error.description"
                )}
              </p>
            </div>
          )}

          {!hasSceneError && (
            <>
              <div className="discovr-solar-system__badge">
                <span>
                  {
                    focusedPlanetName
                  }
                </span>

                <small>
                  {t(
                    "discovr.solarSystemSimulation.notToScale"
                  )}
                </small>
              </div>

              <div className="discovr-solar-system__hint">
                {t(
                  "discovr.solarSystemSimulation.navigationHint"
                )}
              </div>

              <div
                className="discovr-solar-system__telemetry"
                aria-live="off"
              >
                {t(
                  "discovr.solarSystemSimulation.elapsedTime",
                  {
                    years:
                      formattedElapsedYears,
                  }
                )}
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
                      ? t(
                          "discovr.solarSystemSimulation.pause"
                        )
                      : t(
                          "discovr.solarSystemSimulation.resume"
                        )
                  }
                  title={
                    playing
                      ? t(
                          "discovr.solarSystemSimulation.pause"
                        )
                      : t(
                          "discovr.solarSystemSimulation.resume"
                        )
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
                    {t(
                      "discovr.solarSystemSimulation.speedLabel",
                      {
                        speed:
                          formattedSpeed,
                      }
                    )}
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
                    aria-valuetext={t(
                      "discovr.solarSystemSimulation.speedValue",
                      {
                        speed:
                          formattedSpeed,
                      }
                    )}
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

                  {t(
                    "discovr.solarSystemSimulation.orbits"
                  )}
                </label>
              </div>
            </>
          )}
        </div>

        {!hasSceneError && (
          <div
            className="discovr-solar-system__focus"
            role="group"
            aria-label={t(
              "discovr.solarSystemSimulation.focusAria"
            )}
          >
            <button
              type="button"
              className={
                !focusId
                  ? "is-active"
                  : ""
              }
              onClick={() =>
                handleFocusPlanet(
                  null
                )
              }
              aria-pressed={
                !focusId
              }
            >
              {t(
                "discovr.solarSystemSimulation.overview"
              )}
            </button>

            {PLANETS.map(
              (planet) => {
                const planetName =
                  t(
                    getPlanetTranslationKey(
                      planet.id
                    ),
                    {
                      defaultValue:
                        planet.name,
                    }
                  );

                return (
                  <button
                    key={
                      planet.id
                    }
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
                    aria-label={t(
                      "discovr.solarSystemSimulation.focusPlanetAria",
                      {
                        planet:
                          planetName,
                      }
                    )}
                  >
                    {
                      planetName
                    }
                  </button>
                );
              }
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default DiscovrSolarSystem;