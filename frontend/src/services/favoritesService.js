const FAVORITES_KEY = "spacevision_favorites";

export function getFavorites() {
  const favorites = localStorage.getItem(FAVORITES_KEY);

  return favorites ? JSON.parse(favorites) : [];
}

export function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

  window.dispatchEvent(new Event("favoritesUpdated"));
}

export function isFavorite(id) {
  const favorites = getFavorites();

  return favorites.some((favorite) => favorite.id === id);
}

export function addFavorite(favorite) {
  const favorites = getFavorites();

  if (isFavorite(favorite.id)) {
    return favorites;
  }

  const updatedFavorites = [...favorites, favorite];

  saveFavorites(updatedFavorites);

  return updatedFavorites;
}

export function removeFavorite(id) {
  const favorites = getFavorites();

  const updatedFavorites = favorites.filter((favorite) => favorite.id !== id);

  saveFavorites(updatedFavorites);

  return updatedFavorites;
}