import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/common/Container/Container";
import Button from "../../components/common/Button/Button";
import { registerUser } from "../../services/authService";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("As palavras-passe não coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      registerUser(formData);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <Container>
          <p className="auth-hero__label">Junta-te a nós</p>

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
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label htmlFor="name">Nome</label>
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
                <label htmlFor="email">Email</label>
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
                <label htmlFor="password">Palavra-passe</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="confirmPassword">Confirmar palavra-passe</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              {error && <p className="auth-error">{error}</p>}

              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "A criar conta..." : "Criar conta"}
              </Button>
            </form>

            <p className="auth-switch">
              Já tens conta? <Link to="/login">Entrar</Link>
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}

export default Register;
