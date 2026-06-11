import ProductCard from "./ProductCard";
import type { Product } from "../types/product";

type RelatedProductsProps = {
  products: Product[];
};

export default function RelatedProducts({
  products,
}: RelatedProductsProps) {
  return (
    <section className="detail-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Adjacent pieces</p>
          <h2>Related products</h2>
        </div>
      </div>

      <div className="featured-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
