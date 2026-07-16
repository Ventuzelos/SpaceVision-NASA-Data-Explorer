import { Link } from "react-router-dom";

import Container from "../../components/common/Container/Container";
import Icon from "../../components/common/Icon/Icon";

import "./NotFound.css";

function NotFound() {
  return (
    <main className="notfound-page">
      <Container>
        <div className="notfound">
          <div className="notfound__image">
            <svg
              viewBox="-33 0 600 380"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Erro 404, página não encontrada"
            >
              <defs>
                <linearGradient
                  id="notfoundGrad404"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#7e47fd" />
                  <stop offset="50%" stopColor="#4840f0" />
                  <stop offset="100%" stopColor="#4f8df0" />
                </linearGradient>

                <radialGradient
                  id="notfoundPlanetGrad"
                  cx="35%"
                  cy="35%"
                  r="75%"
                >
                  <stop offset="0%" stopColor="#4f8df0" />
                  <stop offset="100%" stopColor="#4840f0" />
                </radialGradient>

                <radialGradient
                  id="notfoundVisorGrad"
                  cx="35%"
                  cy="30%"
                  r="75%"
                >
                  <stop offset="0%" stopColor="#4f8df0" />
                  <stop offset="55%" stopColor="#1b1f2e" />
                  <stop offset="100%" stopColor="#05070d" />
                </radialGradient>

                <path
                  id="notfoundStar"
                  d="M0,-11 L2.9,-3.4 L11,-3.4 L4.4,2 L6.8,10 L0,5.2 L-6.8,10 L-4.4,2 L-11,-3.4 L-2.9,-3.4 Z"
                />
              </defs>

              <g
                fill="var(--color-text-secondary)"
                opacity="0.7"
              >
                <circle cx="35" cy="35" r="1.8" />
                <circle cx="80" cy="15" r="1.2" />
                <circle cx="140" cy="45" r="1.6" />
                <circle cx="200" cy="18" r="1.3" />
                <circle cx="260" cy="40" r="1.5" />
                <circle cx="330" cy="20" r="1.2" />
                <circle cx="400" cy="35" r="1.8" />
                <circle cx="460" cy="15" r="1.3" />
                <circle cx="540" cy="45" r="1.6" />
                <circle cx="570" cy="90" r="1.4" />
                <circle cx="20" cy="150" r="1.4" />
                <circle cx="45" cy="330" r="1.3" />
                <circle cx="200" cy="345" r="1.5" />
                <circle cx="470" cy="330" r="1.3" />
                <circle cx="540" cy="290" r="1.6" />
                <circle cx="570" cy="220" r="1.3" />
                <circle cx="560" cy="130" r="1.4" />
                <circle cx="250" cy="90" r="1.3" />
              </g>

              <g>
                <ellipse
                  cx="105"
                  cy="285"
                  rx="72"
                  ry="18"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="2"
                  opacity="0.5"
                  transform="rotate(-15 105 285)"
                />

                <circle
                  cx="105"
                  cy="275"
                  r="46"
                  fill="url(#notfoundPlanetGrad)"
                />

                <circle
                  cx="90"
                  cy="260"
                  r="6"
                  fill="#000"
                  opacity="0.15"
                />

                <circle
                  cx="118"
                  cy="288"
                  r="4"
                  fill="#000"
                  opacity="0.15"
                />

                <circle
                  cx="93"
                  cy="292"
                  r="3"
                  fill="#000"
                  opacity="0.12"
                />
              </g>

              <text
                x="255"
                y="235"
                textAnchor="middle"
                fontFamily="Inter, sans-serif"
                fontWeight="800"
                fontSize="105"
                fill="url(#notfoundGrad404)"
              >
                404
              </text>

              <g transform="translate(400,205) rotate(-6)">
                <path
                  d="M -20 78 Q -26 100 -22 118"
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth="24"
                  strokeLinecap="round"
                />

                <path
                  d="M -20 78 Q -26 100 -22 118"
                  fill="none"
                  stroke="var(--color-surface-light)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />

                <ellipse
                  cx="-23"
                  cy="122"
                  rx="17"
                  ry="13"
                  fill="url(#notfoundGrad404)"
                  stroke="var(--color-border)"
                  strokeWidth="3"
                />

                <path
                  d="M 20 78 Q 28 100 24 118"
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth="24"
                  strokeLinecap="round"
                />

                <path
                  d="M 20 78 Q 28 100 24 118"
                  fill="none"
                  stroke="var(--color-surface-light)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />

                <ellipse
                  cx="25"
                  cy="122"
                  rx="17"
                  ry="13"
                  fill="url(#notfoundPlanetGrad)"
                  stroke="var(--color-border)"
                  strokeWidth="3"
                />

                <path
                  d="M -34 30 Q -56 42 -50 62"
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth="24"
                  strokeLinecap="round"
                />

                <path
                  d="M -34 30 Q -56 42 -50 62"
                  fill="none"
                  stroke="var(--color-surface-light)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />

                <circle
                  cx="-50"
                  cy="63"
                  r="13"
                  fill="var(--color-surface-light)"
                  stroke="var(--color-border)"
                  strokeWidth="3"
                />

                <path
                  d="M 34 28 Q 60 10 62 -20"
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth="24"
                  strokeLinecap="round"
                />

                <path
                  d="M 34 28 Q 60 10 62 -20"
                  fill="none"
                  stroke="var(--color-surface-light)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />

                <circle
                  cx="63"
                  cy="-22"
                  r="14"
                  fill="var(--color-surface-light)"
                  stroke="var(--color-border)"
                  strokeWidth="3"
                />

                <use
                  href="#notfoundStar"
                  x="90"
                  y="-38"
                  transform="scale(0.9)"
                  fill="#FACC15"
                />

                <rect
                  x="-40"
                  y="10"
                  width="80"
                  height="78"
                  rx="32"
                  fill="var(--color-surface-light)"
                  stroke="var(--color-border)"
                  strokeWidth="4"
                />

                <rect
                  x="-40"
                  y="38"
                  width="80"
                  height="13"
                  fill="url(#notfoundGrad404)"
                  opacity="0.9"
                />

                <circle
                  cx="0"
                  cy="66"
                  r="11"
                  fill="var(--color-surface)"
                  stroke="var(--color-border)"
                  strokeWidth="3"
                />

                <circle
                  cx="0"
                  cy="66"
                  r="4"
                  fill="var(--color-accent)"
                />

                <rect
                  x="-48"
                  y="18"
                  width="14"
                  height="46"
                  rx="6"
                  fill="var(--color-surface)"
                  stroke="var(--color-border)"
                  strokeWidth="3"
                  opacity="0.9"
                />

                <circle
                  cx="0"
                  cy="-38"
                  r="52"
                  fill="var(--color-surface-light)"
                  stroke="var(--color-border)"
                  strokeWidth="5"
                />

                <circle
                  cx="-46"
                  cy="-28"
                  r="12"
                  fill="var(--color-surface-light)"
                  stroke="var(--color-border)"
                  strokeWidth="3"
                />

                <circle
                  cx="46"
                  cy="-28"
                  r="12"
                  fill="var(--color-surface-light)"
                  stroke="var(--color-border)"
                  strokeWidth="3"
                />

                <ellipse
                  cx="0"
                  cy="-36"
                  rx="36"
                  ry="32"
                  fill="url(#notfoundVisorGrad)"
                  stroke="var(--color-border)"
                  strokeWidth="3"
                />

                <ellipse
                  cx="-13"
                  cy="-50"
                  rx="11"
                  ry="7"
                  fill="var(--color-text)"
                  opacity="0.85"
                  transform="rotate(-25 -13 -50)"
                />

                <circle
                  cx="14"
                  cy="-28"
                  r="4"
                  fill="var(--color-text)"
                  opacity="0.5"
                />

                <path
                  d="M -34 -78 q -6 -6 0 -12 q 6 -6 0 -12 q -6 -6 0 -12"
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <circle
                  cx="-34"
                  cy="-104"
                  r="6"
                  fill="var(--color-surface-light)"
                  stroke="var(--color-border)"
                  strokeWidth="2.5"
                />
              </g>

              <use
                href="#notfoundStar"
                x="455"
                y="150"
                fill="#FACC15"
                opacity="0.9"
                transform="scale(0.7)"
              />

              <use
                href="#notfoundStar"
                x="330"
                y="90"
                fill="var(--color-accent)"
                opacity="0.85"
                transform="scale(0.6)"
              />
            </svg>
          </div>

          <p className="notfound__eyebrow">
            Erro 404
          </p>

          <h1 className="notfound__title">
            Página não encontrada
          </h1>

          <p className="notfound__text">
            Parece que esta missão saiu de órbita.
            Verifica o endereço ou volta para um local
            conhecido.
          </p>

          <div className="notfound__actions">
            <Link
              to="/"
              className="notfound__btn notfound__btn--primary"
            >
              <Icon
                name="ArrowLeft"
                size={18}
                aria-hidden="true"
              />
              Voltar ao início
            </Link>

            <Link
              to="/faq"
              className="notfound__btn notfound__btn--ghost"
            >
              Ver FAQ
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default NotFound;