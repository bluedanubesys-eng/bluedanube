#!/usr/bin/env bash
set -e

cat > src/types/cart.ts << 'TS'
import type { Product } from "./product";

export type CartItem = {
  product: Product;
  qty: number;
};
TS

cat > src/services/cart.service.ts << 'TS'
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

const KEY = "bd_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(product: Product) {
  const items = getCart();
  const id = product["Product ID"];
  const found = items.find(i => i.product["Product ID"] === id);

  if (found) found.qty += 1;
  else items.push({ product, qty: 1 });

  saveCart(items);
}

export function updateQty(productId: string, qty: number) {
  const items = getCart()
    .map(i => i.product["Product ID"] === productId ? { ...i, qty } : i)
    .filter(i => i.qty > 0);

  saveCart(items);
}

export function clearCart() {
  saveCart([]);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + Number(i.product["Selling Price"] || 0) * i.qty, 0);
}
TS

cat > src/app/cart/page.tsx << 'TSX'
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
TSX

cat > src/app/checkout/page.tsx << 'TSX'
"use client";

import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { fileToBase64 } from "@/lib/file";
import { cartTotal, clearCart, getCart } from "@/services/cart.service";
import type { CartItem } from "@/types/cart";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => setItems(getCart()), []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const f = new FormData(e.currentTarget);
    const file = f.get("paymentScreenshot") as File;
    const paymentScreenshotBase64 = file && file.size > 0 ? await fileToBase64(file) : "";

    const subtotal = cartTotal(items);
    const deliveryFee = Number(f.get("deliveryFee") || 0);
    const grandTotal = subtotal + deliveryFee;

    const res = await erpPost({
      action: "createOrderWithPaymentScreenshot",
      shopId: CONFIG.defaultShopId,
      customerName: f.get("customerName"),
      phone: f.get("phone"),
      email: f.get("email"),
      address: f.get("address"),
      township: f.get("township"),
      paymentMethod: f.get("paymentMethod"),
      deliveryFee,
      discount: 0,
      tax: 0,
      paymentScreenshotBase64,
      paymentScreenshotName: file && file.size > 0 ? file.name : "",
      items: items.map(i => ({
        productId: i.product["Product ID"],
        productName: i.product["Product Name"],
        brand: i.product.Brand,
        size: i.product.Size,
        color: i.product.Color,
        qty: i.qty,
        unitPrice: Number(i.product["Selling Price"] || 0),
      })),
      remarks: `Checkout total ${grandTotal} MMK`,
    });

    if (res.success) {
      clearCart();
      setItems([]);
      setMsg(`Order submitted successfully. Order ID: ${res.orderId}`);
    } else {
      setMsg(res.message || "Order failed");
    }

    setLoading(false);
  }

  const subtotal = cartTotal(items);

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-blue-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/shop" className="text-2xl font-black">Blue Danube</a>
          <a href="/cart" className="font-bold">Cart</a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-3xl font-black">Checkout</h1>

        {!items.length && !msg && (
          <div className="mt-8 rounded-3xl border bg-white p-8 text-center font-bold text-slate-500">
            Your cart is empty.
          </div>
        )}

        {!!items.length && (
          <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="grid gap-4 rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">Customer Information</h2>
              <input name="customerName" required placeholder="Customer Name" className="rounded-xl border px-4 py-3" />
              <input name="phone" required placeholder="Phone" className="rounded-xl border px-4 py-3" />
              <input name="email" type="email" required placeholder="Gmail" className="rounded-xl border px-4 py-3" />
              <input name="address" required placeholder="Address" className="rounded-xl border px-4 py-3" />
              <input name="township" placeholder="Township" className="rounded-xl border px-4 py-3" />

              <h2 className="mt-4 text-xl font-black">Payment</h2>
              <select name="paymentMethod" className="rounded-xl border px-4 py-3">
                <option>KBZ Pay</option>
                <option>Wave Pay</option>
                <option>AYA Pay</option>
                <option>Bank Transfer</option>
                <option>Cash</option>
              </select>

              <input name="paymentScreenshot" type="file" accept="image/*" required className="rounded-xl border px-4 py-3" />
              <input name="deliveryFee" type="number" defaultValue="0" placeholder="Delivery Fee" className="rounded-xl border px-4 py-3" />
            </div>

            <aside className="h-fit rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">Order Summary</h2>
              <div className="mt-5 space-y-3">
                {items.map(i => (
                  <div key={i.product["Product ID"]} className="flex justify-between text-sm">
                    <span>{i.product["Product Name"]} × {i.qty}</span>
                    <b>{Number(i.product["Selling Price"] || 0) * i.qty} MMK</b>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t pt-4 flex justify-between text-lg">
                <span className="font-black">Subtotal</span>
                <span className="font-black">{subtotal} MMK</span>
              </div>
              <button disabled={loading} className="mt-6 w-full rounded-xl bg-blue-950 px-6 py-3 font-black text-white disabled:opacity-60">
                {loading ? "Submitting..." : "Submit Order"}
              </button>
            </aside>
          </form>
        )}

        {msg && (
          <div className="mt-8 rounded-3xl border bg-white p-6 font-black">
            {msg}
          </div>
        )}
      </section>
    </main>
  );
}
TSX

python3 << 'PY'
from pathlib import Path
p = Path("src/app/shop/page.tsx")
code = p.read_text()

if 'addToCart' not in code:
    code = code.replace(
        'import { getProductImage, getProducts } from "@/services/product.service";',
        'import { getProductImage, getProducts } from "@/services/product.service";\nimport { addToCart } from "@/services/cart.service";'
    )

code = code.replace(
'''<button className="mt-4 w-full rounded-xl bg-blue-950 px-4 py-3 font-black text-white">
                        Add to Cart
                      </button>''',
'''<button
                        onClick={() => addToCart(p)}
                        className="mt-4 w-full rounded-xl bg-blue-950 px-4 py-3 font-black text-white"
                      >
                        Add to Cart
                      </button>'''
)

p.write_text(code)
PY

echo "✅ Cart, checkout, payment screenshot upload, and order submission added"
npm run dev
