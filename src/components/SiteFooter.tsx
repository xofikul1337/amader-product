import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-3 bg-gradient-to-br from-[#f3c6c0] to-[#e07a4f] text-white lg:mt-10">
      <div className="container-tight pt-12 pb-10 lg:pt-28 lg:pb-14">
        <div className="footer-accordion space-y-6 lg:hidden">
          <br></br><br></br>
          <details open className="border-b border-white/25 pb-4">
            <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-slate-900">
              About Us
              <span className="text-lg">▾</span>
            </summary>
            <div className="mt-2 h-[2px] w-20 bg-teal-300" />
            <div className="mt-7 space-y-4">
              <h3 className="font-display text-3xl font-semibold text-slate-900">
                Discount <span className="text-red-500">Market</span>
              </h3>
              <p className="text-sm leading-6 text-white/90">
                Welcome to our online store! We are a team of passionate individuals
                who are dedicated to providing our customers with high-quality
                products and excellent service.
              </p>
              <div className="flex gap-3">
                {["f", "t", "in", "yt"].map((label) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="grid h-8 w-8 place-items-center rounded-full border border-white/40 text-xs font-semibold text-white"
                  >
                    {label}
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#00c2c7] text-white">
                  <svg
                    width="24"
                    height="24"
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
                  <p className="text-[11px] uppercase tracking-[0.25em] text-white/80">
                    Need Help?
                  </p>
                  <strong className="text-lg text-white">01316-014985</strong>
                </div>
              </div>
            </div>
          </details>

          <details className="border-b border-white/25 pb-4">
            <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-slate-900">
              Information
              <span className="text-lg">▾</span>
            </summary>
            <div className="mt-2 h-[2px] w-20 bg-teal-300" />
            <ul className="mt-4 space-y-2 text-sm text-white/90">
              <li>
                <Link href="/#about">About Us</Link>
              </li>
              <li>
                <Link href="/#delivery">Delivery Information</Link>
              </li>
              <li>
                <Link href="/#privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/#terms">Terms &amp; Conditions</Link>
              </li>
              <li>
                <Link href="/#support">Contact Us</Link>
              </li>
              <li>
                <Link href="/#returns">Returns</Link>
              </li>
            </ul>
          </details>

          <details className="border-b border-white/25 pb-4">
            <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-slate-900">
              Customer Service
              <span className="text-lg">▾</span>
            </summary>
            <div className="mt-2 h-[2px] w-20 bg-teal-300" />
            <ul className="mt-4 space-y-2 text-sm text-white/90">
              <li>
                <Link href="/#sitemap">Site Map</Link>
              </li>
              <li>
                <Link href="/#wishlist">Wish List</Link>
              </li>
              <li>
                <Link href="/#brands">Brands</Link>
              </li>
              <li>
                <Link href="/#gift">Gift Certificates</Link>
              </li>
              <li>
                <Link href="/#affiliate">Affiliate</Link>
              </li>
              <li>
                <Link href="/#specials">Specials</Link>
              </li>
              <li>
                <Link href="/#tracking">Order Tracking</Link>
              </li>
            </ul>
          </details>
        </div>

        <div className="hidden gap-10 lg:grid lg:grid-cols-[1.3fr_1fr_1fr]">
          <div className="lg:pt-8">
            <h3 className="font-display text-3xl font-semibold text-slate-900">
              Discount <span className="text-red-500">Market</span>
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/90">
              Welcome to our online store! We are a team of passionate individuals
              who are dedicated to providing our customers with high-quality
              products and excellent service.
            </p>
            <div className="mt-5 flex gap-3">
              {["f", "t", "in", "yt"].map((label) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/40 text-xs font-semibold text-white"
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#00c2c7] text-white">
                <svg
                  width="22"
                  height="22"
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
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/80">
                  Need Help?
                </p>
                <strong className="text-lg text-white">01316-014985</strong>
              </div>
            </div>
          </div>

          <div className="lg:pt-8">
            <h4 className="text-[15px] font-semibold">Information</h4>
            <div className="mt-2 h-[2px] w-20 bg-teal-300" />
            <ul className="mt-5 space-y-2.5 text-sm text-white/90">
              <li>
                <Link href="/#about">About Us</Link>
              </li>
              <li>
                <Link href="/#delivery">Delivery Information</Link>
              </li>
              <li>
                <Link href="/#privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/#terms">Terms &amp; Conditions</Link>
              </li>
              <li>
                <Link href="/#support">Contact Us</Link>
              </li>
              <li>
                <Link href="/#returns">Returns</Link>
              </li>
            </ul>
          </div>

          <div className="lg:pt-8">
            <h4 className="text-[15px] font-semibold">Customer Service</h4>
            <div className="mt-2 h-[2px] w-20 bg-teal-300" />
            <ul className="mt-5 space-y-2.5 text-sm text-white/90">
              <li>
                <Link href="/#sitemap">Site Map</Link>
              </li>
              <li>
                <Link href="/#wishlist">Wish List</Link>
              </li>
              <li>
                <Link href="/#brands">Brands</Link>
              </li>
              <li>
                <Link href="/#gift">Gift Certificates</Link>
              </li>
              <li>
                <Link href="/#affiliate">Affiliate</Link>
              </li>
              <li>
                <Link href="/#specials">Specials</Link>
              </li>
              <li>
                <Link href="/#tracking">Order Tracking</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-tight flex flex-col items-center gap-4 border-t border-white/20 py-6 text-center text-xs text-white/90 lg:flex-row lg:justify-between lg:text-left">
        <p>Discount Market (c) 2026 - Powered-by Storola.net</p>
        <div className="flex flex-wrap justify-center">
          <img
            src="/images/payment-methods.png"
            alt="Payment methods"
            className="h-10 w-auto"
          />
        </div>
      </div>
    </footer>
  );
}
