import { useState } from "react";
import { Link } from "react-router-dom";

import { requestPasswordReset } from "../../services/authService";

import logo from "../../assets/logos/logo.svg";

import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await requestPasswordReset(email);

      setMessage(response.message);
      setEmail("");
    } catch (requestError) {
      const errorMessage =
        requestError.response?.data?.errors?.email?.[0] ||
        requestError.response?.data?.message ||
        "Não foi possível enviar o link de reposição.";

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="forgot-password-page">
      <section className="forgot-password-left">
        <div className="forgot-password-info">
          <img
            src={logo}
            alt="SpaceVision"
            className="forgot-password-logo"
          />

          <h2>
            Recupera o acesso
            <br />
            à tua conta
          </h2>

          <p>
            Introduz o email associado à tua conta e enviaremos
            um link para definires uma nova palavra-passe.
          </p>
        </div>

        <div className="forgot-password-image-wrapper">
          <img
            src="https://images-assets.nasa.gov/image/art002e009289/art002e009289~large.jpg"
            alt="A Terra vista do espaço numa missão Artemis da NASA"
            className="forgot-password-image"
          />
        </div>
      </section>

      <section className="forgot-password-right">
        <div className="auth-card">
          <h1>Esqueceste-te da palavra-passe?</h1>

          <p className="forgot-password-description">
            Indica o teu email para receberes as instruções de reposição.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="o-teu-email@exemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            {message && (
              <p className="auth-success" role="status">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "A enviar..."
                : "Enviar link de reposição"}
            </button>
          </form>

          <p className="auth-switch">
            <Link to="/login">
              Voltar ao início de sessão
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;