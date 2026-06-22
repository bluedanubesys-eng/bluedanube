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
    const couponCode = String(f.get("couponCode") || "");
    let couponDiscount = 0;
    if (couponCode) {
      const coupon = await erpPost({ action: "validateCoupon", shopId: CONFIG.defaultShopId, couponCode });
      if (coupon.success) couponDiscount = Number(coupon.coupon["Discount Value"] || 0);
    }
    const grandTotal = Math.max(subtotal + deliveryFee - couponDiscount, 0);

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

              <input name="couponCode" placeholder="Coupon Code optional" className="rounded-xl border px-4 py-3" />
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
