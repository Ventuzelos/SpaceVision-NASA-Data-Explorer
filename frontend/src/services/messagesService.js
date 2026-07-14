const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

export async function saveContactMessage(contactData) {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.message || "Não foi possível enviar a mensagem."
    );

    error.status = response.status;
    error.validationErrors = data.errors || {};

    throw error;
  }

  return data;
}