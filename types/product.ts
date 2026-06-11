export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  featured?: boolean;
  tags?: string[];
  reviews: Review[];
}