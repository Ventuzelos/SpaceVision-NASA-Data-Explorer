const FAVORITES_KEY = "spacevision_favorites";

export function getFavorites(source = null) {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  const parsedFavorites = favorites ? JSON.parse(favorites) : [];

  if (!source) {
    return parsedFavorites;
  }

  return parsedFavorites.filter((favorite) => favorite.source === source);
}

export function addFavorite(favorite) {
  const favorites = getFavorites();

  const exists = favorites.some(
    (item) => item.id === favorite.id && item.source === favorite.source
  );

  if (!exists) {
    favorites.push(favorite);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(id, source = null) {
  const favorites = getFavorites();

  const updatedFavorites = favorites.filter((favorite) => {
    if (source) {
      return !(favorite.id === id && favorite.source === source);
    }

    return favorite.id !== id;
  });

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
}

export function toggleFavorite(favorite) {
  const favorites = getFavorites();

  const exists = favorites.some(
    (item) => item.id === favorite.id && item.source === favorite.source
  );

  if (exists) {
    removeFavorite(favorite.id, favorite.source);
  } else {
    addFavorite(favorite);
  }
}

export function isFavorite(id, source = null) {
  const favorites = getFavorites(source);

  return favorites.some((favorite) => favorite.id === id);
}