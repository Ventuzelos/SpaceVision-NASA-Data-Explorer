import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  FAVORITES_UPDATED_EVENT,
  getFavorites,
} from "../../../services/favoritesService";

import "./NavLinks.css";

function NavLinks() {
  const [favoritesCount, setFavoritesCount] = useState(0);

  const updateFavoritesCount = useCallback(async () => {
    try {
      const favorites = await getFavorites();
      setFavoritesCount(favorites.length);
    } catch (error) {
      console.error(
        "Não foi possível atualizar o número de favoritos:",
        error
      );

      setFavoritesCount(0);
    }
  }, []);

  useEffect(() => {
    updateFavoritesCount();

    window.addEventListener(
      FAVORITES_UPDATED_EVENT,
      updateFavoritesCount
    );

    return () => {
      window.removeEventListener(
        FAVORITES_UPDATED_EVENT,
        updateFavoritesCount
      );
    };
  }, [updateFavoritesCount]);

  return (
    <div className="nav-links">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/apod">APOD</NavLink>
      <NavLink to="/donki">DONKI</NavLink>
      <NavLink to="/epic">Earth</NavLink>
      <NavLink to="/neowatch">NeoWatch</NavLink>
      <NavLink to="/gallery">Discover</NavLink>
      <NavLink to="/about">Sobre nós</NavLink>
      <NavLink to="/faq">FAQ</NavLink>
    </div>
  );
}

export default NavLinks;