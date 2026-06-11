"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import SiteNav from "../components/SiteNav";
import { categories, products } from "../data/products";

const trustSignals = [
  {
    title: "Verified materials",
    copy: "Premium workspace objects with clear product information.",
    icon: BadgeCheck,
  },
  {
    title: "Protected checkout",
    copy: "Order review remains calm and structured before placement.",
    icon: ShieldCheck,
  },
  {
    title: "Priority dispatch",
    copy: "Order status stays visible from account and admin views.",
    icon: Truck,
  },
  {
    title: "Support ready",
    copy: "Account, cart, wishlist, and orders stay easy to reach.",
    icon: Headphones,
  },
];

const collectionTiles = [
  {
    title: "Executive seating",
    copy: "Ergonomic chairs with graphite profiles and long-session comfort.",
    image: "/products/executive-chair.png",
    href: "/products",
  },
  {
    title: "Architectural desks",
    copy: "Warm walnut surfaces built for focused work and clean setups.",
    image: "/products/premium-desk.png",
    href: "/products",
  },
];

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.45], [0, 70]);

  const featuredProducts = products.filter((product) => product.featured);
  const visibleCategories = categories.filter((category) => category !== "All");
  const heroProduct = products[0];
  const secondaryProduct = products[1] || products[0];

  return (
    <main className="home-page">
      <SiteNav />

      <section className="commerce-hero">
        <div className="commerce-hero__inner">
          <motion.div
            className="commerce-hero__copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">New collection / workspace 2026</p>
            <h1>Modern office pieces for rooms that work beautifully.</h1>
            <p>
              Shop a focused edit of premium chairs and desks made for cleaner
              posture, calmer rooms, and sharper everyday productivity.
            </p>
            <div className="commerce-hero__actions">
              <Link href="/products" className="button button--dark">
                Shop now
                <ArrowRight size={17} />
              </Link>
              <Link href={`/products/${heroProduct.slug}`} className="button button--outline">
                View featured piece
              </Link>
            </div>
          </motion.div>

          <motion.div className="commerce-hero__product" style={{ y: heroY }}>
            <div className="commerce-hero__badge">Best seller</div>
            <Image
              src={heroProduct.images[0]}
              alt={heroProduct.name}
              fill
              priority
              sizes="(min-width: 980px) 48vw, 100vw"
            />
          </motion.div>

          <div className="commerce-hero__side">
            <div>
              <span>From</span>
              <strong>Rs. {heroProduct.price.toLocaleString()}</strong>
            </div>
            <p>{heroProduct.shortDescription}</p>
            <Link href="/products" className="text-link">
              Browse collection
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="page-shell hero-category-strip">
          {visibleCategories.map((category) => {
            const product =
              products.find((item) => item.category === category) || heroProduct;

            return (
              <Link key={category} href="/products" className="hero-category-card">
                <div>
                  <Image src={product.images[0]} alt={category} fill sizes="180px" />
                </div>
                <span>{category}</span>
              </Link>
            );
          })}
          <Link href={`/products/${secondaryProduct.slug}`} className="hero-category-card hero-category-card--wide">
            <div>
              <Image src={secondaryProduct.images[0]} alt={secondaryProduct.name} fill sizes="240px" />
            </div>
            <span>Featured: {secondaryProduct.name}</span>
          </Link>
        </div>
      </section>

      <section className="page-shell home-featured home-featured--priority">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured products</p>
            <h2>Shop the studio edit.</h2>
          </div>
          <Link href="/products">
            All products
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="featured-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="page-shell page-section">
        <div className="collection-panels">
          {collectionTiles.map((tile) => (
            <Link key={tile.title} href={tile.href} className="collection-panel">
              <Image src={tile.image} alt={tile.title} fill sizes="(min-width: 980px) 50vw, 100vw" />
              <div>
                <p className="eyebrow">Shop by collection</p>
                <h3>{tile.title}</h3>
                <span>{tile.copy}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell page-section">
        <div className="product-benefit-layout">
          <div>
            <p className="eyebrow">Why choose OFFICY</p>
            <h2>Product confidence before checkout pressure.</h2>
            <p>
              The experience keeps comparison simple: visible prices, clear
              product imagery, fast wishlist and cart actions, and persistent
              account access.
            </p>
          </div>
          <div className="trust-grid trust-grid--compact">
            {trustSignals.map((signal) => {
              const Icon = signal.icon;

              return (
                <article key={signal.title} className="surface-card feature-card">
                  <Icon size={22} />
                  <h3>{signal.title}</h3>
                  <p>{signal.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-shell page-section">
        <div className="discount-band">
          <div>
            <p className="eyebrow">Studio offer</p>
            <h2>Build a calmer workspace with fewer, better pieces.</h2>
            <Link href="/products" className="button button--light">
              Shop collection
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="discount-band__product">
            <Image
              src={secondaryProduct.images[0]}
              alt={secondaryProduct.name}
              fill
              sizes="(min-width: 980px) 36vw, 100vw"
            />
          </div>
          <span>
            <RotateCcw size={16} />
            Easy cart updates
          </span>
        </div>
      </section>
    </main>
  );
}
