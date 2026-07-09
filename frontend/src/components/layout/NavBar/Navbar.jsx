import { useEffect, useState } from "react";

import Logo from "../Logo/Logo";
import NavLinks from "../NavLinks/NavLinks";
import UserMenu from "../UserMenu/UserMenu";
import { getCurrentUser } from "../../../services/authService";

import "./Navbar.css";

function Navbar() {
  // Guardamos o utilizador em estado (em vez de ler o localStorage apenas
  // uma vez) e ouvimos o evento "authUpdated" disparado pelo authService,
  // para que o menu reaja de imediato ao login/logout sem precisar de
  // recarregar a página.
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    function syncUser() {
      setUser(getCurrentUser());
    }

    window.addEventListener("authUpdated", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("authUpdated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

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