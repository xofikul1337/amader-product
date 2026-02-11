import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type CheckoutItem = {
  id: string;
  slug?: string;
  name: string;
  price: number;
  salePrice?: number | null;
  quantity: number;
};

const SHIPPING_COSTS: Record<string, number> = {
  inside: 60,
  outside: 120,
};

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = (body?.items ?? []) as CheckoutItem[];
    const name = String(body?.name ?? "").trim();
    const phone = String(body?.phone ?? "").trim();
    const address = String(body?.address ?? "").trim();
    const note =
      typeof body?.note === "string" && body.note.trim()
        ? body.note.trim()
        : null;
    const shipping = String(body?.shipping ?? "inside");
    const payment = String(body?.payment ?? "cod");

    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: "Missing required customer details." },
        { status: 400 },
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const slugLookup = Array.from(
      new Set(
        items
          .filter((item) => !isUuid(item.id))
          .map((item) => item.slug || item.id)
          .filter(Boolean),
      ),
    ) as string[];

    const slugToId = new Map<string, string>();
    if (slugLookup.length > 0) {
      const { data: productRows, error: productError } = await supabaseAdmin
        .from("products")
        .select("id, slug")
        .in("slug", slugLookup);

      if (productError) {
        return NextResponse.json(
          { error: productError.message },
          { status: 400 },
        );
      }

      (productRows ?? []).forEach((row) => {
        if (row.slug) {
          slugToId.set(row.slug, row.id);
        }
      });
    }

    const subtotal = items.reduce((sum, item) => {
      const price = Number(item.salePrice ?? item.price ?? 0);
      return sum + price * Number(item.quantity ?? 0);
    }, 0);

    const shippingCost = SHIPPING_COSTS[shipping] ?? 0;
    const total = subtotal + shippingCost;

    const totalQty = items.reduce(
      (sum, item) => sum + Number(item.quantity ?? 0),
      0,
    );

    const orderPayload = {
      status: "pending",
      total_qty: totalQty,
      subtotal,
      shipping_cost: shippingCost,
      total,
      guest_name: name,
      guest_phone: phone,
      shipping_line1: address,
      shipping_line2: null,
      shipping_city: null,
      shipping_state: null,
      shipping_postal_code: null,
    };

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert(orderPayload)
      .select("id")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: orderError?.message ?? "Order creation failed." },
        { status: 400 },
      );
    }

    const itemsPayload = items.map((item) => {
      const unitPrice = Number(item.salePrice ?? item.price ?? 0);
      const quantity = Number(item.quantity ?? 0);
      const productId = isUuid(item.id)
        ? item.id
        : slugToId.get(item.slug || item.id) ?? null;
      return {
        order_id: order.id,
        product_id: productId,
        product_name: item.name,
        variant: null,
        unit_price: unitPrice,
        quantity,
        total_price: unitPrice * quantity,
      };
    });

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(itemsPayload);

    if (itemsError) {
      return NextResponse.json(
        { error: itemsError.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ order_id: order.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error." },
      { status: 500 },
    );
  }
}
