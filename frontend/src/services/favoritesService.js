import backendApi from "./backendApi";

export const FAVORITES_UPDATED_EVENT = "favoritesUpdated";

function notifyFavoritesUpdated() {
  window.dispatchEvent(new Event(FAVORITES_UPDATED_EVENT));
}

export async function getFavorites(source = null) {
  const response = await backendApi.get("/favorites");

  const favorites = Array.isArray(response.data)
    ? response.data
    : [];

  if (!source) {
    return favorites;
  }

  return favorites.filter(
    (favorite) =>
      favorite.nasa_type === source ||
      favorite.source === source
  );
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
        description: favorite.description || null,
        hd_url: favorite.hdUrl || null,
      },
  };

  const response = await backendApi.post("/favorites", payload);

  notifyFavoritesUpdated();

  return response.data;
}

export async function removeFavorite(id) {
  const response = await backendApi.delete(`/favorites/${id}`);

  notifyFavoritesUpdated();

  return response.data;
}

export async function isFavorite(id, source = null) {
  const favorites = await getFavorites(source);

  return favorites.some((favorite) => {
    const favoriteId =
      favorite.nasa_id ||
      favorite.id;

    return String(favoriteId) === String(id);
  });
}

export async function toggleFavorite(favorite) {
  const favorites = await getFavorites(
    favorite.source || favorite.type || favorite.nasa_type
  );

  const existingFavorite = favorites.find((item) => {
    const itemId = item.nasa_id || item.id;
    return String(itemId) === String(favorite.id);
  });

  if (existingFavorite) {
    await removeFavorite(existingFavorite.id);
    return {
      isFavorite: false,
      favorite: null,
    };
  }

  const createdFavorite = await addFavorite(favorite);

  return {
    isFavorite: true,
    favorite: createdFavorite,
  };
}