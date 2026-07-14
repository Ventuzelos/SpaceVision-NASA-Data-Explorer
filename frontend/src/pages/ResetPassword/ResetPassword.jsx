import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { resetPassword } from "../../services/authService";

import logo from "../../assets/logos/logo.svg";

import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = useMemo(
    () => searchParams.get("token") ?? "",
    [searchParams]
  );

  const emailFromUrl = useMemo(
    () => searchParams.get("email") ?? "",
    [searchParams]
  );

  const [formData, setFormData] = useState({
    email: emailFromUrl,
    password: "",
    passwordConfirmation: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("O link de reposição é inválido ou está incompleto.");
      return;
    }

    if (formData.password !== formData.passwordConfirmation) {
      setError("As palavras-passe não coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPassword({
        token,
        email: formData.email,
        password: formData.password,
        passwordConfirmation: formData.passwordConfirmation,
      });

      setMessage(response.message);

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (requestError) {
      const validationErrors =
        requestError.response?.data?.errors;

      const errorMessage =
        validationErrors?.email?.[0] ||
        validationErrors?.password?.[0] ||
        validationErrors?.token?.[0] ||
        requestError.response?.data?.message ||
        "Não foi possível atualizar a palavra-passe.";

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="reset-password-page">
      <section className="reset-password-left">
        <div className="reset-password-info">
          <img
            src={logo}
            alt="SpaceVision"
            className="reset-password-logo"
          />

          <h2>
            Define uma nova
            <br />
            palavra-passe
          </h2>

          <p>
            Escolhe uma palavra-passe segura para voltares a aceder
            à tua conta SpaceVision.
          </p>
        </div>

        <div className="reset-password-image-wrapper">
          <img
            src="https://images-assets.nasa.gov/image/art002e009289/art002e009289~large.jpg"
            alt="A Terra observada do espaço"
            className="reset-password-image"
          />
        </div>
      </section>

      <section className="reset-password-right">
        <div className="auth-card">
          <h1>Repor palavra-passe</h1>

          <p className="reset-password-description">
            Introduz o teu email e escolhe uma nova palavra-passe.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">
                Nova palavra-passe
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="passwordConfirmation">
                Confirmar palavra-passe
              </label>

              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                value={formData.passwordConfirmation}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
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
              disabled={isSubmitting || !token}
            >
              {isSubmitting
                ? "A atualizar..."
                : "Atualizar palavra-passe"}
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

export default ResetPassword;
