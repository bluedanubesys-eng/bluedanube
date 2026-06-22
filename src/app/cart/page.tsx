"use client";

import { cartTotal, getCart, updateQty } from "@/services/cart.service";
import { getProductImage } from "@/services/product.service";
import type { CartItem } from "@/types/cart";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  function load() {
    setItems(getCart());
  }

  useEffect(() => {
    load();
    window.addEventListener("cart-updated", load);
    return () => window.removeEventListener("cart-updated", load);
  }, []);

  const total = cartTotal(items);

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-blue-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/shop" className="text-2xl font-black">Blue Danube</a>
          <a href="/checkout" className="rounded-xl bg-white px-5 py-3 font-black text-blue-950">Checkout</a>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="text-3xl font-black">Shopping Cart</h1>

        {!items.length && (
          <div className="mt-8 rounded-3xl border bg-white p-8 text-center">
            <p className="font-bold text-slate-500">Your cart is empty.</p>
            <a href="/shop" className="mt-5 inline-block rounded-xl bg-blue-950 px-6 py-3 font-black text-white">Continue Shopping</a>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => {
              const p = item.product;
              const img = getProductImage(p);

              return (
                <div key={p["Product ID"]} className="flex gap-4 rounded-3xl border bg-white p-4 shadow-sm">
                  {img ? (
                    <img src={img} className="h-28 w-28 rounded-2xl object-cover" alt={p["Product Name"] || ""} />
                  ) : (
                    <div className="h-28 w-28 rounded-2xl bg-slate-100" />
                  )}

                  <div className="flex-1">
                    <h2 className="font-black">{p["Product Name"]}</h2>
                    <p className="text-sm text-slate-500">{p.Brand} • {p.Size} • {p.Color}</p>
                    <p className="mt-2 font-black text-blue-950">{p["Selling Price"] || 0} MMK</p>

                    <div className="mt-4 flex items-center gap-3">
                      <button onClick={() => updateQty(p["Product ID"] || "", item.qty - 1)} className="rounded-lg border px-3 py-1 font-black">-</button>
                      <span className="font-black">{item.qty}</span>
                      <button onClick={() => updateQty(p["Product ID"] || "", item.qty + 1)} className="rounded-lg border px-3 py-1 font-black">+</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!!items.length && (
            <aside className="h-fit rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">Order Summary</h2>
              <div className="mt-5 flex justify-between">
                <span>Subtotal</span>
                <b>{total} MMK</b>
              </div>
              <div className="mt-3 flex justify-between">
                <span>Delivery</span>
                <b>Calculated at checkout</b>
              </div>
              <a href="/checkout" className="mt-6 block rounded-xl bg-blue-950 px-6 py-3 text-center font-black text-white">
                Proceed to Checkout
              </a>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}
