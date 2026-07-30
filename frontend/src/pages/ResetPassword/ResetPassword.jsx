import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useTranslation,
} from "react-i18next";
import {
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router";

import AuthGalaxyLayout from "../../components/common/AuthGalaxyLayout/AuthGalaxyLayout";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import {
  resetPassword,
} from "../../services/authService";

import getApiErrorMessage from "../../utils/getApiErrorMessage";

import "./ResetPassword.css";

const REDIRECT_DELAY_MS = 1800;

function ResetPassword() {
  const { t } =
    useTranslation();

  const navigate =
    useNavigate();

  const [
    searchParams,
  ] = useSearchParams();

  const redirectTimeoutRef =
    useRef(null);

  const token = useMemo(
    () =>
      searchParams.get(
        "token"
      ) ?? "",
    [searchParams]
  );

  const emailFromUrl =
    useMemo(
      () =>
        searchParams.get(
          "email"
        ) ?? "",
      [searchParams]
    );

  const [
    formData,
    setFormData,
  ] = useState({
    email:
      emailFromUrl,
    password: "",
    passwordConfirmation:
      "",
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

  useEffect(() => {
    return () => {
      if (
        redirectTimeoutRef.current
      ) {
        window.clearTimeout(
          redirectTimeoutRef.current
        );
      }
    };
  }, []);

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

    if (message) {
      setMessage("");
    }
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError(
        t(
          "resetPassword.errors.invalidLink"
        )
      );

      return;
    }

    if (
      formData.password.length <
      8
    ) {
      setError(
        t(
          "resetPassword.errors.passwordLength"
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
          "resetPassword.errors.passwordMismatch"
        )
      );

      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({
        token,
        email:
          formData.email.trim(),
        password:
          formData.password,
        passwordConfirmation:
          formData.passwordConfirmation,
      });

      setMessage(
        t(
          "resetPassword.success"
        )
      );

      redirectTimeoutRef.current =
        window.setTimeout(
          () => {
            navigate(
              "/login"
            );
          },
          REDIRECT_DELAY_MS
        );
    } catch (requestError) {
      const validationErrors =
        requestError.response
          ?.data?.errors;

      const validationMessage =
        validationErrors
          ?.email?.[0] ||
        validationErrors
          ?.password?.[0] ||
        validationErrors
          ?.token?.[0];

      const errorMessage =
        validationMessage ||
        getApiErrorMessage(
          requestError,
          t(
            "resetPassword.errors.updateFailed"
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

  return (
    <>
      <PageMeta
        title={t(
          "resetPassword.meta.title"
        )}
        description={t(
          "resetPassword.meta.description"
        )}
      />

      <AuthGalaxyLayout
        title={t(
          "resetPassword.layout.title"
        )}
        description={t(
          "resetPassword.layout.description"
        )}
        sectionLabel={t(
          "resetPassword.layout.sectionLabel"
        )}
        status={t(
          "resetPassword.layout.status"
        )}
      >
        <div className="reset-card">
          <div className="reset-card__header">
            <p className="reset-card__eyebrow">
              {t(
                "resetPassword.card.eyebrow"
              )}
            </p>

            <h1 id="reset-password-title">
              {t(
                "resetPassword.card.title"
              )}
            </h1>

            <p className="reset-card__description">
              {t(
                "resetPassword.card.description"
              )}
            </p>
          </div>

          <form
            className="reset-form"
            onSubmit={
              handleSubmit
            }
          >
            <div className="reset-field">
              <label htmlFor="reset-email">
                {t(
                  "resetPassword.fields.email"
                )}
              </label>

              <input
                id="reset-email"
                name="email"
                type="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                autoComplete="email"
                required
              />
            </div>

            <div className="reset-field">
              <label htmlFor="reset-password">
                {t(
                  "resetPassword.fields.password"
                )}
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
                  placeholder={t(
                    "resetPassword.fields.passwordPlaceholder"
                  )}
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="reset-password__toggle"
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
                          "resetPassword.actions.hidePassword"
                        )
                      : t(
                          "resetPassword.actions.showPassword"
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

            <div className="reset-field">
              <label htmlFor="reset-password-confirmation">
                {t(
                  "resetPassword.fields.passwordConfirmation"
                )}
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
                  placeholder={t(
                    "resetPassword.fields.passwordConfirmationPlaceholder"
                  )}
                  value={
                    formData.passwordConfirmation
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="reset-password__toggle"
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
                          "resetPassword.actions.hidePasswordConfirmation"
                        )
                      : t(
                          "resetPassword.actions.showPasswordConfirmation"
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
              disabled={
                isSubmitting ||
                !token
              }
            >
              {isSubmitting
                ? t(
                    "resetPassword.actions.submitting"
                  )
                : t(
                    "resetPassword.actions.submit"
                  )}
            </button>
          </form>

          <p className="reset-switch">
            <Link to="/login">
              <ArrowLeft
                size={17}
                aria-hidden="true"
              />

              {t(
                "resetPassword.actions.backToLogin"
              )}
            </Link>
          </p>
        </div>
      </AuthGalaxyLayout>
    </>
  );
}

export default ResetPassword;