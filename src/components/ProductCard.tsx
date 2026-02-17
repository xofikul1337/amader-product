"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/data/products";
import { formatDiscount, formatTaka } from "@/lib/format";
import FavoriteButton from "@/components/FavoriteButton";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import { trackSelectItem } from "@/lib/tracking.client";

type ProductCardProps = {
  product: Product;
  index?: number;
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const router = useRouter();
  const currentPrice = product.salePrice ?? product.price;
  const discount = formatDiscount(product.price, product.salePrice);
  const [loading, setLoading] = useState(false);

  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (target.closest("button, a, input, textarea, select, [data-no-card-nav]")) {
      return;
    }
    const nextUrl = `/products/${product.slug}`;
    trackSelectItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice ?? null,
        category: product.category,
      },
      "product_grid",
    );
    setLoading(true);
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void })
        .startViewTransition(() => {
          router.push(nextUrl);
        });
    } else {
      router.push(nextUrl);
    }
    setTimeout(() => setLoading(false), 120);
  };

  const handlePrefetch = () => {
    const nextUrl = `/products/${product.slug}`;
    router.prefetch(nextUrl);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const nextUrl = `/products/${product.slug}`;
      trackSelectItem(
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          salePrice: product.salePrice ?? null,
          category: product.category,
        },
        "product_grid",
      );
      setLoading(true);
      if (typeof document !== "undefined" && "startViewTransition" in document) {
        (document as unknown as { startViewTransition: (cb: () => void) => void })
          .startViewTransition(() => {
            router.push(nextUrl);
          });
      } else {
        router.push(nextUrl);
      }
      setTimeout(() => setLoading(false), 120);
    }
  };

  return (
    <article
      className="product-card fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={handleCardClick}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
    >
      <div className="product-card__media">
        <div className="favorite-btn__wrap">
          <FavoriteButton
            item={{
              id: product.slug,
              name: product.name,
              image: product.image,
              price: product.price,
              salePrice: product.salePrice ?? null,
              slug: product.slug,
              href: product.href,
            }}
          />
        </div>
        {discount ? <span className="product-card__badge">{discount}</span> : null}
        <Image
          src={product.image}
          alt={`${product.name} ${product.size}`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
      </div>

      <div className="product-card__body">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold leading-snug text-slate-900">
            {product.localName} {product.name}
          </h3>
          <p className="text-xs text-slate-500">{product.size}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-accent">
            {formatTaka(currentPrice)}
          </span>
          {product.salePrice ? (
            <span className="text-xs text-slate-400 line-through">
              {formatTaka(product.price)}
            </span>
          ) : null}
        </div>
        <div className="space-y-2">
          <BuyNowButton
            className="product-action-primary"
            item={{
              id: product.slug,
              name: product.name,
              image: product.image,
              price: product.price,
              salePrice: product.salePrice ?? null,
              slug: product.slug,
              href: product.href,
            }}
          />
          <AddToCartButton
            item={{
              id: product.slug,
              name: product.name,
              image: product.image,
              price: product.price,
              salePrice: product.salePrice ?? null,
              slug: product.slug,
              href: product.href,
            }}
          />
        </div>
      </div>
      {loading ? (
        <div className="product-card__loading">
          <span></span>
        </div>
      ) : null}
    </article>
  );
}
