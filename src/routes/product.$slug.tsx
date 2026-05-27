import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShoppingBag, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { getProduct, related } from "@/data/products";
import { formatINR, useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.product.name} — Jaga Traders` },
      { name: "description", content: loaderData.product.tagline },
      { property: "og:title", content: loaderData.product.name },
      { property: "og:description", content: loaderData.product.tagline },
      { property: "og:image", content: loaderData.product.image },
      { property: "og:type", content: "product" },
    ] : [],
    links: loaderData ? [{ rel: "canonical", href: `/product/${loaderData.product.slug}` }] : [],
  }),
  notFoundComponent: () => (
    <div className="max-w-xl mx-auto py-32 text-center px-6">
      <h2 className="font-display text-4xl">Product not found</h2>
      <Link to="/shop" className="inline-block mt-6 text-gold underline">Back to shop</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add, toggleWish, state } = useStore();
  const [qty, setQty] = useState(1);
  const wished = state.wishlist.includes(product.id);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-xs text-muted-foreground mb-6 tracking-wider">
        <Link to="/" className="hover:text-gold">HOME</Link> /{" "}
        <Link to="/shop" className="hover:text-gold">SHOP</Link> /{" "}
        <span className="text-foreground">{product.name.toUpperCase()}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border aspect-square overflow-hidden"
        >
          <img src={product.image} alt={product.name} width={800} height={800}
               className="w-full h-full object-cover" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <div className="text-xs tracking-widest text-gold">{product.category.toUpperCase()}</div>
          <h1 className="font-display text-4xl md:text-5xl mt-2 leading-tight">{product.name}</h1>
          <p className="text-muted-foreground mt-2">{product.tagline}</p>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-0.5 text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-current" : ""}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
          </div>

          <div className="flex items-baseline gap-4 mt-6 pb-6 border-b border-border">
            <span className="font-display text-4xl text-gold">{formatINR(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatINR(product.oldPrice)}</span>
                <span className="px-2 py-1 text-xs tracking-widest bg-gold/10 text-gold font-bold">
                  SAVE {Math.round((1 - product.price / product.oldPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="mt-6 text-foreground/80 leading-relaxed">{product.description}</p>

          {/* QTY + CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-3 hover:text-gold" aria-label="Decrease">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-semibold w-10 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-3 hover:text-gold" aria-label="Increase">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              disabled={!product.inStock}
              onClick={() => add(product, qty)}
              className="flex-1 min-w-[200px] bg-gold text-primary-foreground py-4 font-bold tracking-widest text-sm hover:shadow-gold transition-shadow disabled:bg-muted disabled:text-muted-foreground inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              {product.inStock ? "ADD TO BAG" : "SOLD OUT"}
            </button>
            <button
              onClick={() => toggleWish(product.id)}
              className={`w-14 h-14 border border-border flex items-center justify-center hover:border-gold hover:text-gold transition-colors ${wished ? "border-gold text-gold" : ""}`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wished ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* SPECS */}
          <div className="mt-10 border-t border-border pt-8">
            <div className="font-display text-xl tracking-wider mb-4">SPECIFICATIONS</div>
            <dl className="grid grid-cols-2 gap-4">
              {product.specs.map((s: { label: string; value: string }) => (
                <div key={s.label} className="border-b border-border pb-2">
                  <dt className="text-xs tracking-widest text-muted-foreground">{s.label.toUpperCase()}</dt>
                  <dd className="text-sm font-semibold mt-1">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-xs">
            {[{ Icon: Truck, t: "Free Shipping" }, { Icon: Shield, t: "2-Yr Warranty" }, { Icon: RotateCcw, t: "30-Day Returns" }].map(({ Icon, t }, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-4 border border-border">
                <Icon className="w-5 h-5 text-gold" />
                <span className="tracking-widest">{t.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RELATED */}
      {related(product.id, product.category).length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl md:text-4xl mb-8">YOU MAY ALSO LIKE</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related(product.id, product.category).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}