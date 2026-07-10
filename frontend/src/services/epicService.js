// Serviço EPIC para obter metadados e construir URLs de imagens

import nasaApi from "./nasaApi";

export async function fetchEpicLatest() {
  const { data } = await nasaApi.get("/epic");

  return data;
}

export async function fetchEpicByDate(date) {
  if (!date) {
    throw new Error("É necessário indicar uma data.");
  }

  const { data } = await nasaApi.get(`/epic/${date}`);

  return data;
}

export function buildImageUrl(photo, date) {
  const photoDate = date || photo?.date?.split(" ")[0];

  if (!photoDate || !photo?.image) {
    return "";
  }

  const [year, month, day] = photoDate.split("-");

  return (
    "https://epic.gsfc.nasa.gov/archive/natural/" +
    `${year}/${month}/${day}/png/${photo.image}.png`
  );
}

export function buildThumbUrl(photo, date) {
  const photoDate = date || photo?.date?.split(" ")[0];

  if (!photoDate || !photo?.image) {
    return "";
  }

  const [year, month, day] = photoDate.split("-");

  return (
    "https://epic.gsfc.nasa.gov/archive/natural/" +
    `${year}/${month}/${day}/thumbs/${photo.image}.jpg`
  );
}

const epicService = {
  fetchEpicLatest,
  fetchEpicByDate,
  buildImageUrl,
  buildThumbUrl,
};

export default epicService;