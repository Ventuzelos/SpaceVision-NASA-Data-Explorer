import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Container from "../../components/common/Container/Container";
import Button from "../../components/common/Button/Button";
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

    setError("");

    if (formData.password.length < 8) {
      setError("A palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }

    if (formData.password !== formData.passwordConfirmation) {
      setError("As palavras-passe não coincidem.");
      return;
    }

    try {
      setIsSubmitting(true);

      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
      });

      navigate("/");
    } catch (requestError) {
      console.error("Erro no registo:", requestError);

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
    <main className="auth-page">
      <section className="auth-hero">
        <Container>
          <p className="auth-hero__label">
            Junta-te a nós
          </p>

          <h1>Cria a tua conta</h1>

          <p className="auth-hero__text">
            Regista-te para guardares os teus conteúdos favoritos e
            personalizares a tua experiência SpaceVision.
          </p>
        </Container>
      </section>

      <section className="auth-content">
        <Container>
          <div className="auth-card">
            <form
              className="auth-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="auth-field">
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

              <div className="auth-field">
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

              <div className="auth-field">
                <label htmlFor="password">
                  Palavra-passe
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mínimo de 8 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
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
                  autoComplete="new-password"
                  placeholder="Repete a palavra-passe"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "A criar conta..."
                  : "Criar conta"}
              </Button>
            </form>

            <p className="auth-switch">
              Já tens conta?{" "}
              <Link to="/login">
                Entrar
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}

export default Register;