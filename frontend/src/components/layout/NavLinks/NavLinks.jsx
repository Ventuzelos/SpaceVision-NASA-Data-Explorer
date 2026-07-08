import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import { getFavorites } from "../../../services/favoritesService";

import "./NavLinks.css";

function NavLinks() {
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    function updateFavoritesCount() {
      setFavoritesCount(getFavorites().length);
    }

    updateFavoritesCount();

    window.addEventListener("favoritesUpdated", updateFavoritesCount);

    return () => {
      window.removeEventListener("favoritesUpdated", updateFavoritesCount);
    };
  }, []);

  return (
    <div className="nav-links">
      <NavLink to="/">Home</NavLink>

      <NavLink to="/apod">APOD</NavLink>

      <NavLink to="/donki">DONKI</NavLink>

      <NavLink to="/epic">Earth</NavLink>

      <NavLink to="/gallery">Gallery</NavLink>

      <NavLink to="/about">Sobre nós</NavLink>
        <NavLink to="/neowatch">Discover</NavLink>

      <NavLink to="/favorites" className="favorites-link">
        Favorites

        {favoritesCount > 0 && (
          <span className="favorites-badge">
            {favoritesCount}
          </span>
        )}
      </NavLink>
    </div>
  );
}

export default NavLinks;