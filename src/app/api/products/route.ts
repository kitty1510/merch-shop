import { NextResponse } from "next/server";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  description: string;
  inStock: boolean;
}

const products: Product[] = [
  {
    id: "ring-obsidian",
    name: "Smart Ring – Obsidian",
    price: 299,
    originalPrice: 349,
    image: "/hero-ring.png",
    category: "Smart Devices",
    badge: "Best Seller",
    rating: 4.9,
    reviewCount: 2148,
    description: "Grade 5 Titanium with matte black PVD coating. 7-day battery, medical-grade sensors.",
    inStock: true,
  },
  {
    id: "ring-silver",
    name: "Smart Ring – Silver",
    price: 279,
    image: "/hero-ring.png",
    category: "Smart Devices",
    badge: "New",
    rating: 4.8,
    reviewCount: 956,
    description: "Polished titanium finish with 24/7 heart rate, HRV, and sleep tracking.",
    inStock: true,
  },
  {
    id: "ring-gold",
    name: "Smart Ring – Gold",
    price: 329,
    image: "/hero-ring.png",
    category: "Smart Devices",
    badge: "Limited",
    rating: 4.9,
    reviewCount: 412,
    description: "Luxurious gold PVD coating. Everything you love about the Smart Ring, elevated.",
    inStock: true,
  },
  {
    id: "charger-dock",
    name: "Wireless Charging Dock",
    price: 39,
    image: "/hero-ring.png",
    category: "Accessories",
    rating: 4.7,
    reviewCount: 3210,
    description: "Magnetic wireless charging dock. 60-minute full charge, compact travel design.",
    inStock: true,
  },
  {
    id: "merch-tshirt",
    name: "Helicorp Logo Tee",
    price: 49,
    originalPrice: 65,
    image: "/hero-ring.png",
    category: "Apparel",
    badge: "Sale",
    rating: 4.6,
    reviewCount: 891,
    description: "Premium 100% organic cotton. Minimalist Helicorp emblem on chest.",
    inStock: true,
  },
  {
    id: "merch-cap",
    name: "Helicorp Snapback Cap",
    price: 35,
    image: "/hero-ring.png",
    category: "Apparel",
    rating: 4.5,
    reviewCount: 467,
    description: "Structured 6-panel snapback with embroidered Helicorp logo.",
    inStock: false,
  },
];

export async function GET() {
  // Simulate a slight network delay to show skeleton loading
  await new Promise((resolve) => setTimeout(resolve, 600));
  return NextResponse.json({ products });
}
