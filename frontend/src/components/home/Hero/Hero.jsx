import { Link } from "react-router-dom";

import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        <p className="hero__subtitle">NASA Data Explorer</p>

        <h1 className="hero__title">
          Explore the Universe Through NASA's Open APIs
        </h1>

        <p className="hero__description">
          Discover astronomy pictures, Mars rover photos, Earth imagery and much
          more through a modern, interactive experience.
        </p>

        <div className="hero__actions">
          <Link to="/apod" className="btn btn--primary">
            Explore APOD
          </Link>

          <Link to="/mars-rover" className="btn btn--secondary">
            Mars Rover
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;