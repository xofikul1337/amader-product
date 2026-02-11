"use client";

import { useEffect, useState } from "react";
import { readCart } from "@/lib/cart";
import { formatTaka } from "@/lib/format";

export default function CartMini() {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  const refresh = () => {
    const items = readCart();
    const qty = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + (item.salePrice ?? item.price) * item.quantity,
      0,
    );
    setCount(qty);
    setTotal(totalPrice);
  };

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

  if (count === 0) return null;

  return (
    <div className="cart-mini">
      <span>{count} ITEM</span>
      <strong>{formatTaka(total)}</strong>
    </div>
  );
}
