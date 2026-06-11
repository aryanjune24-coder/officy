"use client";

import ProductCard from "../../components/ProductCard";
import SiteNav from "../../components/SiteNav";
import { useWishlist } from "../../context/WishlistContext";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <main className="app-page">
      <SiteNav />
      <section className="page-shell page-hero-compact">
        <p className="eyebrow">Saved edit</p>
        <h1>Wishlist</h1>
        <p>Pieces held for later consideration.</p>
      </section>

      <section className="page-shell page-section">
        {wishlist.length === 0 ? (
          <div className="empty-state">
            <p>Your wishlist is empty.</p>
            <span>Save objects from the catalog to build your private edit.</span>
          </div>
        ) : (
          <div className="products-grid">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
