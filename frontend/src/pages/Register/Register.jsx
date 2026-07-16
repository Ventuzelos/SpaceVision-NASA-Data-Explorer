import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import AuthGalaxyLayout from "../../components/common/AuthGalaxyLayout/AuthGalaxyLayout";
import useAuth from "../../hooks/useAuth";

import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showPasswordConfirmation,
    setShowPasswordConfirmation,
  ] = useState(false);

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

    setError("");

    if (formData.password.length < 8) {
      setError(
        "A palavra-passe deve ter pelo menos 8 caracteres."
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

    try {
      setIsSubmitting(true);

      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        password_confirmation:
          formData.passwordConfirmation,
      });

      navigate("/");
    } catch (requestError) {
      console.error(
        "Erro no registo:",
        requestError
      );

      const validationErrors =
        requestError.response?.data?.errors;

      const message =
        validationErrors?.email?.[0] ||
        validationErrors?.password?.[0] ||
        validationErrors?.name?.[0] ||
        requestError.response?.data?.message ||
        "Não foi possível criar a conta.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthGalaxyLayout
      title="Começa a tua exploração do Universo."
      description="Cria uma conta para guardares conteúdos, acompanhares descobertas e personalizares a tua experiência SpaceVision."
      sectionLabel="Criar uma conta SpaceVision"
    >
      <div className="register-card">
        <div className="register-card__header">
          <p className="register-card__eyebrow">
            Junta-te ao SpaceVision
          </p>

          <h1 id="register-title">
            Criar conta
          </h1>

          <p className="register-card__description">
            Guarda os teus favoritos e continua a tua
            exploração em qualquer momento.
          </p>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="register-field">
            <label htmlFor="name">
              Nome
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="O teu nome"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="o-teu-email@exemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <label htmlFor="password">
              Palavra-passe
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
                placeholder="Mínimo de 8 caracteres"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />

              <button
                type="button"
                className="register-password__toggle"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showPassword
                    ? "Ocultar palavra-passe"
                    : "Mostrar palavra-passe"
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

          <div className="register-field">
            <label htmlFor="passwordConfirmation">
              Confirmar palavra-passe
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
                placeholder="Repete a palavra-passe"
                value={
                  formData.passwordConfirmation
                }
                onChange={handleChange}
                required
                minLength={8}
              />

              <button
                type="button"
                className="register-password__toggle"
                onClick={() =>
                  setShowPasswordConfirmation(
                    (current) => !current
                  )
                }
                aria-label={
                  showPasswordConfirmation
                    ? "Ocultar confirmação da palavra-passe"
                    : "Mostrar confirmação da palavra-passe"
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
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "A criar conta..."
              : "Criar conta"}
          </button>
        </form>

        <p className="register-switch">
          Já fazes parte do SpaceVision?{" "}
          <Link to="/login">
            Entrar
          </Link>
        </p>
      </div>
    </AuthGalaxyLayout>
  );
}

export default Register;