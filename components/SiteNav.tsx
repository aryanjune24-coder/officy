"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Shield,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/orders", label: "Orders" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isAdmin = pathname.startsWith("/admin");
  const mobileLinks = [
    ...primaryLinks,
    { href: "/dashboard", label: "Dashboard" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/cart", label: "Cart" },
    { href: "/account", label: "Account" },
    { href: "/admin", label: "Admin" },
  ];
  const accountLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/orders", label: "Order history" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/account", label: "Account settings" },
  ];

  return (
    <>
      <header className="site-nav">
        <Link href="/" className="site-nav__brand" onClick={() => setMenuOpen(false)}>
          OFFICY
        </Link>

        <nav className="site-nav__links" aria-label="Primary navigation">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "is-active" : ""}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/admin" className={isAdmin ? "is-active" : ""}>
            Admin
          </Link>
        </nav>

        <div className="site-nav__actions">
          <Link href="/products" aria-label="Search products" className="nav-icon nav-icon--optional">
            <Search size={17} />
          </Link>
          <Link href="/wishlist" aria-label="Open wishlist" className="nav-icon">
            <Heart size={17} />
            {wishlist.length > 0 && <span>{wishlist.length}</span>}
          </Link>
          <Link href="/cart" aria-label="Open cart" className="nav-icon">
            <ShoppingBag size={17} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </Link>
          <div className="account-menu">
            <button
              type="button"
              className="account-menu__trigger"
              aria-label="Open account menu"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((open) => !open)}
            >
              <User size={16} />
              <span>{session?.user?.name || "Account"}</span>
              <ChevronDown size={14} />
            </button>
            <div className={accountOpen ? "account-menu__panel is-open" : "account-menu__panel"}>
              <div className="account-menu__identity">
                <strong>{session?.user?.name || "OFFICY member"}</strong>
                <span>{session?.user?.email || "Sign in for order history"}</span>
              </div>
              {accountLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setAccountOpen(false)}>
                  {link.label}
                </Link>
              ))}
              {!session?.user && (
                <Link href="/login" onClick={() => setAccountOpen(false)}>
                  Login
                </Link>
              )}
              <button
                type="button"
                className="account-menu__logout"
                onClick={() => {
                  setAccountOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
              >
                <LogOut size={15} />
                Log Out
              </button>
            </div>
          </div>
          <button
            type="button"
            className="nav-menu-button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <div className={menuOpen ? "mobile-drawer is-open" : "mobile-drawer"} aria-hidden={!menuOpen}>
        <div className="mobile-drawer__panel">
          <p className="eyebrow">OFFICY studio</p>
          <nav aria-label="Mobile navigation">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={pathname === link.href ? "is-active" : ""}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mobile-drawer__meta">
            <span>{wishlist.length} saved</span>
            <span>{cartCount} in cart</span>
          </div>
          <button
            type="button"
            className="mobile-drawer__logout"
            onClick={() => {
              setMenuOpen(false);
              signOut({ callbackUrl: "/" });
            }}
          >
            <LogOut size={17} />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}

export function AdminSubNav() {
  const pathname = usePathname();
  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Shield },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/users", label: "Users", icon: User },
  ];

  return (
    <nav className="admin-tabs" aria-label="Admin navigation">
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "is-active" : ""}
          >
            <Icon size={16} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
