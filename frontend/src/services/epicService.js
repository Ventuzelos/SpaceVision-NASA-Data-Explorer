// Este serviço é responsável por interagir com a API do backend para obter dados do EPIC (Earth Polychromatic Imaging Camera) da NASA.

// frontend/src/services/epicService.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const EPIC_IMG_BASE = 'https://epic.gsfc.nasa.gov/archive/natural';

export async function fetchEpicLatest() {
  const res = await fetch(`${API_BASE}/epic/latest`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

export async function fetchEpicByDate(date) {
  const res = await fetch(`${API_BASE}/epic/date/${date}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// URLs das imagens são públicas, não precisam de passar pelo backend
export function buildEpicUrls(photo, date) {
  const [y, m, d] = date.split('-');
  const name = photo.image;
  return {
    thumb: `${EPIC_IMG_BASE}/${y}/${m}/${d}/thumbs/${name}.jpg`,
    full: `${EPIC_IMG_BASE}/${y}/${m}/${d}/png/${name}.png`,
  };
}

//notas
// Este serviço fornece funções para buscar as imagens mais recentes do EPIC, buscar imagens por data específica e construir URLs para acessar as imagens em miniatura e em tamanho completo. As URLs das imagens são públicas e não requerem autenticação.
// O serviço utiliza a variável de ambiente VITE_API_URL para determinar a URL base da API, permitindo flexibilidade entre ambientes de desenvolvimento e produção.
// O serviço também lida com erros retornados pela API, lançando exceções quando necessário para que o componente chamador possa tratar os erros de forma adequada.
