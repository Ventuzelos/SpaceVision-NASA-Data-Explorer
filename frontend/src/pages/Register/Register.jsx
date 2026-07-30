import {
  useState,
} from "react";
import {
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Link,
} from "react-router";
import {
  useTranslation,
} from "react-i18next";

import AuthGalaxyLayout from "../../components/common/AuthGalaxyLayout/AuthGalaxyLayout";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import useAuth from "../../hooks/useAuth";

import {
  resendVerificationEmail,
} from "../../services/authService";

import getApiErrorMessage from "../../utils/getApiErrorMessage";

import "./Register.css";

function Register() {
  const { t } =
    useTranslation();

  const { register } =
    useAuth();

  const [
    registeredEmail,
    setRegisteredEmail,
  ] = useState("");

  const [
    resendState,
    setResendState,
  ] = useState("idle");

  const [
    devVerificationUrl,
    setDevVerificationUrl,
  ] = useState("");

  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showPasswordConfirmation,
    setShowPasswordConfirmation,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  function handleChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (
        currentFormData
      ) => ({
        ...currentFormData,
        [name]: value,
      })
    );

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setError("");

    if (
      formData.password.length <
      8
    ) {
      setError(
        t(
          "register.errors.passwordLength"
        )
      );

      return;
    }

    if (
      formData.password !==
      formData.passwordConfirmation
    ) {
      setError(
        t(
          "register.errors.passwordMismatch"
        )
      );

      return;
    }

    try {
      setIsSubmitting(
        true
      );

      const trimmedEmail =
        formData.email.trim();

      const result =
        await register({
          name:
            formData.name.trim(),
          email:
            trimmedEmail,
          password:
            formData.password,
          password_confirmation:
            formData.passwordConfirmation,
        });

      setRegisteredEmail(
        trimmedEmail
      );

      setDevVerificationUrl(
        result?.verification_url ||
          ""
      );
    } catch (requestError) {
      console.error(
        "Erro no registo:",
        requestError
      );

      const validationErrors =
        requestError.response
          ?.data?.errors;

      const validationMessage =
        validationErrors
          ?.email?.[0] ||
        validationErrors
          ?.password?.[0] ||
        validationErrors
          ?.name?.[0];

      const message =
        validationMessage ||
        getApiErrorMessage(
          requestError,
          t(
            "register.errors.registerFailed"
          )
        );

      setError(message);
    } finally {
      setIsSubmitting(
        false
      );
    }
  }

  async function handleResend() {
    try {
      setResendState(
        "sending"
      );

      const result =
        await resendVerificationEmail(
          registeredEmail
        );

      setResendState(
        "sent"
      );

      setDevVerificationUrl(
        result?.verification_url ||
          ""
      );
    } catch (requestError) {
      console.error(
        "Erro ao reenviar email de verificação:",
        requestError
      );

      setResendState(
        "error"
      );
    }
  }

  if (registeredEmail) {
    return (
      <>
        <PageMeta
          title={t(
            "register.verification.meta.title"
          )}
          description={t(
            "register.verification.meta.description"
          )}
        />

        <AuthGalaxyLayout
          title={t(
            "register.verification.layout.title"
          )}
          description={t(
            "register.verification.layout.description"
          )}
          sectionLabel={t(
            "register.verification.layout.sectionLabel"
          )}
        >
          <div className="register-card">
            <div className="register-card__header">
              <p className="register-card__eyebrow">
                {t(
                  "register.verification.card.eyebrow"
                )}
              </p>

              <h1 id="register-title">
                {t(
                  "register.verification.card.title"
                )}
              </h1>

              <p className="register-card__description">
                {t(
                  "register.verification.card.descriptionBeforeEmail"
                )}{" "}
                <strong>
                  {registeredEmail}
                </strong>
                .{" "}
                {t(
                  "register.verification.card.descriptionAfterEmail"
                )}
              </p>
            </div>

            <p className="register-switch">
              {t(
                "register.verification.resend.prompt"
              )}{" "}
              <button
                type="button"
                className="register-resend-link"
                onClick={
                  handleResend
                }
                disabled={
                  resendState ===
                  "sending"
                }
              >
                {resendState ===
                "sending"
                  ? t(
                      "register.verification.resend.sending"
                    )
                  : t(
                      "register.verification.resend.action"
                    )}
              </button>
            </p>

            {devVerificationUrl && (
              <div className="register-dev-verify">
                <p className="register-dev-verify__label">
                  {t(
                    "register.verification.development.label"
                  )}
                </p>

                <a
                  className="register-dev-verify__link"
                  href={
                    devVerificationUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t(
                    "register.verification.development.action"
                  )}
                </a>
              </div>
            )}

            {resendState ===
              "sent" && (
              <p
                className="register-resend-status"
                role="status"
              >
                {t(
                  "register.verification.resend.success"
                )}
              </p>
            )}

            {resendState ===
              "error" && (
              <p
                className="register-error"
                role="alert"
              >
                {t(
                  "register.verification.resend.error"
                )}
              </p>
            )}

            <p className="register-switch">
              {t(
                "register.verification.login.prompt"
              )}{" "}
              <Link to="/login">
                {t(
                  "register.verification.login.action"
                )}
              </Link>
            </p>
          </div>
        </AuthGalaxyLayout>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={t(
          "register.meta.title"
        )}
        description={t(
          "register.meta.description"
        )}
      />

      <AuthGalaxyLayout
        title={t(
          "register.layout.title"
        )}
        description={t(
          "register.layout.description"
        )}
        sectionLabel={t(
          "register.layout.sectionLabel"
        )}
      >
        <div className="register-card">
          <div className="register-card__header">
            <p className="register-card__eyebrow">
              {t(
                "register.card.eyebrow"
              )}
            </p>

            <h1 id="register-title">
              {t(
                "register.card.title"
              )}
            </h1>

            <p className="register-card__description">
              {t(
                "register.card.description"
              )}
            </p>
          </div>

          <form
            className="register-form"
            onSubmit={
              handleSubmit
            }
            noValidate
          >
            <div className="register-field">
              <label htmlFor="name">
                {t(
                  "register.fields.name"
                )}
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder={t(
                  "register.fields.namePlaceholder"
                )}
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="email">
                {t(
                  "register.fields.email"
                )}
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t(
                  "register.fields.emailPlaceholder"
                )}
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="password">
                {t(
                  "register.fields.password"
                )}
              </label>

              <div className="register-password">
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder={t(
                    "register.fields.passwordPlaceholder"
                  )}
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  required
                  minLength={8}
                />

                <button
                  type="button"
                  className="register-password__toggle"
                  onClick={() =>
                    setShowPassword(
                      (
                        current
                      ) =>
                        !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? t(
                          "register.actions.hidePassword"
                        )
                      : t(
                          "register.actions.showPassword"
                        )
                  }
                  aria-pressed={
                    showPassword
                  }
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

            <div className="register-field">
              <label htmlFor="passwordConfirmation">
                {t(
                  "register.fields.passwordConfirmation"
                )}
              </label>

              <div className="register-password">
                <input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type={
                    showPasswordConfirmation
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder={t(
                    "register.fields.passwordConfirmationPlaceholder"
                  )}
                  value={
                    formData.passwordConfirmation
                  }
                  onChange={
                    handleChange
                  }
                  required
                  minLength={8}
                />

                <button
                  type="button"
                  className="register-password__toggle"
                  onClick={() =>
                    setShowPasswordConfirmation(
                      (
                        current
                      ) =>
                        !current
                    )
                  }
                  aria-label={
                    showPasswordConfirmation
                      ? t(
                          "register.actions.hidePasswordConfirmation"
                        )
                      : t(
                          "register.actions.showPasswordConfirmation"
                        )
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
                className="register-error"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              className="register-submit"
              type="submit"
              disabled={
                isSubmitting
              }
            >
              {isSubmitting
                ? t(
                    "register.actions.submitting"
                  )
                : t(
                    "register.actions.submit"
                  )}
            </button>
          </form>

          <p className="register-switch">
            {t(
              "register.login.prompt"
            )}{" "}
            <Link to="/login">
              {t(
                "register.login.action"
              )}
            </Link>
          </p>
        </div>
      </AuthGalaxyLayout>
    </>
  );
}

export default Register;