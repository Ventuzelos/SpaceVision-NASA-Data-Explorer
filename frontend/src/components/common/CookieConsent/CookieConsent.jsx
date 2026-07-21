import { useState } from "react";

import Icon from "../Icon/Icon";
import Button from "../Button/Button";

import {
  getCookieConsent,
  setCookieConsent,
} from "../../../services/cookieConsentService";

import "./CookieConsent.css";

function getInitialVisibility() {
  const existingChoice = getCookieConsent();

  return !existingChoice;
}

function CookieConsent() {
  const [visible, setVisible] = useState(
    getInitialVisibility
  );

  const [showDetails, setShowDetails] =
    useState(false);

  function handleChoice(status) {
    setCookieConsent(status);
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="cookie-consent__overlay">
      <div
        className="cookie-consent"
        role="region"
        aria-label="Aviso de cookies"
      >
        <div
          className="cookie-consent__icon"
          aria-hidden="true"
        >
          <Icon name="Cookie" size={22} />
        </div>

        <div className="cookie-consent__body">
          <p className="cookie-consent__title">
            Valorizamos a tua privacidade
          </p>

          <p className="cookie-consent__text">
            Usamos armazenamento local para manter a tua
            sessão e guardar os teus favoritos. Não usamos
            cookies de publicidade nem de rastreio.
          </p>

          <button
            type="button"
            className="cookie-consent__link"
            onClick={() =>
              setShowDetails((previous) => !previous)
            }
            aria-expanded={showDetails}
          >
            {showDetails
              ? "Saber menos"
              : "Saber mais"}
          </button>

          {showDetails && (
            <div className="cookie-consent__details">
              <p>
                Não usamos cookies no sentido tradicional.
                Guardamos apenas dados essenciais no teu
                navegador:{" "}
                <strong>sessionStorage</strong> para manter
                a tua sessão ativa e{" "}
                <strong>localStorage</strong> para lembrar
                as tuas preferências. Nada disto é
                partilhado com redes de publicidade ou de
                rastreio de terceiros. Podes apagar estes
                dados a qualquer momento limpando os dados
                de navegação do teu browser.
              </p>
            </div>
          )}

          <div className="cookie-consent__actions">
            <Button
              variant="secondary"
              className="cookie-consent__btn"
              onClick={() =>
                handleChoice("rejected")
              }
            >
              Negar todos os cookies
            </Button>

            <Button
              variant="primary"
              className="cookie-consent__btn"
              onClick={() =>
                handleChoice("accepted")
              }
            >
              Aceitar todos os cookies
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;