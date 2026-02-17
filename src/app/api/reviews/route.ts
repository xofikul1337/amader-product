import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

const HASH_SALT = process.env.REVIEW_HASH_SALT ?? "";

const hashValue = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

export async function POST(request: Request) {
  try {
    if (!HASH_SALT) {
      return NextResponse.json(
        { error: "Missing REVIEW_HASH_SALT env var." },
        { status: 500 },
      );
    }

    const body = await request.json();
    const productId = String(body?.productId ?? "");
    const rating = Number(body?.rating ?? 0);
    const title = body?.title ?? null;
    const reviewBody = String(body?.body ?? "");
    const guestName = body?.guestName ?? null;

    if (!productId || !reviewBody) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
    const ip = forwardedFor.split(",")[0].trim() || "0.0.0.0";
    const agent = request.headers.get("user-agent") ?? "unknown";
    const reviewerHash = hashValue(`${HASH_SALT}:${ip}:${agent}`);

    const { data, error } = await supabaseAdmin.rpc("add_review", {
      p_product_id: productId,
      p_rating: rating,
      p_body: reviewBody,
      p_reviewer_hash: reviewerHash,
      p_title: title,
      p_guest_name: guestName,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ id: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error." },
      { status: 500 },
    );
  }
}
