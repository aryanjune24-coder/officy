"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { categories } from "../../data/products";
import type { Product } from "../../types/product";
import ProductCard from "../../components/ProductCard";
import ProductFilters from "../../components/ProductFilters";
import SearchBar from "../../components/SearchBar";
import SiteNav from "../../components/SiteNav";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("featured");

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
      });
  }, []);

 const filteredProducts = useMemo(() => {
  let result = [...products];

  if (selectedCategory !== "All") {
    result = result.filter(
      (product) => product.category === selectedCategory
    );
  }

  if (searchQuery.trim()) {
    result = result.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  switch (sortOption) {
    case "price-low":
      result.sort((a, b) => a.price - b.price);
      break;

    case "price-high":
      result.sort((a, b) => b.price - a.price);
      break;

    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;

    default:
      result.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  return result;
}, [products, searchQuery, selectedCategory, sortOption]);
    

  return (
    <main className="products-page">
      <SiteNav />
      <section className="products-hero">
        <div className="products-hero__wash" />
        <div className="products-hero__fade" />
        <div className="products-hero__inner">
          <motion.div
            className="products-hero__copy"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-kicker">
              <Sparkles size={15} />
              OFFICY collection
            </div>
            <h1>Objects for a quieter, sharper workspace.</h1>
            <p>
              A curated edit of executive seating and architectural work
              surfaces, staged with the restraint of a private atelier.
            </p>
            <div className="products-hero__specs">
              <span>Gallery-first browsing</span>
              <span>Material-led categories</span>
              <span>Quiet purchase flow</span>
            </div>
          </motion.div>

          <motion.div
            className="products-hero__panel"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="products-hero__preview">
              {products.length > 0 && (
                <Image
                  src={products[0].images[0]}
                  alt={products[0].name}
                  fill
                  sizes="320px"
                />
              )}
            </div>
            <div className="products-hero__count">
              <span>Live edit</span>
              <strong>{filteredProducts.length}</strong>
            </div>
            <p>
              Filter by room, price, and rating without leaving the cinematic
              catalog flow.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="products-catalog">
        <div className="page-shell">
          <div className="products-search-wrap">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          <div className="products-layout">
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortOption={sortOption}
              onSortChange={setSortOption}
            />

            <div className="products-results">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Catalog</p>
                  <h2>
                    {selectedCategory === "All"
                      ? "Complete collection"
                      : selectedCategory}
                  </h2>
                </div>
                <a href="#product-grid">
                  Explore objects
                  <ArrowDown size={16} />
                </a>
              </div>

              {filteredProducts.length > 0 ? (
                <div
                  id="product-grid"
                  className="products-grid"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No matching objects found.</p>
                  <span>
                    Try a broader search or return to the complete collection.
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="catalog-editorial-note">
            <p className="eyebrow">Buying philosophy</p>
            <h2>Every object should earn visual space before it earns desk space.</h2>
            <p>
              The catalog intentionally stays sparse, prioritizing product
              confidence, imagery, and calmer comparison over dense inventory
              merchandising.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
