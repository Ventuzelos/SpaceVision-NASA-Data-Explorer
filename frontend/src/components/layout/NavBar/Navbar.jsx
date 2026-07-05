import Logo from "../Logo/Logo";
import NavLinks from "../NavLinks/NavLinks";
import UserMenu from "../UserMenu/UserMenu";

import "./Navbar.css";

function Navbar() {
  const isAuthenticated = false;

  return (
    <header className="navbar">
      <div className="container navbar__container">
        <Logo />

        <nav class="navbar__nav">
          <div class="nav-links">
            <NavLinks />
          </div>
        </nav>

        <UserMenu isAuthenticated={isAuthenticated} />
      </div>
    </header>
  );
}

export default Navbar;