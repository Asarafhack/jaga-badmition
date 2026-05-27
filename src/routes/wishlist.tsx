import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";
import { products } from "@/data/products";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Jaga Traders" }] }),
  component: Wishlist,
});

function Wishlist() {
  const { state } = useStore();
  const items = products.filter((p) => state.wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="border-b border-border pb-8 mb-8">
        <div className="text-xs tracking-widest text-gold">SAVED FOR LATER</div>
        <h1 className="font-display text-5xl md:text-6xl mt-2">WISHLIST</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto rounded-full border border-gold/40 flex items-center justify-center text-gold">
            <Heart className="w-8 h-8" />
          </div>
          <p className="mt-6 text-muted-foreground">Your wishlist is empty.</p>
          <Link to="/shop" className="inline-block mt-6 bg-gold text-primary-foreground px-8 py-3 font-bold tracking-widest text-sm">BROWSE GEAR</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}