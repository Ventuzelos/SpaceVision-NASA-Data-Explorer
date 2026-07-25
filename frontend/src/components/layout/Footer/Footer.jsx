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

          <p className="footer__description">
            Projeto académico que junta várias APIs públicas da NASA numa
            única interface, para tornar os dados espaciais mais fáceis de
            explorar e compreender.
          </p>
        </div>

        <nav
          className="footer__links"
          aria-label="Navegação do rodapé"
        >
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

          <section
            className="footer__group"
            aria-labelledby="footer-legal-title"
          >
            <h2 id="footer-legal-title">
              Legal
            </h2>

            <div className="footer__group-links">
              <Link to="/cookies">
                Política de Cookies
              </Link>

              <Link to="/termos">
                Termos e Condições
              </Link>

              <Link to="/privacidade">
                Política de Privacidade
              </Link>

              <Link to="/accessibility">
                Acessibilidade
              </Link>
            </div>
          </section>
        </nav>
      </div>

      <div className="container footer__bottom">
        <div className="footer__left">
          © {currentYear} SpaceVision — NASA Data Explorer.
        </div>

        <div className="footer__right">
          Desenvolvido para fins educativos.
        </div>
      </div>
    </footer>
  );
}

export default Footer;