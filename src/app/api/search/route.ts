import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const PLACEHOLDER_IMAGE = "/icons/icon.svg";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  const limit = Number(searchParams.get("limit") ?? "6");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ results: [] });
  }

  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug,description,price,product_images(image_url,sort_order)")
    .eq("status", "active")
    .or(`name.ilike.%${query}%,slug.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(Math.min(limit * 3, 30));

  if (error || !data) {
    return NextResponse.json({ results: [] });
  }

  const normalized = query.toLowerCase();

  const scored = data.map((row) => {
    const name = row?.name ?? "";
    const slug = row?.slug ?? "";
    const description = row?.description ?? "";
    const hayName = name.toLowerCase();
    const haySlug = slug.toLowerCase();
    const hayDescription = description.toLowerCase();
    let score = 0;
    if (hayName.includes(normalized)) score += 3;
    if (haySlug.includes(normalized)) score += 2;
    if (hayDescription.includes(normalized)) score += 1;
    const images =
      row?.product_images?.slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) ??
      [];
    const image = images[0]?.image_url ?? PLACEHOLDER_IMAGE;
    return {
      score,
      id: row.id,
      name,
      slug,
      image,
      price: Number(row.price ?? 0),
    };
  });

  const results = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score: _score, ...item }) => item);

  return NextResponse.json({ results });
}
