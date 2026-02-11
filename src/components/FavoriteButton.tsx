"use client";

import { useEffect, useState } from "react";
import { FavoriteItem, isFavorite, toggleFavorite } from "@/lib/favorites";

type FavoriteButtonProps = {
  item: FavoriteItem;
};

export default function FavoriteButton({ item }: FavoriteButtonProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isFavorite(item.id));
    const handler = () => setActive(isFavorite(item.id));
    window.addEventListener("favorites:updated", handler);
    return () => window.removeEventListener("favorites:updated", handler);
  }, [item.id]);

  const handleToggle = () => {
    toggleFavorite(item);
    setActive(isFavorite(item.id));
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`favorite-btn ${active ? "favorite-btn--active" : ""}`}
      aria-label="Add to favorites"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  );
}
