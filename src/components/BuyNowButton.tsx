"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";

type BuyNowButtonProps = {
  item: {
    id: string;
    name: string;
    image: string;
    price: number;
    salePrice?: number | null;
    slug: string;
    href: string;
  };
  className?: string;
  quantity?: number;
};

export default function BuyNowButton({ item, className, quantity }: BuyNowButtonProps) {
  const [animating, setAnimating] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    addToCart(item, quantity ?? 1);
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      router.push("/checkout");
    }, 200);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${className ?? ""} ${animating ? "btn-pop" : ""}`.trim()}
    >
      অর্ডার করুন
    </button>
  );
}
