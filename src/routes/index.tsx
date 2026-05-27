import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Truck, Award, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { bestsellers, featured, categories } from "@/data/products";
import heroImg from "@/assets/hero-racket.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jaga Traders — Premium Badminton Gear" },
      { name: "description", content: "Tournament-grade rackets, shuttles, footwear and apparel. Built for the court." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center noise-overlay">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="Premium badminton racket and shuttle" width={1920} height={1080}
               className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center w-full py-20">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-gold/40 rounded-full text-xs tracking-widest text-gold mb-6"
            >
              <Sparkles className="w-3 h-3" /> NEW SEASON 2026
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tight"
            >
              YOUR COURT.<br />
              YOUR STYLE.<br />
              <span className="text-gradient-gold">YOUR GEAR.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-6 text-lg text-muted-foreground max-w-md"
            >
              Tournament-grade badminton equipment, engineered for players who demand more from every smash.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link to="/shop" className="group inline-flex items-center gap-3 bg-gold text-primary-foreground px-8 py-4 font-bold tracking-widest text-sm hover:shadow-gold transition-shadow">
                SHOP COLLECTION
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-3 border border-foreground/20 px-8 py-4 font-bold tracking-widest text-sm hover:border-gold hover:text-gold transition-colors">
                OUR STORY
              </Link>
            </motion.div>

            <div className="mt-14 grid grid-cols-3 gap-6 max-w-md">
              {[
                { n: "50K+", l: "Players" },
                { n: "120+", l: "Pro Athletes" },
                { n: "4.9★", l: "Rated" },
              ].map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}>
                  <div className="font-display text-3xl text-gold">{s.n}</div>
                  <div className="text-xs tracking-widest text-muted-foreground mt-1">{s.l}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="animate-shuttle">
                <svg width="120" height="200" viewBox="0 0 120 200" className="text-gold/70 drop-shadow-[0_0_30px_rgba(201,168,76,0.5)]">
                  <path d="M60 40 L40 130 L60 145 L80 130 Z" fill="currentColor" opacity="0.9" />
                  <path d="M60 40 L25 110 M60 40 L40 100 M60 40 L60 95 M60 40 L80 100 M60 40 L95 110" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />
                  <circle cx="60" cy="155" r="14" fill="currentColor" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 border-y border-border bg-background/80 backdrop-blur overflow-hidden">
          <div className="flex animate-marquee py-3 whitespace-nowrap">
            {[...Array(2)].map((_, k) =>
              <div key={k} className="flex gap-12 px-6 font-display text-2xl tracking-widest text-muted-foreground/60">
                {["YONEX-LEVEL QUALITY", "★", "FREE SHIPPING OVER ₹2999", "★", "BWF APPROVED SHUTTLES", "★", "30-DAY RETURNS", "★", "PRO-TESTED GEAR", "★"].map((t, i) => <span key={i}>{t}</span>)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs tracking-widest text-gold mb-2">EXPLORE</div>
            <h2 className="font-display text-4xl md:text-5xl">SHOP BY CATEGORY</h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-sm tracking-widest hover:text-gold transition-colors">
            VIEW ALL <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((c, i) => (
            <Link key={c} to="/shop" search={{ category: c }}
              className="group aspect-square border border-border hover:border-gold bg-card flex items-center justify-center text-center p-4 transition-all hover:bg-gold/5">
              <div>
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {["🏸","🪶","👟","🎒","🧰","👕","🧵"][i]}
                </div>
                <div className="text-xs tracking-widest font-semibold group-hover:text-gold">{c.toUpperCase()}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs tracking-widest text-gold mb-2">HANDPICKED</div>
            <h2 className="font-display text-4xl md:text-5xl">FEATURED GEAR</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured().map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* BANNER */}
      <section className="my-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative overflow-hidden border border-gold/30 bg-gradient-to-br from-card via-background to-card p-10 md:p-20">
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gold/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-court/20 blur-3xl" />
            <div className="relative max-w-2xl">
              <div className="text-xs tracking-widest text-gold mb-3">LIMITED DROP</div>
              <h3 className="font-display text-4xl md:text-6xl leading-tight">
                THE <span className="text-gradient-gold">ARC PRO 88</span><br />HAS LANDED.
              </h3>
              <p className="text-muted-foreground mt-4 text-lg max-w-lg">
                88g of aerospace carbon. Built for explosive smashes and razor net play.
              </p>
              <Link to="/product/$slug" params={{ slug: "jaga-arc-pro-88" }}
                className="inline-flex items-center gap-3 mt-8 bg-gold text-primary-foreground px-8 py-4 font-bold tracking-widest text-sm hover:shadow-gold transition-shadow">
                GET YOURS <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs tracking-widest text-gold mb-2">PLAYER FAVOURITES</div>
            <h2 className="font-display text-4xl md:text-5xl">BESTSELLERS</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bestsellers().map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* TRUST */}
      <section className="py-20 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { Icon: Truck, t: "FREE SHIPPING", d: "On orders over ₹2,999" },
            { Icon: Shield, t: "2-YEAR WARRANTY", d: "On all rackets" },
            { Icon: Award, t: "BWF APPROVED", d: "Tournament-grade shuttles" },
            { Icon: Sparkles, t: "PRO-TESTED", d: "By national-level players" },
          ].map(({ Icon, t, d }, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-sm border border-gold/40 flex items-center justify-center text-gold shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display text-lg tracking-wider">{t}</div>
                <div className="text-sm text-muted-foreground mt-1">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 max-w-3xl mx-auto px-6 text-center">
        <div className="text-xs tracking-widest text-gold mb-3">JOIN THE COURT</div>
        <h3 className="font-display text-4xl md:text-5xl">DROPS, RESTOCKS &amp; PLAYER STORIES.</h3>
        <p className="text-muted-foreground mt-4">Subscribe and get 10% off your first order.</p>
        <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input type="email" required placeholder="you@court.com"
            className="flex-1 bg-card border border-border px-4 py-3 focus:border-gold outline-none" />
          <button className="bg-gold text-primary-foreground px-6 py-3 font-bold tracking-widest text-sm hover:shadow-gold transition-shadow">
            SUBSCRIBE
          </button>
        </form>
      </section>
    </div>
  );
}
