import type { Product } from "../types/product";

export const products: Product[] = [
  {
    id: "1",
    slug: "executive-ergonomic-chair",
    name: "Executive Ergonomic Chair",
    category: "Office Chairs",
    price: 18999,
    originalPrice: 24999,
    shortDescription: "Premium ergonomic seating for executive workspaces.",
    description:
      "Designed for long work sessions with premium lumbar support and executive-grade comfort.",
    images: ["/products/executive-chair.png"],
    rating: 4.8,
    reviewCount: 128,
    stock: 20,
    featured: true,
    reviews: [],
  },

  {
    id: "2",
    slug: "premium-office-desk",
    name: "Premium Office Desk",
    category: "Office Tables",
    price: 32999,
    originalPrice: 39999,
    shortDescription: "Luxury workspace desk.",
    description:
      "Modern office desk built for productivity.",
    images: ["/products/premium-desk.png"],
    rating: 4.7,
    reviewCount: 84,
    stock: 12,
    featured: true,
    reviews: [],
  }
];

export const categories = [
  "All",
  "Office Chairs",
  "Office Tables"
];
