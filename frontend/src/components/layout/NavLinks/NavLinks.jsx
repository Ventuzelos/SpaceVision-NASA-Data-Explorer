import Logo from "../Logo/Logo";
import NavLinks from "../NavLinks/NavLinks";
import UserMenu from "../UserMenu/UserMenu";

import "./NavLinks.css";

function Navbar() {
  const isAuthenticated = false;

  return (
    <header className="navbar">
      <div className="navbar__container">
        <Logo />

        <nav className="navbar__nav" aria-label="Main navigation">
          <NavLinks isAuthenticated={isAuthenticated} />
        </nav>

        <UserMenu isAuthenticated={isAuthenticated} />
      </div>
    </header>
  );
}

export default Navbar;