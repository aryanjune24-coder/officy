"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock3, PackageCheck } from "lucide-react";
import SiteNav from "../../components/SiteNav";

type Order = {
  _id: string;
  product: string;
  customer: string;
  amount: number;
  status: string;
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/login");
      return;
    }

    fetchOrders();
  }, [session, status]);

  const fetchOrders = async () => {
    const customer = session?.user?.name || session?.user?.email;

    const res = await fetch(
      `/api/orders?customer=${encodeURIComponent(customer as string)}`
    );

    const data = await res.json();
    setOrders(data);
  };

  const totalSpend = orders.reduce((sum, order) => sum + order.amount, 0);
  const deliveredCount = orders.filter((order) => order.status === "Delivered").length;

  return (
    <main className="app-page">
      <SiteNav />
      <section className="page-shell page-hero-compact">
        <p className="eyebrow">Order history</p>
        <h1>My orders</h1>
        <p>Track purchases from the existing orders API.</p>
      </section>

      <section className="page-shell page-section">
        <div className="order-insights">
          <article className="surface-card metric-card">
            <span>Orders</span>
            <strong>{orders.length}</strong>
          </article>
          <article className="surface-card metric-card">
            <span>Delivered</span>
            <strong>{deliveredCount}</strong>
          </article>
          <article className="surface-card metric-card">
            <span>Total value</span>
            <strong>Rs. {totalSpend.toLocaleString()}</strong>
          </article>
        </div>
        {orders.length === 0 ? (
          <div className="empty-state">
            <p>No orders yet.</p>
            <span>Placed orders will appear here after checkout.</span>
          </div>
        ) : (
          <div className="stack-list">
            {orders.map((order) => (
              <article key={order._id} className="surface-card order-card">
                <div>
                  <div className="split-row order-card__top">
                    <div>
                      <p className="eyebrow">Order</p>
                      <h2>{order.product}</h2>
                    </div>
                    <span className={`status-pill status-pill--${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="muted">Rs. {order.amount.toLocaleString()}</p>
                  <div className="order-timeline">
                    <div className="order-timeline__step is-complete">
                      <CheckCircle2 size={17} />
                      <span>Placed</span>
                    </div>
                    <div className={`order-timeline__step ${order.status === "Delivered" ? "is-complete" : "is-active"}`}>
                      <Clock3 size={17} />
                      <span>Processing</span>
                    </div>
                    <div className={`order-timeline__step ${order.status === "Delivered" ? "is-complete" : ""}`}>
                      <PackageCheck size={17} />
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
