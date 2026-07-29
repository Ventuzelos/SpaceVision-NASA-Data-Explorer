import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import Icon from "../../common/Icon/Icon";

import sceneImage from "../../../assets/sky_stars.jpg";

import "./DiscovrTimeline.css";

const MOBILE_BREAKPOINT = 900;
const DRAG_THRESHOLD = 5;
const DRAG_SPEED = 1.5;

const MISSION_TIMELINE = [
  {
    year: "1969",
    titleKey:
      "discovr.timeline.missions.apollo11.title",
    textKey:
      "discovr.timeline.missions.apollo11.text",
    position: "above",
  },
  {
    year: "1977",
    titleKey:
      "discovr.timeline.missions.voyager.title",
    textKey:
      "discovr.timeline.missions.voyager.text",
    position: "below",
  },
  {
    year: "1990",
    titleKey:
      "discovr.timeline.missions.hubble.title",
    textKey:
      "discovr.timeline.missions.hubble.text",
    position: "above",
  },
  {
    year: "1998",
    titleKey:
      "discovr.timeline.missions.iss.title",
    textKey:
      "discovr.timeline.missions.iss.text",
    position: "below",
  },
  {
    year: "2012",
    titleKey:
      "discovr.timeline.missions.curiosity.title",
    textKey:
      "discovr.timeline.missions.curiosity.text",
    position: "above",
  },
  {
    year: "2021",
    titleKey:
      "discovr.timeline.missions.jamesWebb.title",
    textKey:
      "discovr.timeline.missions.jamesWebb.text",
    position: "below",
  },
  {
    year: "2022",
    titleKey:
      "discovr.timeline.missions.artemis1.title",
    textKey:
      "discovr.timeline.missions.artemis1.text",
    position: "above",
  },
  {
    yearKey:
      "discovr.timeline.future",
    titleKey:
      "discovr.timeline.missions.artemisFuture.title",
    textKey:
      "discovr.timeline.missions.artemisFuture.text",
    position: "below",
    active: true,
  },
];

function getInitialMobileState() {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !==
      "function"
  ) {
    return false;
  }

  return window.matchMedia(
    `(max-width: ${MOBILE_BREAKPOINT}px)`
  ).matches;
}

function DiscovrTimeline() {
  const { t } = useTranslation();

  const [openIndex, setOpenIndex] =
    useState(null);

  const [
    hoveredIndex,
    setHoveredIndex,
  ] = useState(null);

  const [isMobile, setIsMobile] =
    useState(getInitialMobileState);

  const [isDragging, setIsDragging] =
    useState(false);

  const sceneRef = useRef(null);
  const pathRef = useRef(null);

  const dragStartXRef = useRef(0);
  const dragScrollLeftRef =
    useRef(0);

  const pointerIdRef = useRef(null);
  const mouseMovedRef =
    useRef(false);

  useEffect(() => {
    if (
      typeof window ===
        "undefined" ||
      typeof window.matchMedia !==
        "function"
    ) {
      return undefined;
    }

    const mediaQuery =
      window.matchMedia(
        `(max-width: ${MOBILE_BREAKPOINT}px)`
      );

    function handleMediaChange(
      event
    ) {
      setIsMobile(event.matches);

      if (event.matches) {
        setOpenIndex(null);
        setHoveredIndex(null);
        setIsDragging(false);
      }
    }

    mediaQuery.addEventListener(
      "change",
      handleMediaChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleMediaChange
      );
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (
        event.key === "Escape"
      ) {
        setOpenIndex(null);
        setHoveredIndex(null);
      }
    }

    function handlePointerDownOutside(
      event
    ) {
      const scene =
        sceneRef.current;

      if (
        scene &&
        !scene.contains(
          event.target
        )
      ) {
        setOpenIndex(null);
        setHoveredIndex(null);
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.addEventListener(
      "pointerdown",
      handlePointerDownOutside
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.removeEventListener(
        "pointerdown",
        handlePointerDownOutside
      );
    };
  }, []);

  function handlePointerDown(
    event
  ) {
    if (
      isMobile ||
      event.button !== 0 ||
      event.target.closest(
        "button"
      )
    ) {
      return;
    }

    const slider =
      pathRef.current;

    if (!slider) {
      return;
    }

    pointerIdRef.current =
      event.pointerId;

    dragStartXRef.current =
      event.clientX;

    dragScrollLeftRef.current =
      slider.scrollLeft;

    mouseMovedRef.current =
      false;

    slider.setPointerCapture?.(
      event.pointerId
    );

    setIsDragging(true);
  }

  function handlePointerMove(
    event
  ) {
    if (
      isMobile ||
      !isDragging ||
      pointerIdRef.current !==
        event.pointerId
    ) {
      return;
    }

    const slider =
      pathRef.current;

    if (!slider) {
      return;
    }

    const distance =
      event.clientX -
      dragStartXRef.current;

    if (
      Math.abs(distance) >
      DRAG_THRESHOLD
    ) {
      mouseMovedRef.current =
        true;
    }

    slider.scrollLeft =
      dragScrollLeftRef.current -
      distance * DRAG_SPEED;
  }

  function endDragging(event) {
    if (
      pointerIdRef.current !==
        null &&
      event?.pointerId !==
        undefined &&
      pointerIdRef.current !==
        event.pointerId
    ) {
      return;
    }

    const slider =
      pathRef.current;

    if (
      slider &&
      pointerIdRef.current !==
        null
    ) {
      try {
        slider.releasePointerCapture?.(
          pointerIdRef.current
        );
      } catch {
        // O ponteiro pode já ter sido libertado.
      }
    }

    pointerIdRef.current =
      null;

    setIsDragging(false);
  }

  function handleToggle(index) {
    if (isMobile) {
      return;
    }

    if (
      mouseMovedRef.current
    ) {
      mouseMovedRef.current =
        false;

      return;
    }

    setOpenIndex(
      (currentIndex) =>
        currentIndex === index
          ? null
          : index
    );
  }

  function handleYearMouseEnter(
    index
  ) {
    if (!isMobile) {
      setHoveredIndex(index);
    }
  }

  function handleYearMouseLeave() {
    if (!isMobile) {
      setHoveredIndex(null);
    }
  }

  const stepX =
    100 /
    (MISSION_TIMELINE.length -
      1);

  return (
    <section
      id="timeline"
      className="discovr-section"
      aria-labelledby="discovr-timeline-title"
    >
      <h2
        id="discovr-timeline-title"
        className="discovr-section__title"
      >
        {t(
          "discovr.timeline.title"
        )}
      </h2>

      <p className="discovr-section__subtitle">
        {isMobile
          ? t(
              "discovr.timeline.mobileDescription"
            )
          : t(
              "discovr.timeline.desktopDescription"
            )}
      </p>

      <div
        ref={sceneRef}
        className="discovr-timeline-scene"
      >
        <div
          className="discovr-timeline-scene__bg"
          style={{
            backgroundImage: `url(${sceneImage})`,
          }}
          aria-hidden="true"
        />

        <div
          className="discovr-timeline-scene__overlay"
          aria-hidden="true"
        />

        <div
          ref={pathRef}
          className={`discovr-timeline-scene__path${
            isDragging
              ? " grabbing"
              : ""
          }`}
          onPointerDown={
            handlePointerDown
          }
          onPointerMove={
            handlePointerMove
          }
          onPointerUp={
            endDragging
          }
          onPointerCancel={
            endDragging
          }
          onLostPointerCapture={
            endDragging
          }
          aria-label={t(
            "discovr.timeline.ariaLabel"
          )}
        >
          <div className="discovr-timeline-scene__track">
            <div
              className="discovr-timeline-scene__rail"
              aria-hidden="true"
            />

            {MISSION_TIMELINE.map(
              (
                mission,
                index
              ) => {
                const isOpen =
                  isMobile ||
                  openIndex ===
                    index;

                const isHovered =
                  !isMobile &&
                  hoveredIndex ===
                    index;

                const cardId =
                  `discovr-timeline-card-${index}`;

                const titleId =
                  `${cardId}-title`;

                const year =
                  mission.yearKey
                    ? t(
                        mission.yearKey
                      )
                    : mission.year;

                const title = t(
                  mission.titleKey
                );

                const text = t(
                  mission.textKey
                );

                let alignClass =
                  "discovr-timeline-scene__info--center";

                if (index === 0) {
                  alignClass =
                    "discovr-timeline-scene__info--start";
                }

                if (
                  index ===
                  MISSION_TIMELINE.length -
                    1
                ) {
                  alignClass =
                    "discovr-timeline-scene__info--end";
                }

                const markerStyle =
                  isMobile
                    ? undefined
                    : {
                        left: `${index * stepX}%`,
                      };

                return (
                  <div
                    key={`${mission.titleKey}-${index}`}
                    className="discovr-timeline-scene__marker"
                    style={
                      markerStyle
                    }
                  >
                    <button
                      type="button"
                      className={`discovr-timeline-scene__dot${
                        mission.active
                          ? " discovr-timeline-scene__dot--active"
                          : ""
                      }${
                        isOpen ||
                        isHovered
                          ? " discovr-timeline-scene__dot--open"
                          : ""
                      }`}
                      onClick={() =>
                        handleToggle(
                          index
                        )
                      }
                      disabled={
                        isMobile
                      }
                      aria-expanded={
                        isOpen
                      }
                      aria-controls={
                        cardId
                      }
                      aria-label={t(
                        "discovr.timeline.missionAria",
                        {
                          year,
                          title,
                        }
                      )}
                    />

                    <div
                      className={`discovr-timeline-scene__info discovr-timeline-scene__info--${mission.position} ${alignClass}`}
                    >
                      <button
                        type="button"
                        className="discovr-timeline-scene__year"
                        onClick={() =>
                          handleToggle(
                            index
                          )
                        }
                        onMouseEnter={() =>
                          handleYearMouseEnter(
                            index
                          )
                        }
                        onMouseLeave={
                          handleYearMouseLeave
                        }
                        disabled={
                          isMobile
                        }
                        aria-expanded={
                          isOpen
                        }
                        aria-controls={
                          cardId
                        }
                      >
                        {year}
                      </button>

                      {isOpen && (
                        <div
                          id={cardId}
                          className="discovr-timeline-scene__card"
                          role="region"
                          aria-labelledby={
                            titleId
                          }
                        >
                          {!isMobile && (
                            <button
                              type="button"
                              className="discovr-timeline-scene__card-close"
                              onClick={() =>
                                setOpenIndex(
                                  null
                                )
                              }
                              aria-label={t(
                                "discovr.timeline.closeAria",
                                {
                                  title,
                                }
                              )}
                            >
                              <Icon
                                name="X"
                                size={14}
                                aria-hidden="true"
                              />
                            </button>
                          )}

                          <h3
                            id={titleId}
                          >
                            {title}
                          </h3>

                          <p>
                            {text}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DiscovrTimeline;