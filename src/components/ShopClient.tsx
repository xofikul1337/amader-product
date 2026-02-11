"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product, categoryToParam, matchesCategory } from "@/data/products";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Best Discount" },
  { value: "name-asc", label: "Name: A to Z" },
];

type ShopClientProps = {
  products: Product[];
  categories: string[];
  initialCategory?: string;
  initialQuery?: string;
};

export default function ShopClient({
  products,
  categories,
  initialCategory,
  initialQuery,
}: ShopClientProps) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [categoryParam, setCategoryParam] = useState(initialCategory ?? "all");
  const [sort, setSort] = useState(sortOptions[0].value);
  const [visibleCount, setVisibleCount] = useState(12);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let list = products.filter((product) => matchesCategory(categoryParam, product));

    if (normalizedQuery) {
      list = list.filter((product) =>
        `${product.name} ${product.localName} ${product.size}`
          .toLowerCase()
          .includes(normalizedQuery),
      );
    }

    const sorted = [...list].sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;
      switch (sort) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "discount": {
          const discountA = a.salePrice ? (a.price - a.salePrice) / a.price : 0;
          const discountB = b.salePrice ? (b.price - b.salePrice) / b.price : 0;
          return discountB - discountA;
        }
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [categoryParam, query, sort]);

  const visibleProducts = filtered.slice(0, visibleCount);

  const handleCategoryChange = (value: string) => {
    setCategoryParam(value);
    setVisibleCount(12);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setVisibleCount(12);
  };

  return (
    <div className="container-tight pb-20 pt-6">
      <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-1 flex-wrap gap-4">
            <label className="flex min-w-[200px] flex-1 flex-col gap-2 text-xs font-semibold text-slate-500">
              Search
              <input
                type="search"
                placeholder="Search products..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="rounded-xl border border-line px-3 py-2 text-sm text-slate-900 outline-none"
              />
            </label>
            <label className="flex min-w-[180px] flex-1 flex-col gap-2 text-xs font-semibold text-slate-500">
              Category
              <select
                value={categoryParam}
                onChange={(event) => handleCategoryChange(event.target.value)}
                className="rounded-xl border border-line px-3 py-2 text-sm text-slate-900 outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={categoryToParam(category)}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex min-w-[180px] flex-1 flex-col gap-2 text-xs font-semibold text-slate-500">
              Sort by
              <select
                value={sort}
                onChange={(event) => handleSortChange(event.target.value)}
                className="rounded-xl border border-line px-3 py-2 text-sm text-slate-900 outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Showing {visibleProducts.length} of {filtered.length} products
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
        {visibleProducts.map((product, index) => (
          <ProductCard key={product.slug} product={product} index={index} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-line bg-white p-6 text-center text-sm text-slate-500">
          No products found. Try a different search or category.
        </div>
      ) : null}

      {visibleProducts.length < filtered.length ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white"
          >
            Load More
          </button>
        </div>
      ) : null}
    </div>
  );
}
