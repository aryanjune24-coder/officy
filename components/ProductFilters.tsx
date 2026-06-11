"use client";

import { motion } from "framer-motion";
import { ArrowDownAZ, SlidersHorizontal } from "lucide-react";

type ProductFiltersProps = {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortOption: string;
  onSortChange: (sort: string) => void;
};

export default function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <motion.aside
      className="product-filters"
      initial={{ opacity: 0, x: -22 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="product-filters__header">
        <div>
          <p className="eyebrow">Curation</p>
          <h3>Refine the edit</h3>
        </div>
        <div className="product-filters__mark">
          <SlidersHorizontal size={18} />
        </div>
      </div>

      <div className="product-filters__group">
        <label>Product room</label>
        <div className="product-filters__options">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={
                selectedCategory === category
                  ? "product-filters__option is-active"
                  : "product-filters__option"
              }
            >
              <span>{category}</span>
              <span className="product-filters__dot" />
            </button>
          ))}
        </div>
      </div>

      <div className="product-filters__group">
        <label className="product-filters__sort-label">
          <ArrowDownAZ size={16} />
          Sort by
        </label>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="product-filters__select"
        >
          <option value="featured">Featured edit</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </motion.aside>
  );
}
