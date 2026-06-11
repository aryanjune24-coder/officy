"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import { useToast } from "../../components/ToastProvider";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      toast({
        type: "success",
        title: "Signed in",
        message: "Welcome back to OFFICY.",
      });
      router.push("/dashboard");
    } else {
      toast({
        type: "error",
        title: "Invalid credentials",
        message: "Check your email and password, then try again.",
      });
    }
  };

  return (
    <main className="auth-page">
      <SiteNav />
      <section className="auth-shell">
        <div className="auth-copy">
          <p className="eyebrow">Private access</p>
          <h1>Welcome back to your workspace edit.</h1>
          <p>
            Sign in with the existing OFFICY credentials system to manage
            orders, saved products, and account details.
          </p>
          <div className="auth-proof">
            <span>JWT session</span>
            <span>Role-aware access</span>
            <span>Saved workspace flow</span>
          </div>
        </div>

        <div className="auth-card">
          <h2>Sign in</h2>
          <p className="muted">Continue to your OFFICY dashboard.</p>

          <div className="form-grid">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="lux-input"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="lux-input"
            />
          </div>

          <button onClick={handleLogin} className="button button--dark auth-submit">
            Login
          </button>

          <p className="auth-switch">
            New here? <Link href="/signup">Create Account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
