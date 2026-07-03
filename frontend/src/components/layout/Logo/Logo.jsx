import { Link } from "react-router-dom";
import "./Logo.css";

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Space Vision - Home">
      <div className="logo__icon">🪐</div>

      <div className="logo__text">
        <span className="logo__name">SPACEVISION</span>
        <span className="logo__subtitle">NASA DATA EXPLORER</span>
      </div>
    </Link>
  );
}

export default Logo;