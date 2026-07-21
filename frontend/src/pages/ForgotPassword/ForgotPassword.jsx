import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import AuthGalaxyLayout from "../../components/common/AuthGalaxyLayout/AuthGalaxyLayout";
import { requestPasswordReset } from "../../services/authService";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response =
        await requestPasswordReset(email);

      setMessage(response.message);
      setEmail("");
    } catch (requestError) {
      const errorMessage =
        requestError.response?.data?.errors
          ?.email?.[0] ||
        requestError.response?.data?.message ||
        "Não foi possível enviar o link de reposição.";

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageMeta
        title="Recuperar palavra-passe — SpaceVision"
        description="Solicita uma ligação para redefinires a palavra-passe da tua conta SpaceVision."
      />
      <AuthGalaxyLayout
        title="Recupera o acesso à tua exploração."
        description="Enviaremos as instruções necessárias para definires uma nova palavra-passe e voltares à tua conta SpaceVision."
        sectionLabel="Recuperar o acesso à conta"
        status="A tua conta e os teus favoritos continuam seguros."
      >
        <div className="forgot-card">
          <div className="forgot-card__header">
            <p className="forgot-card__eyebrow">
              Recuperação de conta
            </p>

            <h1 id="forgot-password-title">
              Esqueceste-te da palavra-passe?
            </h1>

            <p className="forgot-card__description">
              Introduz o email associado à tua conta para
              receberes as instruções de reposição.
            </p>
          </div>

          <form
            className="forgot-form"
            onSubmit={handleSubmit}
          >
            <div className="forgot-field">
              <label htmlFor="forgot-email">
                Email
              </label>

              <input
                id="forgot-email"
                name="email"
                type="email"
                placeholder="o-teu-email@exemplo.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                required
              />
            </div>

            {error && (
              <p
                className="forgot-message forgot-message--error"
                role="alert"
              >
                {error}
              </p>
            )}

            {message && (
              <p
                className="forgot-message forgot-message--success"
                role="status"
                aria-live="polite"
              >
                {message}
              </p>
            )}

            <button
              className="forgot-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "A enviar..."
                : "Enviar link de reposição"}
            </button>
          </form>

          <p className="forgot-switch">
            <Link to="/login">
              <ArrowLeft
                size={17}
                aria-hidden="true"
              />
              Voltar ao início de sessão
            </Link>
          </p>
        </div>
      </AuthGalaxyLayout>
      </>
      );
}

      export default ForgotPassword;