"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

type AddToCartButtonProps = {
  item: {
    id: string;
    name: string;
    image: string;
    price: number;
    salePrice?: number | null;
    slug: string;
    href: string;
  };
  quantity?: number;
};

export default function AddToCartButton({ item, quantity }: AddToCartButtonProps) {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    addToCart(item, quantity ?? 1);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 250);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`product-action-secondary ${animating ? "btn-pop" : ""}`}
    >
      কার্টে যোগ করুন
    </button>
  );
}
