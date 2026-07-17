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
            Explora imagens, eventos espaciais e dados reais da NASA através
            de uma experiência digital simples, educativa e interativa.
          </p>

          <p className="footer__disclaimer">
            Projeto académico desenvolvido para fins educativos. O SpaceVision
            não é um website oficial da NASA e não representa nem está afiliado
            à NASA.
          </p>
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

            <Link to="/apod">
              Imagem do dia
            </Link>

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
              Discover
            </Link>
          </section>

          <section
            className="footer__group"
            aria-labelledby="footer-information-title"
          >
            <h2 id="footer-information-title">
              Informação
            </h2>

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
  <p>© {currentYear} SpaceVision — NASA Data Explorer.</p>

  

  <div className="footer__legal">
    <a href="/cookies">Política de Cookies</a>
    <span aria-hidden="true">·</span>
    <a href="/termos">Termos e Condições</a>
    <span aria-hidden="true">·</span>
    <a href="/privacidade">Política de Privacidade</a>
  </div>
  <p className="footer__note">
    Dados e imagens fornecidos através de serviços oficiais da NASA.
  </p>
</div>
    </footer>
  );
}

export default Footer;