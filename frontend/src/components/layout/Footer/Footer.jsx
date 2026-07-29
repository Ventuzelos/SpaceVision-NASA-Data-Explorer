import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import Logo from "../Logo/Logo";

import "./Footer.css";

function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__container">
        <div className="footer__brand">
          <Logo />

          <p className="footer__description">
            {t("footer.description")}
          </p>
        </div>

        <nav
          className="footer__links"
          aria-label={t("footer.navigation")}
        >
          <section
            className="footer__group"
            aria-labelledby="footer-information-title"
          >
            <h2 id="footer-information-title">
              {t("footer.information.title")}
            </h2>

            <div className="footer__group-links">
              <Link to="/about">
                {t("footer.information.about")}
              </Link>

              <Link to="/faq">
                {t("footer.information.faq")}
              </Link>

              <Link to="/about#contact">
                {t("footer.information.contact")}
              </Link>
            </div>
          </section>

          <section
            className="footer__group"
            aria-labelledby="footer-resources-title"
          >
            <h2 id="footer-resources-title">
              {t("footer.resources.title")}
            </h2>

            <div className="footer__group-links">
              <a
                href="https://api.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
              >
                NASA Open APIs

                <span className="sr-only">
                  {" "}
                  — {t("footer.opensNewWindow")}
                </span>
              </a>

              <a
                href="https://www.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer"
              >
                NASA

                <span className="sr-only">
                  {" "}
                  — {t("footer.opensNewWindow")}
                </span>
              </a>
            </div>
          </section>

          <section
            className="footer__group"
            aria-labelledby="footer-legal-title"
          >
            <h2 id="footer-legal-title">
              {t("footer.legal.title")}
            </h2>

            <div className="footer__group-links">
              <Link to="/cookies">
                {t("footer.legal.cookies")}
              </Link>

              <Link to="/termos">
                {t("footer.legal.terms")}
              </Link>

              <Link to="/privacidade">
                {t("footer.legal.privacy")}
              </Link>

              <Link to="/accessibility">
                {t("footer.legal.accessibility")}
              </Link>
            </div>
          </section>
        </nav>
      </div>

      <div className="container footer__bottom">
        <p className="footer__copyright">
          © {currentYear} SpaceVision — NASA Data Explorer.
        </p>

        <p className="footer__note">
          {t("footer.educationalNote")}
        </p>
      </div>
    </footer>
  );
}

export default Footer;