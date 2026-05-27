import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LogOut, ShoppingBag, Heart, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — Jaga Traders" }] }),
  component: Account,
});

function Account() {
  const { user, loading, isAdmin, signOut, openLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) openLogin();
  }, [loading, user, openLogin]);

  if (!user) return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <h1 className="font-display text-3xl">SIGN IN REQUIRED</h1>
      <p className="text-muted-foreground mt-2 text-sm">Please sign in to view your account.</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-xs tracking-widest text-gold">MEMBER AREA</div>
      <h1 className="font-display text-5xl mt-2">MY ACCOUNT</h1>
      <p className="text-muted-foreground mt-2">{user.email}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        <Link to="/cart" className="border border-border bg-card p-6 hover:border-gold transition-colors group">
          <ShoppingBag className="w-6 h-6 text-gold" />
          <div className="font-display text-xl mt-4 group-hover:text-gold">YOUR BAG</div>
          <p className="text-sm text-muted-foreground mt-1">View items in your cart</p>
        </Link>
        <Link to="/wishlist" className="border border-border bg-card p-6 hover:border-gold transition-colors group">
          <Heart className="w-6 h-6 text-gold" />
          <div className="font-display text-xl mt-4 group-hover:text-gold">WISHLIST</div>
          <p className="text-sm text-muted-foreground mt-1">Your saved gear</p>
        </Link>
        {isAdmin && (
          <Link to="/admin" className="border border-gold/40 bg-gold/5 p-6 hover:border-gold transition-colors group">
            <ShieldCheck className="w-6 h-6 text-gold" />
            <div className="font-display text-xl mt-4 text-gold">ADMIN DASHBOARD</div>
            <p className="text-sm text-muted-foreground mt-1">Manage products & orders</p>
          </Link>
        )}
      </div>

      <button
        onClick={async () => { await signOut(); navigate({ to: "/" }); }}
        className="mt-10 inline-flex items-center gap-2 border border-border px-6 py-3 text-sm tracking-widest hover:border-destructive hover:text-destructive transition-colors"
      >
        <LogOut className="w-4 h-4" /> SIGN OUT
      </button>
    </div>
  );
}