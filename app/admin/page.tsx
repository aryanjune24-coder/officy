"use client";

import Link from "next/link";
import { Activity, Package, ShoppingBag, Users } from "lucide-react";
import SiteNav, { AdminSubNav } from "../../components/SiteNav";

export default function AdminPage() {
  const modules = [
    {
      title: "Products",
      copy: "Add, edit, and manage catalog objects.",
      href: "/admin/products",
      cta: "Manage Products",
      icon: Package,
    },
    {
      title: "Orders",
      copy: "Track order status and fulfillment flow.",
      href: "/admin/orders",
      cta: "Manage Orders",
      icon: ShoppingBag,
    },
    {
      title: "Users",
      copy: "View and manage customer records.",
      href: "/admin/users",
      cta: "Manage Users",
      icon: Users,
    },
  ];

  return (
    <main className="admin-page">
      <SiteNav />
      <section className="page-shell page-hero-compact">
        <p className="eyebrow">Operations console</p>
        <h1>Admin dashboard</h1>
        <p>Real OFFICY operations, presented with a calmer control surface.</p>
      </section>
      <div className="page-shell">
        <AdminSubNav />
      </div>

      <section className="page-shell admin-metrics page-section">
        <article className="surface-card metric-card">
          <Activity size={20} />
          <span>Control surface</span>
          <strong>Live</strong>
        </article>
        <article className="surface-card metric-card">
          <Package size={20} />
          <span>Catalog modules</span>
          <strong>3</strong>
        </article>
        <article className="surface-card metric-card">
          <ShoppingBag size={20} />
          <span>Order workflow</span>
          <strong>Active</strong>
        </article>
      </section>

      <section className="page-shell dashboard-grid page-section">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <article key={module.title} className="surface-card feature-card">
              <Icon size={22} />
              <h2>{module.title}</h2>
              <p>{module.copy}</p>
              <Link href={module.href} className="button button--dark">
                {module.cta}
              </Link>
            </article>
          );
        })}
      </section>
    </main>
  );
}
