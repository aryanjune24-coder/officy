"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Heart, Package, Settings, ShoppingBag, UserRound } from "lucide-react";
import SiteNav from "../../components/SiteNav";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

type Order = {
  _id: string;
  product: string;
  customer: string;
  amount: number;
  status: string;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const customer = session?.user?.name || session?.user?.email;

    if (!customer) return;

    fetch(`/api/orders?customer=${encodeURIComponent(customer)}`)
      .then((res) => res.json())
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [session]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const recentOrders = orders.slice(0, 3);

  const cards = [
    {
      title: "My Orders",
      copy: `${orders.length} order records connected to your account.`,
      href: "/orders",
      cta: "View Orders",
      icon: Package,
    },
    {
      title: "Wishlist",
      copy: `${wishlist.length} saved objects for future workspace decisions.`,
      href: "/wishlist",
      cta: "View Wishlist",
      icon: Heart,
    },
    {
      title: "Cart",
      copy: `${cartCount} item${cartCount === 1 ? "" : "s"} waiting for review.`,
      href: "/cart",
      cta: "Review Cart",
      icon: ShoppingBag,
    },
  ];

  return (
    <main className="app-page">
      <SiteNav />
      <section className="page-shell page-hero-compact">
        <p className="eyebrow">Member studio</p>
        <h1>My dashboard</h1>
        <p>Your OFFICY account, shaped for fast review and quiet control.</p>
      </section>

      <section className="page-shell dashboard-overview">
        <div className="surface-card dashboard-profile">
          <div className="dashboard-avatar">
            <UserRound size={24} />
          </div>
          <div>
            <p className="eyebrow">Account overview</p>
            <h2>{session?.user?.name || "OFFICY member"}</h2>
            <p className="muted">{session?.user?.email || "Sign in to sync orders and account details."}</p>
          </div>
          <Link href="/account" className="button button--outline">
            <Settings size={16} />
            Settings
          </Link>
        </div>

        <div className="surface-card dashboard-recent">
          <div className="split-row">
            <div>
              <p className="eyebrow">Recent activity</p>
              <h2>Latest orders</h2>
            </div>
            <Link href="/orders" className="text-link">
              All orders
              <ArrowRight size={15} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="muted dashboard-empty-line">No order activity yet.</p>
          ) : (
            <div className="mini-order-list">
              {recentOrders.map((order) => (
                <div key={order._id} className="mini-order">
                  <span>{order.product}</span>
                  <strong>Rs. {order.amount.toLocaleString()}</strong>
                  <em>{order.status}</em>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="page-shell dashboard-command-bar">
        <Link href="/products">
          Continue curation
          <ArrowRight size={15} />
        </Link>
        <Link href="/checkout">
          Review checkout
          <ArrowRight size={15} />
        </Link>
        <Link href="/account">
          Account details
          <ArrowRight size={15} />
        </Link>
      </section>

      <section className="page-shell dashboard-grid page-section">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article key={card.title} className="surface-card feature-card">
              <Icon size={22} />
              <h2>{card.title}</h2>
              <p>{card.copy}</p>
              <Link href={card.href} className="button button--dark">
                {card.cta}
              </Link>
            </article>
          );
        })}
      </section>
    </main>
  );
}
