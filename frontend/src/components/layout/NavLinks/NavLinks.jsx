import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import "./NavLinks.css";

const exploreRoutes = [
  "/donki",
  "/epic",
  "/neowatch",
  "/discover",
];

function NavLinks({ onNavigate }) {
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const isExploreActive = exploreRoutes.includes(
    location.pathname
  );

  function closeExploreMenu() {
    setIsExploreOpen(false);
  }

  function handleNavigate() {
    closeExploreMenu();
    onNavigate?.();
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        closeExploreMenu();
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeExploreMenu();
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  return (
    <div className="nav-links">
      <NavLink
        to="/"
        end
        onClick={handleNavigate}
      >
        Início
      </NavLink>

      <div
        ref={dropdownRef}
        className={`nav-links__dropdown ${
          isExploreActive
            ? "nav-links__dropdown--active"
            : ""
        }`}
      >
        <button
          type="button"
          className="nav-links__dropdown-button"
          onClick={() => {
            setIsExploreOpen((currentValue) => {
              return !currentValue;
            });
          }}
          aria-expanded={isExploreOpen}
          aria-controls="explore-navigation"
        >
          <span>Explorar</span>

          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`nav-links__dropdown-icon ${
              isExploreOpen
                ? "nav-links__dropdown-icon--open"
                : ""
            }`}
          />
        </button>

        <div
          id="explore-navigation"
          className={`nav-links__dropdown-menu ${
            isExploreOpen
              ? "nav-links__dropdown-menu--open"
              : ""
          }`}
          aria-hidden={!isExploreOpen}
        >
          <div className="nav-links__dropdown-content">
            <NavLink
              to="/donki"
              onClick={handleNavigate}
              tabIndex={isExploreOpen ? 0 : -1}
            >
              <span>Meteorologia Espacial</span>
              <small>Eventos espaciais DONKI</small>
            </NavLink>

            <NavLink
              to="/epic"
              onClick={handleNavigate}
              tabIndex={isExploreOpen ? 0 : -1}
            >
              <span>Terra</span>
              <small>Imagens EPIC da NASA</small>
            </NavLink>

            <NavLink
              to="/neowatch"
              onClick={handleNavigate}
              tabIndex={isExploreOpen ? 0 : -1}
            >
              <span>Asteroides</span>
              <small>Objetos próximos da Terra</small>
            </NavLink>

            <NavLink
              to="/discover"
              onClick={handleNavigate}
              tabIndex={isExploreOpen ? 0 : -1}
            >
              <span>Descobrir</span>
              <small>Explora conteúdos espaciais</small>
            </NavLink>
          </div>
        </div>
      </div>

      <NavLink
        to="/quiz"
        onClick={handleNavigate}
      >
        Quiz
      </NavLink>

      <NavLink
        to="/about"
        onClick={handleNavigate}
      >
        Sobre
      </NavLink>

      <NavLink
        to="/faq"
        onClick={handleNavigate}
      >
        Perguntas Frequentes
      </NavLink>
    </div>
  );
}

export default NavLinks;