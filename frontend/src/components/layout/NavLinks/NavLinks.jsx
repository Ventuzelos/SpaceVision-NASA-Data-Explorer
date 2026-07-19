import { NavLink } from "react-router-dom";

import "./NavLinks.css";

function NavLinks() {
  return (
    <div className="nav-links">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/donki">DONKI</NavLink>
      <NavLink to="/epic">EPIC</NavLink>
      <NavLink to="/neowatch">NeoWatch</NavLink>
      <NavLink to="/discover">Discover</NavLink>
      <NavLink to="/quiz">Quiz</NavLink>
      <NavLink to="/about">Sobre nós</NavLink>
      <NavLink to="/faq">FAQ</NavLink>
    </div>
  );
}

export default NavLinks;