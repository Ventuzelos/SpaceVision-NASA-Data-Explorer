import api from "./api";

export async function getApod() {
 const { data } = await api.get("/planetary/apod");
return data;

  if (!response.ok) {
    throw new Error("Erro ao carregar a imagem do dia.");
  }

  return response.json();
}