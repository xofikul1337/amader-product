import { categoryToParam } from "@/data/products";
import { getCategories } from "@/data/products.server";

export default async function CategoryDrawer() {
  const categories = await getCategories();
  return (
    <div id="category-drawer" className="category-drawer">
      <div className="drawer-panel">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Browse
            </p>
            <h3 className="text-lg font-semibold text-foreground">
              Product Categories
            </h3>
          </div>
          <a
            href="#"
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition hover:text-foreground"
            aria-label="Close"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </a>
        </div>

        <div className="mt-5 grid gap-3">
          {categories.map((category) => (
            <a
              key={category}
              href={`/shop?category=${categoryToParam(category)}`}
              className="flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-accent hover:text-accent"
            >
              <span>{category}</span>
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
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-slate-50 p-4 text-xs text-muted">
          Tap any category to filter the products list.
        </div>
      </div>
    </div>
  );
}
