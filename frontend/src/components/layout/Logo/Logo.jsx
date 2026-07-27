import { Link } from "react-router";
import logo from "../../../assets/logos/logo-horizontal-planet -02.webp";

import "./Logo.css";

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Space Vision - Home">
      <img src={logo} alt="SpaceVision" className="logo__image" />
    </Link>
  );
}

export default Logo;