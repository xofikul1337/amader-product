"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CartItem,
  clearCart,
  readCart,
  removeFromCart,
  updateQuantity,
} from "@/lib/cart";
import { formatTaka } from "@/lib/format";

export default function CartWidget() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const refresh = () => setItems(readCart());

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("cart:updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("cart:updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const totalQty = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + (item.salePrice ?? item.price) * item.quantity,
        0,
      ),
    [items],
  );

  return (
    <>
      <button
        className="relative grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/20 text-white"
        aria-label="Cart"
        onClick={() => setOpen(true)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
        </svg>
        <span className="icon-badge">{totalQty}</span>
      </button>

      {open ? (
        <div className="cart-drawer">
          <div className="cart-drawer__panel">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Cart
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  Your Items
                </h3>
              </div>
              <button
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-slate-500"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            {items.length === 0 ? (
              <p className="mt-6 text-sm text-slate-500">Cart is empty.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {formatTaka(item.salePrice ?? item.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          className="rounded-full border border-line px-2 text-xs"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="text-xs font-semibold">{item.quantity}</span>
                        <button
                          className="rounded-full border border-line px-2 text-xs"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                        <button
                          className="ml-auto text-xs font-semibold text-rose-600"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 ? (
              <div className="cart-drawer__footer">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>{formatTaka(totalPrice)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="mt-3 block rounded-full bg-accent px-4 py-2 text-center text-xs font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  Checkout
                </Link>
                <button
                  className="mt-2 w-full rounded-full border border-line px-4 py-2 text-xs font-semibold text-slate-500"
                  onClick={() => clearCart()}
                >
                  Clear cart
                </button>
                <div className="h-17" />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
