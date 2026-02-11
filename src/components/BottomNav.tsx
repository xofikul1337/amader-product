"use client";

import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isShop = pathname?.startsWith("/shop");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="border-t border-line bg-white px-3 py-2 shadow-[0_-8px_20px_rgba(15,23,42,0.08)]">
        <div className="grid grid-cols-5 items-center text-[11px] font-semibold text-slate-500">
          <a
            href="/"
            className={`flex flex-col items-center gap-1 ${
              isHome ? "text-accent" : ""
            }`}
          >
            <span
              className={`grid h-9 w-9 place-items-center rounded-full ${
                isHome ? "bg-slate-100 text-accent" : "bg-slate-100 text-slate-600"
              }`}
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
                <path d="M3 10.5 12 3l9 7.5" />
                <path d="M9 22V12h6v10" />
              </svg>
            </span>
            Home
          </a>
          <a
            href="/shop"
            className={`flex flex-col items-center gap-1 ${
              isShop ? "text-accent" : ""
            }`}
          >
            <span
              className={`grid h-9 w-9 place-items-center rounded-full ${
                isShop ? "bg-slate-100 text-accent" : "bg-slate-100 text-slate-600"
              }`}
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
                <path d="M6 6h15l-1.5 9h-12z" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </span>
            Shop
          </a>
          <a
            href="#category-drawer"
            className="flex flex-col items-center gap-1"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600">
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
                <rect x="3" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" />
              </svg>
            </span>
            Categories
          </a>
          <a
            href="#"
            className="flex flex-col items-center gap-1"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600">
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
                <path d="m21 21-3.5-3.5" />
              </svg>
            </span>
            Search
          </a>
          <a
            href="#"
            className="flex flex-col items-center gap-1"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600">
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
            </span>
            Account
          </a>
        </div>
      </div>
    </nav>
  );
}
