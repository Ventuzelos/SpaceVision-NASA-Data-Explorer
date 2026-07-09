import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Carousel.css";

function Carousel({ children }) {
  const trackRef = useRef(null);

  function scrollCarousel(direction) {
    if (!trackRef.current) return;

    const scrollAmount = 320;

    trackRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <div className="carousel">
      <button
        className="carousel__button carousel__button--left"
        type="button"
        aria-label="Ver imagens anteriores"
        onClick={() => scrollCarousel("left")}
      >
        <ChevronLeft size={20} />
      </button>

      <div className="carousel__track" ref={trackRef}>
        {children}
      </div>

      <button
        className="carousel__button carousel__button--right"
        type="button"
        aria-label="Ver mais imagens"
        onClick={() => scrollCarousel("right")}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export default Carousel;