"use client";

import Image from "next/image";
import { use, useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, PackageCheck, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import type { Product } from "../../../types/product";
import { useCart } from "../../../context/CartContext";
import QuantitySelector from "../../../components/QuantitySelector";
import ProductReviews from "../../../components/ProductReviews";
import RelatedProducts from "../../../components/RelatedProducts";
import SiteNav from "../../../components/SiteNav";
import { useToast } from "../../../components/ToastProvider";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function ProductDetailPage({
  params,
}: ProductPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const mappedProducts = data.map((item: any) => ({
          ...item,
          id: item._id,
          slug: item._id,
          images: [item.image || "/products/premium-desk.png", ...(item.galleryImages || [])],
          rating: 5,
          reviewCount: 0,
          featured: false,
          stock: 10,
          shortDescription: item.description,
          reviews: [],
        }));
        setProducts(mappedProducts);
        setLoading(false);
      });
  }, []);

  const product = products.find(
    (item) => item.slug === resolvedParams.slug
  );

  if (loading) {
    return <main className="app-page"><SiteNav /><div className="page-shell">Loading...</div></main>;
  }

  if (!product) {
    notFound();
  }

  const relatedProducts = products.filter(
    (item) =>
      item.category === product.category &&
      item.id !== product.id
  );

  const productNotes = [
    { label: "Material mood", value: product.category === "Office Chairs" ? "Graphite leather" : "Walnut surface" },
    { label: "Studio fit", value: "Executive workspace" },
    { label: "Availability", value: `${product.stock} in stock` },
  ];

  return (
    <main className="app-page">
      <SiteNav />
      <section className="product-detail page-shell">
        <Link href="/products" className="back-link">
          <ArrowLeft size={16} />
          Back to catalog
        </Link>

        <div className="product-detail__grid">
          <div className="product-detail__media">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 980px) 52vw, 100vw"
            />
          </div>

          <div className="product-detail__content">
            <p className="eyebrow">{product.category}</p>
            <h1>{product.name}</h1>
            <p className="product-detail__copy">{product.description}</p>

            <div className="product-detail__rating">
              <Star size={17} fill="currentColor" />
              <strong>{product.rating}</strong>
              <span>{product.reviewCount} reviews</span>
            </div>

            <div className="product-detail__price-row">
              <div>
                <p className="product-detail__price">
                  Rs. {product.price.toLocaleString()}
                </p>
                {product.originalPrice && (
                  <span>Rs. {product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            </div>

            <div className="product-detail__actions">
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  toast({
                    type: "success",
                    title: "Added to cart",
                    message: `${quantity} x ${product.name} added without leaving the page.`,
                  });
                }}
                className="button button--dark"
              >
                Add to Cart
              </button>

              <button
                onClick={() => {
                  addToCart(product, quantity);
                  toast({
                    type: "success",
                    title: "Ready for checkout",
                    message: `${quantity} x ${product.name} added to your cart.`,
                  });
                  router.push("/checkout");
                }}
                className="button button--outline"
              >
                Buy Now
              </button>
            </div>

            <div className="assurance-grid">
              <div>
                <ShieldCheck size={20} />
                <span>Verified materials</span>
              </div>
              <div>
                <PackageCheck size={20} />
                <span>Priority delivery</span>
              </div>
            </div>

            <div className="product-note-grid">
              {productNotes.map((note) => (
                <div key={note.label}>
                  <span>{note.label}</span>
                  <strong>{note.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="product-material-story">
          <div>
            <p className="eyebrow">Design reading</p>
            <h2>Built for rooms that need focus before ornament.</h2>
          </div>
          <p>
            This piece is presented as part of the OFFICY studio language:
            quiet silhouettes, warm material contrast, and controls that
            support the buying decision without competing with the object.
          </p>
        </section>

        <ProductReviews reviews={product.reviews} />

        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </section>
    </main>
  );
}
