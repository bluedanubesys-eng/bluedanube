"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getCart } from "@/services/cart.service";

export default function Premium CollectionHeader() {
  const [cartCount, setCartCount] = useState(0);

  function loadCart() {
    setCartCount(getCart().reduce((s, i) => s + i.qty, 0));
  }

  useEffect(() => {
    loadCart();
    window.addEventListener("cart-updated", loadCart);
    return () => window.removeEventListener("cart-updated", loadCart);
  }, []);

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="bg-[#071b46] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs font-semibold">
          <p>European products curated for international customers</p>
          <div className="flex gap-4">
            <a href="/account">Track Order</a>
            <a href="/partner">Sell With Us</a>
          </div>
        </div>
      </div>

      <div className="bg-[#0b255c] text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
          <a href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Blue Danube"
              width={42}
              height={42}
              priority
              className="h-10 w-10 rounded-xl bg-white object-contain p-1"
            />
            <span className="text-2xl font-black tracking-tight">Blue Danube</span>
          </a>

          <div className="hidden flex-1 md:block">
            <input
              className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 outline-none ring-2 ring-transparent focus:ring-amber-300"
              placeholder="Search European products, brands, categories..."
            />
          </div>

          <nav className="flex items-center gap-3 text-sm font-bold">
            <a href="/shop" className="hidden rounded-full px-4 py-2 hover:bg-white/10 sm:block">Shop</a>
            <a href="/account" className="hidden rounded-full px-4 py-2 hover:bg-white/10 md:block">Orders</a>
            <a href="/cart" className="rounded-full bg-amber-400 px-5 py-2 text-[#071b46]">
              Cart {cartCount > 0 ? `(${cartCount})` : ""}
            </a>
          </nav>
        </div>
      </div>

      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-3 text-sm font-black text-slate-700">
          {["All", "New Arrivals", "Fashion", "Shoes", "Bags", "Accessories", "Beauty", "Lifestyle", "Deals"].map((x) => (
            <a key={x} href="/shop" className="whitespace-nowrap rounded-full bg-slate-100 px-4 py-2 hover:bg-[#0b255c] hover:text-white">
              {x}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}