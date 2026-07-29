import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { NavLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import { nasaApis } from "../../../data/nasaApis";

import "./NavLinks.css";

const liveApis = nasaApis.filter((api) => api.isLiveApi);
const exploreRoutes = liveApis.map((api) => api.link);

function NavLinks({ onNavigate }) {
  const { t } = useTranslation();

  const [isExploreOpen, setIsExploreOpen] =
    useState(false);

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
      "click",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "click",
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
        {t("navigation.home")}
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
            setIsExploreOpen(
              (currentValue) => !currentValue
            );
          }}
          aria-expanded={isExploreOpen}
          aria-controls="explore-navigation"
        >
          <span>
            {t("navigation.nasaData")}
          </span>

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
            {liveApis.map(
              ({
                titleKey,
                descriptionKey,
                icon: Icon,
                link,
              }) => (
                <NavLink
                  key={link}
                  to={link}
                  onClick={handleNavigate}
                  tabIndex={
                    isExploreOpen ? 0 : -1
                  }
                >
                  {Icon && (
                    <Icon
                      size={20}
                      aria-hidden="true"
                      className="nav-links__dropdown-item-icon"
                    />
                  )}

                  <div className="nav-links__dropdown-text">
                    <span>
                      {t(titleKey)}
                    </span>

                    <small>
                      {t(descriptionKey)}
                    </small>
                  </div>
                </NavLink>
              )
            )}
          </div>
        </div>
      </div>

      <NavLink
        to="/discover"
        onClick={handleNavigate}
      >
        {t("navigation.discover")}
      </NavLink>

      <NavLink
        to="/quiz"
        onClick={handleNavigate}
      >
        {t("navigation.quiz")}
      </NavLink>

      <NavLink
        to="/about"
        onClick={handleNavigate}
      >
        {t("navigation.about")}
      </NavLink>

      <NavLink
        to="/faq"
        onClick={handleNavigate}
      >
        {t("navigation.faq")}
      </NavLink>
    </div>
  );
}

export default NavLinks;