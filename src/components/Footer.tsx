export default function Footer() {
  return (
    <footer className="border-t border-line bg-card">
      <div className="container-tight grid gap-10 py-12 md:grid-cols-3">
        <div className="space-y-4">
          <p className="font-display text-2xl">Amader Product</p>
          <p className="text-sm text-muted">
            Premium Bangladeshi pantry staples — handpicked honey, ghee, oils,
            dates, and salts for families who value purity and taste.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-semibold text-foreground">Explore</p>
          <div className="grid gap-2 text-muted">
            <a href="#products">Bestsellers</a>
            <a href="#story">Our Story</a>
            <a href="#faq">FAQ</a>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-semibold text-foreground">Promise</p>
          <div className="grid gap-2 text-muted">
            <span>Small-batch sourcing</span>
            <span>Quality checked every lot</span>
            <span>Careful delivery handling</span>
          </div>
        </div>
      </div>
      <div className="border-t border-line py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Amader Product. All rights reserved.
      </div>
    </footer>
  );
}
