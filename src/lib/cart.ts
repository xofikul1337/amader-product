export type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number | null;
  slug: string;
  href: string;
  quantity: number;
};

const STORAGE_KEY = "amader_cart";

export const readCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
};

export const writeCart = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart:updated"));
};

export const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
  if (quantity <= 0) return;
  const items = readCart();
  const existing = items.find((entry) => entry.id === item.id);
  if (existing) {
    writeCart(
      items.map((entry) =>
        entry.id === item.id
          ? { ...entry, quantity: entry.quantity + quantity }
          : entry,
      ),
    );
  } else {
    writeCart([{ ...item, quantity }, ...items]);
  }
};

export const updateQuantity = (id: string, quantity: number) => {
  const items = readCart();
  if (quantity <= 0) {
    writeCart(items.filter((entry) => entry.id !== id));
    return;
  }
  writeCart(items.map((entry) => (entry.id === id ? { ...entry, quantity } : entry)));
};

export const removeFromCart = (id: string) => {
  const items = readCart();
  writeCart(items.filter((entry) => entry.id !== id));
};

export const clearCart = () => writeCart([]);
