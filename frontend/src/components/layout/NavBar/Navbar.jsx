import Logo from "../Logo/Logo";
import NavLinks from "../NavLinks/NavLinks";
import UserMenu from "../UserMenu/UserMenu";

import "./Navbar.css";

function Navbar() {
  
   const isAuthenticated = !!localStorage.getItem("spacevision_session");
   // o localStorage não sai da sessão apenas por reiniciar a página, então o estado de autenticação é mantido mesmo após o refresh da página. 
   //Temos que ativar o botão "terminar sessão" para que o usuário possa encerrar a sessão e limpar o localStorage, caso contrário, ele permanecerá autenticado mesmo após reiniciar a página.
  

  return (
    <header className="navbar">
      <div className="container navbar__container">
        <Logo />

        <nav className="navbar__nav" aria-label="Main navigation">
          <NavLinks />
        </nav>

        <UserMenu isAuthenticated={isAuthenticated} />
      </div>
    </header>
  );
}

export default Navbar;