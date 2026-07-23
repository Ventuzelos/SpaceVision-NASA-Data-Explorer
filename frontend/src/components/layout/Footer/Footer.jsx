import { Link } from "react-router-dom";

import Logo from "../Logo/Logo";

import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__container">
        <div className="footer__brand">
          <Logo />
        </div>

        <nav
          className="footer__links"
          aria-label="Navegação do rodapé"
        >
          <section
            className="footer__group"
            aria-labelledby="footer-explore-title"
          >
            <h2 id="footer-explore-title">
              Explorar
            </h2>

            <div className="footer__group-links">
            <Link to="/donki">
              Eventos espaciais
            </Link>

            <Link to="/epic">
              Terra
            </Link>

            <Link to="/neowatch">
              Asteroides
            </Link>

            <Link to="/discover">
              Descobrir
            </Link>

            <Link to="/quiz">
              Quiz
            </Link>
          </div>
          </section>

          <section
            className="footer__group"
            aria-labelledby="footer-information-title"
          >
            <h2 id="footer-information-title">
              Informação
            </h2>

            <div className="footer__group-links">
              <Link to="/about">
                Sobre o projeto
              </Link>

            <Link to="/faq">
              Perguntas frequentes
            </Link>

            <Link to="/about#contact">
              Contacto
            </Link>

            <Link to="/accessibility">
              Acessibilidade
            </Link>
          </div>
          </section>

      
          <section
            className="footer__group"
            aria-labelledby="footer-resources-title"
          >
            <h2 id="footer-resources-title">
              Fontes oficiais
            </h2>


            <a
              href="https://api.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NASA Open APIs
              <span className="sr-only">
                {" "}— abre numa nova janela
              </span>
            </a>

            <a
              href="https://www.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NASA
              <span className="sr-only">
                {" "}— abre numa nova janela
              </span>
            </a>
          </section>
        </nav>
      </div>

      <div className="container footer__bottom">
  <div className="footer__left">
    © {currentYear} SpaceVision — NASA Data Explorer.
  </div>

  <div className="footer__center">
    <Link to="/cookies">Política de Cookies</Link>
    <span>·</span>
    <Link to="/termos">Termos e Condições</Link>
    <span>·</span>
    <Link to="/privacidade">Política de Privacidade</Link>
  </div>

  <div className="footer__right">
    Projeto académico desenvolvido para fins educativos.
  </div>
</div>
    </footer>
  );
}

export default Footer;