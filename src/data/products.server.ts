import {
  Product,
  buildCategories,
  getSeedProductBySlug,
  normalizeSlug,
  seedProducts,
} from "@/data/products";
import { createServerSupabase } from "@/lib/supabase/server";

const PLACEHOLDER_IMAGE = "/icons/icon.svg";

const mapRowToProduct = (row: any): Product => {
  const images =
    row?.images?.map((image: { image_url: string }) => image.image_url).filter(Boolean) ??
    row?.product_images?.map((image: { image_url: string }) => image.image_url).filter(Boolean) ??
    [];

  const image = images[0] ?? row?.image_url ?? PLACEHOLDER_IMAGE;
  const slug = row?.slug
    ? normalizeSlug(row.slug)
    : row?.id
      ? String(row.id)
      : normalizeSlug(row?.name ?? "");
  const description = row?.description ?? "";
  const highlights =
    Array.isArray(row?.highlights) && row.highlights.length > 0
      ? row.highlights
      : description
      ? [description.slice(0, 80)]
      : [];

  return {
    id: row?.id ?? undefined,
    slug,
    name: row?.name ?? "Product",
    localName: row?.local_name ?? row?.name ?? "",
    size: row?.size ?? "",
    price: Number(row?.price ?? 0),
    salePrice: row?.sale_price ? Number(row.sale_price) : undefined,
    gallery: images.length ? images : [image],
    rating: Number(row?.rating ?? 4.8),
    reviews: Number(row?.reviews ?? 0),
    category: row?.category?.name ?? row?.category_name ?? "All Product",
    origin: row?.origin ?? "",
    shortDescription: row?.short_description ?? description ?? "",
    details: row?.details ?? description ?? "",
    highlights,
    image,
    href: `/products/${slug}`,
  };
};

export const getProducts = async (): Promise<Product[]> => {
  const supabase = createServerSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(name), images:product_images(image_url)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapRowToProduct);
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const normalized = normalizeSlug(slug);
  const supabase = createServerSupabase();
  if (!supabase) {
    return getSeedProductBySlug(normalized) ?? null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(name), images:product_images(image_url)")
    .eq("slug", normalized)
    .maybeSingle();

  if (!error && data) {
    return mapRowToProduct(data);
  }

  const looksLikeUuid = /^[0-9a-fA-F-]{36}$/.test(normalized);
  if (!looksLikeUuid) {
    return null;
  }

  const { data: byId, error: idError } = await supabase
    .from("products")
    .select("*, category:categories(name), images:product_images(image_url)")
    .eq("id", normalized)
    .maybeSingle();

  if (idError || !byId) {
    return null;
  }

  return mapRowToProduct(byId);
};

export const getCategories = async (): Promise<string[]> => {
  const supabase = createServerSupabase();
  if (!supabase) return buildCategories(seedProducts);

  const { data, error } = await supabase
    .from("categories")
    .select("name")
    .order("name", { ascending: true });

  if (error || !data || data.length === 0) {
    const products = await getProducts();
    return buildCategories(products);
  }

  return ["All Product", ...data.map((item) => item.name)];
};
