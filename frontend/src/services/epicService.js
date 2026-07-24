// Serviço EPIC para obter metadados e construir URLs de imagens

import nasaApi from "./nasaApi";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value) {
  if (!value || !DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  const parsedDate = new Date(
    year,
    month - 1,
    day
  );

  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  );
}

function getPhotoDate(photo, date) {
  const photoDate =
    date ||
    photo?.date?.split(" ")[0] ||
    "";

  return isValidDate(photoDate)
    ? photoDate
    : "";
}

function buildEpicArchiveUrl(
  photo,
  date,
  folder,
  extension
) {
  const photoDate = getPhotoDate(
    photo,
    date
  );

  const imageName =
    typeof photo?.image === "string"
      ? photo.image.trim()
      : "";

  if (!photoDate || !imageName) {
    return "";
  }

  const [year, month, day] =
    photoDate.split("-");

  const safeImageName =
    encodeURIComponent(imageName);

  return (
    "https://epic.gsfc.nasa.gov/archive/natural/" +
    `${year}/${month}/${day}/${folder}/${safeImageName}.${extension}`
  );
}

export async function fetchEpicLatest() {
  const { data } = await nasaApi.get(
    "/epic"
  );

  return Array.isArray(data)
    ? data
    : [];
}

export async function fetchEpicByDate(date) {
  if (!date) {
    throw new Error(
      "É necessário indicar uma data."
    );
  }

  if (!isValidDate(date)) {
    throw new Error(
      "A data deve estar no formato AAAA-MM-DD."
    );
  }

  const { data } = await nasaApi.get(
    `/epic/${encodeURIComponent(date)}`
  );

  return Array.isArray(data)
    ? data
    : [];
}

export function buildImageUrl(photo, date) {
  return buildEpicArchiveUrl(
    photo,
    date,
    "png",
    "png"
  );
}

export function buildThumbUrl(photo, date) {
  return buildEpicArchiveUrl(
    photo,
    date,
    "thumbs",
    "jpg"
  );
}

const epicService = {
  fetchEpicLatest,
  fetchEpicByDate,
  buildImageUrl,
  buildThumbUrl,
};

export default epicService;