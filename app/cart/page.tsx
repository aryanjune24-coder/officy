"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import SiteNav from "../../components/SiteNav";
import { useToast } from "../../components/ToastProvider";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { cart, addToCart, removeFromCart } = useCart();
  const { toast } = useToast();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <main className="app-page">
      <SiteNav />
      <section className="page-shell page-hero-compact">
        <p className="eyebrow">Order composition</p>
        <h1>Your cart</h1>
        <p>Review quantities before checkout.</p>
      </section>

      <section className="page-shell cart-layout">
        {cart.length === 0 ? (
          <div className="empty-state">
            <p>Cart is empty.</p>
            <span>Explore the catalog to add your first workspace object.</span>
            <Link href="/products" className="button button--dark">
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="stack-list">
              {cart.map((item) => (
                <article key={item.product.id} className="cart-item">
                  <div className="cart-item__image">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="140px"
                    />
                  </div>
                  <div className="cart-item__content">
                    <h2>{item.product.name}</h2>
                    <p>Rs. {item.product.price.toLocaleString()}</p>
                  </div>
                  <div className="cart-item__controls">
                    <button
                      onClick={() => {
                        addToCart(item.product, -1);
                        toast({
                          type: "warning",
                          title: "Quantity updated",
                          message: item.product.name,
                        });
                      }}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <strong>{item.quantity}</strong>
                    <button
                      onClick={() => {
                        addToCart(item.product, 1);
                        toast({
                          type: "success",
                          title: "Quantity updated",
                          message: item.product.name,
                        });
                      }}
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => {
                        removeFromCart(item.product.id);
                        toast({
                          type: "warning",
                          title: "Removed from cart",
                          message: item.product.name,
                        });
                      }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="order-summary">
              <p className="eyebrow">Summary</p>
              <div className="checkout-progress">
                <span className="is-active">Cart</span>
                <span>Review</span>
                <span>Orders</span>
              </div>
              <div className="split-row">
                <span>Subtotal</span>
                <strong>Rs. {subtotal.toLocaleString()}</strong>
              </div>
              <p className="muted">Shipping and final taxes are reviewed at checkout.</p>
              <div className="summary-assurance">
                <span>Stored locally until checkout</span>
                <span>No backend cart mutation</span>
              </div>
              <Link href="/checkout" className="button button--dark">
                Proceed to Checkout
              </Link>
            </aside>
          </>
        )}
      </section>
    </main>
  );
}
