"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import { useToast } from "../../components/ToastProvider";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    if (res.ok) {
      toast({
        type: "success",
        title: "Account created",
        message: "You can now sign in to your OFFICY account.",
      });
      router.push("/login");
    } else {
      toast({
        type: "error",
        title: "Signup failed",
        message: "Please review your details and try again.",
      });
    }
  };

  return (
    <main className="auth-page">
      <SiteNav />
      <section className="auth-shell">
        <div className="auth-copy">
          <p className="eyebrow">Join OFFICY</p>
          <h1>Create a calmer account experience.</h1>
          <p>
            Create an account to save pieces, review orders, and keep your
            workspace decisions in one place.
          </p>
          <div className="auth-proof">
            <span>Private wishlist</span>
            <span>Order history</span>
            <span>Calm account controls</span>
          </div>
        </div>

        <div className="auth-card">
          <h2>Create account</h2>
          <p className="muted">Save products and track orders.</p>

          <div className="form-grid">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="lux-input" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="lux-input" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="lux-input" />
          </div>

          <button onClick={handleSignup} className="button button--dark auth-submit">
            Create Account
          </button>

          <p className="auth-switch">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
