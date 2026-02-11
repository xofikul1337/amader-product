import Link from "next/link";
import Script from "next/script";
import Header from "@/components/Header";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getProductBySlug, getProducts } from "@/data/products.server";
import { formatTaka } from "@/lib/format";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug[0]
    : resolvedParams.slug;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: `${product.name} ${product.size}`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} ${product.size}`,
      description: product.shortDescription,
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug[0]
    : resolvedParams.slug;
  const product = await getProductBySlug(slug);
  if (!product) {
    return (
      <div className="bg-background text-foreground">
        <Header />
        <main className="container-tight pb-28 pt-6">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <h1 className="text-lg font-semibold">Product not found</h1>
            <p className="mt-2 text-sm text-muted">
              The product you are looking for is not available.
            </p>
            <Link href="/#products" className="mt-4 inline-block text-xs font-semibold text-accent">
              Back to products →
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const currentPrice = product.salePrice ?? product.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} ${product.size}`,
    image: [product.image],
    description: product.details,
    brand: {
      "@type": "Brand",
      name: "Amader Product",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: currentPrice,
      availability: "https://schema.org/InStock",
      url: product.href,
    },
  };

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3);

  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="container-tight pb-28 pt-6">
        <Link href="/#products" className="text-sm text-muted">
          &lt; Back to products
        </Link>

        <div className="product-page-grid">
          <div className="product-page-main">
            <ProductDetailClient product={product} />
          </div>
          <aside className="product-page-sidebar">
            <div className="product-sidebar-card">
              <div className="product-sidebar-title">
                <h3>Related Products</h3>
              </div>
              <div className="product-sidebar-list">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/products/${item.slug}`}
                    className="product-sidebar-item"
                  >
                    <div className="product-sidebar-thumb">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div>
                      <p className="product-sidebar-name">{item.name}</p>
                      <p className="product-sidebar-price">
                        {formatTaka(item.salePrice ?? item.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
