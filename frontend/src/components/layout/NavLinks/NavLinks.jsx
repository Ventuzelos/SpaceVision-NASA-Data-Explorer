import { NavLink } from "react-router-dom";
import "./NavLinks.css";

function NavLinks() {
  return (

    <div className="nav-links">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/apod">APOD</NavLink>
      <NavLink to="/mars-rover">Mars</NavLink>
      <NavLink to="/epic">Earth</NavLink>
      <NavLink to="/gallery">Gallery</NavLink>
      <NavLink to="/favorites">Favorites</NavLink>
    </div>
  );
}

export default NavLinks;