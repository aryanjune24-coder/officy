"use client";

import { useEffect, useState } from "react";
import SiteNav, { AdminSubNav } from "../../../components/SiteNav";
import { useToast } from "../../../components/ToastProvider";

type User = {
  _id: string;
  name: string;
  email: string;
  orders: number;
};

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async () => {
    if (!name || !email) return;

    if (editingId) {
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          name,
          email,
          orders: Number(orders),
        }),
      });

      setEditingId(null);
      toast({
        type: "success",
        title: "User updated",
        message: name,
      });
    } else {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          orders: Number(orders),
        }),
      });
      toast({
        type: "success",
        title: "User added",
        message: name,
      });
    }

    setName("");
    setEmail("");
    setOrders("");
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchUsers();
    toast({
      type: "warning",
      title: "User deleted",
      message: "The customer record was removed.",
    });
  };

  const handleEdit = (user: User) => {
    setEditingId(user._id);
    setName(user.name);
    setEmail(user.email);
    setOrders(user.orders.toString());
  };

  const seedUsers = async () => {
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Aryan Singh",
        email: "aryan@officy.com",
        orders: 4,
      }),
    });

    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Rahul Mehta",
        email: "rahul@example.com",
        orders: 2,
      }),
    });

    fetchUsers();
    toast({
      type: "success",
      title: "Demo users seeded",
      message: "Two customer records were added through the existing API.",
    });
  };

  return (
    <main className="admin-page">
      <SiteNav />
      <section className="page-shell page-hero-compact">
        <p className="eyebrow">Customer operations</p>
        <h1>Admin users</h1>
        <p>Review customers, edit details, and keep records tidy.</p>
      </section>
      <div className="page-shell">
        <AdminSubNav />
      </div>

      <section className="page-shell admin-layout page-section">
        <div className="admin-metrics">
          <article className="surface-card metric-card">
            <span>Total users</span>
            <strong>{users.length}</strong>
          </article>
          <article className="surface-card metric-card">
            <span>Total order refs</span>
            <strong>{users.reduce((sum, user) => sum + user.orders, 0)}</strong>
          </article>
        </div>

        <div className="surface-card admin-form">
          <div className="split-row">
            <h2>{editingId ? "Edit User" : "Add User"}</h2>
            <button onClick={seedUsers} className="button button--outline">Seed Demo Users</button>
          </div>
          <div className="form-grid form-grid--three">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="lux-input" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="lux-input" />
            <input value={orders} onChange={(e) => setOrders(e.target.value)} placeholder="Total Orders" className="lux-input" />
          </div>
          <button onClick={handleSave} className="button button--dark">
            {editingId ? "Update User" : "Add User"}
          </button>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            <p>No customer records yet.</p>
            <span>Create or seed users to review the customer ledger.</span>
          </div>
        ) : (
        <div className="admin-list">
          {users.map((user) => (
            <article key={user._id} className="surface-card admin-row">
              <div>
                <h2>{user.name}</h2>
                <p className="muted">{user.email}</p>
                <p className="muted">Total Orders: {user.orders}</p>
              </div>
              <div className="row-actions">
                <button onClick={() => handleEdit(user)} className="button button--outline">Edit</button>
                <button onClick={() => handleDelete(user._id)} className="button button--dark">Delete</button>
              </div>
            </article>
          ))}
        </div>
        )}
      </section>
    </main>
  );
}
