import backendApi from "./backendApi";
import { getFavorites } from "./favoritesService";
import {
  getContactMessages,
  getContactMessagesCount,
} from "./messagesService";


export async function getUsersCount() {
  try {
    const response = await backendApi.get("/admin/users/count");

    return (
      response.data?.count ??
      response.data?.total ??
      null
    );
  } catch (error) {
    console.error(
      "Não foi possível obter a contagem de utilizadores:",
      error
    );

    return null;
  }
}

const FAVORITE_CATEGORIES = [
  { value: "apod", label: "APOD" },
  { value: "donki", label: "DONKI" },
  { value: "epic", label: "EPIC" },
  { value: "neows", label: "NeoWS" },
];

function getFavoriteType(favorite) {
  return String(
    favorite.nasa_type ||
      favorite.type ||
      favorite.data?.nasa_type ||
      favorite.data?.type ||
      ""
  ).toLowerCase();
}

/*
 * Estatísticas de favoritos agrupadas por categoria da NASA.
 * Usa o serviço de favoritos já ligado ao backend real.
 */
export async function getFavoritesStats() {
  const favorites = await getFavorites();
  const list = Array.isArray(favorites) ? favorites : [];

  const byCategory = FAVORITE_CATEGORIES.map((category) => ({
    ...category,
    count: list.filter(
      (favorite) => getFavoriteType(favorite) === category.value
    ).length,
  }));

  return {
    total: list.length,
    byCategory,
  };
}

/*
 * Mensagens de contacto enviadas pelos utilizadores.
 * Por agora vivem em localStorage (ver messagesService.js);
 * quando existir endpoint de contacto no backend, basta trocar
 * a implementação aqui.
 */
export function getMessagesStats() {
  return {
    total: getContactMessagesCount(),
    messages: getContactMessages(),
  };
}
