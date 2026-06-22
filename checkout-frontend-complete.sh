#!/usr/bin/env bash
set -e

cat > src/app/checkout/page.tsx << 'TSX'
"use client";

import { erpPost } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { fileToBase64 } from "@/lib/file";
import { cartTotal, clearCart, getCart } from "@/services/cart.service";
import type { CartItem } from "@/types/cart";
import { useEffect, useState } from "react";

const steps = ["Customer", "Delivery", "Payment", "Review"];

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [step, setStep] = useState(0);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setItems(getCart()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const subtotal = cartTotal(items);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const f = new FormData(e.currentTarget);
    const file = f.get("paymentScreenshot") as File;
    const paymentScreenshotBase64 =
      file && file.size > 0 ? await fileToBase64(file) : "";

    const deliveryFee = Number(f.get("deliveryFee") || 0);
    const couponCode = String(f.get("couponCode") || "");
    let couponDiscount = 0;

    if (couponCode) {
      const coupon = await erpPost({
        action: "validateCoupon",
        shopId: CONFIG.defaultShopId,
        couponCode,
      });
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
      discount: couponDiscount,
      tax: 0,
      paymentScreenshotBase64,
      paymentScreenshotName: file && file.size > 0 ? file.name : "",
      items: items.map((i) => ({
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

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-slate-950">
      <header className="bg-[#071b46] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/shop" className="text-2xl font-black">Blue Danube Checkout</a>
          <nav className="flex gap-5 text-sm font-bold">
            <a href="/shop">Shop</a>
            <a href="/cart">Cart</a>
            <a href="/account">Orders</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#0b255c]">
            Secure Checkout
          </p>
          <h1 className="mt-2 text-4xl font-black">Complete Your Order</h1>
          <p className="mt-3 text-slate-500">
            Fill customer information, delivery details, payment method and review your order before submission.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {steps.map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(i)}
                className={`rounded-2xl p-4 text-sm font-black ${
                  i <= step ? "bg-[#0b255c] text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {i + 1}. {s}
              </button>
            ))}
          </div>
        </div>

        {!items.length && !msg && (
          <div className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black">Your cart is empty</h2>
            <a href="/shop" className="mt-5 inline-block rounded-full bg-[#0b255c] px-6 py-3 font-black text-white">
              Continue Shopping
            </a>
          </div>
        )}

        {!!items.length && (
          <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
              {step === 0 && (
                <div className="grid gap-4">
                  <h2 className="text-2xl font-black">Customer Information</h2>
                  <input name="customerName" required placeholder="Customer Name" className="rounded-xl border px-4 py-3" />
                  <input name="phone" required placeholder="Phone" className="rounded-xl border px-4 py-3" />
                  <input name="email" type="email" required placeholder="Gmail" className="rounded-xl border px-4 py-3" />
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4">
                  <h2 className="text-2xl font-black">Delivery Details</h2>
                  <input name="address" required placeholder="Address" className="rounded-xl border px-4 py-3" />
                  <input name="township" placeholder="Township" className="rounded-xl border px-4 py-3" />
                  <input name="deliveryFee" type="number" defaultValue="0" placeholder="Delivery Fee" className="rounded-xl border px-4 py-3" />
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4">
                  <h2 className="text-2xl font-black">Payment</h2>
                  <select name="paymentMethod" className="rounded-xl border px-4 py-3">
                    <option>KBZ Pay</option>
                    <option>Wave Pay</option>
                    <option>AYA Pay</option>
                    <option>Bank Transfer</option>
                    <option>Cash</option>
                  </select>
                  <input name="couponCode" placeholder="Coupon Code optional" className="rounded-xl border px-4 py-3" />
                  <input name="paymentScreenshot" type="file" accept="image/*" required className="rounded-xl border px-4 py-3" />
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-black">Review Order</h2>
                  <div className="mt-5 space-y-3">
                    {items.map((i) => (
                      <div key={i.product["Product ID"]} className="flex justify-between rounded-2xl bg-slate-50 p-4 text-sm">
                        <span>{i.product["Product Name"]} × {i.qty}</span>
                        <b>{(Number(i.product["Selling Price"] || 0) * i.qty).toLocaleString()} MMK</b>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  disabled={step <= 0}
                  onClick={() => setStep(step - 1)}
                  className="rounded-xl border px-6 py-3 font-black disabled:opacity-40"
                >
                  Back
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="rounded-xl bg-[#0b255c] px-6 py-3 font-black text-white"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    disabled={loading}
                    className="rounded-xl bg-[#0b255c] px-6 py-3 font-black text-white disabled:opacity-60"
                  >
                    {loading ? "Submitting..." : "Submit Order"}
                  </button>
                )}
              </div>
            </div>

            <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-2xl font-black">Order Summary</h2>
              <div className="mt-5 space-y-3">
                {items.map((i) => (
                  <div key={i.product["Product ID"]} className="flex justify-between text-sm">
                    <span>{i.product["Product Name"]} × {i.qty}</span>
                    <b>{(Number(i.product["Selling Price"] || 0) * i.qty).toLocaleString()} MMK</b>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between text-lg">
                  <span className="font-black">Subtotal</span>
                  <span className="font-black">{subtotal.toLocaleString()} MMK</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Delivery and coupon discount will be applied when submitted.
                </p>
              </div>
            </aside>
          </form>
        )}

        {msg && (
          <div className="mt-8 rounded-[2rem] bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black">Order Result</h2>
            <p className="mt-3 font-bold text-green-700">{msg}</p>
            <a href="/account" className="mt-5 inline-block rounded-full bg-[#0b255c] px-6 py-3 font-black text-white">
              Track Order
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
TSX

npm run build
./test-pages.sh
