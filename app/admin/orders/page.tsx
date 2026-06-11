"use client";

import { useEffect, useState } from "react";
import SiteNav, { AdminSubNav } from "../../../components/SiteNav";
import { useToast } from "../../../components/ToastProvider";

type Order = {
  _id: string;
  product: string;
  customer: string;
  amount: number;
  status: "Processing" | "Delivered";
};

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleStatus = async (order: Order) => {
    const newStatus =
      order.status === "Processing" ? "Delivered" : "Processing";

    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: order._id,
        status: newStatus,
      }),
    });

    fetchOrders();
    toast({
      type: "success",
      title: "Order status updated",
      message: `${order.product} is now ${newStatus}.`,
    });
  };

  const seedOrders = async () => {
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: "Executive Ergonomic Chair",
        customer: "Rahul Mehta",
        amount: 18999,
        status: "Processing",
      }),
    });

    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: "Premium Office Desk",
        customer: "Priya Sharma",
        amount: 32999,
        status: "Delivered",
      }),
    });

    fetchOrders();
    toast({
      type: "success",
      title: "Demo orders seeded",
      message: "Two order records were added through the existing API.",
    });
  };

  const processingCount = orders.filter((order) => order.status === "Processing").length;
  const deliveredCount = orders.filter((order) => order.status === "Delivered").length;

  return (
    <main className="admin-page">
      <SiteNav />
      <section className="page-shell page-hero-compact">
        <p className="eyebrow">Fulfillment console</p>
        <h1>Admin orders</h1>
        <p>Review order activity and move fulfillment forward.</p>
      </section>
      <div className="page-shell">
        <AdminSubNav />
      </div>

      <section className="page-shell page-section">
        <div className="admin-metrics">
          <article className="surface-card metric-card">
            <span>Total orders</span>
            <strong>{orders.length}</strong>
          </article>
          <article className="surface-card metric-card">
            <span>Processing</span>
            <strong>{processingCount}</strong>
          </article>
          <article className="surface-card metric-card">
            <span>Delivered</span>
            <strong>{deliveredCount}</strong>
          </article>
        </div>

        <div className="surface-card split-row admin-toolbar">
          <div>
            <h2>Orders ledger</h2>
            <p className="muted">{orders.length} records in the operations view.</p>
          </div>
          <button onClick={seedOrders} className="button button--outline">
            Seed Demo Orders
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <p>No order records yet.</p>
            <span>Checkout-created orders and seeded demo orders appear here.</span>
          </div>
        ) : (
        <div className="admin-list">
          {orders.map((order) => (
            <article key={order._id} className="surface-card admin-row order-admin-row">
              <div>
                <h2>{order.product}</h2>
                <p className="muted">Customer: {order.customer}</p>
                <p className="muted">Rs. {order.amount.toLocaleString()}</p>
              </div>
              <button onClick={() => toggleStatus(order)} className={`status-pill status-pill--button status-pill--${order.status.toLowerCase()}`}>
                {order.status}
              </button>
            </article>
          ))}
        </div>
        )}
      </section>
    </main>
  );
}
