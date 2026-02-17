import Link from "next/link";
import FavoritesWidget from "@/components/FavoritesWidget";
import CartWidget from "@/components/CartWidget";
import { getCategories } from "@/data/products.server";
import ProductSearch from "@/components/ProductSearch";

export default async function Header() {
  const categories = await getCategories();
  return (
    <header className="sticky top-0 z-40 header-gradient text-white shadow-md">
      <div className="container-tight pt-4 pb-3">
        <div className="lg:hidden">
          <div className="flex items-center justify-between gap-4 pt-4">
            <a
              href="#category-drawer"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur"
              aria-label="Menu"
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
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </a>

            <Link href="/" className="flex items-center gap-2 font-display text-lg">
              <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-white/70 bg-white/10 text-xs font-semibold">
                AP
              </span>
              <span className="text-base">
                <span className="font-semibold text-slate-900">Amader</span>{" "}
                <span className="font-semibold text-accent">Product</span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <FavoritesWidget />
              <CartWidget />
            </div>
          </div>

          <div className="mt-4">
            <ProductSearch variant="mobile" />
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 text-sm font-semibold text-white/90">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
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
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                Call Us
              </p>
              <p className="text-sm font-semibold">01316-014985</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="desktop-top">
            <Link href="/" className="desktop-logo">
              <span className="desktop-logo__text">
                <span>Amader</span> <strong>Product</strong>
              </span>
            </Link>

            <ProductSearch variant="desktop" categories={categories} />

            <div className="desktop-icons">
              <FavoritesWidget />
              <CartWidget />
              <button className="desktop-account" aria-label="Account">
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
                  <path d="M20 21a8 8 0 1 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            </div>
          </div>

          <div className="desktop-nav">
            <div className="desktop-nav__left">
              <a href="#category-drawer">ALL CATEGORY</a>
              <Link href="/">Home</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/shop">New Arrivals</Link>
              <Link href="/#support">Contact Us</Link>
            </div>
            <div className="desktop-call">
              <span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <div>
                <p>Call Us:</p>
                <strong>01316-014985</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="notice-bar py-2 text-center text-xs font-semibold text-slate-900">
        উপজেলা এবং ইউনিয়ন পর্যায়ে থাকছে হোম ডেলিভারি
      </div>
    </header>
  );
}
