"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FavoriteItem,
  clearFavorites,
  readFavorites,
  removeFavorite,
} from "@/lib/favorites";
import { formatTaka } from "@/lib/format";

export default function FavoritesWidget() {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [open, setOpen] = useState(false);

  const refresh = () => setItems(readFavorites());

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("favorites:updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("favorites:updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return (
    <>
      <button
        className="relative grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/20 text-white"
        aria-label="Favorites"
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
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
        <span className="icon-badge">{items.length}</span>
      </button>

      {open ? (
        <div className="favorite-drawer">
          <div className="favorite-drawer__panel">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Favorites
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  Saved Products
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
              <p className="mt-6 text-sm text-slate-500">No favorites yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatTaka(item.salePrice ?? item.price)}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white"
                          onClick={() => setOpen(false)}
                        >
                          Checkout
                        </Link>
                        <button
                          className="rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-slate-500"
                          onClick={() => removeFavorite(item.id)}
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
              <div className="mt-6 flex justify-between">
                <button
                  className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-slate-500"
                  onClick={() => clearFavorites()}
                >
                  Clear all
                </button>
                <button
                  className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  Continue
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
