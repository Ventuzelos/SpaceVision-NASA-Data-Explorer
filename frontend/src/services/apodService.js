import api from "./api";

export async function getApod() {
  const { data } = await api.get("/apod");
  return data;
}