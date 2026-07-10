import Logo from "../Logo/Logo";
import NavLinks from "../NavLinks/NavLinks";
import UserMenu from "../UserMenu/UserMenu";
import useAuth from "../../../hooks/useAuth";

import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div className="container navbar__container">
        <Logo />

        <nav className="navbar__nav" aria-label="Main navigation">
          <NavLinks />
        </nav>

        <UserMenu user={user} />
      </div>
    </header>
  );
}

export default Navbar;