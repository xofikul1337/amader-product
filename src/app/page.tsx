import Script from "next/script";
import HeroSlider from "@/components/HeroSlider";
import CategoryScroller from "@/components/CategoryScroller";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { buildCategories, matchesCategory } from "@/data/products";
import { getProducts } from "@/data/products.server";

export default async function Home({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const activeCategory = searchParams?.category;
  const products = await getProducts();
  const visibleProducts = products.filter((product) =>
    matchesCategory(activeCategory, product),
  );
  const heroSlides = products.slice(0, 3);
  const categories = buildCategories(products);
  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="pb-28">
        <section className="container-tight py-6">
          <HeroSlider slides={heroSlides} />
        </section>

        <section className="container-tight pb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Popular Categories</h3>
          </div>
          <div className="mt-4">
            <CategoryScroller
              categories={categories.filter((item) => item !== "All Product")}
            />
          </div>
        </section>

        <section className="container-tight py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">New Arrivals</h2>
            <a href="/shop" className="text-xs font-semibold text-slate-600">
              View More
            </a>
          </div>
        </section>

        <section className="container-tight pb-5">
          <div
            id="products"
            className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5"
          >
            {visibleProducts.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>
        </section>
      </main>
      <Script
        id="itemlist-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            itemListElement: visibleProducts.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: `${product.name} (${product.size})`,
              url: product.href,
              image: product.image,
            })),
            "@context": "https://schema.org",
            "@type": "ItemList",
          }),
        }}
      />
    </div>
  );
}
