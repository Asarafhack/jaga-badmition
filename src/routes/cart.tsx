import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatINR, useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Bag — Jaga Traders" }] }),
  component: Cart,
});

function Cart() {
  const { state, remove, setQty, cartTotal } = useStore();
  const { user, openLogin } = useAuth();
  const shipping = cartTotal > 2999 || cartTotal === 0 ? 0 : 199;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  if (state.cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-32 text-center px-6">
        <div className="w-20 h-20 mx-auto rounded-full border border-gold/40 flex items-center justify-center text-gold">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-display text-4xl mt-6">YOUR BAG IS EMPTY</h1>
        <p className="text-muted-foreground mt-2">Add tournament-ready gear and dominate the court.</p>
        <Link to="/shop" className="inline-block mt-8 bg-gold text-primary-foreground px-8 py-4 font-bold tracking-widest text-sm">
          SHOP NOW
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-5xl md:text-6xl">YOUR BAG</h1>
      <p className="text-muted-foreground mt-2">{state.cart.length} item(s)</p>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10 mt-10">
        <div className="space-y-4">
          {state.cart.map(({ product, qty }) => (
            <div key={product.id} className="flex gap-4 p-4 border border-border bg-card">
              <img src={product.image} alt={product.name} className="w-28 h-28 object-cover" />
              <div className="flex-1 min-w-0">
                <Link to="/product/$slug" params={{ slug: product.slug }} className="font-display text-xl hover:text-gold">{product.name}</Link>
                <div className="text-xs tracking-widest text-muted-foreground mt-1">{product.category.toUpperCase()}</div>
                <div className="text-gold font-semibold mt-2">{formatINR(product.price)}</div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-border">
                    <button onClick={() => setQty(product.id, qty - 1)} className="px-2 py-1.5 hover:text-gold"><Minus className="w-3 h-3" /></button>
                    <span className="px-3 text-sm w-8 text-center">{qty}</span>
                    <button onClick={() => setQty(product.id, qty + 1)} className="px-2 py-1.5 hover:text-gold"><Plus className="w-3 h-3" /></button>
                  </div>
                  <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-destructive text-sm flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
              <div className="text-right font-semibold">{formatINR(product.price * qty)}</div>
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start border border-border bg-card p-6">
          <div className="font-display text-2xl tracking-wider">ORDER SUMMARY</div>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(cartTotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "FREE" : formatINR(shipping)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax (GST 18%)</span><span>{formatINR(tax)}</span></div>
            <div className="border-t border-border pt-3 mt-3 flex justify-between text-lg font-display tracking-wider">
              <span>TOTAL</span><span className="text-gold">{formatINR(total)}</span>
            </div>
          </div>
          <button
            onClick={() => {
              if (!user) { openLogin(); return; }
              toast.info("Secure checkout launches in Phase 3 with Razorpay & COD");
            }}
            className="w-full mt-6 bg-gold text-primary-foreground py-4 font-bold tracking-widest text-sm hover:shadow-gold transition-shadow"
          >
            {user ? "CHECKOUT" : "SIGN IN TO CHECKOUT"}
          </button>
          <Link to="/shop" className="block text-center mt-3 text-sm text-muted-foreground hover:text-gold">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}