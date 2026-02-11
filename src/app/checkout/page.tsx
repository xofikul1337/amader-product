import Header from "@/components/Header";
import CheckoutClient from "@/components/CheckoutClient";

export const metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="pb-28">
        <CheckoutClient />
      </main>
    </div>
  );
}
