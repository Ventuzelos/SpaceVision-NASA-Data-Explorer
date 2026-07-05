import { NavLink } from "react-router-dom";

import "./NavLinks.css";

function NavLinks() {
  return (
    <>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/apod">APOD</NavLink>
      <NavLink to="/mars-rover">Mars Rover</NavLink>
      <NavLink to="/epic">EPIC</NavLink>
      <NavLink to="/favorites">Favorites</NavLink>
    </>
  );
}

export default NavLinks;