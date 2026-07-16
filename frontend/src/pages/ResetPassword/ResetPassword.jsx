import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import AuthGalaxyLayout from "../../components/common/AuthGalaxyLayout/AuthGalaxyLayout";
import { resetPassword } from "../../services/authService";

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

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showPasswordConfirmation,
    setShowPasswordConfirmation,
  ] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

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
      setError(
        "O link de reposição é inválido ou está incompleto."
      );
      return;
    }

    if (formData.password.length < 8) {
      setError(
        "A nova palavra-passe deve ter pelo menos 8 caracteres."
      );
      return;
    }

    if (
      formData.password !==
      formData.passwordConfirmation
    ) {
      setError(
        "As palavras-passe não coincidem."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPassword({
        token,
        email: formData.email,
        password: formData.password,
        passwordConfirmation:
          formData.passwordConfirmation,
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
    <AuthGalaxyLayout
      title="Define uma nova palavra-passe."
      description="Escolhe uma palavra-passe segura para recuperares o acesso à tua conta e continuares a explorar o Universo."
      sectionLabel="Definir uma nova palavra-passe"
      status="A atualização será aplicada de forma segura à tua conta."
    >
      <div className="reset-card">
        <div className="reset-card__header">
          <p className="reset-card__eyebrow">
            Segurança da conta
          </p>

          <h1 id="reset-password-title">
            Repor palavra-passe
          </h1>

          <p className="reset-card__description">
            Confirma o teu email e introduz uma nova
            palavra-passe.
          </p>
        </div>

        <form
          className="reset-form"
          onSubmit={handleSubmit}
        >
          <div className="reset-field">
            <label htmlFor="reset-email">
              Email
            </label>

            <input
              id="reset-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="reset-field">
            <label htmlFor="reset-password">
              Nova palavra-passe
            </label>

            <div className="reset-password">
              <input
                id="reset-password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Mínimo de 8 caracteres"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="button"
                className="reset-password__toggle"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showPassword
                    ? "Ocultar nova palavra-passe"
                    : "Mostrar nova palavra-passe"
                }
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff
                    size={20}
                    aria-hidden="true"
                  />
                ) : (
                  <Eye
                    size={20}
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          </div>

          <div className="reset-field">
            <label htmlFor="reset-password-confirmation">
              Confirmar palavra-passe
            </label>

            <div className="reset-password">
              <input
                id="reset-password-confirmation"
                name="passwordConfirmation"
                type={
                  showPasswordConfirmation
                    ? "text"
                    : "password"
                }
                placeholder="Repete a nova palavra-passe"
                value={
                  formData.passwordConfirmation
                }
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="button"
                className="reset-password__toggle"
                onClick={() =>
                  setShowPasswordConfirmation(
                    (current) => !current
                  )
                }
                aria-label={
                  showPasswordConfirmation
                    ? "Ocultar confirmação da nova palavra-passe"
                    : "Mostrar confirmação da nova palavra-passe"
                }
                aria-pressed={
                  showPasswordConfirmation
                }
              >
                {showPasswordConfirmation ? (
                  <EyeOff
                    size={20}
                    aria-hidden="true"
                  />
                ) : (
                  <Eye
                    size={20}
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p
              className="reset-message reset-message--error"
              role="alert"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              className="reset-message reset-message--success"
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          )}

          <button
            className="reset-submit"
            type="submit"
            disabled={isSubmitting || !token}
          >
            {isSubmitting
              ? "A atualizar..."
              : "Atualizar palavra-passe"}
          </button>
        </form>

        <p className="reset-switch">
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
  );
}

export default ResetPassword;