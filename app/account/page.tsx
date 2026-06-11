"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, ShieldCheck, UserRound } from "lucide-react";
import SiteNav from "../../components/SiteNav";
import { useToast } from "../../components/ToastProvider";

export default function AccountPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setName(session?.user?.name || "");
    setEmail(session?.user?.email || "");
  }, [session]);

  const notifySaved = (title: string) => {
    toast({
      type: "success",
      title,
      message: "Your local account view has been updated.",
    });
  };

  return (
    <main className="app-page">
      <SiteNav />
      <section className="page-shell page-hero-compact">
        <p className="eyebrow">Profile controls</p>
        <h1>Account settings</h1>
        <p>Personal and security settings presented with the same OFFICY system.</p>
      </section>

      <section className="page-shell account-profile">
        <div className="surface-card dashboard-profile">
          <div className="dashboard-avatar">
            <UserRound size={24} />
          </div>
          <div>
            <p className="eyebrow">Profile</p>
            <h2>{name || "OFFICY member"}</h2>
            <p className="muted">{email || "Add your email to complete the profile."}</p>
          </div>
        </div>
        <div className="surface-card account-note">
          <Bell size={22} />
          <div>
            <h2>Preference center</h2>
            <p className="muted">Account edits stay frontend-only until a profile API is connected.</p>
          </div>
        </div>
      </section>

      <section className="page-shell settings-grid page-section">
        <div className="surface-card">
          <h2>Personal Information</h2>
          <div className="form-grid">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full Name" className="lux-input" />
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="lux-input" />
            <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone" className="lux-input" />
          </div>
          <button onClick={() => notifySaved("Profile saved")} className="button button--dark">Save Changes</button>
        </div>

        <div className="surface-card">
          <h2>
            <ShieldCheck size={20} />
            Security
          </h2>
          <div className="form-grid">
            <input type="password" placeholder="Current Password" className="lux-input" />
            <input type="password" placeholder="New Password" className="lux-input" />
          </div>
          <button onClick={() => notifySaved("Security preferences saved")} className="button button--dark">Update Password</button>
        </div>
      </section>

      <section className="page-shell preference-grid page-section">
        <article className="surface-card preference-card">
          <span>01</span>
          <h3>Order visibility</h3>
          <p className="muted">Keep fulfillment and purchase history close to the account dashboard.</p>
        </article>
        <article className="surface-card preference-card">
          <span>02</span>
          <h3>Saved edit</h3>
          <p className="muted">Wishlist decisions remain lightweight and private in local storage.</p>
        </article>
        <article className="surface-card preference-card">
          <span>03</span>
          <h3>Calm controls</h3>
          <p className="muted">Forms stay direct, quiet, and intentionally frontend-only here.</p>
        </article>
      </section>
    </main>
  );
}
