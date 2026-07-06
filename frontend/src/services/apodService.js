import { BASE_URL, NASA_API_KEY } from "./api";

export async function getApod() {
  const response = await fetch(
    `${BASE_URL}/planetary/apod?api_key=${NASA_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Erro ao carregar a imagem do dia.");
  }

  return response.json();
}