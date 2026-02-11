import Header from "@/components/Header";
import ShopClient from "@/components/ShopClient";
import { buildCategories } from "@/data/products";
import { getProducts } from "@/data/products.server";

export const metadata = {
  title: "Shop",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: { category?: string; q?: string };
}) {
  const products = await getProducts();
  const categories = buildCategories(products);

  return (
    <div className="bg-background text-foreground">
      <Header />
      <main>
        <ShopClient
          initialCategory={searchParams?.category}
          initialQuery={searchParams?.q}
          products={products}
          categories={categories}
        />
      </main>
    </div>
  );
}
