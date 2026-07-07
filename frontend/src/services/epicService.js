// Servico EPIC para obter metadados e construir URLs de imagens

import api from './api';

export async function fetchEpicLatest() {
  const res = await api.get('/EPIC/api/natural');
  return res.data;
}

export async function fetchEpicByDate(date) {
  const res = await api.get(`/EPIC/api/natural/date/${date}`);
  return res.data;
}

export function buildImageUrl(photo, date) {
  const d = date || (photo?.date && photo.date.split(' ')[0]);
  if (!d) return '';
  const [y, m, day] = d.split('-');
  // Imagem em alta resolucao (PNG)
  return `https://epic.gsfc.nasa.gov/archive/natural/${y}/${m}/${day}/png/${photo.image}.png`;
}

export function buildThumbUrl(photo, date) {
  const d = date || (photo?.date && photo.date.split(' ')[0]);
  if (!d) return '';
  const [y, m, day] = d.split('-');
  // Versao JPEG (menor) usada como thumb
  return `https://epic.gsfc.nasa.gov/archive/natural/${y}/${m}/${day}/jpg/${photo.image}.jpg`;
}

const epicService = {
  fetchEpicLatest,
  fetchEpicByDate,
  buildImageUrl,
  buildThumbUrl,
};

export default epicService;
