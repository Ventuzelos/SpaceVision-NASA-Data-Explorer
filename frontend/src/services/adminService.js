import backendApi from "./backendApi";


const FAVORITE_CATEGORIES = [
  { value: "apod", label: "APOD" },
  { value: "donki", label: "DONKI" },
  { value: "epic", label: "EPIC" },
  { value: "neows", label: "NeoWS" },
];

export async function getUsersStats() {
  try {
    const response = await backendApi.get("/admin/users/stats");

    return {
      total: response.data?.total ?? null,
      newLastMonth: response.data?.new_last_month ?? 0,
    };
  } catch (error) {
    console.error(
      "Não foi possível obter as estatísticas de utilizadores:",
      error
    );

    return { total: null, newLastMonth: 0 };
  }
}

/*export async function getUsersCount() {
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
}*/

export async function getUsersCount() {
  const { total } = await getUsersStats();
  return total;
}

/*function getFavoriteType(favorite) {
  return String(
    favorite.nasa_type ||
      favorite.type ||
      favorite.data?.nasa_type ||
      favorite.data?.type ||
      ""
  ).toLowerCase();
}*/

/*
 * Estatísticas de favoritos agrupadas por categoria da NASA.
 * Usa o serviço de favoritos já ligado ao backend real.
 */
export async function getFavoritesStats() {
  const response = await backendApi.get("/admin/favorites/stats");
  const data = response.data ?? {};
  const byCategoryData = data.by_category ?? {};

  const byCategory = FAVORITE_CATEGORIES.map((category) => ({
    ...category,
    count: Number(byCategoryData[category.value] ?? 0),
  }));

  const topSaved = Array.isArray(data.top_saved)
    ? data.top_saved.map((item) => ({
        nasaType: item.nasa_type,
        nasaId: item.nasa_id,
        title: item.title || "Conteúdo NASA",
        saves: Number(item.saves ?? 0),
      }))
    : [];

  return {
    total: Number(data.total ?? 0),
    byCategory,
    topSaved,
  };
}


/*
 * Mensagens de contacto enviadas pelos utilizadores.
 * Por agora vivem em localStorage (ver messagesService.js);
 * quando existir endpoint de contacto no backend, basta trocar
 * a implementação aqui.
 */
export async function getMessagesStats() {
  const response = await backendApi.get("/admin/messages");

  return {
    total: response.data?.total ?? 0,
    unread: response.data?.unread ?? 0,
    messages: Array.isArray(response.data?.messages)
      ? response.data.messages
      : [],
  };
}

export async function markMessageAsRead(messageId) {
  const response = await backendApi.patch(
    `/admin/messages/${messageId}/read`
  );

  return response.data;
}

export async function deleteMessage(messageId) {
  const response = await backendApi.delete(
    `/admin/messages/${messageId}`
  );

  return response.data;
}
