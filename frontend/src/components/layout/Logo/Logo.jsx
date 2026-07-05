import { Link } from "react-router-dom";
import logo from "../../../assets/logos/logo-horizontal.svg";

import "./Logo.css";

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Space Vision - Home">
      <Link to="/" className="logo" aria-label="Space Vision - Home">
      <img src={logo} alt="SpaceVision" className="logo__image" />
    </Link>
      {/* <div className="logo__icon">
        <img src={logo} alt="SpaceVision Logo" />
      </div>

      <div className="logo__text">
        <span className="logo__name">SPACEVISION</span>
        <span className="logo__subtitle">NASA DATA EXPLORER</span>
      </div> */}
    </Link>
  );
}

export default Logo;