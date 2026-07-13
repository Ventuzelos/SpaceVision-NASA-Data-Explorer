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
      favorite.type ||
      "";

    return (
      String(favoriteSource).toLowerCase() ===
      String(source).toLowerCase()
    );
  });
}

export async function addFavorite(favorite) {
  const nasaType = String(
    favorite.nasa_type ||
      favorite.source ||
      favorite.type ||
      ""
  ).toLowerCase();

  const payload = {
    nasa_type: nasaType,

    nasa_id: String(
      favorite.nasa_id ||
        favorite.id ||
        ""
    ),

    title:
      favorite.title ||
      favorite.data?.title ||
      favorite.data?.name ||
      "Conteúdo NASA",

    image_url:
      favorite.image_url ||
      favorite.imageUrl ||
      favorite.data?.image_url ||
      favorite.data?.imageUrl ||
      favorite.data?.hdurl ||
      favorite.data?.url ||
      null,

    data:
      favorite.data &&
      typeof favorite.data === "object"
        ? favorite.data
        : {
            ...favorite,
            nasa_type: nasaType,
          },
  };

  console.log(
    "Favorito enviado ao backend:",
    payload
  );

  const response = await backendApi.post(
    "/favorites",
    payload
  );

  const createdFavorite = response.data;

  console.log(
    "Favorito completo devolvido pelo backend:",
    createdFavorite
  );

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
  const source = String(
    favorite.nasa_type ||
      favorite.source ||
      favorite.type ||
      ""
  ).toLowerCase();

  const favoriteId = String(
    favorite.nasa_id ||
      favorite.id ||
      ""
  );

  const favorites = await getFavorites(
    source,
    true
  );

  const existingFavorite = favorites.find(
    (item) => {
      const itemId = String(
        item.nasa_id ||
          item.id
      );

      return itemId === favoriteId;
    }
  );

  if (existingFavorite) {
    await removeFavorite(
      existingFavorite.id
    );

    return {
      isFavorite: false,
      favorite: null,
    };
  }

  const createdFavorite = await addFavorite({
    ...favorite,
    nasa_type: source,
    nasa_id: favoriteId,

    data:
      favorite.data &&
      typeof favorite.data === "object"
        ? favorite.data
        : {
            ...favorite,
          },
  });

  return {
    isFavorite: true,
    favorite: createdFavorite,
  };
}

export function clearFavoritesCache() {
  favoritesCache = null;
  favoritesRequest = null;
}