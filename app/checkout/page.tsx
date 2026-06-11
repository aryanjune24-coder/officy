"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SiteNav from "../../components/SiteNav";
import { useToast } from "../../components/ToastProvider";
import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!session?.user) {
      toast({
        type: "warning",
        title: "Sign in required",
        message: "Please login before placing your order.",
      });
      router.push("/login");
      return;
    }

    if (cart.length === 0) {
      toast({
        type: "warning",
        title: "Cart is empty",
        message: "Add a product before checkout.",
      });
      return;
    }

    for (const item of cart) {
      await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: item.product.name,
          customer: session.user.name || session.user.email,
          amount: item.product.price * item.quantity,
          status: "Processing",
        }),
      });
    }

    clearCart();
    toast({
      type: "success",
      title: "Order placed",
      message: "Your order history has been updated.",
    });
    router.push("/orders");
  };

  return (
    <main className="app-page">
      <SiteNav />
      <section className="page-shell page-hero-compact">
        <p className="eyebrow">Secure checkout</p>
        <h1>Review and place your order.</h1>
        <p>Confirm the objects, quantities, and total before placing your order.</p>
      </section>

      <section className="page-shell cart-layout">
        <div className="checkout-review">
          <div className="surface-card checkout-frame">
            <p className="eyebrow">Review</p>
            <h2>Objects ready for order creation</h2>
            <p className="muted">
              The existing checkout flow creates one order record per cart item.
            </p>
          </div>
          <div className="stack-list">
            {cart.map((item) => (
              <article key={item.product.id} className="cart-item">
                <div className="cart-item__image">
                  <Image src={item.product.images[0]} alt={item.product.name} fill sizes="140px" />
                </div>
                <div className="cart-item__content">
                  <h2>{item.product.name}</h2>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <strong>Rs. {(item.product.price * item.quantity).toLocaleString()}</strong>
              </article>
            ))}
          </div>
        </div>

        <aside className="order-summary">
          <p className="eyebrow">Total</p>
          <div className="checkout-progress">
            <span>Cart</span>
            <span className="is-active">Review</span>
            <span>Orders</span>
          </div>
          <div className="split-row">
            <span>Order total</span>
            <strong>Rs. {total.toLocaleString()}</strong>
          </div>
          <p className="muted">
            Authentication and order creation remain powered by the existing
            session and MongoDB API flow.
          </p>
          <button onClick={handleCheckout} className="button button--dark">
            Place Order
          </button>
        </aside>
      </section>
    </main>
  );
}
