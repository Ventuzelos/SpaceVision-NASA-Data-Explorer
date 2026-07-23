import backendApi from "./backendApi";

const FAVORITE_CATEGORIES = [
  { value: "apod", label: "APOD" },
  { value: "donki", label: "DONKI" },
  { value: "epic", label: "EPIC" },
  { value: "neows", label: "NeoWS" },
];

export async function getUsersStats() {
  try {
    const response = await backendApi.get(
      "/admin/users/stats"
    );

    return {
      total: response.data?.total ?? null,
      newLastMonth:
        response.data?.new_last_month ?? 0,
    };
  } catch (error) {
    console.error(
      "Não foi possível obter as estatísticas de utilizadores:",
      error
    );

    return {
      total: null,
      newLastMonth: 0,
    };
  }
}

export async function getUsersCount() {
  const { total } = await getUsersStats();

  return total;
}

export async function getFavoritesStats() {
  const response = await backendApi.get(
    "/admin/favorites/stats"
  );

  const data = response.data ?? {};
  const byCategoryData = data.by_category ?? {};

  const byCategory = FAVORITE_CATEGORIES.map(
    (category) => ({
      ...category,
      count: Number(
        byCategoryData[category.value] ?? 0
      ),
    })
  );

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

export async function getMessagesStats({
  page = 1,
  search = "",
  status = "all",
  perPage = 10,
} = {}) {
  const response = await backendApi.get(
    "/admin/messages",
    {
      params: {
        page,
        search: search.trim() || undefined,
        status,
        per_page: perPage,
      },
    }
  );

  return {
    total: Number(response.data?.total ?? 0),
    unread: Number(response.data?.unread ?? 0),
    filteredTotal: Number(
      response.data?.filtered_total ?? 0
    ),
    messages: Array.isArray(
      response.data?.messages
    )
      ? response.data.messages
      : [],
    pagination: {
      currentPage: Number(
        response.data?.pagination
          ?.current_page ?? 1
      ),
      lastPage: Number(
        response.data?.pagination?.last_page ?? 1
      ),
      perPage: Number(
        response.data?.pagination?.per_page ??
          perPage
      ),
      from:
        response.data?.pagination?.from ?? null,
      to: response.data?.pagination?.to ?? null,
      total: Number(
        response.data?.pagination?.total ?? 0
      ),
    },
    filters: {
      search:
        response.data?.filters?.search ?? "",
      status:
        response.data?.filters?.status ?? "all",
    },
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