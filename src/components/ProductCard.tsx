import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { formatINR, useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { add, toggleWish, state } = useStore();
  const { user, openLogin } = useAuth();
  const wished = state.wishlist.includes(product.id);
  const guard = (fn: () => void, msg: string) => {
    if (!user) { toast.info(msg); openLogin(); return; }
    fn();
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative bg-card border border-border hover:border-gold/40 transition-colors overflow-hidden"
    >
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={800}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && <span className="px-2 py-0.5 text-[10px] tracking-widest bg-gold text-primary-foreground font-bold">NEW</span>}
            {product.bestseller && <span className="px-2 py-0.5 text-[10px] tracking-widest bg-foreground text-background font-bold">BESTSELLER</span>}
            {!product.inStock && <span className="px-2 py-0.5 text-[10px] tracking-widest bg-destructive text-destructive-foreground font-bold">OUT OF STOCK</span>}
          </div>
          {product.oldPrice && (
            <div className="absolute top-3 right-3 px-2 py-0.5 text-[10px] tracking-widest bg-background/90 text-gold font-bold">
              -{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="text-[10px] tracking-widest text-muted-foreground">{product.category.toUpperCase()}</div>
          <h3 className="font-display text-xl tracking-wide mt-1 group-hover:text-gold transition-colors">{product.name}</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-semibold">{formatINR(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">{formatINR(product.oldPrice)}</span>
            )}
          </div>
        </div>
      </Link>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.preventDefault(); guard(() => toggleWish(product.id), "Sign in to save to your wishlist"); }}
          className={`w-9 h-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center hover:bg-gold hover:text-primary-foreground transition-colors ${wished ? "text-gold" : ""}`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
        </button>
      </div>

      <button
        disabled={!product.inStock}
        onClick={() => guard(() => { add(product); toast.success("Added to bag"); }, "Sign in to add items to your bag")}
        className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gold text-primary-foreground py-3 font-semibold text-sm tracking-widest flex items-center justify-center gap-2 disabled:bg-muted disabled:text-muted-foreground"
      >
        <ShoppingBag className="w-4 h-4" />
        {product.inStock ? "ADD TO BAG" : "SOLD OUT"}
      </button>
    </motion.div>
  );
}