import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { NavLink, useLocation } from "react-router";

import { nasaApis } from "../../../data/nasaApis";

import "./NavLinks.css";

const liveApis = nasaApis.filter((api) => api.isLiveApi);
const exploreRoutes = liveApis.map((api) => api.link);

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
          <span>Dados da NASA</span>

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
            {liveApis.map(({ title, description, icon: Icon, link }) => (
              <NavLink
                key={link}
                to={link}
                onClick={handleNavigate}
                tabIndex={isExploreOpen ? 0 : -1}
              >
                <Icon
                  size={20}
                  aria-hidden="true"
                  className="nav-links__dropdown-item-icon"
                />

                <div className="nav-links__dropdown-text">
                  <span>{title}</span>
                  <small>{description}</small>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <NavLink
        to="/discover"
        onClick={handleNavigate}
      >
        Descobrir
      </NavLink>

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