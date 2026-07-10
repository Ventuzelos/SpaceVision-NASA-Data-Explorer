// Serviço EPIC para obter metadados e construir URLs de imagens

import api from "./api";

export async function fetchEpicLatest() {
  const response = await api.get("/epic");
  return response.data;
}

export async function fetchEpicByDate(date) {
  const response = await api.get(`/epic/${date}`);
  return response.data;
}

export function buildImageUrl(photo, date) {
  const resolvedDate = date || photo?.date?.split(" ")[0];

  if (!resolvedDate || !photo?.image) {
    return "";
  }

  const [year, month, day] = resolvedDate.split("-");

  return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${photo.image}.png`;
}

export function buildThumbUrl(photo, date) {
  const resolvedDate = date || photo?.date?.split(" ")[0];

  if (!resolvedDate || !photo?.image) {
    return "";
  }

  const [year, month, day] = resolvedDate.split("-");

  return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/thumbs/${photo.image}.jpg`;
}

const epicService = {
  fetchEpicLatest,
  fetchEpicByDate,
  buildImageUrl,
  buildThumbUrl,
};

export default epicService;