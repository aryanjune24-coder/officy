"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import { ToastProvider } from "../components/ToastProvider";
import PageTransition from "../components/PageTransition";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <PageTransition>{children}</PageTransition>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
