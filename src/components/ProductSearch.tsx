"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { categoryToParam } from "@/data/products";
import { formatTaka } from "@/lib/format";
import { trackSearch, trackSelectItem } from "@/lib/tracking.client";

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
};

type ProductSearchProps = {
  variant: "mobile" | "desktop";
  categories?: string[];
};

const DEFAULT_LIMIT = 6;

export default function ProductSearch({ variant, categories = [] }: ProductSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(categories[0] ?? "All Product");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const trimmedQuery = query.trim();

  const searchUrl = useMemo(() => {
    if (!trimmedQuery) return "/shop";
    const params = new URLSearchParams();
    params.set("q", trimmedQuery);
    if (category && category !== "All Product" && category !== "All Category") {
      params.set("category", categoryToParam(category));
    }
    return `/shop?${params.toString()}`;
  }, [category, trimmedQuery]);

  useEffect(() => {
    if (!trimmedQuery) {
      setResults([]);
      setOpen(false);
      return;
    }

    setOpen(true);
    const controller = new AbortController();
    const handle = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedQuery)}&limit=${DEFAULT_LIMIT}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          setResults([]);
          return;
        }
        const data = (await response.json()) as { results?: SearchResult[] };
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      clearTimeout(handle);
    };
  }, [trimmedQuery]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedQuery) return;
    trackSearch(trimmedQuery, results.length);
    setOpen(false);
    router.push(searchUrl);
  };

  const handleBlur = () => {
    setTimeout(() => setOpen(false), 120);
  };

  const handleDropdownMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const dropdown = open ? (
    <div className="search-dropdown" role="listbox" onMouseDown={handleDropdownMouseDown}>
      {loading ? <div className="search-dropdown__loading">Searching...</div> : null}
      {!loading && results.length === 0 ? (
        <div className="search-dropdown__empty">No products found.</div>
      ) : null}
      {!loading
        ? results.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className="search-dropdown__item"
              onClick={() => {
                trackSelectItem(
                  {
                    id: item.id,
                    slug: item.slug,
                    name: item.name,
                    price: item.price,
                  },
                  "search_results",
                );
                setOpen(false);
              }}
            >
              <span className="search-dropdown__thumb">
                <Image src={item.image} alt={item.name} fill sizes="40px" />
              </span>
              <span className="search-dropdown__name">{item.name}</span>
              <span className="search-dropdown__price">{formatTaka(item.price)}</span>
            </Link>
          ))
        : null}
    </div>
  ) : null;

  if (variant === "desktop") {
    return (
      <div className="desktop-search search-wrap" onBlur={handleBlur}>
        <form className="desktop-search__shell" onSubmit={handleSubmit}>
          <input
            type="search"
            placeholder="Search entire store here ..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => trimmedQuery && setOpen(true)}
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Category"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All Product" ? "All Category" : item}
              </option>
            ))}
          </select>
          <button type="submit" aria-label="Search">
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
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>
        {dropdown}
      </div>
    );
  }

  return (
    <div className="search-wrap" onBlur={handleBlur}>
      <form
        className="search-pill flex items-center gap-2 rounded-full bg-white px-3 py-2 text-slate-900"
        onSubmit={handleSubmit}
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-accent">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </span>
        <input
          type="search"
          placeholder="Search entire store here ..."
          className="flex-1 bg-transparent text-sm outline-none"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => trimmedQuery && setOpen(true)}
        />
        <button
          type="submit"
          className="rounded-full bg-accent-2 px-4 py-2 text-xs font-semibold text-white"
        >
          Search
        </button>
      </form>
      {dropdown}
    </div>
  );
}
