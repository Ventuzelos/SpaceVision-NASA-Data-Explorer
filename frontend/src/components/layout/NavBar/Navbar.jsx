import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";


import Logo from "../Logo/Logo";
import NavLinks from "../NavLinks/NavLinks";
import UserMenu from "../UserMenu/UserMenu";

import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen((currentValue) => !currentValue);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);


  useEffect(() => {
    document.body.style.overflow = isMenuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="navbar">
        <div className="container navbar__container">
          <Logo />

          <nav
            className="navbar__desktop-nav"
            aria-label="Navegação principal"
          >
            <NavLinks />
          </nav>

          <div className="navbar__desktop-actions">
            <UserMenu />
          </div>

          <button
            type="button"
            className="navbar__toggle"
            onClick={toggleMenu}
            aria-label={
              isMenuOpen
                ? "Fechar menu"
                : "Abrir menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? (
              <X size={26} aria-hidden="true" />
            ) : (
              <Menu size={26} aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <>
          <button
            type="button"
            className="navbar__overlay"
            onClick={closeMenu}
            aria-label="Fechar menu"
          />

          <aside
            id="mobile-navigation"
            className="navbar__mobile-panel"
            aria-label="Menu móvel"
          >
            <div className="navbar__mobile-content">
              <nav
                aria-label="Navegação móvel"
                onClick={closeMenu}
              >
                <NavLinks />
              </nav>

              <div className="navbar__mobile-divider" />

              <div className="navbar__mobile-actions">
                <UserMenu />
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

export default Navbar;