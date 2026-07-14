import { useState } from "react";

import Button from "../Button/Button";
import { saveContactMessage } from "../../../services/messagesService";

import "./ContactForm.css";

const initialValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Indica o teu nome.";
  } else if (values.name.trim().length > 100) {
    errors.name = "O nome não pode ter mais de 100 caracteres.";
  }

  if (!values.email.trim()) {
    errors.email = "Indica um email.";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Indica um email válido.";
  } else if (values.email.trim().length > 150) {
    errors.email = "O email não pode ter mais de 150 caracteres.";
  }

  if (!values.subject.trim()) {
    errors.subject = "Indica o assunto.";
  } else if (values.subject.trim().length > 150) {
    errors.subject = "O assunto não pode ter mais de 150 caracteres.";
  }

  if (!values.message.trim()) {
    errors.message = "Escreve uma mensagem.";
  } else if (values.message.trim().length < 10) {
    errors.message = "A mensagem deve ter pelo menos 10 caracteres.";
  } else if (values.message.trim().length > 5000) {
    errors.message = "A mensagem não pode ter mais de 5000 caracteres.";
  }

  return errors;
}

function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((previousValues) => ({
      ...previousValues,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: "",
      }));
    }

    if (status === "error") {
      setStatus("idle");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setStatus("sending");

    try {
      await saveContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      });

      setValues(initialValues);
      setErrors({});
      setStatus("success");
    } catch (error) {
      console.error("Erro ao enviar mensagem de contacto:", error);

      if (error.validationErrors) {
        const backendErrors = Object.entries(
          error.validationErrors
        ).reduce((result, [field, messages]) => {
          result[field] = messages[0];
          return result;
        }, {});

        setErrors(backendErrors);
      }

      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="contact-form contact-form--success"
        role="status"
        aria-live="polite"
      >
        <p>Mensagem enviada com sucesso! Entraremos em contacto em breve.</p>

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
          maxLength={100}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          disabled={status === "sending"}
        />

        {errors.name && (
          <span id="name-error" className="contact-form__error">
            {errors.name}
          </span>
        )}
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
          maxLength={150}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          disabled={status === "sending"}
        />

        {errors.email && (
          <span id="email-error" className="contact-form__error">
            {errors.email}
          </span>
        )}
      </div>

      <div className="contact-form__field">
        <label htmlFor="subject">Assunto</label>

        <input
          id="subject"
          name="subject"
          type="text"
          value={values.subject}
          onChange={handleChange}
          placeholder="Sobre o que nos queres contactar?"
          maxLength={150}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          disabled={status === "sending"}
        />

        {errors.subject && (
          <span id="subject-error" className="contact-form__error">
            {errors.subject}
          </span>
        )}
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
          maxLength={5000}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          disabled={status === "sending"}
        />

        {errors.message && (
          <span id="message-error" className="contact-form__error">
            {errors.message}
          </span>
        )}
      </div>

      {status === "error" && (
        <p
          className="contact-form__error contact-form__error--general"
          role="alert"
        >
          Não foi possível enviar a mensagem. Verifica os dados e tenta
          novamente.
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={status === "sending"}
      >
        {status === "sending" ? "A enviar..." : "Enviar mensagem"}
      </Button>
    </form>
  );
}

export default ContactForm;