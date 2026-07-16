import Container from "../Container/Container";
import GalaxyBackground from "../GalaxyBackground/GalaxyBackground";

import logo from "../../../assets/logos/logo.svg";

import "./AuthGalaxyLayout.css";

function AuthGalaxyLayout({
  eyebrow = "NASA Data Explorer",
  title,
  description,
  status = "Dados científicos. Exploração sem limites.",
  sectionLabel,
  children,
}) {
  return (
    <main className="auth-galaxy">
      <GalaxyBackground
        className="auth-galaxy__background"
        density={1200}
        speed={0.35}
        interactive
      />

      <div
        className="auth-galaxy__overlay"
        aria-hidden="true"
      />

      <div className="auth-galaxy__content">
        <Container>
          <div className="auth-galaxy__layout">
            <section
              className="auth-galaxy__intro"
              aria-label="Apresentação do SpaceVision"
            >
              <div className="auth-galaxy__intro-content">
                <img
                  src={logo}
                  alt="SpaceVision"
                  className="auth-galaxy__logo"
                />

                <p className="auth-galaxy__eyebrow">
                  {eyebrow}
                </p>

                <p className="auth-galaxy__title">
                  {title}
                </p>

                <p className="auth-galaxy__description">
                  {description}
                </p>

                {status && (
                  <div
                    className="auth-galaxy__status"
                    aria-hidden="true"
                  >
                    <span className="auth-galaxy__status-dot" />

                    <span>{status}</span>
                  </div>
                )}
              </div>
            </section>

            <section
              className="auth-galaxy__panel"
              aria-label={sectionLabel}
            >
              {children}
            </section>
          </div>
        </Container>
      </div>
    </main>
  );
}

export default AuthGalaxyLayout;