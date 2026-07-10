import { useState } from "react";
import { Menu, X } from "lucide-react";

import Logo from "../Logo/Logo";
import NavLinks from "../NavLinks/NavLinks";
import UserMenu from "../UserMenu/UserMenu";
import useAuth from "../../../hooks/useAuth";

import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar__container">
        <Logo />

        <nav
          id="navbar-nav"
          className={`navbar__nav ${isMenuOpen ? "navbar__nav--open" : ""}`}
          aria-label="Main navigation"
          onClick={() => setIsMenuOpen(false)}
        >
          <NavLinks />
        </nav>

        <div className="navbar__actions">
          <UserMenu user={user} />

          <button
            type="button"
            className="navbar__toggle"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            aria-controls="navbar-nav"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;