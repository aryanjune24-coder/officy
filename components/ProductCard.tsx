"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "./ToastProvider";
import type { Product } from "../types/product";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();

  const inWishlist = wishlist.some(
    (item) => item.id === product.id
  );

  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="product-card__topline">
        <span className="product-card__category">
          {product.category}
        </span>
        <button
          type="button"
          aria-label={
            inWishlist
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          onClick={() => {
            toggleWishlist(product);
            toast({
              type: inWishlist ? "warning" : "success",
              title: inWishlist ? "Removed from wishlist" : "Saved to wishlist",
              message: product.name,
            });
          }}
          className={
            inWishlist
              ? "product-card__wishlist is-active"
              : "product-card__wishlist"
          }
        >
          <Heart
            size={18}
            fill={inWishlist ? "currentColor" : "none"}
          />
        </button>
      </div>

      <Link
        href={`/products/${product.slug}`}
        className="product-card__image-link"
      >
        <div className="product-card__image">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
            className="product-card__img"
          />
          <div className="product-card__image-shade" />
        </div>
      </Link>

      <div className="product-card__body">
        <div className="product-card__title-row">
          <Link href={`/products/${product.slug}`}>
            <h3>{product.name}</h3>
          </Link>
          <div className="product-card__rating">
            <Star
              size={14}
              fill="currentColor"
            />
            <span>{product.rating}</span>
          </div>
        </div>

        <p className="product-card__description">
          {product.shortDescription}
        </p>

        <div className="product-card__meta">
          <span>{product.reviewCount} reviews</span>
          <div>
            <div className="product-card__price">
              Rs. {product.price.toLocaleString()}
            </div>
            {product.originalPrice && (
              <div className="product-card__old-price">
                Rs. {product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div className="product-card__actions">
          <Link
            href={`/products/${product.slug}`}
            className="button button--dark"
          >
            View details
          </Link>
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => {
              addToCart(product);
              toast({
                type: "success",
                title: "Added to cart",
                message: `${product.name} is ready for checkout.`,
              });
            }}
            className="button-icon"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
