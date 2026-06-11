"use client";

import { useEffect, useState } from "react";
import SiteNav, { AdminSubNav } from "../../../components/SiteNav";
import { useToast } from "../../../components/ToastProvider";
import ImageUploader from "../../../components/ImageUploader";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
  galleryImages?: string[];
};

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async () => {
    if (!name || !price || uploadedImages.length === 0) {
      toast({
        type: "warning",
        title: "Validation Error",
        message: "Name, price, and primary image are required.",
      });
      return;
    }

    const image = uploadedImages[0];
    const galleryImages = uploadedImages.slice(1, 4);

    if (editingId) {
      await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          name,
          price: Number(price),
          category,
          description,
          image,
          galleryImages,
        }),
      });

      setEditingId(null);
      toast({
        type: "success",
        title: "Product updated",
        message: name,
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: Number(price),
          category,
          description,
          image,
          galleryImages,
        }),
      });
      toast({
        type: "success",
        title: "Product added",
        message: name,
      });
    }

    setName("");
    setPrice("");
    setCategory("");
    setDescription("");
    setUploadedImages([]);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchProducts();
    toast({
      type: "warning",
      title: "Product deleted",
      message: "The catalog record was removed.",
    });
  };

  const handleEdit = (product: Product) => {
    setEditingId(product._id);
    setName(product.name);
    setPrice(product.price.toString());
    setCategory(product.category);
    setDescription(product.description);
    
    const initialImages = [];
    if (product.image) initialImages.push(product.image);
    if (product.galleryImages) initialImages.push(...product.galleryImages);
    setUploadedImages(initialImages);
  };

  return (
    <main className="admin-page">
      <SiteNav />
      <section className="page-shell page-hero-compact">
        <p className="eyebrow">Catalog operations</p>
        <h1>Admin products</h1>
        <p>Maintain the product catalog from one polished workspace.</p>
      </section>
      <div className="page-shell">
        <AdminSubNav />
      </div>

      <section className="page-shell admin-layout page-section">
        <div className="admin-metrics">
          <article className="surface-card metric-card">
            <span>Total records</span>
            <strong>{products.length}</strong>
          </article>
          <article className="surface-card metric-card">
            <span>Editing mode</span>
            <strong>{editingId ? "On" : "Off"}</strong>
          </article>
        </div>

        <div className="surface-card admin-form">
          <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
          <div className="form-grid form-grid--two">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" className="lux-input" />
            <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="lux-input" />
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="lux-input" />
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="lux-input" />
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>Product Images (Drag & Drop)</p>
              <ImageUploader 
                images={uploadedImages} 
                onChange={setUploadedImages} 
                maxImages={4} 
              />
            </div>
          </div>
          <button onClick={handleSave} className="button button--dark">
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <p>No MongoDB products yet.</p>
            <span>Create a product record to populate the admin catalog ledger.</span>
          </div>
        ) : (
        <div className="admin-list">
          {products.map((product) => (
            <article key={product._id} className="surface-card admin-row">
              <div>
                <h2>{product.name}</h2>
                <p className="muted">Rs. {product.price.toLocaleString()} / {product.category}</p>
                <p className="muted">{product.description}</p>
              </div>
              <div className="row-actions">
                <button onClick={() => handleEdit(product)} className="button button--outline">Edit</button>
                <button onClick={() => handleDelete(product._id)} className="button button--dark">Delete</button>
              </div>
            </article>
          ))}
        </div>
        )}
      </section>
    </main>
  );
}
