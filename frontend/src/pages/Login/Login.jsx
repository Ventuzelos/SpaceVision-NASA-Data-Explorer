import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/common/Container/Container";
import Button from "../../components/common/Button/Button";
import { loginUser } from "../../services/authService";
import logo from "../../assets/logos/logo-horizontal.svg";
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
  <main className="login-page">

    <div className="login-left">

      <div className="login-info">

        <img src={logo} alt="SpaceVision" className="login-logo" />

        <h2>Explora o universo</h2>
        <h2>com dados reais</h2>

      </div>
      
      <div className="login-image-wrapper">
        <img
          src="https://images-assets.nasa.gov/image/art002e009289/art002e009289~large.jpg"
          alt="A Setting Earth - NASA Artemis II"
          className="login-bottom-image"
        />
      </div>

    </div>

    <div className="login-right">

      <div className="auth-card">

        <h1>Entrar na tua conta</h1>

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

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "A entrar..." : "Entrar"}
          </Button>

        </form>

        <p className="auth-switch">
          Ainda não tens conta? <Link to="/register">Regista-te</Link>
        </p>

      </div>

    </div>

  </main>
);
}

export default Login;
