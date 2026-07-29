import { useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "../Button/Button";

import { saveContactMessage } from "../../../services/messagesService";

import "./ContactForm.css";

const initialValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function validate(
  values,
  t
) {
  const errors = {};

  const trimmedName =
    values.name.trim();

  const trimmedEmail =
    values.email.trim();

  const trimmedSubject =
    values.subject.trim();

  const trimmedMessage =
    values.message.trim();

  if (!trimmedName) {
    errors.name = t(
      "contactForm.validation.nameRequired"
    );
  } else if (
    trimmedName.length > 100
  ) {
    errors.name = t(
      "contactForm.validation.nameMax"
    );
  }

  if (!trimmedEmail) {
    errors.email = t(
      "contactForm.validation.emailRequired"
    );
  } else if (
    !/^\S+@\S+\.\S+$/.test(
      trimmedEmail
    )
  ) {
    errors.email = t(
      "contactForm.validation.emailInvalid"
    );
  } else if (
    trimmedEmail.length > 150
  ) {
    errors.email = t(
      "contactForm.validation.emailMax"
    );
  }

  if (!trimmedSubject) {
    errors.subject = t(
      "contactForm.validation.subjectRequired"
    );
  } else if (
    trimmedSubject.length > 150
  ) {
    errors.subject = t(
      "contactForm.validation.subjectMax"
    );
  }

  if (!trimmedMessage) {
    errors.message = t(
      "contactForm.validation.messageRequired"
    );
  } else if (
    trimmedMessage.length < 10
  ) {
    errors.message = t(
      "contactForm.validation.messageMin"
    );
  } else if (
    trimmedMessage.length > 5000
  ) {
    errors.message = t(
      "contactForm.validation.messageMax"
    );
  }

  return errors;
}

function ContactForm() {
  const { t } =
    useTranslation();

  const [
    values,
    setValues,
  ] = useState(initialValues);

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    status,
    setStatus,
  ] = useState("idle");

  function handleChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;

    setValues(
      (previousValues) => ({
        ...previousValues,
        [name]: value,
      })
    );

    if (errors[name]) {
      setErrors(
        (previousErrors) => ({
          ...previousErrors,
          [name]: "",
        })
      );
    }

    if (
      status === "error"
    ) {
      setStatus("idle");
    }
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    const validationErrors =
      validate(
        values,
        t
      );

    setErrors(
      validationErrors
    );

    if (
      Object.keys(
        validationErrors
      ).length > 0
    ) {
      return;
    }

    setStatus("sending");

    try {
      await saveContactMessage({
        name:
          values.name.trim(),
        email:
          values.email.trim(),
        subject:
          values.subject.trim(),
        message:
          values.message.trim(),
      });

      setValues(
        initialValues
      );

      setErrors({});
      setStatus("success");
    } catch (error) {
      console.error(
        "Erro ao enviar mensagem de contacto:",
        error
      );

      if (
        error.validationErrors
      ) {
        const backendErrors =
          Object.entries(
            error.validationErrors
          ).reduce(
            (
              result,
              [field, messages]
            ) => {
              result[field] =
                Array.isArray(
                  messages
                )
                  ? messages[0]
                  : String(
                      messages
                    );

              return result;
            },
            {}
          );

        setErrors(
          backendErrors
        );
      }

      setStatus("error");
    }
  }

  if (
    status === "success"
  ) {
    return (
      <div
        className="contact-form contact-form--success"
        role="status"
        aria-live="polite"
      >
        <p>
          {t(
            "contactForm.success.message"
          )}
        </p>

        <Button
          variant="secondary"
          onClick={() =>
            setStatus("idle")
          }
        >
          {t(
            "contactForm.success.sendAnother"
          )}
        </Button>
      </div>
    );
  }

  return (
    <form
      className="contact-form"
      onSubmit={
        handleSubmit
      }
      noValidate
      aria-label={t(
        "contactForm.formAria"
      )}
    >
      <div className="contact-form__field">
        <label htmlFor="contact-name">
          {t(
            "contactForm.fields.name.label"
          )}
        </label>

        <input
          id="contact-name"
          name="name"
          type="text"
          value={
            values.name
          }
          onChange={
            handleChange
          }
          placeholder={t(
            "contactForm.fields.name.placeholder"
          )}
          maxLength={100}
          autoComplete="name"
          aria-invalid={Boolean(
            errors.name
          )}
          aria-describedby={
            errors.name
              ? "contact-name-error"
              : undefined
          }
          disabled={
            status ===
            "sending"
          }
        />

        {errors.name && (
          <span
            id="contact-name-error"
            className="contact-form__error"
          >
            {errors.name}
          </span>
        )}
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-email">
          {t(
            "contactForm.fields.email.label"
          )}
        </label>

        <input
          id="contact-email"
          name="email"
          type="email"
          value={
            values.email
          }
          onChange={
            handleChange
          }
          placeholder={t(
            "contactForm.fields.email.placeholder"
          )}
          maxLength={150}
          autoComplete="email"
          aria-invalid={Boolean(
            errors.email
          )}
          aria-describedby={
            errors.email
              ? "contact-email-error"
              : undefined
          }
          disabled={
            status ===
            "sending"
          }
        />

        {errors.email && (
          <span
            id="contact-email-error"
            className="contact-form__error"
          >
            {errors.email}
          </span>
        )}
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-subject">
          {t(
            "contactForm.fields.subject.label"
          )}
        </label>

        <input
          id="contact-subject"
          name="subject"
          type="text"
          value={
            values.subject
          }
          onChange={
            handleChange
          }
          placeholder={t(
            "contactForm.fields.subject.placeholder"
          )}
          maxLength={150}
          aria-invalid={Boolean(
            errors.subject
          )}
          aria-describedby={
            errors.subject
              ? "contact-subject-error"
              : undefined
          }
          disabled={
            status ===
            "sending"
          }
        />

        {errors.subject && (
          <span
            id="contact-subject-error"
            className="contact-form__error"
          >
            {
              errors.subject
            }
          </span>
        )}
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-message">
          {t(
            "contactForm.fields.message.label"
          )}
        </label>

        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={
            values.message
          }
          onChange={
            handleChange
          }
          placeholder={t(
            "contactForm.fields.message.placeholder"
          )}
          maxLength={5000}
          aria-invalid={Boolean(
            errors.message
          )}
          aria-describedby={
            errors.message
              ? "contact-message-error"
              : undefined
          }
          disabled={
            status ===
            "sending"
          }
        />

        {errors.message && (
          <span
            id="contact-message-error"
            className="contact-form__error"
          >
            {
              errors.message
            }
          </span>
        )}
      </div>

      {status ===
        "error" && (
        <p
          className="contact-form__error contact-form__error--general"
          role="alert"
        >
          {t(
            "contactForm.error.general"
          )}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={
          status ===
          "sending"
        }
      >
        {status ===
        "sending"
          ? t(
              "contactForm.actions.sending"
            )
          : t(
              "contactForm.actions.submit"
            )}
      </Button>
    </form>
  );
}

export default ContactForm;