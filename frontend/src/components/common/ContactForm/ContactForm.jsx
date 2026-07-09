import { useState } from "react";

import Button from "../Button/Button";
import { saveContactMessage } from "../../../services/messagesService";

import "./ContactForm.css";

const initialValues = { name: "", email: "", message: "" };

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Indica o teu nome.";
  }

  if (!values.email.trim()) {
    errors.email = "Indica um email.";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Indica um email válido.";
  }

  if (!values.message.trim()) {
    errors.message = "Escreve uma mensagem.";
  } else if (values.message.trim().length < 10) {
    errors.message = "A mensagem deve ter pelo menos 10 caracteres.";
  }

  return errors;
}

function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setStatus("sending");

    try {
      // TODO: substituir por uma chamada real ao back-end (Laravel) quando
      // existir um endpoint de contacto, ex:
      // await axios.post("/api/contact", values);
      await new Promise((resolve) => setTimeout(resolve, 900));

      saveContactMessage(values);

      setStatus("success");
      setValues(initialValues);
    } catch (error) {
      console.error("Erro ao enviar mensagem de contacto:", error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form contact-form--success">
        <p>✅ Mensagem enviada com sucesso! Entraremos em contacto em breve.</p>
        <Button variant="secondary" onClick={() => setStatus("idle")}>
          Enviar outra mensagem
        </Button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__field">
        <label htmlFor="name">Nome</label>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          placeholder="O teu nome"
        />
        {errors.name && <span className="contact-form__error">{errors.name}</span>}
      </div>

      <div className="contact-form__field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          placeholder="tu@exemplo.com"
        />
        {errors.email && <span className="contact-form__error">{errors.email}</span>}
      </div>

      <div className="contact-form__field">
        <label htmlFor="message">Mensagem</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={handleChange}
          placeholder="Escreve a tua mensagem..."
        />
        {errors.message && (
          <span className="contact-form__error">{errors.message}</span>
        )}
      </div>

      {status === "error" && (
        <p className="contact-form__error contact-form__error--general">
          Não foi possível enviar a mensagem. Tenta novamente.
        </p>
      )}

      <Button type="submit" variant="primary" disabled={status === "sending"}>
        {status === "sending" ? "A enviar..." : "Enviar mensagem"}
      </Button>
    </form>
  );
}

export default ContactForm;
