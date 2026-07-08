import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/common/Container/Container";
import Button from "../../components/common/Button/Button";
import { loginUser } from "../../services/authService";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      loginUser(formData);
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
          <p className="auth-hero__label">Bem-vindo de volta</p>

          <h1>Entrar na tua conta</h1>

          <p className="auth-hero__text">
            Acede à tua área pessoal para consultares os teus favoritos e
            continuares a explorar o universo SpaceVision.
          </p>
        </Container>
      </section>

      <section className="auth-content">
        <Container>
          <div className="auth-card">
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              {error && <p className="auth-error">{error}</p>}

              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "A entrar..." : "Entrar"}
              </Button>
            </form>

            <p className="auth-switch">
              Ainda não tens conta? <Link to="/register">Regista-te</Link>
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}

export default Login;
