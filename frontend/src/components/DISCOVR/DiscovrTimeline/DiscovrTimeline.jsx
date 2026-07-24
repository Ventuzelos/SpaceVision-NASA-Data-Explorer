import {
  useEffect,
  useRef,
  useState,
} from "react";

import Icon from "../../common/Icon/Icon";

import sceneImage from "../../../assets/hero1.webp";

import "./DiscovrTimeline.css";

const MOBILE_BREAKPOINT = 900;
const DRAG_THRESHOLD = 5;
const DRAG_SPEED = 1.5;

const MISSION_TIMELINE = [
  {
    year: "1969",
    title: "Apollo 11",
    text: "Armstrong e Aldrin tornam-se os primeiros humanos a pisar a Lua.",
    position: "above",
  },
  {
    year: "1977",
    title: "Voyager 1 e 2",
    text: "Lançamento das sondas gémeas rumo aos planetas exteriores.",
    position: "below",
  },
  {
    year: "1990",
    title: "Telescópio Hubble",
    text: "O telescópio espacial revoluciona a astronomia observacional.",
    position: "above",
  },
  {
    year: "1998",
    title: "Estação Espacial Internacional",
    text: "Início da construção do laboratório orbital internacional.",
    position: "below",
  },
  {
    year: "2012",
    title: "Curiosity em Marte",
    text: "O rover pousa em Marte para estudar a sua habitabilidade.",
    position: "above",
  },
  {
    year: "2021",
    title: "Telescópio James Webb",
    text: "Lançado para observar o Universo em infravermelho.",
    position: "below",
  },
  {
    year: "2022",
    title: "Artemis I",
    text: "Voo de teste não tripulado à volta da Lua.",
    position: "above",
  },
  {
    year: "Futuro",
    title: "Artemis II e III",
    text: "Missões tripuladas rumo a uma nova alunagem humana.",
    position: "below",
    active: true,
  },
];

function getInitialMobileState() {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }

  return window.matchMedia(
    `(max-width: ${MOBILE_BREAKPOINT}px)`
  ).matches;
}

function DiscovrTimeline() {
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
  const dragScrollLeftRef = useRef(0);
  const pointerIdRef = useRef(null);
  const mouseMovedRef = useRef(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT}px)`
    );

    function handleMediaChange(event) {
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
      if (event.key === "Escape") {
        setOpenIndex(null);
        setHoveredIndex(null);
      }
    }

    function handlePointerDownOutside(
      event
    ) {
      const scene = sceneRef.current;

      if (
        scene &&
        !scene.contains(event.target)
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

  function handlePointerDown(event) {
    if (
      isMobile ||
      event.button !== 0
    ) {
      return;
    }

    const slider = pathRef.current;

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

  function handlePointerMove(event) {
    if (
      isMobile ||
      !isDragging ||
      pointerIdRef.current !==
        event.pointerId
    ) {
      return;
    }

    const slider = pathRef.current;

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
      pointerIdRef.current !== null &&
      event?.pointerId !== undefined &&
      pointerIdRef.current !==
        event.pointerId
    ) {
      return;
    }

    const slider = pathRef.current;

    if (
      slider &&
      pointerIdRef.current !== null
    ) {
      try {
        slider.releasePointerCapture?.(
          pointerIdRef.current
        );
      } catch {
        // O ponteiro pode já ter sido libertado.
      }
    }

    pointerIdRef.current = null;
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
    (MISSION_TIMELINE.length - 1);

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
        <Icon
          name="Calendar"
          size={22}
          aria-hidden="true"
        />

        Linha do tempo interativa
      </h2>

      <p className="discovr-section__subtitle">
        {isMobile
          ? "Desliza para baixo para explorares as missões."
          : "Clica num ano da linha para veres a missão correspondente."}
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
          aria-label="Linha cronológica das principais missões espaciais"
        >
          <div className="discovr-timeline-scene__track">
            <div
              className="discovr-timeline-scene__rail"
              aria-hidden="true"
            />

            {MISSION_TIMELINE.map(
              (mission, index) => {
                const isOpen =
                  isMobile ||
                  openIndex === index;

                const isHovered =
                  !isMobile &&
                  hoveredIndex ===
                    index;

                const cardId =
                  `discovr-timeline-card-${index}`;

                const titleId =
                  `${cardId}-title`;

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
                    key={`${mission.year}-${mission.title}`}
                    className="discovr-timeline-scene__marker"
                    style={markerStyle}
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
                      disabled={isMobile}
                      aria-expanded={
                        isOpen
                      }
                      aria-controls={
                        cardId
                      }
                      aria-label={`${mission.year} — ${mission.title}`}
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
                        {mission.year}
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
                              aria-label={`Fechar detalhes de ${mission.title}`}
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
                            {
                              mission.title
                            }
                          </h3>

                          <p>
                            {
                              mission.text
                            }
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