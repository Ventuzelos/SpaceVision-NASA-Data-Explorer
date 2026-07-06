import Logo from "../Logo/Logo";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__container">
        <div className="footer__brand">
          <Logo />

          <p className="footer__description">
            Explora imagens, missões e dados reais da NASA através de uma
            experiência digital simples, educativa e interativa.
          </p>
        </div>

        <div className="footer__links">
          <div className="footer__group">
            <h4>Explorar</h4>
            <a href="/apod">APOD</a>
            <a href="/donki">DONKI</a>
            <a href="/epic">EPIC</a>
            <a href="/favorites">Favoritos</a>
          </div>

          <div className="footer__group">
            <h4>Recursos</h4>
            <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer">
              NASA Open APIs
            </a>
            <a href="https://www.nasa.gov/" target="_blank" rel="noreferrer">
              NASA
            </a>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© 2026 SpaceVision. NASA Data Explorer.</p>
      </div>
    </footer>
  );
}

export default Footer;