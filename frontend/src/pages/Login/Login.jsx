import { useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router";

import { Eye, EyeOff } from "lucide-react";

import AuthGalaxyLayout from "../../components/common/AuthGalaxyLayout/AuthGalaxyLayout";
import useAuth from "../../hooks/useAuth";

import PageMeta from "../../components/common/PageMeta/PageMeta";
import getApiErrorMessage from "../../utils/getApiErrorMessage";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const wasEmailJustVerified = useMemo(
    () =>
      new URLSearchParams(location.search).get("verified") ===
      "1",
    [location.search]
  );

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const user = await login(formData);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate(location.state?.from || "/");
      }
     } catch (requestError) {
      const fallbackMessage =
        "Não foi possível iniciar sessão. Por favor, verifica as tuas credenciais e tenta novamente.";

      const validationMessage =
        requestError.response?.data?.errors?.email?.[0];

      const message =
        validationMessage ||
        getApiErrorMessage(requestError, fallbackMessage);

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageMeta
        title="Entrar — SpaceVision"
        description="Inicia sessão no SpaceVision para guardares favoritos e gerires a tua conta."
      />
      <AuthGalaxyLayout
        title="Explora o Universo através de dados reais."
        description="Descobre imagens, eventos espaciais, aproximações de asteroides e observações da Terra através das APIs da NASA."
        sectionLabel="Iniciar sessão no SpaceVision"
      >
        <div className="login-auth-card">
          <div className="login-auth-card__header">
            <p className="login-auth-card__eyebrow">
              Bem-vindo de volta
            </p>

            <h1 id="login-title">
              Entrar na tua conta
            </h1>

            <p className="login-auth-card__description">
              Acede aos teus favoritos e continua a tua
              exploração do Universo.
            </p>
          </div>

          {wasEmailJustVerified && (
            <p
              className="login-auth-verified-banner"
              role="status"
            >
              Email confirmado com sucesso. Já podes
              iniciar sessão.
            </p>
          )}

          <form
            className="login-auth-form"
            onSubmit={handleSubmit}
          >
            <div className="login-auth-field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="o-teu-email@exemplo.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="login-auth-field">
              <div className="login-auth-field__heading">
                <label htmlFor="password">
                  Palavra-passe
                </label>

              </div>

              <div className="login-password-input">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword
                      ? "Ocultar palavra-passe"
                      : "Mostrar palavra-passe"
                  }
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff size={20} aria-hidden="true" />
                  ) : (
                    <Eye size={20} aria-hidden="true" />
                  )}
                </button>
              </div>
              <Link
                  className="login-forgot-password"
                  to="/forgot-password"
                >
                  Esqueceste-te?
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
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "A entrar..."
                : "Entrar"}
            </button>
          </form>

          <p className="login-auth-switch">
            Novo no SpaceVision?{" "}
            <Link to="/register">
              Criar conta
            </Link>
          </p>
        </div>
      </AuthGalaxyLayout>
    </>
  );
}

export default Login;