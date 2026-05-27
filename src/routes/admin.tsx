import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, Plus, Trash2, Pencil, Upload, X, Package, Image as ImageIcon, Tag, BarChart3 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Jaga Traders" }] }),
  component: Admin,
});

type Tab = "dashboard" | "products" | "banners" | "categories";

type ProductRow = {
  id: string; name: string; slug: string; price: number; old_price: number | null;
  stock: number; in_stock: boolean; featured: boolean; bestseller: boolean; is_new: boolean;
  category_name: string | null; tagline: string | null; description: string | null;
  primary_image: string | null; is_active: boolean;
};

function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("dashboard");

  if (loading) return <div className="py-32 text-center text-muted-foreground">Loading…</div>;

  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <ShieldAlert className="w-12 h-12 mx-auto text-destructive" />
        <h1 className="font-display text-3xl mt-4">ACCESS RESTRICTED</h1>
        <p className="text-muted-foreground mt-2 text-sm">This area is reserved for administrators.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-xs tracking-widest text-gold">CONTROL CENTER</div>
      <h1 className="font-display text-5xl mt-2">ADMIN DASHBOARD</h1>
      <p className="text-muted-foreground mt-2">Welcome, {user.email}.</p>

      <div className="flex flex-wrap gap-2 mt-10 border-b border-border">
        {([
          ["dashboard","Dashboard", BarChart3],
          ["products","Products", Package],
          ["banners","Banners", ImageIcon],
          ["categories","Categories", Tag],
        ] as const).map(([k,l,Icon]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-3 text-xs tracking-widest font-semibold flex items-center gap-2 border-b-2 transition-colors ${tab===k ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <Icon className="w-4 h-4" /> {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "dashboard" && <DashboardTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "banners" && <BannersTab />}
        {tab === "categories" && <CategoriesTab />}
      </div>
    </div>
  );
}

function DashboardTab() {
  const [stats, setStats] = useState({ products: 0, users: 0, lowStock: 0, banners: 0 });
  useEffect(() => {
    (async () => {
      const [p, u, l, b] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }).lt("stock", 10),
        supabase.from("banners").select("*", { count: "exact", head: true }),
      ]);
      setStats({ products: p.count ?? 0, users: u.count ?? 0, lowStock: l.count ?? 0, banners: b.count ?? 0 });
    })();
  }, []);
  const cards = [
    { l: "PRODUCTS", v: stats.products },
    { l: "CUSTOMERS", v: stats.users },
    { l: "LOW STOCK", v: stats.lowStock },
    { l: "BANNERS", v: stats.banners },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c) => (
        <motion.div key={c.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="border border-border bg-card p-6 hover:border-gold transition-colors">
          <div className="text-[10px] tracking-widest text-muted-foreground">{c.l}</div>
          <div className="font-display text-5xl text-gold mt-3">{c.v}</div>
        </motion.div>
      ))}
    </div>
  );
}

function ProductsTab() {
  const [items, setItems] = useState<ProductRow[]>([]);
  const [editing, setEditing] = useState<Partial<ProductRow> | null>(null);
  const [q, setQ] = useState("");

  const load = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setItems((data as ProductRow[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const filtered = items.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  const quickToggle = async (id: string, field: "is_active" | "featured" | "bestseller", value: boolean) => {
    const update = { [field]: value } as { is_active?: boolean; featured?: boolean; bestseller?: boolean };
    const { error } = await supabase.from("products").update(update).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…"
          className="bg-card border border-border px-4 py-2 text-sm flex-1 min-w-[200px] focus:border-gold outline-none" />
        <button onClick={() => setEditing({ name: "", slug: "", price: 0, stock: 0, in_stock: true, featured: false, bestseller: false, is_new: true, is_active: true })}
          className="bg-gold text-primary-foreground px-5 py-2 text-xs tracking-widest font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> NEW PRODUCT
        </button>
      </div>

      <div className="border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-xs tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left p-3">Product</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-center p-3">Active</th>
              <th className="text-center p-3">Featured</th>
              <th className="text-center p-3">Best</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-border hover:bg-secondary/40">
                <td className="p-3">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.slug} · {p.category_name}</div>
                </td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">
                  <span className={p.stock < 10 ? "text-destructive font-semibold" : ""}>{p.stock}</span>
                </td>
                <td className="p-3 text-center"><Toggle on={p.is_active} onChange={(v) => quickToggle(p.id,"is_active",v)} /></td>
                <td className="p-3 text-center"><Toggle on={p.featured} onChange={(v) => quickToggle(p.id,"featured",v)} /></td>
                <td className="p-3 text-center"><Toggle on={p.bestseller} onChange={(v) => quickToggle(p.id,"bestseller",v)} /></td>
                <td className="p-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditing(p)} className="p-2 hover:text-gold"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => del(p.id)} className="p-2 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No products</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && <ProductEditor row={editing} onClose={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)}
      className={`w-10 h-5 rounded-full transition-colors relative ${on ? "bg-gold" : "bg-muted"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-background transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

function ProductEditor({ row, onClose }: { row: Partial<ProductRow>; onClose: () => void }) {
  const [form, setForm] = useState<Partial<ProductRow>>(row);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const isNew = !row.id;

  const upload = async (file: File) => {
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((f) => ({ ...f, primary_image: pub.publicUrl }));
    setUploading(false);
    toast.success("Image uploaded");
  };

  const save = async () => {
    if (!form.name || !form.slug) return toast.error("Name and slug required");
    const payload = {
      name: form.name, slug: form.slug, price: Number(form.price ?? 0),
      old_price: form.old_price ? Number(form.old_price) : null,
      stock: Number(form.stock ?? 0), in_stock: form.in_stock ?? true,
      featured: !!form.featured, bestseller: !!form.bestseller, is_new: !!form.is_new,
      is_active: form.is_active ?? true,
      category_name: form.category_name ?? null,
      tagline: form.tagline ?? null, description: form.description ?? null,
      primary_image: form.primary_image ?? null,
    };
    const { error } = isNew
      ? await supabase.from("products").insert(payload)
      : await supabase.from("products").update(payload).eq("id", row.id!);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Created" : "Saved");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur flex items-start justify-center overflow-y-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-card border border-border my-10">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="font-display text-2xl">{isNew ? "NEW PRODUCT" : "EDIT PRODUCT"}</div>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          {form.primary_image && (
            <div className="aspect-video bg-secondary border border-border overflow-hidden">
              <img src={form.primary_image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <input ref={fileRef} type="file" accept="image/*" hidden
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="w-full py-3 border-2 border-dashed border-border hover:border-gold transition-colors text-sm flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" /> {uploading ? "Uploading…" : "UPLOAD IMAGE"}
            </button>
          </div>
          <Field label="Name" value={form.name ?? ""} onChange={(v) => setForm({ ...form, name: v, slug: form.slug || v.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") })} />
          <Field label="Slug (URL)" value={form.slug ?? ""} onChange={(v) => setForm({ ...form, slug: v })} />
          <Field label="Category" value={form.category_name ?? ""} onChange={(v) => setForm({ ...form, category_name: v })} />
          <Field label="Tagline" value={form.tagline ?? ""} onChange={(v) => setForm({ ...form, tagline: v })} />
          <div>
            <label className="text-[10px] tracking-widest text-muted-foreground">DESCRIPTION</label>
            <textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4} className="w-full bg-background border border-border px-3 py-2 mt-1 focus:border-gold outline-none" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Price ₹" type="number" value={String(form.price ?? 0)} onChange={(v) => setForm({ ...form, price: Number(v) })} />
            <Field label="Old Price ₹" type="number" value={String(form.old_price ?? "")} onChange={(v) => setForm({ ...form, old_price: v ? Number(v) : null })} />
            <Field label="Stock" type="number" value={String(form.stock ?? 0)} onChange={(v) => setForm({ ...form, stock: Number(v) })} />
          </div>
          <div className="flex flex-wrap gap-5 pt-2">
            <Check label="Active" v={!!form.is_active} on={(v) => setForm({ ...form, is_active: v })} />
            <Check label="In Stock" v={!!form.in_stock} on={(v) => setForm({ ...form, in_stock: v })} />
            <Check label="Featured" v={!!form.featured} on={(v) => setForm({ ...form, featured: v })} />
            <Check label="Bestseller" v={!!form.bestseller} on={(v) => setForm({ ...form, bestseller: v })} />
            <Check label="New" v={!!form.is_new} on={(v) => setForm({ ...form, is_new: v })} />
          </div>
        </div>
        <div className="p-5 border-t border-border flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-sm border border-border">Cancel</button>
          <button onClick={save} className="px-6 py-2 text-sm tracking-widest font-bold bg-gold text-primary-foreground">SAVE</button>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-[10px] tracking-widest text-muted-foreground">{label.toUpperCase()}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border px-3 py-2 mt-1 focus:border-gold outline-none" />
    </div>
  );
}

function Check({ label, v, on }: { label: string; v: boolean; on: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm">
      <Toggle on={v} onChange={on} /> {label}
    </label>
  );
}

function BannersTab() {
  const [items, setItems] = useState<{ id: string; title: string; subtitle: string | null; image_url: string; is_active: boolean }[]>([]);
  const [uploading, setUploading] = useState(false);
  const load = async () => {
    const { data } = await supabase.from("banners").select("*").order("sort_order");
    setItems((data as typeof items) ?? []);
  };
  useEffect(() => { load(); }, []);
  const addBanner = async (file: File) => {
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("banners").upload(path, file);
    if (upErr) { toast.error(upErr.message); setUploading(false); return; }
    const { data: pub } = supabase.storage.from("banners").getPublicUrl(path);
    await supabase.from("banners").insert({ title: file.name, image_url: pub.publicUrl, sort_order: items.length + 1 });
    setUploading(false); toast.success("Banner added"); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await supabase.from("banners").delete().eq("id", id); load();
  };
  return (
    <div>
      <label className="block mb-5">
        <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && addBanner(e.target.files[0])} />
        <div className="border-2 border-dashed border-border hover:border-gold cursor-pointer py-10 text-center text-sm">
          <Upload className="w-6 h-6 mx-auto mb-2" /> {uploading ? "Uploading…" : "UPLOAD NEW BANNER"}
        </div>
      </label>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((b) => (
          <div key={b.id} className="border border-border bg-card overflow-hidden">
            <div className="aspect-video bg-secondary"><img src={b.image_url} alt={b.title} className="w-full h-full object-cover" /></div>
            <div className="p-3 flex justify-between items-center">
              <div className="text-xs truncate">{b.title}</div>
              <button onClick={() => remove(b.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoriesTab() {
  const [items, setItems] = useState<{ id: string; name: string; slug: string; is_active: boolean }[]>([]);
  const [name, setName] = useState("");
  const load = async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setItems((data as typeof items) ?? []);
  };
  useEffect(() => { load(); }, []);
  const add = async () => {
    if (!name) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const { error } = await supabase.from("categories").insert({ name, slug, sort_order: items.length + 1 });
    if (error) return toast.error(error.message);
    setName(""); load();
  };
  const del = async (id: string) => { await supabase.from("categories").delete().eq("id", id); load(); };
  return (
    <div>
      <div className="flex gap-3 mb-5">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name"
          className="flex-1 bg-card border border-border px-4 py-2 text-sm focus:border-gold outline-none" />
        <button onClick={add} className="bg-gold text-primary-foreground px-5 py-2 text-xs tracking-widest font-bold">ADD</button>
      </div>
      <div className="border border-border bg-card divide-y divide-border">
        {items.map((c) => (
          <div key={c.id} className="p-4 flex items-center justify-between">
            <div><div className="font-semibold">{c.name}</div><div className="text-xs text-muted-foreground">{c.slug}</div></div>
            <button onClick={() => del(c.id)} className="text-destructive p-2"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}