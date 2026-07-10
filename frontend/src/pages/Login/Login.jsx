import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import logo from "../../assets/logos/logo.svg";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        navigate("/");
      }
    } catch (requestError) {
      const message =
        requestError.response?.data?.errors?.email?.[0] ||
        requestError.response?.data?.message ||
        "Não foi possível iniciar sessão.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-left">
        <div className="login-info">
          <img
            src={logo}
            alt="SpaceVision"
            className="login-logo"
          />

          <h2>
            Explora o
            <br />
            universo
            <br />
            com dados
            <br />
            reais
          </h2>
        </div>

        <div className="login-image-wrapper">
          <img
            src="https://images-assets.nasa.gov/image/art002e009289/art002e009289~large.jpg"
            alt="A Setting Earth - NASA Artemis II"
            className="login-bottom-image"
          />
        </div>
      </section>

      <section className="login-right">
        <div className="auth-card">
          <h1>Entrar na tua conta</h1>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="email">Email</label>

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

            <div className="auth-field">
              <label htmlFor="password">Palavra-passe</label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="auth-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "A entrar..." : "Entrar"}
            </button>
          </form>

          <p className="auth-switch">
            Ainda não tens conta?{" "}
            <Link to="/register">
              Regista-te
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;