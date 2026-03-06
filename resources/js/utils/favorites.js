export const getFavorites = () => {
    const favs = localStorage.getItem("favorites");
    return favs ? JSON.parse(favs) : [];
};

export const saveFavorites = (favorites) => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
};

export const toggleFavorite = (id) => {
    let favorites = getFavorites();

    if (favorites.includes(id)) {
        favorites = favorites.filter(fav => fav !== id);
    } else {
        favorites.push(id);
    }

    saveFavorites(favorites);
    return favorites;
};
