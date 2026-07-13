import backendApi from "./backendApi";

export const FAVORITES_UPDATED_EVENT = "favoritesUpdated";

let favoritesCache = null;
let favoritesRequest = null;

function notifyFavoritesUpdated() {
  window.dispatchEvent(
    new Event(FAVORITES_UPDATED_EVENT)
  );
}

function normalizeFavorites(responseData) {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (Array.isArray(responseData?.data)) {
    return responseData.data;
  }

  return [];
}

async function fetchFavorites() {
  /*
   * Se já existir um pedido em curso, todos os componentes
   * aguardam pelo mesmo pedido em vez de criar novos.
   */
  if (favoritesRequest) {
    return favoritesRequest;
  }

  favoritesRequest = backendApi
    .get("/favorites")
    .then((response) => {
      favoritesCache = normalizeFavorites(
        response.data
      );

      return favoritesCache;
    })
    .finally(() => {
      favoritesRequest = null;
    });

  return favoritesRequest;
}

export async function getFavorites(
  source = null,
  forceRefresh = false
) {
  if (forceRefresh || favoritesCache === null) {
    await fetchFavorites();
  }

  const favorites = favoritesCache || [];

  if (!source) {
    return favorites;
  }

  return favorites.filter((favorite) => {
    const favoriteSource =
      favorite.nasa_type ||
      favorite.source ||
      favorite.type;

    return favoriteSource === source;
  });
}

export async function addFavorite(favorite) {
  const payload = {
    nasa_type:
      favorite.nasa_type ||
      favorite.source ||
      favorite.type,

    nasa_id:
      favorite.nasa_id ||
      favorite.id,

    title:
      favorite.title ||
      "Conteúdo NASA",

    image_url:
      favorite.image_url ||
      favorite.imageUrl ||
      null,

    data:
      favorite.data || {
        date: favorite.date || null,
        description:
          favorite.description || null,
        hd_url: favorite.hdUrl || null,
      },
  };

  const response = await backendApi.post(
    "/favorites",
    payload
  );

  const createdFavorite =
    response.data?.data || response.data;

  /*
   * Atualizamos diretamente a cache sem voltar
   * a pedir todos os favoritos ao backend.
   */
  if (favoritesCache !== null) {
    favoritesCache = [
      ...favoritesCache.filter(
        (item) =>
          String(item.id) !==
          String(createdFavorite.id)
      ),
      createdFavorite,
    ];
  }

  notifyFavoritesUpdated();

  return createdFavorite;
}

export async function removeFavorite(id) {
  const response = await backendApi.delete(
    `/favorites/${id}`
  );

  if (favoritesCache !== null) {
    favoritesCache = favoritesCache.filter(
      (favorite) =>
        String(favorite.id) !== String(id)
    );
  }

  notifyFavoritesUpdated();

  return response.data;
}

export async function isFavorite(
  id,
  source = null
) {
  const favorites = await getFavorites(source);

  return favorites.some((favorite) => {
    const favoriteId =
      favorite.nasa_id ||
      favorite.id;

    return String(favoriteId) === String(id);
  });
}

export async function toggleFavorite(favorite) {
  const source =
    favorite.source ||
    favorite.type ||
    favorite.nasa_type;

  const favoriteId =
    favorite.nasa_id ||
    favorite.id;

  const favorites = await getFavorites(source);

  const existingFavorite = favorites.find(
    (item) => {
      const itemId =
        item.nasa_id ||
        item.id;

      return (
        String(itemId) ===
        String(favoriteId)
      );
    }
  );

  if (existingFavorite) {
    await removeFavorite(existingFavorite.id);

    return {
      isFavorite: false,
      favorite: null,
    };
  }

  const createdFavorite =
    await addFavorite(favorite);

  return {
    isFavorite: true,
    favorite: createdFavorite,
  };
}

export function clearFavoritesCache() {
  favoritesCache = null;
  favoritesRequest = null;
}