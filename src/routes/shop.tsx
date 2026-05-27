import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/data/products";

const searchSchema = z.object({
  category: z.string().optional(),
  sort: z.enum(["featured", "price-asc", "price-desc", "rating"]).optional(),
  q: z.string().optional(),
});
type ShopSearch = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop — Jaga Traders" },
      { name: "description", content: "Browse premium rackets, shuttles, footwear, apparel and accessories." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category, sort = "featured", q = "" } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });

  const filtered = useMemo(() => {
    let list = [...products];
    if (category) list = list.filter((p) => p.category === category);
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, sort, q]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="border-b border-border pb-8 mb-8">
        <div className="text-xs tracking-widest text-gold">COLLECTION</div>
        <h1 className="font-display text-5xl md:text-6xl mt-2">{category ? category.toUpperCase() : "ALL GEAR"}</h1>
        <p className="text-muted-foreground mt-2">{filtered.length} products</p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          <div>
            <div className="font-display text-sm tracking-widest text-gold mb-3">CATEGORY</div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate({ search: (s: ShopSearch) => ({ ...s, category: undefined }) })}
                  className={`text-sm hover:text-gold transition-colors ${!category ? "text-gold font-semibold" : ""}`}>
                  All
                </button>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => navigate({ search: (s: ShopSearch) => ({ ...s, category: c }) })}
                    className={`text-sm hover:text-gold transition-colors ${category === c ? "text-gold font-semibold" : ""}`}>
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-display text-sm tracking-widest text-gold mb-3">SORT</div>
            <select
              value={sort}
              onChange={(e) => navigate({ search: (s: ShopSearch) => ({ ...s, sort: e.target.value as ShopSearch["sort"] }) })}
              className="w-full bg-card border border-border px-3 py-2 text-sm focus:border-gold outline-none">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No products match your filters.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}