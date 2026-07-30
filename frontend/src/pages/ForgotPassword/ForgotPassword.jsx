import {
  useState,
} from "react";
import {
  useTranslation,
} from "react-i18next";
import {
  ArrowLeft,
} from "lucide-react";
import {
  Link,
} from "react-router";

import AuthGalaxyLayout from "../../components/common/AuthGalaxyLayout/AuthGalaxyLayout";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import {
  requestPasswordReset,
} from "../../services/authService";

import getApiErrorMessage from "../../utils/getApiErrorMessage";

import "./ForgotPassword.css";

function ForgotPassword() {
  const { t } =
    useTranslation();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      await requestPasswordReset(
        email
      );

      setMessage(
        t(
          "forgotPassword.success"
        )
      );

      setEmail("");
    } catch (requestError) {
      const validationMessage =
        requestError.response
          ?.data?.errors
          ?.email?.[0];

      const errorMessage =
        validationMessage ||
        getApiErrorMessage(
          requestError,
          t(
            "forgotPassword.errors.requestFailed"
          )
        );

      setError(
        errorMessage
      );
    } finally {
      setIsSubmitting(
        false
      );
    }
  }

  function handleEmailChange(
    event
  ) {
    setEmail(
      event.target.value
    );

    if (error) {
      setError("");
    }

    if (message) {
      setMessage("");
    }
  }

  return (
    <>
      <PageMeta
        title={t(
          "forgotPassword.meta.title"
        )}
        description={t(
          "forgotPassword.meta.description"
        )}
      />

      <AuthGalaxyLayout
        title={t(
          "forgotPassword.layout.title"
        )}
        description={t(
          "forgotPassword.layout.description"
        )}
        sectionLabel={t(
          "forgotPassword.layout.sectionLabel"
        )}
        status={t(
          "forgotPassword.layout.status"
        )}
      >
        <div className="forgot-card">
          <div className="forgot-card__header">
            <p className="forgot-card__eyebrow">
              {t(
                "forgotPassword.card.eyebrow"
              )}
            </p>

            <h1 id="forgot-password-title">
              {t(
                "forgotPassword.card.title"
              )}
            </h1>

            <p className="forgot-card__description">
              {t(
                "forgotPassword.card.description"
              )}
            </p>
          </div>

          <form
            className="forgot-form"
            onSubmit={
              handleSubmit
            }
          >
            <div className="forgot-field">
              <label htmlFor="forgot-email">
                {t(
                  "forgotPassword.fields.email"
                )}
              </label>

              <input
                id="forgot-email"
                name="email"
                type="email"
                placeholder={t(
                  "forgotPassword.fields.emailPlaceholder"
                )}
                value={email}
                onChange={
                  handleEmailChange
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
              disabled={
                isSubmitting
              }
            >
              {isSubmitting
                ? t(
                    "forgotPassword.actions.submitting"
                  )
                : t(
                    "forgotPassword.actions.submit"
                  )}
            </button>
          </form>

          <p className="forgot-switch">
            <Link to="/login">
              <ArrowLeft
                size={17}
                aria-hidden="true"
              />

              {t(
                "forgotPassword.actions.backToLogin"
              )}
            </Link>
          </p>
        </div>
      </AuthGalaxyLayout>
    </>
  );
}

export default ForgotPassword;