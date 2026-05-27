import racketPro from "@/assets/product-racket-pro.jpg";
import shuttles from "@/assets/product-shuttles.jpg";
import shoes from "@/assets/product-shoes.jpg";
import bag from "@/assets/product-bag.jpg";
import grip from "@/assets/product-grip.jpg";
import strings from "@/assets/product-strings.jpg";
import jersey from "@/assets/product-jersey.jpg";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Rackets" | "Shuttlecocks" | "Footwear" | "Bags" | "Accessories" | "Apparel" | "Strings";
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured?: boolean;
  bestseller?: boolean;
  isNew?: boolean;
  tagline: string;
  description: string;
  specs: { label: string; value: string }[];
};

export const products: Product[] = [
  {
    id: "1", slug: "jaga-arc-pro-88", name: "Jaga Arc Pro 88",
    category: "Rackets", price: 14999, oldPrice: 17999, image: racketPro,
    rating: 4.8, reviews: 312, inStock: true, featured: true, bestseller: true,
    tagline: "Tournament-grade carbon attack racket",
    description: "Engineered for explosive smashes and razor-fast net play. Aerospace-grade carbon frame, head-heavy balance, and isometric string bed for a 12% larger sweet spot.",
    specs: [
      { label: "Weight", value: "88g (4U)" },
      { label: "Balance", value: "Head Heavy" },
      { label: "Flex", value: "Stiff" },
      { label: "String Tension", value: "Up to 32 lbs" },
      { label: "Grip Size", value: "G5" },
    ],
  },
  {
    id: "2", slug: "jaga-feather-tour", name: "Feather Tour Shuttles (Tube of 12)",
    category: "Shuttlecocks", price: 1899, oldPrice: 2299, image: shuttles,
    rating: 4.7, reviews: 528, inStock: true, featured: true, bestseller: true,
    tagline: "BWF-approved goose feather shuttles",
    description: "Hand-selected goose feathers with a natural cork base for tournament-level flight stability.",
    specs: [
      { label: "Speed", value: "77 (Medium)" }, { label: "Feather", value: "Goose" },
      { label: "Quantity", value: "12 per tube" }, { label: "Use", value: "Tournament" },
    ],
  },
  {
    id: "3", slug: "jaga-court-blade-x", name: "Court Blade X",
    category: "Footwear", price: 8499, oldPrice: 9999, image: shoes,
    rating: 4.6, reviews: 184, inStock: true, featured: true,
    tagline: "Power Cushion+ midsole, gum sole grip",
    description: "All-court badminton shoe with a low-profile chassis, lateral support cage, and shock-absorbing midsole.",
    specs: [
      { label: "Drop", value: "8mm" }, { label: "Outsole", value: "Non-marking Gum" },
      { label: "Upper", value: "Engineered Mesh" }, { label: "Sizes", value: "UK 6 — UK 12" },
    ],
  },
  {
    id: "4", slug: "jaga-pro-thermo-bag", name: "Pro Thermo Bag 9R",
    category: "Bags", price: 5499, image: bag,
    rating: 4.9, reviews: 96, inStock: true, bestseller: true,
    tagline: "Holds 9 rackets, thermal-lined main compartment",
    description: "Protects your gear from heat and humidity with a thermal-lined main compartment and dedicated shoe pocket.",
    specs: [
      { label: "Capacity", value: "9 rackets" }, { label: "Material", value: "Thermo PU" },
      { label: "Pockets", value: "4 incl. shoe" }, { label: "Straps", value: "Padded backpack" },
    ],
  },
  {
    id: "5", slug: "jaga-tack-grip-x5", name: "Tack Grip X5 (Pack of 5)",
    category: "Accessories", price: 549, oldPrice: 699, image: grip,
    rating: 4.5, reviews: 740, inStock: true, isNew: true,
    tagline: "Sweat-absorbing PU overgrip",
    description: "Ultra-tacky PU overgrip with micro-perforations. Five-pack in tournament black.",
    specs: [
      { label: "Thickness", value: "0.6mm" }, { label: "Material", value: "Micro PU" },
      { label: "Pack", value: "5 grips" },
    ],
  },
  {
    id: "6", slug: "jaga-bg-aero-66", name: "BG Aero 66 String Reel",
    category: "Strings", price: 2499, image: strings,
    rating: 4.7, reviews: 211, inStock: true, featured: true,
    tagline: "0.66mm high-repulsion nylon",
    description: "Multifilament nylon string for high repulsion, sharp sound, and tournament durability.",
    specs: [
      { label: "Gauge", value: "0.66mm" }, { label: "Length", value: "200m reel" },
      { label: "Tension", value: "20 — 30 lbs" },
    ],
  },
  {
    id: "7", slug: "jaga-court-polo", name: "Court Polo — Black/Gold",
    category: "Apparel", price: 1999, oldPrice: 2499, image: jersey,
    rating: 4.6, reviews: 132, inStock: true, isNew: true,
    tagline: "Moisture-wicking match polo",
    description: "Premium 4-way stretch polo with mesh underarm panels and a tailored athletic fit.",
    specs: [
      { label: "Fabric", value: "Polyester / Spandex" }, { label: "Fit", value: "Athletic" },
      { label: "Sizes", value: "S — XXL" },
    ],
  },
  {
    id: "8", slug: "jaga-arc-pro-78", name: "Jaga Arc Pro 78 Lite",
    category: "Rackets", price: 11499, image: racketPro,
    rating: 4.5, reviews: 88, inStock: false,
    tagline: "Even-balance all-rounder, 78g",
    description: "An even-balanced lightweight frame ideal for doubles and fast hands at the net.",
    specs: [
      { label: "Weight", value: "78g (5U)" }, { label: "Balance", value: "Even" },
      { label: "Flex", value: "Medium" }, { label: "Tension", value: "Up to 30 lbs" },
    ],
  },
];

export const categories = [
  "Rackets", "Shuttlecocks", "Footwear", "Bags", "Accessories", "Apparel", "Strings",
] as const;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const featured = () => products.filter((p) => p.featured);
export const bestsellers = () => products.filter((p) => p.bestseller);
export const related = (id: string, cat: string) =>
  products.filter((p) => p.id !== id && p.category === cat).slice(0, 4);