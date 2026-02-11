export type FavoriteItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number | null;
  slug: string;
  href: string;
};

const STORAGE_KEY = "amader_favorites";

export const readFavorites = (): FavoriteItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FavoriteItem[];
  } catch {
    return [];
  }
};

export const writeFavorites = (items: FavoriteItem[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("favorites:updated"));
};

export const isFavorite = (id: string) =>
  readFavorites().some((item) => item.id === id);

export const toggleFavorite = (item: FavoriteItem) => {
  const items = readFavorites();
  const exists = items.find((entry) => entry.id === item.id);
  if (exists) {
    writeFavorites(items.filter((entry) => entry.id !== item.id));
  } else {
    writeFavorites([item, ...items]);
  }
};

export const removeFavorite = (id: string) => {
  const items = readFavorites();
  writeFavorites(items.filter((entry) => entry.id !== id));
};

export const clearFavorites = () => writeFavorites([]);
