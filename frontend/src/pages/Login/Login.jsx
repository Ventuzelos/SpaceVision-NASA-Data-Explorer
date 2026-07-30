import {
  useMemo,
  useState,
} from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router";
import { useTranslation } from "react-i18next";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import AuthGalaxyLayout from "../../components/common/AuthGalaxyLayout/AuthGalaxyLayout";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import useAuth from "../../hooks/useAuth";

import getApiErrorMessage from "../../utils/getApiErrorMessage";

import "./Login.css";

function Login() {
  const { t } =
    useTranslation();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const { login } =
    useAuth();

  const wasEmailJustVerified =
    useMemo(
      () =>
        new URLSearchParams(
          location.search
        ).get("verified") ===
        "1",
      [location.search]
    );

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    formData,
    setFormData,
  ] = useState({
    email: "",
    password: "",
  });

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
      (current) => ({
        ...current,
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
    setIsSubmitting(true);

    try {
      const user =
        await login(formData);

      if (
        user.role === "admin"
      ) {
        navigate("/admin");
      } else {
        navigate(
          location.state
            ?.from || "/"
        );
      }
    } catch (requestError) {
      const fallbackMessage =
        t(
          "login.errors.loginFailed"
        );

      const validationMessage =
        requestError.response
          ?.data?.errors
          ?.email?.[0];

      const message =
        validationMessage ||
        getApiErrorMessage(
          requestError,
          fallbackMessage
        );

      setError(message);
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
          "login.meta.title"
        )}
        description={t(
          "login.meta.description"
        )}
      />

      <AuthGalaxyLayout
        title={t(
          "login.layout.title"
        )}
        description={t(
          "login.layout.description"
        )}
        sectionLabel={t(
          "login.layout.sectionLabel"
        )}
      >
        <div className="login-auth-card">
          <div className="login-auth-card__header">
            <p className="login-auth-card__eyebrow">
              {t(
                "login.card.eyebrow"
              )}
            </p>

            <h1 id="login-title">
              {t(
                "login.card.title"
              )}
            </h1>

            <p className="login-auth-card__description">
              {t(
                "login.card.description"
              )}
            </p>
          </div>

          {wasEmailJustVerified && (
            <p
              className="login-auth-verified-banner"
              role="status"
            >
              {t(
                "login.verified"
              )}
            </p>
          )}

          <form
            className="login-auth-form"
            onSubmit={
              handleSubmit
            }
          >
            <div className="login-auth-field">
              <label htmlFor="email">
                {t(
                  "login.fields.email"
                )}
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder={t(
                  "login.fields.emailPlaceholder"
                )}
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

            <div className="login-auth-field">
              <div className="login-auth-field__heading">
                <label htmlFor="password">
                  {t(
                    "login.fields.password"
                  )}
                </label>
              </div>

              <div className="login-password-input">
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? t(
                          "login.actions.hidePassword"
                        )
                      : t(
                          "login.actions.showPassword"
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

              <Link
                className="login-forgot-password"
                to="/forgot-password"
              >
                {t(
                  "login.actions.forgotPassword"
                )}
              </Link>
            </div>

            {error && (
              <p
                className="login-auth-error"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              className="login-auth-submit"
              type="submit"
              disabled={
                isSubmitting
              }
            >
              {isSubmitting
                ? t(
                    "login.actions.submitting"
                  )
                : t(
                    "login.actions.submit"
                  )}
            </button>
          </form>

          <p className="login-auth-switch">
            {t(
              "login.register.prompt"
            )}{" "}
            <Link to="/register">
              {t(
                "login.register.action"
              )}
            </Link>
          </p>
        </div>
      </AuthGalaxyLayout>
    </>
  );
}

export default Login;