import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";


import Logo from "../Logo/Logo";
import NavLinks from "../NavLinks/NavLinks";
import UserMenu from "../UserMenu/UserMenu";

import "./Navbar.css";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleButtonRef = useRef(null);
  const panelRef = useRef(null);
  const isFirstRender = useRef(true);

  function toggleMenu() {
    setIsMenuOpen((currentValue) => !currentValue);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  useEffect(() => {
    function handleKeydown(event) {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !isMenuOpen) return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll(FOCUSABLE_SELECTOR)
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isMenuOpen) {
      const firstFocusable = panelRef.current?.querySelector(
        FOCUSABLE_SELECTOR
      );

      firstFocusable?.focus();
    } else {
      toggleButtonRef.current?.focus();
    }
  }, [isMenuOpen]);


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
            ref={toggleButtonRef}
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
            ref={panelRef}
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
                <UserMenu onMobileNavigate={closeMenu}/>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

export default Navbar;