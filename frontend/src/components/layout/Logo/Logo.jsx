import { Link } from "react-router-dom";
import logo from "../../../assets/logos/logo-horizontal-planet.svg";

import "./Logo.css";

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Space Vision - Home">
      <img src={logo} alt="SpaceVision" className="logo__image" />
    </Link>
  );
}

export default Logo;