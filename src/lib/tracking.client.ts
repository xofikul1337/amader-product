"use client";

type TrackingItemInput = {
  id?: string;
  slug?: string;
  name: string;
  price: number;
  salePrice?: number | null;
  quantity?: number;
  category?: string | null;
  variant?: string | null;
};

type TrackOptions = {
  dedupeKey?: string;
};

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    __amaderTrackedEvents?: Record<string, boolean>;
  }
}

const DEDUPE_STORAGE_KEY = "amader_tracked_events_v1";

const readStoredKeys = (): Record<string, boolean> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(DEDUPE_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
};

const writeStoredKeys = (value: Record<string, boolean>) => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(DEDUPE_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore storage write failure
  }
};

const isDuplicate = (key?: string) => {
  if (!key || typeof window === "undefined") return false;
  const inMemory = window.__amaderTrackedEvents ?? {};
  if (inMemory[key]) return true;
  const stored = readStoredKeys();
  if (stored[key]) {
    window.__amaderTrackedEvents = { ...inMemory, [key]: true };
    return true;
  }
  const next = { ...stored, [key]: true };
  window.__amaderTrackedEvents = { ...inMemory, [key]: true };
  writeStoredKeys(next);
  return false;
};

const eventId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const push = (payload: Record<string, unknown>) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
};

const normalizeItem = (item: TrackingItemInput) => {
  const unitPrice = Number(item.salePrice ?? item.price ?? 0);
  return {
    item_id: item.slug || item.id || item.name,
    item_name: item.name,
    item_brand: "Amader Product",
    item_category: item.category || undefined,
    item_variant: item.variant || undefined,
    price: unitPrice,
    quantity: Math.max(1, Number(item.quantity ?? 1)),
  };
};

const totalValue = (items: TrackingItemInput[]) =>
  items.reduce((sum, item) => {
    const unitPrice = Number(item.salePrice ?? item.price ?? 0);
    const qty = Math.max(1, Number(item.quantity ?? 1));
    return sum + unitPrice * qty;
  }, 0);

export const trackEvent = (
  name: string,
  payload: Record<string, unknown> = {},
  options: TrackOptions = {},
) => {
  if (isDuplicate(options.dedupeKey)) return;
  push({
    event: name,
    event_id: eventId(),
    event_source: "web",
    ...payload,
  });
};

export const trackPageView = (pathname: string, search = "") => {
  const pagePath = search ? `${pathname}?${search}` : pathname;
  const location =
    typeof window !== "undefined"
      ? `${window.location.origin}${pagePath}`
      : pagePath;
  push({
    event: "page_view",
    page_path: pagePath,
    page_location: location,
    page_title: typeof document !== "undefined" ? document.title : undefined,
  });
};

export const trackSearch = (query: string, resultCount: number) => {
  trackEvent("search", {
    search_term: query,
    result_count: resultCount,
  });
};

export const trackSelectItem = (item: TrackingItemInput, listName = "products") => {
  trackEvent("select_item", {
    item_list_name: listName,
    ecommerce: {
      items: [normalizeItem(item)],
    },
  });
};

export const trackViewItem = (item: TrackingItemInput) => {
  const normalized = normalizeItem(item);
  trackEvent(
    "view_item",
    {
      currency: "BDT",
      value: Number(normalized.price) * Number(normalized.quantity),
      ecommerce: { items: [normalized] },
    },
    { dedupeKey: `view_item:${normalized.item_id}` },
  );
};

export const trackAddToCart = (item: TrackingItemInput, quantity = 1) => {
  const normalized = normalizeItem({ ...item, quantity });
  trackEvent("add_to_cart", {
    currency: "BDT",
    value: Number(normalized.price) * Number(normalized.quantity),
    ecommerce: { items: [normalized] },
  });
};

export const trackBeginCheckout = (items: TrackingItemInput[], shippingCost = 0) => {
  const normalizedItems = items.map(normalizeItem);
  const value = totalValue(items) + shippingCost;
  const hash = normalizedItems
    .map((item) => `${item.item_id}:${item.quantity}`)
    .join("|");
  trackEvent(
    "begin_checkout",
    {
      currency: "BDT",
      value,
      ecommerce: { items: normalizedItems },
    },
    { dedupeKey: `begin_checkout:${hash}` },
  );
};

export const trackAddShippingInfo = (items: TrackingItemInput[], shippingTier: string) => {
  trackEvent("add_shipping_info", {
    currency: "BDT",
    shipping_tier: shippingTier,
    ecommerce: {
      items: items.map(normalizeItem),
    },
  });
};

export const trackAddPaymentInfo = (items: TrackingItemInput[], paymentType: string) => {
  trackEvent("add_payment_info", {
    currency: "BDT",
    payment_type: paymentType,
    ecommerce: {
      items: items.map(normalizeItem),
    },
  });
};

export const trackPurchase = (
  orderId: string,
  items: TrackingItemInput[],
  shippingCost = 0,
) => {
  const normalizedItems = items.map(normalizeItem);
  const value = totalValue(items) + shippingCost;
  trackEvent(
    "purchase",
    {
      transaction_id: orderId,
      currency: "BDT",
      value,
      shipping: shippingCost,
      ecommerce: {
        transaction_id: orderId,
        currency: "BDT",
        value,
        shipping: shippingCost,
        items: normalizedItems,
      },
    },
    { dedupeKey: `purchase:${orderId}` },
  );
};
